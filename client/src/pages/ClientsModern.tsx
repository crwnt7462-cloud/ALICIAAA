import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, Filter, Star, Phone, 
  Mail, Calendar, MessageCircle, User, Crown, Sparkles,
  Heart, Zap, Users
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
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 relative overflow-hidden"
    >
      {/* Émojis flottants diffus - style vraie page d'accueil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [-20, 20],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 text-3xl opacity-20"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [20, -20],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute top-40 right-16 text-2xl opacity-15"
        >
          💄
        </motion.div>
        <motion.div
          animate={{ 
            y: [-15, 15],
            x: [-5, 5]
          }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          className="absolute bottom-32 left-20 text-2xl opacity-20"
        >
          💅
        </motion.div>
        <motion.div
          animate={{ 
            y: [10, -10],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse", delay: 3 }}
          className="absolute top-60 right-1/4 text-2xl opacity-15"
        >
          🌸
        </motion.div>
      </div>
      
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
          <div className="p-4 md:p-6 lg:p-12 xl:p-16">
            <div className="max-w-md mx-auto lg:max-w-7xl xl:max-w-none">
              
              {/* Header style Landing page */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center space-y-6 pt-8 lg:pt-16 mb-8 lg:mb-16"
              >
                <div className="w-16 h-16 lg:w-24 lg:h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-luxury mx-auto">
                  <Users className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                </div>
                
                <div>
                  <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-2 lg:mb-4">
                    Gestion Clients
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-xl leading-relaxed max-w-3xl mx-auto">
                    Base de données clients complète avec historique et préférences
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm lg:text-base text-gray-600">{(clients || []).length} clientes • Gestion intelligente</span>
                </div>
              </motion.div>

              {/* Stats style Landing page */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8 lg:mb-16"
              >
                <div className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                  <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-3 gap-4 lg:gap-8 text-center">
                      <div>
                        <p className="text-xl lg:text-3xl font-bold text-gray-900">{clients?.filter(c => c.status === 'VIP').length || 0}</p>
                        <p className="text-xs lg:text-sm text-gray-600">Clientes VIP</p>
                      </div>
                      <div>
                        <p className="text-xl lg:text-3xl font-bold text-gray-900">{clients?.filter(c => c.status === 'Fidèle').length || 0}</p>
                        <p className="text-xs lg:text-sm text-gray-600">Fidèles</p>
                      </div>
                      <div>
                        <p className="text-xl lg:text-3xl font-bold text-gray-900">{clients?.filter(c => c.status === 'Nouvelle').length || 0}</p>
                        <p className="text-xs lg:text-sm text-gray-600">Nouvelles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contrôles style Landing page - Mobile/Desktop responsive */}
              <div className="space-y-4 lg:space-y-8 mb-8 lg:mb-16">
                
                {/* Barre de recherche style Landing */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Rechercher une cliente..."
                    className="w-full h-12 lg:h-14 pl-12 lg:pl-14 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all shadow-md"
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
                      className={`px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-all ${
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
                    title: "Nouvelle cliente", 
                    description: "Fonctionnalité à venir" 
                  })}
                  className="w-full h-12 lg:h-14 gradient-bg text-white rounded-xl text-base lg:text-lg font-semibold transition-all flex items-center justify-center gap-3 shadow-luxury hover:shadow-xl"
                >
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                  Ajouter une cliente
                </motion.button>
              </div>

              {/* Liste des clients responsive desktop optimisée */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8"
              >
                {filteredClients.length === 0 ? (
                  <div className="col-span-full">
                    <div className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden text-center py-16">
                      <div className="relative mb-6">
                        <User className="h-16 w-16 lg:h-20 lg:w-20 mx-auto text-gray-400" />
                        <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-gray-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Aucune cliente trouvée</h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-4">Commencez par ajouter vos premières clientes</p>
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
                  filteredClients.map((client, index) => (
                  <motion.button
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedClient(client.id)}
                    className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 text-left p-4 lg:p-6"
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
          
          {/* Footer Avyento complet responsive */}
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="w-full border-0 shadow-md bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16"
          >
            <div className="p-4 md:p-6 lg:p-12 xl:p-16">
              <div className="max-w-md mx-auto lg:max-w-7xl xl:max-w-none">
                {/* Logo et description Avyento */}
                <div className="text-center mb-8 lg:mb-12">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-luxury mx-auto mb-4">
                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Avyento
                  </h2>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Révolutionnez votre salon avec l'intelligence artificielle
                  </p>
                </div>

                {/* Contenu footer 4 colonnes responsive */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-12 text-sm lg:text-base">
                  {/* Colonne Avyento */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Avyento</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><a href="#" className="hover:text-gray-900 transition-colors">À propos</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Notre vision</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Équipe</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Carrières</a></li>
                    </ul>
                  </div>

                  {/* Colonne Services */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Gestion salon</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">IA Assistant</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Analytics</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Marketing</a></li>
                    </ul>
                  </div>

                  {/* Colonne Partenaires */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Partenaires</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Devenir partenaire</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Fournisseurs</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Intégrations</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">API</a></li>
                    </ul>
                  </div>

                  {/* Colonne Support */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Centre d'aide</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Formation</a></li>
                      <li><a href="#" className="hover:text-gray-900 transition-colors">Documentation</a></li>
                    </ul>
                  </div>
                </div>

                {/* Réseaux sociaux style Landing */}
                <div className="flex justify-center gap-4 mb-6 lg:mb-8">
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <span className="text-gray-700 font-semibold text-sm lg:text-base">f</span>
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <span className="text-gray-700 font-semibold text-sm lg:text-base">ig</span>
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <span className="text-gray-700 font-semibold text-sm lg:text-base">tw</span>
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    href="#" 
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <span className="text-gray-700 font-semibold text-sm lg:text-base">li</span>
                  </motion.a>
                </div>

                {/* Copyright Avyento */}
                <div className="text-center text-xs lg:text-sm text-gray-600 border-t border-gray-200 pt-4 lg:pt-6">
                  <p>&copy; 2025 Avyento. Tous droits réservés.</p>
                  <div className="flex justify-center gap-4 lg:gap-6 mt-2">
                    <a href="#" className="hover:text-gray-900 transition-colors">Politique de confidentialité</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Conditions d'utilisation</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Mentions légales</a>
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