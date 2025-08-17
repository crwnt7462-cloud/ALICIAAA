import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  Clock, 
  Settings, 
  Search, 
  ChevronRight,
  Home,
  User,
  BarChart3,
  MessageSquare,
  ChevronDown,
  MapPin,
  Activity,
  Globe,
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: popularServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/dashboard/popular-services"],
  });

  const { data: todayAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/dashboard/today-appointments"],
  });

  const { data: weeklyNewClients } = useQuery({
    queryKey: ["/api/dashboard/weekly-new-clients"],
  });

  if (statsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-20 bg-gradient-to-b from-purple-600 to-purple-700"></div>
        <div className="flex-1 p-4 md:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 w-full">
      <div className="flex min-h-screen">
        {/* Sidebar Glass - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex w-16 lg:w-20 flex-col items-center py-4 lg:py-6" style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(128, 128, 128, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}>
          {/* Logo */}
          <div className="w-10 lg:w-12 h-10 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 lg:mb-8 border border-gray-300/50">
            <Sparkles className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
          </div>
          
          {/* Navigation Icons */}
          <div className="space-y-3 lg:space-y-4">
            <div 
              onClick={() => setLocation('/dashboard')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-white/25 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center border border-gray-300/40 cursor-pointer shadow-sm"
            >
              <Home className="w-5 lg:w-6 h-5 lg:h-6 text-gray-700" />
            </div>
            
            <div 
              onClick={() => setLocation('/planning')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Calendar className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
            
            <div 
              onClick={() => setLocation('/clients-modern')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Users className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
            
            <div 
              onClick={() => setLocation('/services-management')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Settings className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
            
            <div 
              onClick={() => setLocation('/messaging-hub')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <MessageSquare className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
            
            <div 
              onClick={() => setLocation('/ai-assistant-fixed')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <MapPin className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
            
            <div 
              onClick={() => setLocation('/client-analytics')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <BarChart3 className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
            
            <div 
              onClick={() => setLocation('/inventory-modern')}
              className="w-10 lg:w-12 h-10 lg:h-12 bg-transparent hover:bg-white/15 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Activity className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
            </div>
          </div>
          
          {/* User Avatar */}
          <div className="mt-auto mb-3 lg:mb-4">
            <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl lg:rounded-2xl flex items-center justify-center">
              <User className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Navigation mobile en bas sur mobile uniquement */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-4 py-2">
            <div className="flex justify-around items-center max-w-md mx-auto">
              <div onClick={() => setLocation('/dashboard')} className="flex flex-col items-center p-2 cursor-pointer">
                <Home className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-purple-600 mt-1">Accueil</span>
              </div>
              <div onClick={() => setLocation('/planning')} className="flex flex-col items-center p-2 cursor-pointer">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-xs text-gray-500 mt-1">Planning</span>
              </div>
              <div onClick={() => setLocation('/clients-modern')} className="flex flex-col items-center p-2 cursor-pointer">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-xs text-gray-500 mt-1">Clients</span>
              </div>
              <div onClick={() => setLocation('/services-management')} className="flex flex-col items-center p-2 cursor-pointer">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-xs text-gray-500 mt-1">Services</span>
              </div>
            </div>
          </div>

          {/* Zone principale */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-y-auto max-h-screen pb-20 md:pb-8 pt-8 md:pt-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 space-y-4 md:space-y-0">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Avyento</p>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-auto"
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
                  className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg md:rounded-xl transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-xs md:text-sm text-gray-700 hidden sm:inline">Ma Page</span>
                </button>
                
                <button 
                  onClick={() => setLocation('/salon-settings-modern')}
                  className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg md:rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="text-xs md:text-sm text-purple-700 hidden sm:inline">Settings</span>
                </button>
                
                <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-xs md:text-sm">AV</span>
                </div>
              </div>
            </div>

            {/* Layout principal en 2 colonnes - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Grande carte Overview à gauche */}
              <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 text-gray-800 relative overflow-hidden h-60 md:h-64 lg:h-80" style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.09)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
              }}>
                {/* Header avec période */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 lg:mb-6 space-y-2 sm:space-y-0">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">Revenus - Cette Semaine</span>
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs text-gray-400">
                    <span>Jour</span>
                    <span className="font-semibold text-gray-900">Semaine</span>
                    <span>Mois</span>
                    <span className="hidden md:inline">Année</span>
                  </div>
                </div>
                
                {/* Montant principal */}
                <div className="mb-3 md:mb-6 lg:mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                    {statsLoading ? "..." : `${(stats as any)?.monthlyRevenue || 0}€`}
                  </h2>
                </div>
                
                {/* Graphique en ligne */}
                <div className="h-16 md:h-24 mb-4 md:mb-6 relative">
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
                
                {/* Jours de la semaine et bouton Voir alignés */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 flex-1 mr-4">
                    <span>Lun</span>
                    <span>Mar</span>
                    <span>Mer</span>
                    <span>Jeu</span>
                    <span>Ven</span>
                    <span>Sam</span>
                    <span>Dim</span>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    Voir
                  </button>
                </div>
              </div>
              
              {/* Colonne droite avec 2 cartes empilées */}
              <div className="flex flex-col gap-3 md:gap-4 h-auto lg:h-80">
                {/* Services Populaires */}
                <div className="rounded-2xl md:rounded-3xl p-3 md:p-4 lg:p-6 text-gray-800 flex-1 relative overflow-hidden min-h-[100px] md:min-h-[120px]" style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-white/30 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center border border-white/40">
                      <Calendar className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base lg:text-lg">Services Populaires</h3>
                      <p className="text-xs md:text-sm opacity-75">
                        {servicesLoading ? "Chargement..." : 
                         (popularServices as any[]).length > 0 ? 
                         `${(popularServices as any)[0]?.serviceName} (${(popularServices as any)[0]?.bookingCount} réservations)` : 
                         "Aucun service encore"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Planning Aujourd'hui */}
                <div className="rounded-2xl md:rounded-3xl p-3 md:p-4 lg:p-6 text-gray-800 flex-1 relative overflow-hidden min-h-[100px] md:min-h-[120px]" style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-white/30 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center border border-white/40">
                        <Clock className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm md:text-base lg:text-lg">Planning Aujourd'hui</h3>
                        <p className="text-xs md:text-sm opacity-75">Objectif: 100% rempli</p>
                        <p className="text-lg md:text-xl lg:text-2xl font-bold mt-1">
                          {appointmentsLoading ? "..." : `${(todayAppointments as any[])?.length || 0} RDV`}
                        </p>
                        <p className="text-xs opacity-75">Août 2025</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          
          {/* Cartes Gestion Salon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-white/30 backdrop-blur-sm rounded-xl md:rounded-2xl mb-3 md:mb-4 border border-white/40">
                <Users className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-900 mb-1">Gestion Clients</h3>
              <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">{statsLoading ? "Chargement..." : `${(stats as any)?.totalClients || 0} clients actifs`}</p>
              <div className="mb-2">
                <div className="flex justify-between text-xs md:text-sm mb-1">
                  <span className="text-gray-600">Fidélité</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600/60 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                <span>Nouveaux cette semaine</span>
                <span className="text-gray-700">{(weeklyNewClients as any)?.count || 0} clients</span>
              </div>
            </div>
            
            <div className="rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              {/* Header avec dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 lg:mb-6 space-y-2 sm:space-y-0">
                <h3 className="text-xs md:text-base lg:text-lg font-semibold text-gray-500 uppercase tracking-wide">Événements Programmés</h3>
                <div className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium flex items-center space-x-1 self-start sm:self-auto">
                  <span>Aujourd'hui</span>
                  <ChevronDown className="w-3 md:w-4 h-3 md:h-4" />
                </div>
              </div>

              {/* Layout avec graphique circulaire et statistiques */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
                {/* Graphique circulaire */}
                <div className="relative self-center sm:self-auto">
                  <svg className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 transform -rotate-90" viewBox="0 0 112 112">
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${95 * 2.76} ${(100 - 95) * 2.76}`}
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
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">95%</span>
                    <span className="text-[7px] sm:text-[8px] lg:text-[10px] text-gray-500 uppercase tracking-tight leading-none">OCCUPATION</span>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="flex-1 grid grid-cols-3 sm:flex sm:flex-col gap-3 sm:space-y-0 sm:space-y-3 lg:space-y-4">
                  <div className="text-center sm:text-left">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {appointmentsLoading ? "..." : `${(todayAppointments as any[])?.length || 0}`}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500">Rendez-vous</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {(weeklyNewClients as any)?.count || 0}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500">Nouveaux clients</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">8h</div>
                    <div className="text-xs lg:text-sm text-gray-500">Heures travaillées</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-white/30 backdrop-blur-sm rounded-xl md:rounded-2xl mb-3 md:mb-4 border border-white/40">
                <Settings className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-900 mb-1">Services Actifs</h3>
              <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">12 prestations disponibles</p>
              <div className="mb-2">
                <div className="flex justify-between text-xs md:text-sm mb-1">
                  <span className="text-gray-600">Popularité</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
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