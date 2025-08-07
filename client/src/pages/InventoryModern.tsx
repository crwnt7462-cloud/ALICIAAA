import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Search, Plus, Package, AlertTriangle, 
  Edit3, Trash2, Filter
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  costPrice: number;
  salePrice: number;
  supplier?: string;
  lastRestocked: string;
}

export default function InventoryModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'soins-cheveux',
    brand: '',
    currentStock: 0,
    minStock: 5,
    costPrice: 0,
    salePrice: 0,
    supplier: ''
  });

  // Récupérer l'inventaire depuis la BDD
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['/api/inventory'],
    retry: 1
  });

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'soins-cheveux', label: 'Cheveux' },
    { id: 'soins-visage', label: 'Visage' },
    { id: 'maquillage', label: 'Maquillage' },
    { id: 'ongles', label: 'Ongles' },
    { id: 'outils', label: 'Outils' }
  ];

  const addMutation = useMutation({
    mutationFn: async (item: any) => {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à l'inventaire",
      });
      setShowAddForm(false);
      setNewItem({
        name: '',
        category: 'soins-cheveux',
        brand: '',
        currentStock: 0,
        minStock: 5,
        costPrice: 0,
        salePrice: 0,
        supplier: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    }
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.brand) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir au moins le nom et la marque",
        variant: "destructive"
      });
      return;
    }
    addMutation.mutate(newItem);
  };

  const filteredItems = (inventory || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = (inventory || []).filter(item => item.currentStock <= item.minStock);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header violet moderne - Style iPhone identique client */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 border-b border-violet-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLocation('/business-features')}
                className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Inventaire</h1>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold text-violet-600 text-center mb-6">Gestion des Stocks</h2>

          {/* Alertes stock faible */}
          {lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Stock faible ({lowStockItems.length})</span>
              </div>
              <div className="space-y-1">
                {lowStockItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-sm text-red-700">
                    {item.name} - {item.currentStock} restants
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{inventory?.length || 0}</div>
              <div className="text-xs text-gray-500">Produits</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-green-600">{inventory?.filter(i => i.currentStock > i.minStock).length || 0}</div>
              <div className="text-xs text-gray-500">En stock</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-red-600">{lowStockItems.length}</div>
              <div className="text-xs text-gray-500">Rupture</div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>

          {/* Filtres catégories */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Liste des produits */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">Aucun produit trouvé</p>
                <p className="text-sm">Commencez par ajouter vos premiers produits</p>
              </div>
            ) : (
              filteredItems.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit3 className="h-3 w-3 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-1 text-sm ${
                    item.currentStock <= item.minStock ? 'text-red-600' : 'text-green-600'
                  }`}>
                    <Package className="h-4 w-4" />
                    <span>{item.currentStock} en stock</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">€{item.salePrice}</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 h-8 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50">
                    -
                  </button>
                  <button className="flex-1 h-8 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50">
                    +
                  </button>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Formulaire d'ajout */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ajouter un produit</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom du produit"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                  
                  <input
                    type="text"
                    value={newItem.brand}
                    onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Marque"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                  
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newItem.currentStock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                      placeholder="Stock"
                      className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                    <input
                      type="number"
                      value={newItem.salePrice}
                      onChange={(e) => setNewItem(prev => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                      placeholder="Prix €"
                      className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 h-10 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddItem}
                      disabled={addMutation.isPending}
                      className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-xl text-sm font-medium"
                    >
                      {addMutation.isPending ? "..." : "Ajouter"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}