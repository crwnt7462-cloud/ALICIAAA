import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { BottomNavigation } from '@/components/BottomNavigation';
import { 
  ArrowLeft, Search, Plus, Package, AlertTriangle, 
  Edit3, Trash2, Filter, TrendingUp, TrendingDown, 
  DollarSign, Calendar, Truck, BarChart3, Eye, 
  Save, X, RefreshCw, Shield, Clock
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  brand: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  costPrice: number;
  salePrice: number;
  supplier?: string;
  lastRestocked: string;
  expiryDate?: string;
  sku?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InventoryStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  averageMargin: number;
}

export default function Inventory() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'soins-cheveux',
    brand: '',
    currentStock: 0,
    minStock: 5,
    maxStock: 100,
    costPrice: 0,
    salePrice: 0,
    supplier: '',
    sku: '',
    location: '',
    expiryDate: ''
  });

  // Données de test pour le développement
  const testInventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Shampooing L\'Oréal Professional',
      description: 'Shampooing réparateur pour cheveux abîmés',
      category: 'soins-cheveux',
      brand: 'L\'Oréal Professional',
      currentStock: 12,
      minStock: 5,
      maxStock: 50,
      costPrice: 8.50,
      salePrice: 15.90,
      supplier: 'Beauty Supply Co',
      sku: 'LOR-SH-001',
      location: 'Étagère A1',
      lastRestocked: '2024-01-15',
      expiryDate: '2025-12-31',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Crème Hydratante Nivea',
      description: 'Crème hydratante pour le visage',
      category: 'soins-visage',
      brand: 'Nivea',
      currentStock: 3,
      minStock: 8,
      maxStock: 30,
      costPrice: 4.20,
      salePrice: 9.90,
      supplier: 'Cosmetics Direct',
      sku: 'NIV-CR-002',
      location: 'Étagère B2',
      lastRestocked: '2024-01-10',
      expiryDate: '2025-06-30',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Rouge à Lèvres Chanel',
      description: 'Rouge à lèvres mat longue tenue',
      category: 'maquillage',
      brand: 'Chanel',
      currentStock: 0,
      minStock: 3,
      maxStock: 15,
      costPrice: 25.00,
      salePrice: 45.00,
      supplier: 'Luxury Cosmetics',
      sku: 'CHA-RL-003',
      location: 'Vitrine C1',
      lastRestocked: '2024-01-05',
      expiryDate: '2026-03-31',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-05'
    },
    {
      id: '4',
      name: 'Vernis à Ongles OPI',
      description: 'Vernis gel longue tenue',
      category: 'ongles',
      brand: 'OPI',
      currentStock: 7,
      minStock: 4,
      maxStock: 25,
      costPrice: 6.80,
      salePrice: 12.50,
      supplier: 'Nail Supply Pro',
      sku: 'OPI-VN-004',
      location: 'Étagère D3',
      lastRestocked: '2024-01-12',
      expiryDate: '2025-09-15',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12'
    },
    {
      id: '5',
      name: 'Séchoir Professionnel',
      description: 'Séchoir à cheveux haute puissance',
      category: 'outils',
      brand: 'Dyson',
      currentStock: 2,
      minStock: 3,
      maxStock: 8,
      costPrice: 180.00,
      salePrice: 320.00,
      supplier: 'Professional Tools',
      sku: 'DYS-SC-005',
      location: 'Réserve E1',
      lastRestocked: '2024-01-08',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-08'
    }
  ];

  // Récupérer l'inventaire depuis la BDD avec fallback test
  const { data: inventory, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/inventory');
        if (!response.ok) throw new Error('Erreur API');
        return response.json();
      } catch (error) {
        console.warn('Erreur API inventaire, utilisation des données de test:', error);
        return testInventory;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Récupérer les statistiques
  const { data: stats } = useQuery<InventoryStats>({
    queryKey: ['/api/inventory/stats'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/inventory/stats');
        if (!response.ok) throw new Error('Erreur API stats');
        return response.json();
      } catch (error) {
        // Calculer les stats depuis l'inventaire local
        const inventoryData = (inventory || testInventory) as InventoryItem[];
        const totalProducts = inventoryData.length;
        const inStock = inventoryData.filter((item: InventoryItem) => item.currentStock > item.minStock).length;
        const lowStock = inventoryData.filter((item: InventoryItem) => item.currentStock <= item.minStock && item.currentStock > 0).length;
        const outOfStock = inventoryData.filter((item: InventoryItem) => item.currentStock === 0).length;
        const totalValue = inventoryData.reduce((sum: number, item: InventoryItem) => sum + (item.currentStock * item.costPrice), 0);
        const averageMargin = inventoryData.length > 0 ? 
          inventoryData.reduce((sum: number, item: InventoryItem) => sum + ((item.salePrice - item.costPrice) / item.salePrice * 100), 0) / inventoryData.length : 0;
        
        return {
          totalProducts,
          inStock,
          lowStock,
          outOfStock,
          totalValue,
          averageMargin
        };
      }
    },
    enabled: !!inventory
  });

  // Externaliser les catégories pour éviter les répétitions
  const categories = [
    { id: 'all', label: 'Tous', icon: Package },
    { id: 'soins-cheveux', label: 'Cheveux', icon: TrendingUp },
    { id: 'soins-visage', label: 'Visage', icon: Eye },
    { id: 'maquillage', label: 'Maquillage', icon: TrendingUp },
    { id: 'ongles', label: 'Ongles', icon: TrendingUp },
    { id: 'outils', label: 'Outils', icon: TrendingUp }
  ];

  // Externaliser les fonctions utilitaires
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }, []);

  const getStockStatus = useCallback((item: InventoryItem) => {
    if (item.currentStock === 0) return { label: 'Rupture', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
    if (item.currentStock <= item.minStock) return { label: 'Stock faible', color: 'text-orange-600 bg-orange-50', icon: AlertTriangle };
    return { label: 'En stock', color: 'text-green-600 bg-green-50', icon: Package };
  }, []);

  // Validation des données avec sécurité
  const validateItem = useCallback((item: any): string[] => {
    const errors: string[] = [];
    
    if (!item.name || item.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }
    if (!item.brand || item.brand.trim().length < 2) {
      errors.push('La marque doit contenir au moins 2 caractères');
    }
    if (item.currentStock < 0) {
      errors.push('Le stock ne peut pas être négatif');
    }
    if (item.minStock < 0) {
      errors.push('Le stock minimum ne peut pas être négatif');
    }
    if (item.costPrice < 0) {
      errors.push('Le prix d\'achat ne peut pas être négatif');
    }
    if (item.salePrice < 0) {
      errors.push('Le prix de vente ne peut pas être négatif');
    }
    if (item.salePrice < item.costPrice) {
      errors.push('Le prix de vente doit être supérieur au prix d\'achat');
    }
    
    return errors;
  }, []);

  // Mutations avec sécurité renforcée
  const addMutation = useMutation({
    mutationFn: async (item: any) => {
      // Validation côté client
      const errors = validateItem(item);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      
      const response = await apiRequest('POST', '/api/inventory', {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout');
      }
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
        description: '',
        category: 'soins-cheveux',
        brand: '',
        currentStock: 0,
        minStock: 5,
        maxStock: 100,
        costPrice: 0,
        salePrice: 0,
        supplier: '',
        sku: '',
        location: '',
        expiryDate: ''
      });
      setLastActivity(Date.now());
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, currentStock }: { id: string; currentStock: number }) => {
      const response = await apiRequest('PATCH', `/api/inventory/${id}`, { 
        currentStock,
        updatedAt: new Date().toISOString()
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      return response.json();
    },
    onSuccess: () => {
      setLastActivity(Date.now());
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/inventory/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé de l'inventaire",
      });
      setLastActivity(Date.now());
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    }
  });

  const handleAddItem = useCallback(() => {
    const errors = validateItem(newItem);
    if (errors.length > 0) {
      toast({
        title: "Données invalides",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }
    addMutation.mutate(newItem);
  }, [newItem, validateItem, addMutation, toast]);

  const handleStockAdjustment = useCallback((item: InventoryItem, adjustment: number) => {
    const newStock = Math.max(0, item.currentStock + adjustment);
    updateStockMutation.mutate({ id: item.id, currentStock: newStock });
  }, [updateStockMutation]);

  const handleDeleteItem = useCallback((item: InventoryItem) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      deleteMutation.mutate(item.id);
    }
  }, [deleteMutation]);

  const handleEditItem = useCallback((item: InventoryItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description || '',
      category: item.category,
      brand: item.brand,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock || 100,
      costPrice: item.costPrice,
      salePrice: item.salePrice,
      supplier: item.supplier || '',
      sku: item.sku || '',
      location: item.location || '',
      expiryDate: item.expiryDate || ''
    });
    setShowAddForm(true);
  }, []);

  // Filtrage et tri optimisés
  const filteredItems = useCallback(() => {
    const inventoryData = (inventory || testInventory) as InventoryItem[];
    let filtered = inventoryData.filter((item: InventoryItem) => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
                           (item.sku && item.sku.toLowerCase().includes(searchText.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Tri
    filtered.sort((a: InventoryItem, b: InventoryItem) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'price':
          aValue = a.salePrice;
          bValue = b.salePrice;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [inventory, testInventory, searchText, selectedCategory, sortBy, sortOrder]);

  const lowStockItems = useCallback(() => {
    const inventoryData = (inventory || testInventory) as InventoryItem[];
    return inventoryData.filter((item: InventoryItem) => item.currentStock <= item.minStock);
  }, [inventory, testInventory]);

  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'inventaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header responsive avec sécurité */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 border-b border-violet-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setLocation('/business-features')}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-semibold text-white">Inventaire</h1>
              {error && (
                <div className="flex items-center gap-1 text-xs text-yellow-200">
                  <Shield className="h-3 w-3" />
                  <span>Mode test</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/inventory'] })}
                className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-colors"
                aria-label="Actualiser"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setShowAddForm(true)}
                className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/30 transition-colors"
                aria-label="Ajouter un produit"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-violet-600 text-center sm:text-left mb-2 sm:mb-0">Gestion des Stocks</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Dernière activité: {new Date(lastActivity).toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>

          {/* Alertes stock faible avec plus d'infos */}
          {lowStockItems().length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Stock faible ({lowStockItems().length})</span>
              </div>
              <div className="space-y-1">
                {lowStockItems().slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-red-700">{item.name}</span>
                    <span className="text-red-600 font-medium">{item.currentStock} restants</span>
                  </div>
                ))}
                {lowStockItems().length > 3 && (
                  <p className="text-xs text-red-600">+{lowStockItems().length - 3} autres articles</p>
                )}
              </div>
            </div>
          )}

          {/* Stats détaillées avec responsivité */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalProducts || (inventory as InventoryItem[])?.length || 0}</div>
              <div className="text-xs text-gray-500">Produits</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-green-600">{stats?.inStock || (inventory as InventoryItem[])?.filter((i: InventoryItem) => i.currentStock > i.minStock).length || 0}</div>
              <div className="text-xs text-gray-500">En stock</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-orange-600">{stats?.lowStock || lowStockItems().length}</div>
              <div className="text-xs text-gray-500">Stock faible</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-red-600">{stats?.outOfStock || (inventory as InventoryItem[])?.filter((i: InventoryItem) => i.currentStock === 0).length || 0}</div>
              <div className="text-xs text-gray-500">Rupture</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-violet-600">{formatPrice(stats?.totalValue || 0)}</div>
              <div className="text-xs text-gray-500">Valeur totale</div>
            </div>
          </div>

          {/* Barre de recherche et filtres avancés */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Rechercher par nom, marque, SKU..."
                className="w-full h-10 sm:h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Filtres de tri */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="name">Trier par nom</option>
                <option value="stock">Trier par stock</option>
                <option value="price">Trier par prix</option>
                <option value="category">Trier par catégorie</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-10 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-sm font-medium transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Filtres catégories avec icônes */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.charAt(0)}</span>
                </button>
              );
            })}
          </div>

          {/* Liste des produits avec design amélioré */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-20">
            {filteredItems().length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2 font-medium">Aucun produit trouvé</p>
                <p className="text-sm mb-4">Commencez par ajouter vos premiers produits</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </button>
              </div>
            ) : (
              filteredItems().map((item: InventoryItem) => {
                const stockStatus = getStockStatus(item);
                const margin = ((item.salePrice - item.costPrice) / item.salePrice * 100).toFixed(1);
                return (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{item.brand}</p>
                        {item.sku && (
                          <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Modifier"
                        >
                          <Edit3 className="h-3 w-3 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${stockStatus.color}`}>
                        <stockStatus.icon className="h-3 w-3" />
                        <span>{item.currentStock} en stock</span>
                        <span className="text-gray-500">(min: {item.minStock})</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatPrice(item.salePrice)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Marge: {margin}%
                        </div>
                      </div>
                      
                      {item.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Package className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      
                      {item.expiryDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Exp: {formatDate(item.expiryDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStockAdjustment(item, -1)}
                        disabled={item.currentStock <= 0 || updateStockMutation.isPending}
                        className="flex-1 h-8 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 h-8 flex items-center justify-center text-sm font-medium text-gray-900">
                        {item.currentStock}
                      </span>
                      <button 
                        onClick={() => handleStockAdjustment(item, 1)}
                        disabled={updateStockMutation.isPending}
                        className="flex-1 h-8 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Formulaire d'ajout/édition amélioré */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingItem ? 'Modifier le produit' : 'Ajouter un produit'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
            <div className="space-y-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                    <input
                      type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Shampooing L'Oréal"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      required
                />
              </div>
                  
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description du produit"
                      className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    />
              </div>
                  
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                    <input
                      type="text"
                  value={newItem.brand}
                  onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Ex: L'Oréal Professional"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      required
                />
              </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock actuel</label>
                      <input
                    type="number"
                        min="0"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock min</label>
                      <input
                    type="number"
                        min="0"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
                  
              <div className="grid grid-cols-2 gap-2">
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat (€)</label>
                      <input
                    type="number"
                    step="0.01"
                        min="0"
                        value={newItem.costPrice}
                        onChange={(e) => setNewItem(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (€)</label>
                      <input
                    type="number"
                    step="0.01"
                        min="0"
                        value={newItem.salePrice}
                        onChange={(e) => setNewItem(prev => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input
                        type="text"
                        value={newItem.sku}
                        onChange={(e) => setNewItem(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="Code produit"
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
                      <input
                        type="text"
                        value={newItem.location}
                        onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Ex: Étagère A1"
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
            </div>
      </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                      placeholder="Nom du fournisseur"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                    <input
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                      }}
                      className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddItem}
                      disabled={addMutation.isPending}
                      className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {addMutation.isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingItem ? 'Modifier' : 'Ajouter'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
        </div>
      </div>
      
      {/* Barre de navigation mobile */}
      <BottomNavigation />
    </div>
  );
}