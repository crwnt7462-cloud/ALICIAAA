import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Grid3X3, List, Heart, X, Calendar, Users, Star, TrendingUp, Search, Eye, Phone, Mail, Loader2, AlertCircle
} from 'lucide-react';
import { ProHeader } from '@/components/ProHeader';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useToast } from '@/hooks/use-toast';

// Interface pour les clients
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  lastService: string;
  lastVisit: string;
  firstVisit: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: number;
  notes: string;
}

// Fonction de validation et sanitisation
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Composant réutilisable pour les cartes de statistiques
const StatCard = ({ title, value, color, icon: Icon, percentage, label }: {
  title: string;
  value: number;
  color: string;
  icon: any;
  percentage: string;
  label: string;
}) => (
  <div className={`bg-gradient-to-br ${color} text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg`}>
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h3 className="text-base sm:text-lg font-semibold drop-shadow-sm">{title}</h3>
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <div className="text-2xl sm:text-4xl font-bold mb-1 drop-shadow-sm">{value}</div>
        <div className="text-white/80 text-xs sm:text-sm font-medium">{label}</div>
      </div>
    </div>
    <div className="mt-2 text-xs sm:text-sm text-white/80 font-medium">{percentage}</div>
  </div>
);

// Composant réutilisable pour les cercles de progression
const ProgressCircle = ({ percentage, color }: { percentage: number; color: string }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  );
};

