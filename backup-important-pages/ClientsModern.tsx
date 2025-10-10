import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid3X3, List, Heart, X, Calendar, Users, Star, TrendingUp, Search, Eye, Phone, Mail
} from 'lucide-react';
import { ProHeader } from '@/components/ProHeader';
import { MobileBottomNav } from '@/components/MobileBottomNav';

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

// Interface Mediwave exacte reproduisant la capture d'écran
export default function ClientsModern() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  // Statistiques du dashboard - modifiées selon demandes
  const dashboardStats = {
    appointments: { count: 150, label: 'Aujourd\'hui', percentage: '+31%' },
    cancelled: { count: 3, label: 'Aujourd\'hui', percentage: '+30%' },
    inactiveClients: { count: 12, label: 'Dernière semaine', percentage: '-8%' }
  };

  // Insights clients avancés demandés
  const clientInsights = {
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

  // Liste des clients avec données complètes
  const allClients: Client[] = [
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
    },
    {
      id: '6',
      firstName: 'Claire',
      lastName: 'Rousseau',
      avatar: '👩🏻',
      lastService: 'Épilation jambes',
      lastVisit: '16/08/2025',
      firstVisit: '11/05/2024',
      phone: '06 56 78 90 12',
      email: 'claire.rousseau@email.com',
      totalVisits: 10,
      totalSpent: 420,
      notes: 'Nouvelle cliente. Très satisfaite du service.'
    },
    {
      id: '7',
      firstName: 'Alexandre',
      lastName: 'Blanc',
      avatar: '👨🏼',
      lastService: 'Coupe tendance',
      lastVisit: '22/08/2025',
      firstVisit: '30/01/2024',
      phone: '06 67 89 01 23',
      email: 'alexandre.blanc@email.com',
      totalVisits: 16,
      totalSpent: 640,
      notes: 'Aime essayer de nouvelles coupes. Très fidèle.'
    },
    {
      id: '8',
      firstName: 'Camille',
      lastName: 'Garnier',
      avatar: '👩🏼',
      lastService: 'Balayage blond',
      lastVisit: '17/08/2025',
      firstVisit: '25/03/2024',
      phone: '06 78 90 12 34',
      email: 'camille.garnier@email.com',
      totalVisits: 8,
      totalSpent: 560,
      notes: 'Adore les changements de couleur. Très patiente.'
    },
    {
      id: '9',
      firstName: 'Lucas',
      lastName: 'Roux',
      avatar: '👨🏽',
      lastService: 'Soin du cuir chevelu',
      lastVisit: '14/08/2025',
      firstVisit: '18/04/2024',
      phone: '06 89 01 23 45',
      email: 'lucas.roux@email.com',
      totalVisits: 14,
      totalSpent: 770,
      notes: 'Problèmes de pellicules. Traitement en cours.'
    },
    {
      id: '10',
      firstName: 'Léa',
      lastName: 'Lambert',
      avatar: '👩🏻',
      lastService: 'Mise en plis',
      lastVisit: '23/08/2025',
      firstVisit: '07/02/2024',
      phone: '06 90 12 34 56',
      email: 'lea.lambert@email.com',
      totalVisits: 20,
      totalSpent: 900,
      notes: 'Cliente régulière. Très ponctuelle.'
    },
    {
      id: '11',
      firstName: 'Nicolas',
      lastName: 'Faure',
      avatar: '👨🏻',
      lastService: 'Coupe + Shampoing',
      lastVisit: '13/08/2025',
      firstVisit: '14/06/2024',
      phone: '06 01 23 45 67',
      email: 'nicolas.faure@email.com',
      totalVisits: 9,
      totalSpent: 270,
      notes: 'Coupe classique. Pas compliqué.'
    },
    {
      id: '12',
      firstName: 'Anaïs',
      lastName: 'Girard',
      avatar: '👩🏽',
      lastService: 'Extensions cheveux',
      lastVisit: '12/08/2025',
      firstVisit: '28/05/2024',
      phone: '06 12 34 56 78',
      email: 'anais.girard@email.com',
      totalVisits: 6,
      totalSpent: 1200,
      notes: 'Aime les services premium. Budget élevé.'
    }
  ];

  // Filtrage des clients selon la recherche
  const filteredClients = allClients.filter(client => 
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastService.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + clientsPerPage);

  // Fonction pour créer le cercle de progression
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
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

        {/* 3 Cartes statistiques colorées avec meilleur contraste */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Carte Appointments - Bleu pastel avec meilleur contraste */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold drop-shadow-sm">Rendez-vous</h3>
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 drop-shadow-sm">{dashboardStats.appointments.count}</div>
                <div className="text-blue-100 text-xs sm:text-sm font-medium">{dashboardStats.appointments.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={31} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-blue-100 font-medium">{dashboardStats.appointments.percentage}</div>
          </div>

          {/* Carte Cancelled - Rouge pastel avec meilleur contraste */}
          <div className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold drop-shadow-sm">Annulés</h3>
              <X className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 drop-shadow-sm">0{dashboardStats.cancelled.count}</div>
                <div className="text-red-100 text-xs sm:text-sm font-medium">{dashboardStats.cancelled.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={30} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-red-100 font-medium">{dashboardStats.cancelled.percentage}</div>
          </div>

          {/* Carte Clients Inactifs - Orange pastel avec meilleur contraste */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold drop-shadow-sm">Clients Inactifs</h3>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 drop-shadow-sm">{dashboardStats.inactiveClients.count}</div>
                <div className="text-orange-100 text-xs sm:text-sm font-medium">{dashboardStats.inactiveClients.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={8} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-orange-100 font-medium">{dashboardStats.inactiveClients.percentage}</div>
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

          {/* 3 Cartes d'insights clients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Clients fidèles */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{clientInsights.loyalClients.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{clientInsights.loyalClients.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights.loyalClients.percentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    {clientInsights.loyalClients.change}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights.loyalClients.percentage} color={clientInsights.loyalClients.color} />
                </div>
              </div>
            </div>

            {/* Nouveaux clients */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-amber-100 rounded-lg sm:rounded-xl">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{clientInsights.newClients.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{clientInsights.newClients.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights.newClients.percentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-amber-600 font-medium">
                    {clientInsights.newClients.change}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights.newClients.percentage} color={clientInsights.newClients.color} />
                </div>
              </div>
            </div>

            {/* Clients avec avis */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                    <Star className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{clientInsights.reviewedClients.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{clientInsights.reviewedClients.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights.reviewedClients.percentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">
                    {clientInsights.reviewedClients.change}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights.reviewedClients.percentage} color={clientInsights.reviewedClients.color} />
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
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            {currentClients.map((client, index) => (
              <motion.div 
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors"
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
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
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
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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