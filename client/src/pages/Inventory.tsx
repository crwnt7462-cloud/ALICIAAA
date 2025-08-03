import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Package, AlertTriangle, Edit, Trash2, 
  Search, Filter, TrendingDown, TrendingUp, Minus
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
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Récupérer l'inventaire
  const { data: inventory = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  // Récupérer les articles en rupture de stock
  const { data: lowStockItems = [] } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  // Nouveau formulaire d'article
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "hair_care",
    brand: "",
    currentStock: 10,
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
        category: "hair_care",
        brand: "",
        currentStock: 10,
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
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    }
  });

  // Mutation pour ajuster le stock
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, currentStock }: { id: number; currentStock: number }) => {
      const response = await apiRequest("PATCH", `/api/inventory/${id}`, { currentStock });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({ title: "Stock mis à jour!" });
    },
  });

  // Filtrer les articles
  const filteredInventory = (inventory as InventoryItem[]).filter((item: InventoryItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Vérifier si un article est en stock faible
  const isLowStock = (item: InventoryItem) => item.currentStock <= item.minStock;

  const handleStockAdjustment = (item: InventoryItem, adjustment: number) => {
    const newStock = Math.max(0, item.currentStock + adjustment);
    updateStockMutation.mutate({ id: item.id, currentStock: newStock });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
          <p className="text-gray-600">Gérez votre inventaire et surveillez les niveaux de stock</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel article</DialogTitle>
              <DialogDescription>
                Ajoutez un nouvel article à votre inventaire
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom de l'article *</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Shampooing L'Oréal Professional"
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
                  placeholder="L'Oréal Professional"
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
              <Button
                onClick={() => createItemMutation.mutate(newItem)}
                disabled={!newItem.name || createItemMutation.isPending}
                className="w-full gradient-bg"
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
              {lowStockItems.slice(0, 3).map((item: InventoryItem) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                  <div>
                    <span className="font-medium text-red-900">{item.name}</span>
                    <span className="text-red-600 ml-2">({item.currentStock} restants)</span>
                  </div>
                  <Badge variant="destructive" className="bg-red-600">
                    Stock faible
                  </Badge>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <div className="text-red-600 text-sm">
                  +{lowStockItems.length - 3} autres articles en stock faible
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="hair_care">Soins cheveux</SelectItem>
                  <SelectItem value="skin_care">Soins visage</SelectItem>
                  <SelectItem value="tools">Outils</SelectItem>
                  <SelectItem value="nail_care">Soins ongles</SelectItem>
                  <SelectItem value="makeup">Maquillage</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des articles */}
      <div className="grid gap-4">
        {filteredInventory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter 
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Commencez par ajouter votre premier article d'inventaire"
                }
              </p>
              {!searchTerm && !categoryFilter && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-bg">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter votre premier article
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredInventory.map((item: InventoryItem) => (
            <Card key={item.id} className={`${isLowStock(item) ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {isLowStock(item) && (
                        <Badge variant="destructive" className="bg-red-600">
                          Stock faible
                        </Badge>
                      )}
                      {item.brand && (
                        <Badge variant="outline" className="text-xs">
                          {item.brand}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Stock: {item.currentStock}</span>
                      <span>Min: {item.minStock}</span>
                      {item.category && (
                        <span>Catégorie: {item.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockAdjustment(item, -1)}
                      disabled={item.currentStock <= 0 || updateStockMutation.isPending}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-2 font-medium min-w-[3rem] text-center">
                      {item.currentStock}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockAdjustment(item, 1)}
                      disabled={updateStockMutation.isPending}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}