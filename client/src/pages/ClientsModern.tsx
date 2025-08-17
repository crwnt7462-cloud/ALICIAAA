import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, Filter, Star, Phone, 
  Mail, Calendar, MessageCircle, User, Crown, Sparkles,
  Heart, Zap
} from 'lucide-react';

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

export default function ClientsModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Récupérer les clients depuis la BDD
  const { data: clients, isLoading } = useQuery({
    queryKey: ['/api/clients'],
    retry: 1
  });

  const filters = [
    { id: 'all', label: 'Tous', count: clients?.length || 0 },
    { id: 'VIP', label: 'VIP', count: clients?.filter(c => c.status === 'VIP').length || 0 },
    { id: 'Fidèle', label: 'Fidèles', count: clients?.filter(c => c.status === 'Fidèle').length || 0 },
    { id: 'Nouvelle', label: 'Nouvelles', count: clients?.filter(c => c.status === 'Nouvelle').length || 0 },
    { id: 'Inactive', label: 'Inactives', count: clients?.filter(c => c.status === 'Inactive').length || 0 }
  ];

  const filteredClients = (clients || []).filter(client => {
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
    ? (clients || []).find(c => c.id === selectedClient)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden flex items-center justify-center">
        {/* Émojis flottants diffus */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [-20, 20] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-20 left-10 text-4xl opacity-20"
          >
            💄
          </motion.div>
          <motion.div
            animate={{ y: [20, -20] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute top-40 right-16 text-3xl opacity-20"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [-15, 15] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            className="absolute bottom-32 left-20 text-3xl opacity-20"
          >
            💅
          </motion.div>
        </div>
        
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
          <p className="text-purple-600 font-medium">Chargement de vos clientes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden"
    >
      {/* Émojis flottants diffus - style Avyento */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [-20, 20],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 text-4xl opacity-10"
        >
          💄
        </motion.div>
        <motion.div
          animate={{ 
            y: [20, -20],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute top-40 right-16 text-3xl opacity-10"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [-15, 15],
            x: [-10, 10]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          className="absolute bottom-32 left-20 text-3xl opacity-10"
        >
          💅
        </motion.div>
        <motion.div
          animate={{ 
            y: [10, -10],
            rotate: [0, 20, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 3 }}
          className="absolute top-60 left-1/2 text-2xl opacity-10"
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ 
            y: [-25, 25],
            x: [15, -15]
          }}
          transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", delay: 4 }}
          className="absolute bottom-40 right-12 text-3xl opacity-10"
        >
          💆‍♀️
        </motion.div>
      </div>
      
      {!selectedClient ? (
        // Vue liste des clients
        <div className="relative z-10">
          
          {/* Header avec retour */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => window.history.back()}
            className="absolute left-4 top-4 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:bg-white/90 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-purple-600" />
          </motion.button>

          <div className="px-6 pt-16 pb-6">
            <div className="max-w-md mx-auto">
              
              {/* Header avec logo Avyento */}
              <motion.div 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8"
              >
                <div className="relative inline-block">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-2">
                    Clientes
                  </h1>
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-400 animate-pulse" />
                </div>
                <p className="text-purple-600/70 font-medium">Gérez votre clientèle avec élégance</p>
                <p className="text-sm text-gray-500 mt-1">{(clients || []).length} clientes au total</p>
              </motion.div>

              {/* Stats rapides - Design Avyento */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-3 gap-3 mb-8"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all"
                >
                  <Crown className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-600">{clients?.filter(c => c.status === 'VIP').length || 0}</div>
                  <div className="text-xs text-purple-600/80 font-medium">VIP</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all"
                >
                  <Heart className="h-5 w-5 text-pink-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-pink-500">{clients?.filter(c => c.status === 'Fidèle').length || 0}</div>
                  <div className="text-xs text-pink-500/80 font-medium">Fidèles</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-amber-500">{clients?.filter(c => c.status === 'Nouvelle').length || 0}</div>
                  <div className="text-xs text-amber-500/80 font-medium">Nouvelles</div>
                </motion.div>
              </motion.div>

              {/* Barre de recherche moderne */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative mb-6"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Rechercher une cliente..."
                  className="w-full h-14 pl-12 pr-4 bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl text-base text-gray-900 placeholder:text-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-300 transition-all shadow-lg"
                />
              </motion.div>

              {/* Filtres modernes */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex gap-2 mb-8 overflow-x-auto pb-2"
              >
                {filters.map((filter, index) => (
                  <motion.button
                    key={filter.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                      selectedFilter === filter.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/60 backdrop-blur-lg text-purple-600 hover:bg-white/80 border border-white/40'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </motion.button>
                ))}
              </motion.div>

              {/* Bouton nouvelle cliente avec style Avyento */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast({ 
                  title: "Nouvelle cliente", 
                  description: "Cette fonctionnalité sera bientôt disponible ✨" 
                })}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl text-base font-semibold transition-all flex items-center justify-center gap-3 mb-8 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Ajouter une cliente
                <Sparkles className="h-4 w-4" />
              </motion.button>

              {/* Liste des clients moderne */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-4"
              >
                {filteredClients.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center py-16"
                  >
                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-lg">
                      <div className="relative mb-6">
                        <User className="h-16 w-16 mx-auto text-purple-300" />
                        <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-pink-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-purple-600 mb-2">Aucune cliente trouvée</h3>
                      <p className="text-purple-400/80 text-sm mb-4">Commencez votre aventure beauté en ajoutant vos premières clientes</p>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        💅
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  filteredClients.map((client, index) => (
                  <motion.button
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedClient(client.id)}
                    className="w-full bg-white/70 backdrop-blur-lg hover:bg-white/90 rounded-2xl p-4 transition-all text-left border border-white/50 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {client.avatar ? (
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-white/50"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center ring-2 ring-white/50">
                            <User className="h-7 w-7 text-purple-500" />
                          </div>
                        )}
                        {client.status === 'VIP' && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1"
                          >
                            <Crown className="h-5 w-5 text-purple-600" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-base">{client.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                        <p className="text-sm text-purple-600/70 mb-2">{client.email}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < Math.floor(client.rating) 
                                    ? 'text-amber-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-purple-600/60 font-medium">{client.totalVisits} visites</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">€{client.totalSpent}</div>
                        <div className="text-xs text-purple-400/70">{new Date(client.lastVisit).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  </motion.button>
                  ))
                )}
              </motion.div>

            </div>
          </div>
          
          {/* Pied de page Avyento */}
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="w-full bg-white/80 backdrop-blur-lg border-t border-white/50 shadow-lg"
          >
            <div className="px-6 py-8">
              <div className="max-w-6xl mx-auto">
                {/* Logo et description */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-2">
                    Avyento
                  </h2>
                  <p className="text-purple-600/70 text-sm">
                    Révolutionnez votre salon avec l'IA
                  </p>
                </div>

                {/* Contenu du footer en 4 colonnes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
                  {/* Colonne Avyento */}
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-3">Avyento</h3>
                    <ul className="space-y-2 text-purple-600/70">
                      <li><a href="#" className="hover:text-purple-600 transition-colors">À propos</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Notre vision</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Équipe</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Carrières</a></li>
                    </ul>
                  </div>

                  {/* Colonne Services */}
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-3">Services</h3>
                    <ul className="space-y-2 text-purple-600/70">
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Gestion salon</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">IA Assistant</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Analytics</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Marketing</a></li>
                    </ul>
                  </div>

                  {/* Colonne Partenaires */}
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-3">Partenaires</h3>
                    <ul className="space-y-2 text-purple-600/70">
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Devenir partenaire</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Fournisseurs</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Intégrations</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">API</a></li>
                    </ul>
                  </div>

                  {/* Colonne Support */}
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-3">Support</h3>
                    <ul className="space-y-2 text-purple-600/70">
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Centre d'aide</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Contact</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Formation</a></li>
                      <li><a href="#" className="hover:text-purple-600 transition-colors">Documentation</a></li>
                    </ul>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="flex justify-center gap-4 mb-6">
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-purple-600 font-semibold">f</span>
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-purple-600 font-semibold">ig</span>
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-purple-600 font-semibold">tw</span>
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-purple-600 font-semibold">li</span>
                  </motion.a>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-purple-600/60 border-t border-purple-100 pt-4">
                  <p>&copy; 2025 Avyento. Tous droits réservés.</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="hover:text-purple-600 transition-colors">Politique de confidentialité</a>
                    <a href="#" className="hover:text-purple-600 transition-colors">Conditions d'utilisation</a>
                    <a href="#" className="hover:text-purple-600 transition-colors">Mentions légales</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.footer>
        </div>
      ) : (
        // Vue détail client
        <div className="min-h-screen bg-white">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{currentClient?.name}</h3>
                <p className="text-sm text-gray-500">{currentClient?.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(`tel:${currentClient?.phone}`)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setLocation('/pro-messaging')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu détail */}
          <div className="p-6">
            <div className="max-w-sm mx-auto space-y-6">
              
              {/* Infos principales - ✅ GLASSMORPHISM APPLIQUÉ */}
              <div className="glass-stat-card rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  {currentClient?.avatar ? (
                    <img
                      src={currentClient.avatar}
                      alt={currentClient.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-violet-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentClient?.name}</h2>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs border ${getStatusColor(currentClient?.status || '')}`}>
                      {currentClient?.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-violet-600">{currentClient?.totalVisits}</div>
                    <div className="text-xs text-gray-700">Visites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">€{currentClient?.totalSpent}</div>
                    <div className="text-xs text-gray-700">Dépensé</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{currentClient?.rating}</div>
                    <div className="text-xs text-gray-700">Note</div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="space-y-3">
                <button
                  onClick={() => setLocation('/booking')}
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium transition-colors"
                >
                  Prendre rendez-vous
                </button>
                
                <button
                  onClick={() => setLocation('/pro-messaging')}
                  className="w-full h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-base font-medium transition-colors"
                >
                  Envoyer un message
                </button>
              </div>

              {/* Préférences */}
              {currentClient?.preferences && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Préférences</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentClient.preferences.map((pref, index) => (
                      <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {currentClient?.notes && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{currentClient.notes}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}