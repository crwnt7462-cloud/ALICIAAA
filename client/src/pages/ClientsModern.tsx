import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, Star, Phone, 
  MessageCircle, User, Crown, Sparkles, Users, ArrowRight, Calendar
} from 'lucide-react';
import { getGenericGlassButton } from "@/lib/salonColors";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'VIP' | 'Fidèle' | 'Nouvelle' | 'Inactive';
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  rating: number;
  notes?: string;
  birthday?: string;
  preferences?: string[];
}

// ✅ DESKTOP RESPONSIVE OPTIMISÉ - Version finale
export default function ClientsModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Clients fictifs pour la démo
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      phone: '06 12 34 56 78',
      status: 'VIP',
      lastVisit: '2025-01-15',
      totalVisits: 24,
      totalSpent: 1850,
      rating: 4.9,
      notes: 'Préfère les rendez-vous le matin. Allergique aux sulfates.',
      preferences: ['Coiffure', 'Coloration naturelle', 'Soins bio']
    },
    {
      id: '2',
      name: 'Sophie Martin',
      email: 'sophie.martin@gmail.com',
      phone: '06 98 76 54 32',
      status: 'Fidèle',
      lastVisit: '2025-01-10',
      totalVisits: 12,
      totalSpent: 680,
      rating: 4.7,
      preferences: ['Manucure', 'Pédicure', 'Massage']
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@outlook.com',
      phone: '07 45 67 89 12',
      status: 'Nouvelle',
      lastVisit: '2025-01-08',
      totalVisits: 2,
      totalSpent: 120,
      rating: 4.5
    },
    {
      id: '4',
      name: 'Lucas Leroy',
      email: 'lucas.leroy@email.fr',
      phone: '06 11 22 33 44',
      status: 'VIP',
      lastVisit: '2025-01-12',
      totalVisits: 18,
      totalSpent: 1200,
      rating: 4.8,
      preferences: ['Coupe homme', 'Barbe', 'Soins visage']
    },
    {
      id: '5',
      name: 'Amélie Thomas',
      email: 'amelie.thomas@yahoo.fr',
      phone: '06 55 44 33 22',
      status: 'Fidèle',
      lastVisit: '2025-01-05',
      totalVisits: 8,
      totalSpent: 450,
      rating: 4.6,
      preferences: ['Extensions', 'Lissage', 'Soins capillaires']
    }
  ];

  // Récupérer les clients depuis la BDD avec fallback sur les clients fictifs
  const { data: clientsFromDB, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    retry: 1
  });

  const clients = clientsFromDB && clientsFromDB.length > 0 ? clientsFromDB : mockClients;

  const filters = [
    { id: 'all', label: 'Tous', count: clients?.length || 0 },
    { id: 'VIP', label: 'VIP', count: clients?.filter((c: Client) => c.status === 'VIP').length || 0 },
    { id: 'Fidèle', label: 'Fidèles', count: clients?.filter((c: Client) => c.status === 'Fidèle').length || 0 },
    { id: 'Nouvelle', label: 'Nouvelles', count: clients?.filter((c: Client) => c.status === 'Nouvelle').length || 0 },
    { id: 'Inactive', label: 'Inactives', count: clients?.filter((c: Client) => c.status === 'Inactive').length || 0 }
  ];

  const filteredClients = (clients || []).filter((client: Client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         client.phone.includes(searchText);
    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Fidèle': return 'bg-green-100 text-green-600 border-green-200';
      case 'Nouvelle': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Inactive': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const currentClient = selectedClient 
    ? (clients || []).find((c: Client) => c.id === selectedClient)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden flex items-center justify-center">

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-100 border-t-purple-500 rounded-full mx-auto mb-6"
          />
          <p className="text-purple-600 font-medium">Chargement de vos client(e)s...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 relative overflow-hidden"
    >

      
      {!selectedClient ? (
        // Vue liste des clients
        <div className="relative z-10">
          
          {/* Header avec retour - style Landing */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => window.history.back()}
            className="absolute left-4 top-4 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-md hover:bg-white/90 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </motion.button>

          {/* Layout responsive Desktop optimisé + Mobile */}
          <div className="p-4 md:p-6 lg:p-8 xl:p-12 2xl:p-16">
            <div className="max-w-md mx-auto lg:max-w-6xl xl:max-w-7xl 2xl:max-w-none 2xl:px-8">
              
              {/* Header responsive desktop optimisé */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center space-y-4 lg:space-y-6 xl:space-y-8 pt-4 lg:pt-8 xl:pt-12 2xl:pt-16 mb-6 lg:mb-12 xl:mb-16 2xl:mb-20"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 gradient-bg rounded-3xl flex items-center justify-center shadow-luxury mx-auto">
                  <Users className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 text-white" />
                </div>
                
                <div>
                  <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 tracking-tight mb-2 lg:mb-3 xl:mb-4 2xl:mb-6">
                    Gestion Client(e)s
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
                    Base de données client(e)s complète avec historique et préférences
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600">{(clients || []).length} client(e)s • Gestion intelligente</span>
                </div>
              </motion.div>

              {/* Stats responsive desktop optimisé */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6 lg:mb-10 xl:mb-12 2xl:mb-16"
              >
                <div className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl xl:rounded-2xl 2xl:rounded-3xl overflow-hidden">
                  <div className="p-4 lg:p-6 xl:p-8 2xl:p-10">
                    <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 text-center">
                      <div>
                        <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900">{clients?.filter((c: Client) => c.status === 'VIP').length || 0}</p>
                        <p className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-600">Client(e)s VIP</p>
                      </div>
                      <div>
                        <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900">{clients?.filter((c: Client) => c.status === 'Fidèle').length || 0}</p>
                        <p className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-600">Fidèles</p>
                      </div>
                      <div>
                        <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900">{clients?.filter((c: Client) => c.status === 'Nouvelle').length || 0}</p>
                        <p className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-600">Nouveau/elles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contrôles responsive desktop optimisé */}
              <div className="space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10 mb-6 lg:mb-10 xl:mb-12 2xl:mb-16">
                
                {/* Barre de recherche style Landing */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative"
                >
                  <Search className="absolute left-4 lg:left-5 xl:left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 text-gray-500" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Rechercher une cliente..."
                    className="w-full h-12 lg:h-14 xl:h-16 2xl:h-18 pl-12 lg:pl-14 xl:pl-16 2xl:pl-18 pr-4 lg:pr-6 xl:pr-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl xl:rounded-2xl 2xl:rounded-3xl text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all shadow-md"
                  />
                </motion.div>

                {/* Filtres style Landing avec grid responsive */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="grid grid-cols-2 lg:flex gap-2 lg:gap-4"
                >
                  {filters.map((filter, index) => (
                    <motion.button
                      key={filter.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-3 py-2 lg:px-4 lg:py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 rounded-xl xl:rounded-2xl text-xs lg:text-sm xl:text-base 2xl:text-lg font-medium whitespace-nowrap transition-all ${
                        selectedFilter === filter.id
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200/50 shadow-md'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </motion.button>
                  ))}
                </motion.div>

                {/* Bouton nouvelle cliente style Landing */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast({ 
                    title: "Nouveau(elle) client(e)", 
                    description: "Fonctionnalité à venir" 
                  })}
                  className="w-full h-12 lg:h-14 xl:h-16 2xl:h-18 text-white rounded-xl xl:rounded-2xl text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold transition-all flex items-center justify-center gap-3 shadow-luxury hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(124, 58, 237, 0.4) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                  Ajouter un(e) client(e)
                </motion.button>
              </div>

              {/* Liste des clients responsive desktop optimisée */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8"
              >
                {filteredClients.length === 0 ? (
                  <div className="col-span-full">
                    <div className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden text-center py-16">
                      <div className="relative mb-6">
                        <User className="h-16 w-16 lg:h-20 lg:w-20 mx-auto text-gray-400" />
                        <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-gray-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Aucun(e) client(e) trouvé(e)</h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-4">Commencez par ajouter vos premier(ère)s client(e)s</p>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        👥
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  filteredClients.map((client: Client, index: number) => (
                  <motion.button
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedClient(client.id)}
                    className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl xl:rounded-2xl 2xl:rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-200 text-left p-4 lg:p-5 xl:p-6 2xl:p-8"
                  >
                    <div className="space-y-3">
                      {/* Avatar et statut */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {client.avatar ? (
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 lg:h-8 lg:w-8 text-gray-700" />
                            </div>
                          )}
                          {client.status === 'VIP' && (
                            <Crown className="absolute -top-1 -right-1 h-4 w-4 text-gray-700" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1">
                            {client.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Infos client */}
                      <div className="space-y-2">
                        <p className="text-xs lg:text-sm text-gray-600">{client.email}</p>
                        
                        {/* Rating et visites */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < Math.floor(client.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{client.totalVisits} visites</span>
                        </div>
                        
                        {/* Total dépensé */}
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg lg:text-xl font-bold text-gray-900">€{client.totalSpent}</span>
                          <span className="text-xs lg:text-sm text-gray-500">
                            {new Date(client.lastVisit).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                  ))
                )}
              </motion.div>

            </div>
          </div>
          
          {/* Footer identique à Landing.tsx */}
          <div className="text-center text-xs text-gray-500 pb-4 mt-16">
            <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
          </div>
        </div>
      ) : (
        // Vue détail client moderne - DESIGN LANDING.TSX
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 md:p-6 lg:p-8"
        >
          <div className="max-w-md mx-auto lg:max-w-6xl space-y-8">
            
            {/* Header avec retour */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => setSelectedClient(null)}
                className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/90 transition-all shadow-md"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <div className="flex-1">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  {currentClient?.name}
                </h1>
                <p className="text-gray-600 text-sm lg:text-lg">{currentClient?.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(`tel:${currentClient?.phone}`)}
                  className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/90 transition-all shadow-md"
                >
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setLocation('/pro-messaging')}
                  className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/90 transition-all shadow-md"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </motion.div>

            {/* Contenu principal avec layout moderne */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Colonne gauche - Infos principales */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Photo et infos - DESIGN GLASSMORPHISM LANDING */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    {/* Photo avec upload */}
                    <div className="relative group">
                      {currentClient?.avatar ? (
                        <img
                          src={currentClient.avatar}
                          alt={currentClient.name}
                          className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-luxury"
                        />
                      ) : (
                        <div className="w-24 h-24 lg:w-32 lg:h-32 gradient-bg rounded-full flex items-center justify-center border-4 border-white shadow-luxury">
                          <User className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
                        </div>
                      )}
                      <button className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="h-8 w-8 text-white" />
                      </button>
                    </div>
                    
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{currentClient?.name}</h2>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(currentClient?.status || '')}`}>
                        {currentClient?.status}
                      </span>
                      {/* Informations de contact */}
                      <div className="mt-4 space-y-2 text-sm lg:text-base text-gray-600">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                          <span>📧</span>
                          <span>{currentClient?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                          <span>📞</span>
                          <span>{currentClient?.phone || '+33 6 12 34 56 78'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats en grille - STYLE LANDING */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-violet-600 mb-1">{currentClient?.totalVisits}</div>
                      <div className="text-sm lg:text-base text-gray-600">Visites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-1">€{currentClient?.totalSpent}</div>
                      <div className="text-sm lg:text-base text-gray-600">Dépensé</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-yellow-600 mb-1">{currentClient?.rating}</div>
                      <div className="text-sm lg:text-base text-gray-600">Note</div>
                    </div>
                  </div>
                </div>

                {/* Actions rapides - STYLE GLASSMORPHISM LANDING */}
                <div className="space-y-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLocation('/booking')}
                    className="relative w-full h-16 rounded-3xl overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(124, 58, 237, 0.4) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center h-full text-white font-semibold text-lg">
                      <Calendar className="w-5 h-5 mr-3" />
                      Prendre rendez-vous
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </motion.button>
                  
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-14 ${getGenericGlassButton(1)} rounded-xl text-base font-medium flex items-center justify-center`}
                    onClick={() => setLocation('/pro-messaging')}
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Envoyer un message
                  </motion.button>
                </div>

                {/* Préférences - STYLE LANDING */}
                {currentClient?.preferences && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg"
                  >
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Préférences</h3>
                    <div className="flex flex-wrap gap-3">
                      {currentClient.preferences.map((pref: string, index: number) => (
                        <span key={index} className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm lg:text-base text-gray-700 border border-gray-200/50 font-medium">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Colonne droite - Notes et Photos */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-8"
              >
                {/* Notes éditables - STYLE LANDING */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Notes</h3>
                  <textarea
                    className="w-full h-40 p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm lg:text-base"
                    placeholder="Préfère les rendez-vous le matin. Allergique aux sulfates."
                    defaultValue={currentClient?.notes || 'Préfère les rendez-vous le matin. Allergique aux sulfates.'}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-2xl text-sm lg:text-base font-medium transition-all shadow-lg"
                  >
                    Sauvegarder
                  </motion.button>
                </div>

                {/* Galerie photos - STYLE LANDING */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Photos</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Placeholder photos */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-violet-400 cursor-pointer transition-all shadow-md"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-violet-400 cursor-pointer transition-all shadow-md"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-violet-400 cursor-pointer transition-all shadow-md"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                    </motion.div>
                  </div>
                  <p className="text-sm lg:text-base text-gray-500 mt-4 text-center">Cliquez pour ajouter des photos de réalisations</p>
                </div>
              </motion.div>
            </div>

            {/* Footer identique à Landing.tsx */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-xs lg:text-sm text-gray-500 pb-4 pt-8"
            >
              <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}