export default function ClientsModern() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;
  const { toast } = useToast();

  // Données de test pour le développement
  const testClients: Client[] = [
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Dubois',
      avatar: '👩🏻',
      lastService: 'Coupe + Couleur',
      lastVisit: '15/08/2025',
      firstVisit: '12/03/2024',
      phone: '06 12 34 56 78',
      email: 'marie.dubois@email.com',
      totalVisits: 18,
      totalSpent: 1250,
      notes: 'Préfère les RDV le matin. Allergique aux sulfates.'
    },
    {
      id: '2',
      firstName: 'Sophie',
      lastName: 'Martin',
      avatar: '👩🏼',
      lastService: 'Manucure française',
      lastVisit: '20/08/2025',
      firstVisit: '05/01/2024',
      phone: '06 98 76 54 32',
      email: 'sophie.martin@email.com',
      totalVisits: 24,
      totalSpent: 890,
      notes: 'Cliente VIP. Préfère la styliste Emma.'
    },
    {
      id: '3',
      firstName: 'Julien',
      lastName: 'Leroy',
      avatar: '👨🏻',
      lastService: 'Coupe + Barbe',
      lastVisit: '18/08/2025',
      firstVisit: '15/06/2024',
      phone: '06 45 67 89 12',
      email: 'julien.leroy@email.com',
      totalVisits: 12,
      totalSpent: 480,
      notes: 'Coupe toujours très courte. RDV rapides.'
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Petit',
      avatar: '👩🏽',
      lastService: 'Soin visage hydratant',
      lastVisit: '21/08/2025',
      firstVisit: '08/04/2024',
      phone: '06 23 45 67 89',
      email: 'emma.petit@email.com',
      totalVisits: 15,
      totalSpent: 750,
      notes: 'Peau sensible. Utilise uniquement des produits bio.'
    },
    {
      id: '5',
      firstName: 'Thomas',
      lastName: 'Moreau',
      avatar: '👨🏻',
      lastService: 'Massage relaxant',
      lastVisit: '19/08/2025',
      firstVisit: '20/02/2024',
      phone: '06 34 56 78 90',
      email: 'thomas.moreau@email.com',
      totalVisits: 22,
      totalSpent: 1680,
      notes: 'Vient tous les 15 jours. Préfère les RDV en fin de journée.'
    }
  ];

  const testDashboardStats = {
    appointments: { count: 150, label: 'Aujourd\'hui', percentage: '+31%' },
    cancelled: { count: 3, label: 'Aujourd\'hui', percentage: '+30%' },
    inactiveClients: { count: 12, label: 'Dernière semaine', percentage: '-8%' }
  };

  const testClientInsights = {
    loyalClients: { 
      percentage: 68, 
      label: 'Clients fidèles',
      description: 'Plus de 5 visites',
      change: '+12%',
      color: '#10b981'
    },
    newClients: { 
      percentage: 32, 
      label: 'Nouveaux clients',
      description: 'Moins de 5 visites',
      change: '+8%',
      color: '#f59e0b'
    },
    reviewedClients: { 
      percentage: 45, 
      label: 'Clients avec avis',
      description: 'Ont laissé un avis',
      change: '+15%',
      color: '#8b5cf6'
    }
  };

  // Simulation des états de chargement
  const clientsLoading = false;
  const statsLoading = false;
  const insightsLoading = false;
  const clientsError = null;
  const statsError = null;
  const insightsError = null;

  // Utilisation des données de test
  const clients = testClients;
  const dashboardStats = testDashboardStats;
  const clientInsights = testClientInsights;

  // Gestion des erreurs avec notifications (déplacé dans useEffect)
  useEffect(() => {
    if (clientsError || statsError || insightsError) {
      const errorMessage = 'Erreur de chargement des données';
      toast({
        title: "Erreur de chargement",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [clientsError, statsError, insightsError, toast]);

  // Filtrage sécurisé des clients selon la recherche
  const safeSearchQuery = useMemo(() => sanitizeInput(searchQuery), [searchQuery]);
  const filteredClients = useMemo(() => {
    if (!safeSearchQuery) return clients;
    return clients.filter((client: Client) => 
      client.firstName.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
      client.lastService?.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(safeSearchQuery.toLowerCase())
    );
  }, [clients, safeSearchQuery]);

  // Pagination sécurisée
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + clientsPerPage);

  // États de chargement
  const isLoading = clientsLoading || statsLoading || insightsLoading;
  const hasError = clientsError || statsError || insightsError;

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <ProHeader currentPage="clients" />
        <MobileBottomNav userType="pro" />
        <div className="pt-20 md:pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-600" />
                <p className="text-gray-600">Chargement des données...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran d'erreur
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <ProHeader currentPage="clients" />
        <MobileBottomNav userType="pro" />
        <div className="pt-20 md:pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
                <p className="text-gray-600 mb-4">Erreur lors du chargement des données</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <ProHeader currentPage="clients" />
      <MobileBottomNav userType="pro" />

      <div className="pt-20 md:pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8 p-3 sm:p-6">
          {/* En-tête principale */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 sm:pt-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Fichier Client</h1>
                <p className="text-sm sm:text-base text-gray-600">Salon Avyento Pro</p>
              </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-300 text-white' : 'bg-gray-200'}`}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-300 text-white' : 'bg-gray-200'}`}
              >
                <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 3 Cartes statistiques avec glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="glass-button p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{dashboardStats?.appointments?.count || 150}</div>
                <div className="text-sm text-blue-600 font-medium">{dashboardStats?.appointments?.percentage || '+31%'}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Rendez-vous</h3>
              <p className="text-sm text-gray-600">{dashboardStats?.appointments?.label || 'Aujourd\'hui'}</p>
            </div>
          </div>

          <div className="glass-button p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(239, 68, 68, 0.1) 100%)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{dashboardStats?.cancelled?.count || 3}</div>
                <div className="text-sm text-red-600 font-medium">{dashboardStats?.cancelled?.percentage || '+30%'}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Annulés</h3>
              <p className="text-sm text-gray-600">{dashboardStats?.cancelled?.label || 'Aujourd\'hui'}</p>
            </div>
          </div>

          <div className="glass-button p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(245, 158, 11, 0.1) 100%)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{dashboardStats?.inactiveClients?.count || 12}</div>
                <div className="text-sm text-orange-600 font-medium">{dashboardStats?.inactiveClients?.percentage || '-8%'}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Clients Inactifs</h3>
              <p className="text-sm text-gray-600">{dashboardStats?.inactiveClients?.label || 'Dernière semaine'}</p>
            </div>
          </div>
        </motion.div>

        {/* Insights Clients Avancés */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Insights Clients</h2>
            <p className="text-sm sm:text-base text-gray-600">Analyse comportementale de votre clientèle</p>
          </div>

          {/* 3 Cartes d'insights clients avec glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Clients fidèles */}
            <div className="glass-button p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(34, 197, 94, 0.1) 100%)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{clientInsights?.loyalClients?.label || 'Clients fidèles'}</h3>
                    <p className="text-sm text-gray-600">{clientInsights?.loyalClients?.description || 'Plus de 5 visites'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights?.loyalClients?.percentage || 68}%
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {clientInsights?.loyalClients?.change || '+12%'}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights?.loyalClients?.percentage || 68} color="#22c55e" />
                </div>
              </div>
            </div>

            {/* Nouveaux clients */}
            <div className="glass-button p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(245, 158, 11, 0.1) 100%)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{clientInsights?.newClients?.label || 'Nouveaux clients'}</h3>
                    <p className="text-sm text-gray-600">{clientInsights?.newClients?.description || 'Moins de 5 visites'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights?.newClients?.percentage || 32}%
                  </div>
                  <div className="text-sm text-amber-600 font-medium">
                    {clientInsights?.newClients?.change || '+8%'}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights?.newClients?.percentage || 32} color="#f59e0b" />
                </div>
              </div>
            </div>

            {/* Clients avec avis */}
            <div className="glass-button p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{clientInsights?.reviewedClients?.label || 'Clients avec avis'}</h3>
                    <p className="text-sm text-gray-600">{clientInsights?.reviewedClients?.description || 'Ont laissé un avis'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights?.reviewedClients?.percentage || 45}%
                  </div>
                  <div className="text-sm text-purple-600 font-medium">
                    {clientInsights?.reviewedClients?.change || '+15%'}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights?.reviewedClients?.percentage || 45} color="#8b5cf6" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Clients avec barre de recherche et tableau */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* En-tête de la section avec barre de recherche */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Clients</h2>
                <span className="text-xs sm:text-sm text-gray-500">{filteredClients.length} clients</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent glass-button"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          {/* En-têtes des colonnes - masqué sur mobile */}
          <div className="hidden sm:block px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Nom / Prénom</div>
              <div className="col-span-2">Dernière Prestation</div>
              <div className="col-span-2">Dernière Visite</div>
              <div className="col-span-2">Première Visite</div>
              <div className="col-span-1">Visites</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          {/* Liste des clients */}
          <div className="divide-y divide-gray-100">
            {currentClients.map((client: Client, index: number) => (
              <motion.div 
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Version Desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  {/* Nom avec avatar */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {client.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{client.firstName} {client.lastName}</span>
                  </div>

                  {/* Dernière prestation */}
                  <div className="col-span-2">
                    <span className="text-blue-600 text-sm">{client.lastService}</span>
                  </div>

                  {/* Dernière visite */}
                  <div className="col-span-2">
                    <span className="text-gray-600 text-sm">{client.lastVisit}</span>
                  </div>

                  {/* Première visite */}
                  <div className="col-span-2">
                    <span className="text-gray-600 text-sm">{client.firstVisit}</span>
                  </div>

                  {/* Nombre de visites */}
                  <div className="col-span-1 flex justify-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{client.totalVisits}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                    >
                      VOIR DÉTAILS
                    </button>
                  </div>
                </div>

                {/* Version Mobile */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {client.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{client.firstName} {client.lastName}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-blue-600 text-xs">{client.lastService}</span>
                          <span className="text-gray-600 text-xs">{client.lastVisit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{client.totalVisits}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="w-full glass-button text-black px-3 py-2 rounded-xl text-xs font-medium hover:scale-105 transition-all duration-200"
                    >
                      VOIR DÉTAILS
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer avec pagination */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
              <span>Affichage de {startIndex + 1} à {Math.min(startIndex + clientsPerPage, filteredClients.length)} sur {filteredClients.length} clients</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl glass-button text-black hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Précédent
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                        currentPage === i + 1 
                          ? 'glass-button text-black scale-105' 
                          : 'glass-button text-black hover:scale-105'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl glass-button text-black hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popup détails client */}
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header du popup */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                      {selectedClient.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Client depuis le {selectedClient.firstVisit}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Contenu du popup */}
              <div className="p-6 space-y-6">
                {/* Informations de contact */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>

                {/* Historique */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Historique</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Total visites</div>
                      <div className="text-2xl font-bold text-blue-900">{selectedClient.totalVisits}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Total dépensé</div>
                      <div className="text-2xl font-bold text-green-900">{selectedClient.totalSpent}€</div>
                    </div>
                  </div>
                </div>

                {/* Dernière prestation */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Dernière prestation</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{selectedClient.lastService}</div>
                    <div className="text-sm text-gray-600">Le {selectedClient.lastVisit}</div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedClient.notes}</p>
                  </div>
                </div>
              </div>

              {/* Footer du popup */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Nouveau RDV
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    Modifier
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}