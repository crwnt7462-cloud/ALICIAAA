import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight,
  Home,
  User,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Menu,
  ChevronDown,
  MapPin,
  Activity,
  Globe
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [], isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  if (statsLoading || revenueLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-20 bg-gradient-to-b from-purple-600 to-purple-700"></div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-3 gap-6">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const clients = [
    { name: "Sophie Martin", service: "Coupe & Brushing", time: "10h30", avatar: "SM" },
    { name: "Marie Dubois", service: "Couleur", time: "14h00", avatar: "MD" },
    { name: "Julie Leroy", service: "Manucure", time: "15h30", avatar: "JL" },
    { name: "Emma Rousseau", service: "Soin Visage", time: "16h45", avatar: "ER" },
    { name: "Laura Bernard", service: "Balayage", time: "9h15", avatar: "LB" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 w-full">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Glass */}
        <div className="w-20 flex flex-col items-center py-6" style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(255, 255, 255, 0.09)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
        }}>
          {/* Logo */}
          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/40">
            <Bell className="w-6 h-6 text-gray-700" />
          </div>
          
          {/* Navigation Icons */}
          <div className="space-y-4">
            <div 
              onClick={() => setLocation('/dashboard')}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 cursor-pointer"
            >
              <Home className="w-6 h-6 text-white" />
            </div>
            
            <div 
              onClick={() => setLocation('/planning')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Calendar className="w-6 h-6 text-white/70" />
            </div>
            
            <div 
              onClick={() => setLocation('/clients-modern')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Users className="w-6 h-6 text-white/70" />
            </div>
            
            <div 
              onClick={() => setLocation('/services-management')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Settings className="w-6 h-6 text-white/70" />
            </div>
            
            <div 
              onClick={() => setLocation('/messaging-hub')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 text-white/70" />
            </div>
            
            <div 
              onClick={() => setLocation('/ai-assistant-fixed')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <MapPin className="w-6 h-6 text-white/70" />
            </div>
            
            <div 
              onClick={() => setLocation('/client-analytics')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <BarChart3 className="w-6 h-6 text-white/70" />
            </div>
            
            <div 
              onClick={() => setLocation('/inventory-modern')}
              className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Activity className="w-6 h-6 text-white/70" />
            </div>
          </div>
          
          {/* User Avatar */}
          <div className="mt-auto mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex">
          {/* Zone principale */}
          <div className="flex-1 p-8 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-500 text-sm">Avyento</p>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {/* Boutons d'action */}
                <button 
                  onClick={async () => {
                    try {
                      // Récupérer le salon de l'utilisateur connecté
                      const response = await fetch('/api/salon/my-salon');
                      if (response.ok) {
                        const data = await response.json();
                        if (data.salon) {
                          // Rediriger vers la page du salon avec mode éditeur
                          setLocation(`/salon-editor/${data.salon.id}`);
                        } else {
                          // Pas de salon trouvé, créer un nouveau salon
                          setLocation('/salon-creation');
                        }
                      } else {
                        // Erreur API, fallback vers création
                        setLocation('/salon-creation');
                      }
                    } catch (error) {
                      console.error('Erreur récupération salon:', error);
                      setLocation('/salon-creation');
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Ma Page</span>
                </button>
                
                <button 
                  onClick={() => setLocation('/salon-settings-modern')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700">Settings</span>
                </button>
                
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AV</span>
                </div>
              </div>
            </div>

            {/* Layout principal en 2 colonnes - Dimensions exactes */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Grande carte Overview à gauche */}
              <div className="rounded-3xl p-6 text-gray-800 relative overflow-hidden h-80" style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.09)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
              }}>
                {/* Header avec période */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500 font-medium">Revenus - Cette Semaine</span>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span>Day</span>
                    <span className="font-semibold text-gray-900">Week</span>
                    <span>Month</span>
                    <span>Year</span>
                  </div>
                </div>
                
                {/* Montant principal */}
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-1">$234.2</h2>
                </div>
                
                {/* Graphique en ligne */}
                <div className="h-24 mb-6 relative">
                  <svg className="w-full h-full" viewBox="0 0 300 80">
                    <path
                      d="M10,60 Q30,40 50,45 T90,35 Q110,25 130,30 T170,20 Q190,15 210,25 T250,30 Q270,35 290,25"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                    {/* Points sur la courbe */}
                    <circle cx="50" cy="45" r="3" fill="#374151" />
                    <circle cx="90" cy="35" r="3" fill="#374151" />
                    <circle cx="130" cy="30" r="3" fill="#374151" />
                    <circle cx="170" cy="20" r="3" fill="#374151" />
                    <circle cx="210" cy="25" r="3" fill="#374151" />
                    <circle cx="250" cy="30" r="3" fill="#374151" />
                  </svg>
                </div>
                
                {/* Jours de la semaine */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
                
                {/* Bouton View */}
                <div className="absolute bottom-6 right-6">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    View
                  </button>
                </div>
              </div>
              
              {/* Colonne droite avec 2 cartes empilées */}
              <div className="flex flex-col gap-4 h-80">
                {/* Services Populaires */}
                <div className="rounded-3xl p-6 text-gray-800 flex-1 relative overflow-hidden" style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/40">
                      <Calendar className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Services Populaires</h3>
                      <p className="text-sm opacity-75">Coiffure & Esthétique</p>
                    </div>
                  </div>
                </div>
                
                {/* Planning Aujourd'hui */}
                <div className="rounded-3xl p-6 text-gray-800 flex-1 relative overflow-hidden" style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/40">
                        <Clock className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Planning Aujourd'hui</h3>
                        <p className="text-sm opacity-75">Objectif: 100% rempli</p>
                        <p className="text-2xl font-bold mt-1">{stats?.appointmentsToday || 0} RDV</p>
                        <p className="text-xs opacity-75">Août 2025</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          
          {/* Cartes Gestion Salon */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="rounded-2xl p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl mb-4 border border-white/40">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Gestion Clients</h3>
              <p className="text-sm text-gray-500 mb-4">{stats?.totalClients || 0} clients actifs</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Fidélité</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600/60 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Nouveaux cette semaine</span>
                <span className="text-gray-700">3 clients</span>
              </div>
            </div>
            
            <div className="rounded-2xl p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              {/* Header avec dropdown */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">My Scheduled Events</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
                  <span>Today</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Layout avec graphique circulaire et statistiques */}
              <div className="flex items-center space-x-6">
                {/* Graphique circulaire */}
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${95 * 2.51} ${(100 - 95) * 2.51}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">95%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">BUSYNESS</span>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">25</div>
                    <div className="text-sm text-gray-500">Consultations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-500">Laboratory analyzes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-500">Meetings</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl mb-4 border border-white/40">
                <Settings className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Services Actifs</h3>
              <p className="text-sm text-gray-500 mb-4">12 prestations disponibles</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Popularité</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Plus demandé: Coupe</span>
                <span className="text-blue-500">45% des RDV</span>
              </div>
            </div>
          </div>
        </div>


        </div>
      </div>
      

    </div>
  );
}