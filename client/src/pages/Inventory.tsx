import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Package, AlertTriangle, Edit, Trash2, 
  Search, Filter, TrendingDown, TrendingUp
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unitCost?: number;
  sellingPrice?: number;
  supplier?: string;
  expiryDate?: string;
  isActive: boolean;
}

export default function Inventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Récupérer l'inventaire
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  // Récupérer les articles en rupture de stock
  const { data: lowStockItems = [] } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
  });

  // Nouveau formulaire d'article
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    currentStock: 0,
    minStock: 5,
    maxStock: 100,
    unitCost: 0,
    sellingPrice: 0,
    supplier: "",
    expiryDate: "",
  });

  // Mutation pour créer un article
  const createItemMutation = useMutation({
    mutationFn: async (data: typeof newItem) => {
      const response = await apiRequest("POST", "/api/inventory", data);
      if (!response.ok) throw new Error("Erreur lors de la création");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      setIsAddDialogOpen(false);
      setNewItem({
        name: "",
        description: "",
        category: "",
        brand: "",
        currentStock: 0,
        minStock: 5,
        maxStock: 100,
        unitCost: 0,
        sellingPrice: 0,
        supplier: "",
        expiryDate: "",
      });
      toast({ title: "Article créé avec succès!" });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour le stock
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, currentStock }: { id: number; currentStock: number }) => {
      const response = await apiRequest("PATCH", `/api/inventory/${id}/stock`, { currentStock });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({ title: "Stock mis à jour!" });
    },
  });

  // Mutation pour supprimer un article
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/inventory/${id}`);
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({ title: "Article supprimé!" });
    },
  });

  // Filtrer les articles
  const filteredInventory = inventory.filter((item: InventoryItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Catégories uniques
  const categories = [...new Set(inventory.map((item: InventoryItem) => item.category).filter(Boolean))];

  // Vérifier si un article est en stock faible
  const isLowStock = (item: InventoryItem) => item.currentStock <= item.minStock;

  const handleStockUpdate = (item: InventoryItem, newStock: number) => {
    updateStockMutation.mutate({ id: item.id, currentStock: newStock });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header avec alertes */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Stocks</h1>
          <p className="text-gray-500">Gérez votre inventaire et surveillez les niveaux de stock</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom de l'article *</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Shampooing L'Oréal"
                />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hair_care">Soins cheveux</SelectItem>
                    <SelectItem value="skin_care">Soins visage</SelectItem>
                    <SelectItem value="tools">Outils</SelectItem>
                    <SelectItem value="nail_care">Soins ongles</SelectItem>
                    <SelectItem value="makeup">Maquillage</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marque</Label>
                <Input
                  value={newItem.brand}
                  onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="L'Oréal"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Stock actuel</Label>
                  <Input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Stock min</Label>
                  <Input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Stock max</Label>
                  <Input
                    type="number"
                    value={newItem.maxStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Prix d'achat (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Prix de vente (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div>
                <Label>Fournisseur</Label>
                <Input
                  value={newItem.supplier}
                  onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Nom du fournisseur"
                />
              </div>
              <Button
                onClick={() => createItemMutation.mutate(newItem)}
                disabled={!newItem.name || createItemMutation.isPending}
                className="w-full"
              >
                {createItemMutation.isPending ? "Création..." : "Créer l'article"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertes de stock faible */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertes Stock Faible ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lowStockItems.map((item: InventoryItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-white rounded border border-red-200"
                >
                  <div>
                    <span className="font-medium text-red-800">{item.name}</span>
                    {item.brand && <span className="text-sm text-red-600 ml-2">({item.brand})</span>}
                  </div>
                  <Badge variant="destructive">
                    {item.currentStock}/{item.minStock}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes catégories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'hair_care' ? 'Soins cheveux' :
                 category === 'skin_care' ? 'Soins visage' :
                 category === 'tools' ? 'Outils' :
                 category === 'nail_care' ? 'Soins ongles' :
                 category === 'makeup' ? 'Maquillage' : 
                 category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des articles */}
      <div className="grid gap-4">
        {filteredInventory.map((item: InventoryItem) => (
          <Card 
            key={item.id} 
            className={`${isLowStock(item) ? 'border-red-200 bg-red-50' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{item.name}</span>
                    {item.brand && (
                      <Badge variant="outline" className="text-xs">{item.brand}</Badge>
                    )}
                    {isLowStock(item) && (
                      <Badge variant="destructive" className="text-xs">
                        Stock faible !
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {item.category && (
                      <span className="text-gray-500">
                        {item.category === 'hair_care' ? 'Soins cheveux' :
                         item.category === 'skin_care' ? 'Soins visage' :
                         item.category === 'tools' ? 'Outils' :
                         item.category === 'nail_care' ? 'Soins ongles' :
                         item.category === 'makeup' ? 'Maquillage' : 
                         item.category}
                      </span>
                    )}
                    {item.supplier && (
                      <span className="text-gray-500">Fournisseur: {item.supplier}</span>
                    )}
                    {item.unitCost && item.sellingPrice && (
                      <span className="text-green-600">
                        Marge: {((item.sellingPrice - item.unitCost) / item.unitCost * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stock */}
                  <div className="text-center">
                    <div className={`text-lg font-bold ${isLowStock(item) ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.currentStock}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minStock}
                    </div>
                  </div>

                  {/* Actions stock */}
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(item, item.currentStock + 1)}
                      disabled={updateStockMutation.isPending}
                    >
                      <TrendingUp className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(item, Math.max(0, item.currentStock - 1))}
                      disabled={updateStockMutation.isPending || item.currentStock === 0}
                    >
                      <TrendingDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteItemMutation.mutate(item.id)}
                      disabled={deleteItemMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun article trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter ? 
                "Aucun article ne correspond à vos critères de recherche." :
                "Commencez par ajouter des articles à votre inventaire."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}