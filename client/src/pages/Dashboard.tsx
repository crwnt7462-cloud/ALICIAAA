import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Search, 
  Globe, 
  Settings as SettingsIcon, 
  Sparkles, 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Activity, 
  User, 
  Clock, 
  Eye,
  LogOut
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  
  // Données simulées pour le chiffre d'affaires
  const generateRevenueData = (period: string) => {
    const baseData = {
      Day: { value: 285, data: [0, 0, 0, 0, 0, 285, 0] }, // Seulement aujourd'hui
      Week: { value: 2850, data: [420, 380, 510, 290, 340, 450, 460] }, // Lun-Dim
      Month: { value: 12400, data: [2850, 2920, 2780, 3100, 2650, 2890, 3200] }, // 4 semaines
      Year: { value: 148800, data: [12400, 11800, 13200, 12900, 14100, 13600, 12700] } // 12 mois (7 derniers)
    };
    return baseData[period as keyof typeof baseData] || baseData.Week;
  };
  
  const revenueData = generateRevenueData(selectedPeriod);
  
  // Services populaires simulés
  const popularServicesData = [
    { name: "Coupe + Brushing", count: 24, revenue: 1200, growth: "+12%" },
    { name: "Coloration", count: 18, revenue: 1440, growth: "+8%" },
    { name: "Balayage", count: 12, revenue: 1080, growth: "+15%" },
    { name: "Soin Capillaire", count: 15, revenue: 675, growth: "+5%" }
  ];

  // Planning du jour simulé
  const todaySchedule = [
    { time: "09:00", client: "Marie Dubois", service: "Coupe + Brushing", duration: "1h30" },
    { time: "10:30", client: "Sophie Martin", service: "Coloration", duration: "2h30" },
    { time: "14:00", client: "Julie Petit", service: "Balayage", duration: "3h00" },
    { time: "16:30", client: "Claire Moreau", service: "Soin + Coupe", duration: "2h00" },
    { time: "18:30", client: "Emma Bernard", service: "Brushing", duration: "45min" }
  ];
  
  // Labels pour les graphiques selon la période
  const getLabels = (period: string) => {
    const labels = {
      Day: ["00h", "04h", "08h", "12h", "16h", "20h", "24h"],
      Week: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      Month: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
      Year: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul"]
    };
    return labels[period as keyof typeof labels] || labels.Week;
  };

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: todayAppointments } = useQuery({
    queryKey: ["/api/dashboard/today-appointments"],
  });

  const { data: popularServices } = useQuery({
    queryKey: ["/api/dashboard/popular-services"],
  });

  // Supprimé car non utilisé dans l'interface

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        {/* Sidebar Desktop uniquement */}
        <div className="hidden lg:flex lg:w-20 fixed left-0 top-0 h-full bg-slate-50/80 backdrop-blur-16 border-r border-slate-400/20"></div>
        
        <div className="lg:ml-20 bg-gray-50 min-h-screen pb-20 md:pb-16 lg:pb-0">
          <MobileBottomNav userType="pro" />
          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="animate-pulse space-y-4 sm:space-y-5 md:space-y-6">
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded-lg w-3/4 sm:w-1/2 md:w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {Array.from({length: 3}).map((_, i) => (
                  <div key={i} className="h-24 sm:h-28 md:h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Sidebar Desktop uniquement */}
      <div className="hidden lg:flex lg:w-20 fixed left-0 top-0 h-full flex-col items-center py-6 z-30 bg-slate-50/80 backdrop-blur-16 border-r border-slate-400/20">
        {/* Logo */}
        <div className="w-12 h-12 bg-white/80 backdrop-blur-16 rounded-2xl flex items-center justify-center mb-8 border border-slate-200">
          <Sparkles className="w-6 h-6 text-gray-700" />
        </div>
        
        {/* Navigation Icons */}
        <div className="space-y-4">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-16 border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center">
            <Home className="w-6 h-6 text-gray-700" />
          </div>
          
          <div 
            onClick={() => setLocation('/planning')}
            className="w-12 h-12 bg-transparent hover:bg-white/60 hover:backdrop-blur-16 hover:border hover:border-slate-200 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <Calendar className="w-6 h-6 text-gray-600" />
          </div>
          
          <div 
            onClick={() => setLocation('/clients-modern')}
            className="w-12 h-12 bg-transparent hover:bg-white/60 hover:backdrop-blur-16 hover:border hover:border-slate-200 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <Users className="w-6 h-6 text-gray-600" />
          </div>
          
          <div 
            onClick={() => setLocation('/services-management')}
            className="w-12 h-12 bg-transparent hover:bg-white/60 hover:backdrop-blur-16 hover:border hover:border-slate-200 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </div>
          
          <div 
            onClick={() => setLocation('/messaging-hub')}
            className="w-12 h-12 bg-transparent hover:bg-white/60 hover:backdrop-blur-16 hover:border hover:border-slate-200 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <MessageSquare className="w-6 h-6 text-gray-600" />
          </div>
          
          <div 
            onClick={() => setLocation('/client-analytics')}
            className="w-12 h-12 bg-transparent hover:bg-white/60 hover:backdrop-blur-16 hover:border hover:border-slate-200 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
          
          <div 
            onClick={() => setLocation('/inventory')}
            className="w-12 h-12 bg-transparent hover:bg-white/60 hover:backdrop-blur-16 hover:border hover:border-slate-200 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <Activity className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        
        {/* User Avatar */}
        <div className="mt-auto">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-16 border border-slate-200 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Main Content - Style exact de l'image */}
      <div className="lg:ml-20 bg-gray-50 min-h-screen pb-20 md:pb-16 lg:pb-0">
        <MobileBottomNav userType="pro" />
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Header - Responsive */}
          <div className="flex flex-col space-y-4 sm:space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6 md:mb-7 lg:mb-8">
            <div>
              <p className="text-gray-500 text-sm sm:text-base mb-1">Avyento</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Tableau de Bord</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <div className="relative flex-1 sm:flex-none md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-56 md:w-64 lg:w-72"
                />
              </div>
              
              <Button 
                onClick={() => {
                  // Redirection vers la template officielle /salon 
                  // qui affiche maintenant dynamiquement les données du salon connecté
                  setLocation('/salon');
                }}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden lg:inline">Ma Page</span>
                <span className="lg:hidden">Page</span>
              </Button>
              
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/salon/my-salon');
                    if (response.ok) {
                      const data = await response.json();
                      if (data.salon) {
                        setLocation(`/salon-editor/${data.salon.id}`);
                      } else {
                        setLocation('/salon-creation');
                      }
                    } else {
                      setLocation('/salon-creation');
                    }
                  } catch (error) {
                    console.error('Erreur récupération salon:', error);
                    setLocation('/salon-creation');
                  }
                }}
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center space-x-2"
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Modifier</span>
              </Button>
              
              <Button 
                onClick={() => setLocation('/salon-settings-modern')}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Paramètres</span>
                <span className="lg:hidden">Config</span>
              </Button>

              <Button 
                onClick={() => window.location.href = '/api/logout'}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Déconnexion</span>
              </Button>
              
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm sm:text-base">AV</span>
              </div>
            </div>
          </div>

          {/* Content Grid - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Graphique des revenus - Section principale gauche */}
            <div className="lg:col-span-8">
              <Card className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border-0">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col space-y-4 sm:space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4 sm:mb-5 md:mb-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Chiffre d'affaires</h3>
                      <div className="flex items-center space-x-2 mt-2 overflow-x-auto pb-2 sm:pb-0">
                        <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
                          <button 
                            onClick={() => setSelectedPeriod("Day")}
                            className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-lg whitespace-nowrap transition-colors ${selectedPeriod === "Day" ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Jour
                          </button>
                          <button 
                            onClick={() => setSelectedPeriod("Week")}
                            className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-lg whitespace-nowrap transition-colors ${selectedPeriod === "Week" ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Semaine
                          </button>
                          <button 
                            onClick={() => setSelectedPeriod("Month")}
                            className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-lg whitespace-nowrap transition-colors ${selectedPeriod === "Month" ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Mois
                          </button>
                          <button 
                            onClick={() => setSelectedPeriod("Year")}
                            className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-lg whitespace-nowrap transition-colors ${selectedPeriod === "Year" ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Année
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Afficher</span>
                    </Button>
                  </div>
                  
                  {/* Montant principal - Données dynamiques */}
                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{revenueData.value}€</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {selectedPeriod === "Day" && "Aujourd'hui"}
                      {selectedPeriod === "Week" && "Cette semaine"}
                      {selectedPeriod === "Month" && "Ce mois"}
                      {selectedPeriod === "Year" && "Cette année"}
                    </div>
                  </div>
                  
                  {/* Graphique simulé - Courbe comme dans l'image */}
                  <div className="relative h-28 sm:h-32 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 400 120" className="touch-manipulation">
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {/* Courbe principale */}
                      <path 
                        d="M 20 80 Q 80 60 120 50 T 200 45 T 280 40 T 360 35" 
                        stroke="#8B5CF6" 
                        strokeWidth="2" 
                        fill="none"
                        className="drop-shadow-sm"
                      />
                      {/* Zone sous la courbe */}
                      <path 
                        d="M 20 80 Q 80 60 120 50 T 200 45 T 280 40 T 360 35 L 360 100 L 20 100 Z" 
                        fill="url(#revenueGradient)"
                      />
                      {/* Points sur la courbe */}
                      <circle cx="120" cy="50" r="3" fill="#8B5CF6" />
                      <circle cx="200" cy="45" r="3" fill="#8B5CF6" />
                      <circle cx="280" cy="40" r="3" fill="#8B5CF6" />
                      <circle cx="360" cy="35" r="3" fill="#8B5CF6" />
                    </svg>
                  </div>
                  
                  {/* Labels dynamiques selon la période */}
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    {getLabels(selectedPeriod).map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services Populaires - Section droite */}
            <div className="lg:col-span-4">
              <Card className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border-0">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Services Populaires</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {popularServicesData.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{service.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{service.count} réservations</div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-sm sm:text-base font-semibold text-gray-900">{service.revenue}€</div>
                          <div className="text-xs text-green-600">{service.growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section Planning Aujourd'hui - En bas comme l'image */}
          <div className="mt-6 md:mt-7 lg:mt-8">
            <Card className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border-0">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4 sm:mb-5 md:mb-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Planning Aujourd'hui</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Objectif: 100% rempli</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-start md:space-x-4">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{todaySchedule.length} RDV</div>
                    <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => setLocation('/planning')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="hidden lg:inline">Voir Planning</span>
                      <span className="lg:hidden">Planning</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {todaySchedule.map((appointment, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-3 sm:p-3.5 md:p-4 hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-900 text-sm sm:text-base truncate pr-2" title={appointment.service}>{appointment.service}</div>
                        <div className="text-xs sm:text-sm text-purple-600 font-medium flex-shrink-0">{appointment.time}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 min-w-0">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate" title={appointment.client}>{appointment.client}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex-shrink-0 ml-2">{appointment.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}