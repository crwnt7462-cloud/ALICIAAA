import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, Star, Phone, 
  MessageCircle, User, Crown, Users, Calendar
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
  appointments?: Appointment[];
  review?: string;
}

interface Appointment {
  id: string;
  date: string;
  service: string;
  price: number;
  duration: string;
  status: 'Terminé' | 'À venir' | 'Annulé';
}

// ✅ DESKTOP RESPONSIVE OPTIMISÉ - Version finale
export default function ClientsModern() {
  const [, setLocation] = useLocation();
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
      preferences: ['Coiffure', 'Coloration naturelle', 'Soins bio'],
      review: 'Service impeccable ! Marie est très professionnelle et à l\'écoute. Je recommande vivement ce salon pour la qualité des prestations.',
      appointments: [
        { id: '1', date: '2024-03-15', service: 'Coupe + Brushing', price: 65, duration: '1h30', status: 'Terminé' },
        { id: '2', date: '2024-02-20', service: 'Coloration + Coupe', price: 120, duration: '2h30', status: 'Terminé' },
        { id: '3', date: '2024-01-18', service: 'Soin capillaire', price: 45, duration: '1h', status: 'Terminé' },
        { id: '4', date: '2024-04-22', service: 'Coupe + Coloration', price: 135, duration: '3h', status: 'À venir' }
      ]
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
      preferences: ['Manucure', 'Pédicure', 'Massage'],
      review: 'Très satisfaite du service. L\'équipe est accueillante et les prestations sont de qualité.',
      appointments: [
        { id: '5', date: '2024-03-10', service: 'Manucure gel', price: 35, duration: '45min', status: 'Terminé' },
        { id: '6', date: '2024-02-25', service: 'Pédicure spa', price: 55, duration: '1h', status: 'Terminé' }
      ]
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
      rating: 4.5,
      review: 'Première visite très réussie ! Je reviendrai certainement.',
      appointments: [
        { id: '7', date: '2024-03-08', service: 'Coupe découverte', price: 60, duration: '1h30', status: 'Terminé' },
        { id: '8', date: '2024-04-15', service: 'Brushing', price: 35, duration: '45min', status: 'À venir' }
      ]
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
        // Vue liste clients moderne - DESIGN EXACT CAPTURE D'ÉCRAN
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 md:p-6 lg:p-8"
        >
          <div className="max-w-md mx-auto lg:max-w-6xl space-y-8">
            
            {/* Header avec bouton retour - STYLE CAPTURE */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => window.history.back()}
              className="absolute left-4 top-4 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-md hover:bg-white/90 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </motion.button>

            {/* Header avec icône et titre - STYLE CAPTURE */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center space-y-6 pt-8"
            >
              {/* Icône glassmorphism violette avec Users */}
              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-3xl flex items-center justify-center shadow-luxury"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.8) 50%, rgba(109, 40, 217, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <Users className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                  Gestion Client(e)s
                </h1>
                <p className="text-gray-600 text-sm lg:text-lg leading-relaxed max-w-2xl mx-auto">
                  Base de données client(e)s complète avec historique et préférences
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mt-2">
                  {filteredClients.length} client(e)s • Gestion intelligente
                </p>
              </div>
            </motion.div>

            {/* Cartes statistiques - STYLE CAPTURE (3 cartes horizontales) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 lg:p-8 shadow-lg"
            >
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {mockClients.filter(c => c.status === 'VIP').length}
                  </div>
                  <div className="text-sm lg:text-base text-gray-600">Client(e)s VIP</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {mockClients.filter(c => c.status === 'Fidèle').length}
                  </div>
                  <div className="text-sm lg:text-base text-gray-600">Fidèles</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {mockClients.filter(c => c.status === 'Nouvelle').length}
                  </div>
                  <div className="text-sm lg:text-base text-gray-600">Nouvelles</div>
                </div>
              </div>
            </motion.div>

            {/* Barre de recherche - STYLE CAPTURE */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-4 shadow-lg"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher une cliente..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </motion.div>

            {/* Filtres en onglets - STYLE CAPTURE (onglets arrondis noirs/blancs) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { key: 'all', label: `Tous (${mockClients.length})` },
                { key: 'VIP', label: `VIP (${mockClients.filter(c => c.status === 'VIP').length})` },
                { key: 'Fidèle', label: `Fidèles (${mockClients.filter(c => c.status === 'Fidèle').length})` },
                { key: 'Nouvelle', label: `Nouvelles (${mockClients.filter(c => c.status === 'Nouvelle').length})` },
                { key: 'Inactive', label: `Inactives (${mockClients.filter(c => c.status === 'Inactive').length})` }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-md ${
                    selectedFilter === filter.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:bg-white/90'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Liste des clients - STYLE LANDING GLASSMORPHISM */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              {filteredClients.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-500 text-lg">Aucune cliente trouvée</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredClients.map((client, index) => (
                    <motion.button
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedClient(client.id)}
                      className="w-full text-left bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-4 lg:gap-6">
                        {/* Photo avec effet glassmorphism */}
                        <div className="relative">
                          {client.avatar ? (
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-white shadow-luxury"
                            />
                          ) : (
                            <div className="w-16 h-16 lg:w-20 lg:h-20 gradient-bg rounded-full flex items-center justify-center border-4 border-white shadow-luxury">
                              <User className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                            </div>
                          )}
                          {client.status === 'VIP' && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                              <Crown className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                              {client.name}
                            </h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                              {client.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 lg:w-4 lg:h-4 ${i < Math.floor(client.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                              <span className="ml-1">{client.rating}</span>
                            </div>
                            <span className="text-xs lg:text-sm text-gray-500">{client.totalVisits} visites</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

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



                {/* Avis client - STYLE LANDING */}
                {currentClient?.review && (
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Avis laissé</h3>
                    <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(currentClient.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-lg font-semibold text-gray-700 ml-2">{currentClient.rating}/5</span>
                      </div>
                      <p className="text-gray-700 text-sm lg:text-base leading-relaxed italic">
                        "{currentClient.review}"
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sections pleine largeur desktop */}
            <div className="max-w-md lg:max-w-none lg:w-full space-y-8">
              {/* Historique des rendez-vous - PLEINE LARGEUR DESKTOP */}
              {currentClient?.appointments && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg"
                >
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Historique des rendez-vous</h3>
                  <div className="space-y-4">
                    {/* Afficher seulement les 2 derniers */}
                    {currentClient.appointments
                      .slice(0, 2)
                      .map((appointment) => (
                        <motion.div 
                          key={appointment.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 lg:p-6 transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-base lg:text-lg">{appointment.service}</h4>
                              <p className="text-sm text-gray-600">{new Date(appointment.date).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'Terminé' 
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : appointment.status === 'À venir'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>⏱️ {appointment.duration}</span>
                            <span className="font-semibold text-green-600">€{appointment.price}</span>
                          </div>
                        </motion.div>
                      ))}
                    {/* Scroll indicator si plus de 2 rendez-vous */}
                    {currentClient.appointments.length > 2 && (
                      <div className="text-center py-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto opacity-60"></div>
                        <p className="text-xs text-gray-500 mt-2">Scroll pour voir les {currentClient.appointments.length - 2} autres rendez-vous</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Avis client - PLEINE LARGEUR DESKTOP */}
              {currentClient?.review && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg"
                >
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Avis client</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-6 h-6 ${i < Math.floor(currentClient.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-lg font-semibold text-gray-700 ml-2">{currentClient.rating}/5</span>
                    </div>
                    <p className="text-gray-700 text-sm lg:text-base leading-relaxed italic">
                      "{currentClient.review}"
                    </p>
                  </div>
                </motion.div>
              )}
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