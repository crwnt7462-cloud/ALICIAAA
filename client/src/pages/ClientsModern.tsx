import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Search, Plus, Filter, Star, Phone, 
  Mail, Calendar, MessageCircle, User, Crown
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {!selectedClient ? (
        // Vue liste des clients
        <div className="relative">
          
          {/* Header */}
          <button
            onClick={() => window.history.back()}
            className="absolute left-4 top-4 z-10 p-2"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>

          <div className="px-6 pt-16 pb-6">
            <div className="max-w-sm mx-auto">
              
              {/* Logo */}
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-violet-600">Clients</h1>
              </div>

              {/* Titre et stats */}
              <div className="text-center mb-8">
                <h2 className="text-xl text-gray-500 font-normal">Manage your clientele</h2>
                <p className="text-sm text-gray-400 mt-1">{mockClients.length} clients total</p>
              </div>

              {/* Stats rapides - ✅ GLASSMORPHISM APPLIQUÉ */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-stat-card rounded-2xl p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">{clients?.filter(c => c.status === 'VIP').length || 0}</div>
                  <div className="text-xs text-gray-700">VIP</div>
                </div>
                <div className="glass-stat-card rounded-2xl p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{clients?.filter(c => c.status === 'Fidèle').length || 0}</div>
                  <div className="text-xs text-gray-700">Fidèles</div>
                </div>
                <div className="glass-stat-card rounded-2xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{clients?.filter(c => c.status === 'Nouvelle').length || 0}</div>
                  <div className="text-xs text-gray-700">Nouvelles</div>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Rechercher une cliente..."
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Bouton nouvelle cliente */}
              <button
                onClick={() => toast({ title: "Nouvelle cliente", description: "Fonctionnalité à venir" })}
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium transition-colors flex items-center justify-center gap-2 mb-6"
              >
                <Plus className="h-4 w-4" />
                Nouvelle cliente
              </button>

              {/* Liste des clients */}
              <div className="space-y-3">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="mb-2">Aucun client trouvé</p>
                    <p className="text-sm">Commencez par ajouter vos premiers clients</p>
                  </div>
                ) : (
                  filteredClients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client.id)}
                    className="w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {client.avatar ? (
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-violet-600" />
                          </div>
                        )}
                        {client.status === 'VIP' && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm">{client.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{client.email}</p>
                        <div className="flex items-center gap-2 mt-1">
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
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{client.totalVisits} visites</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">€{client.totalSpent}</div>
                        <div className="text-xs text-gray-400">{new Date(client.lastVisit).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  </button>
                  ))
                )}
              </div>

            </div>
          </div>
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
    </div>
  );
}