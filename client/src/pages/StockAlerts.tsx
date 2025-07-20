import { useAuthSession } from "@/hooks/useAuthSession";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Package, 
  ShoppingCart, 
  TrendingDown,
  RefreshCw,
  Plus,
  Minus,
  Bell,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
  cost: number;
  sellingPrice: number;
}

export default function StockAlerts() {
  const { user, isProfessional } = useAuthSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  // Récupérer les articles en stock faible
  const { data: lowStockItems = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory/low-stock'],
    enabled: isProfessional,
  });

  // Mutation pour ajuster le stock
  const adjustStockMutation = useMutation({
    mutationFn: async ({ itemId, newStock }: { itemId: number; newStock: number }) => {
      const response = await apiRequest('PATCH', `/api/inventory/${itemId}`, {
        currentStock: newStock
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({
        title: "Stock mis à jour",
        description: "Le niveau de stock a été ajusté avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stock",
        variant: "destructive"
      });
    }
  });

  // Mutation pour marquer comme réapprovisionné
  const markRestockedMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest('PATCH', `/api/inventory/${itemId}/restock`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/low-stock'] });
      toast({
        title: "Article réapprovisionné",
        description: "L'article a été marqué comme réapprovisionné"
      });
    }
  });

  const handleStockAdjustment = (itemId: number, currentStock: number, adjustment: number) => {
    const newStock = Math.max(0, currentStock + adjustment);
    adjustStockMutation.mutate({ itemId, newStock });
  };

  const handleQuickRestock = (itemId: number) => {
    const quantity = quantities[itemId] || 0;
    if (quantity > 0) {
      const item = lowStockItems.find(item => item.id === itemId);
      if (item) {
        const newStock = item.currentStock + quantity;
        adjustStockMutation.mutate({ itemId, newStock });
        setQuantities({ ...quantities, [itemId]: 0 });
      }
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { label: "Rupture", color: "bg-red-500" };
    if (item.currentStock <= item.minThreshold) return { label: "Stock faible", color: "bg-orange-500" };
    return { label: "OK", color: "bg-green-500" };
  };

  if (!isProfessional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-medium mb-2">Gestion des stocks</h3>
            <p className="text-gray-600">
              Connectez-vous pour gérer vos alertes de stock
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <span>Alertes de Stock</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Articles nécessitant un réapprovisionnement
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/inventory/low-stock'] })}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Commander
            </Button>
          </div>
        </div>

        {/* Résumé des alertes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Articles en rupture</p>
                  <p className="text-2xl font-bold text-red-600">
                    {lowStockItems.filter(item => item.currentStock === 0).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock faible</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {lowStockItems.filter(item => item.currentStock > 0 && item.currentStock <= item.minThreshold).length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total alertes</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {lowStockItems.length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des articles en alerte */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des alertes...</p>
            </CardContent>
          </Card>
        ) : lowStockItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium mb-2">Aucune alerte de stock</h3>
              <p className="text-gray-600">
                Tous vos articles sont correctement approvisionnés
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {lowStockItems.map((item) => {
              const status = getStockStatus(item);
              const margin = ((item.sellingPrice - item.cost) / item.cost * 100).toFixed(1);
              
              return (
                <Card key={item.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge className={`text-white ${status.color}`}>
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Stock actuel:</span>
                            <p className={`font-bold ${item.currentStock === 0 ? 'text-red-600' : item.currentStock <= item.minThreshold ? 'text-orange-600' : 'text-green-600'}`}>
                              {item.currentStock} {item.unit}
                            </p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Seuil minimum:</span>
                            <p>{item.minThreshold} {item.unit}</p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Fournisseur:</span>
                            <p>{item.supplier}</p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Marge:</span>
                            <p className="text-green-600">+{margin}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 ml-6">
                        {/* Ajustement rapide */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockAdjustment(item.id, item.currentStock, -1)}
                            disabled={item.currentStock === 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.currentStock}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockAdjustment(item.id, item.currentStock, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Réapprovisionnement rapide */}
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Qté"
                            className="w-20"
                            value={quantities[item.id] || ''}
                            onChange={(e) => setQuantities({
                              ...quantities,
                              [item.id]: parseInt(e.target.value) || 0
                            })}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleQuickRestock(item.id)}
                            disabled={!quantities[item.id] || quantities[item.id] <= 0}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => markRestockedMutation.mutate(item.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Réapprovisionné
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Commander
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Barre de progression du stock */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Stock critique</span>
                        <span>Stock optimal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.currentStock === 0 ? 'bg-red-500' :
                            item.currentStock <= item.minThreshold ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (item.currentStock / item.maxThreshold) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}