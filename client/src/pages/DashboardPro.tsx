import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import { useEffect, useState } from 'react';
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProHeader } from "@/components/ProHeader";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [publicSlug, setPublicSlug] = useState<string | null>(null);
  const [salonName, setSalonName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Variables d'environnement sécurisées
  const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
  
  useEffect(() => {
    fetch('/api/salon/my-salon', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          const salon = data.salon || data;
          if (typeof salon.public_slug === 'string') {
            setPublicSlug(salon.public_slug);
          }
          if (typeof salon.name === 'string') {
            setSalonName(salon.name);
          }
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement du salon:', error);
      });
  }, []);
  
  const [selectedPeriod, setSelectedPeriod] = useState("Week");

  // Types pour les données API
  type RevenueData = {
    value: number;
    data: number[];
  };
  type Stats = {
    revenue: Record<string, RevenueData>;
  };
  type PopularService = {
    name: string;
    count: number;
    revenue: number;
    growth: string;
  };
  type Appointment = {
    time: string;
    client: string;
    service: string;
    duration: string;
  };

  // Hooks useQuery déclarés AVANT usage
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: todayAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/dashboard/today-appointments"],
  });

  const { data: popularServices } = useQuery<PopularService[]>({
    queryKey: ["/api/dashboard/popular-services"],
  });

  // Récupération des données de l'utilisateur professionnel connecté
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/business/me"],
    queryFn: async () => {
      const response = await fetch("/api/business/me", {
        credentials: "include",
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("Non authentifié");
      return response.json();
    },
    retry: 3,
    staleTime: 60 * 60 * 1000, // 1 heure
  });

  // Données de test pour démonstration - 7 jours complets (Lun-Dim)
  const testRevenueData: Record<string, RevenueData> = {
    Day: {
      value: 450,
      data: [0, 50, 120, 200, 300, 380, 450]
    },
    Week: {
      value: 2850,
      data: [320, 450, 380, 520, 680, 420, 280] // Lun, Mar, Mer, Jeu, Ven, Sam, Dim
    },
    Month: {
      value: 12500,
      data: [2800, 3200, 2900, 3600, 3100, 2800, 2500] // 7 semaines complètes
    },
    Year: {
      value: 145000,
      data: [12000, 13500, 12800, 14200, 13800, 14500, 13000] // 7 mois complets
    }
  };

  // Données dynamiques avec fallback de test
  const revenueData: RevenueData = stats?.revenue?.[selectedPeriod] || testRevenueData[selectedPeriod] || {
    value: 0,
    data: [0, 0, 0, 0, 0, 0, 0]
  };

  // Données de test pour les services populaires
  const testPopularServices: PopularService[] = [
    { name: "Coupe + Brushing", count: 45, revenue: 2250, growth: "+12%" },
    { name: "Coloration", count: 28, revenue: 1680, growth: "+8%" },
    { name: "Manucure", count: 35, revenue: 1050, growth: "+15%" },
    { name: "Soin visage", count: 22, revenue: 1320, growth: "+5%" }
  ];

  // Données de test pour le planning
  const testTodaySchedule: Appointment[] = [
    { time: "09:00", client: "Marie Dubois", service: "Coupe + Brushing", duration: "1h30" },
    { time: "10:30", client: "Sophie Martin", service: "Coloration", duration: "2h00" },
    { time: "14:00", client: "Emma Petit", service: "Manucure", duration: "1h00" },
    { time: "15:30", client: "Julie Leroy", service: "Soin visage", duration: "1h15" },
    { time: "17:00", client: "Claire Moreau", service: "Coupe", duration: "1h00" }
  ];

  // Services populaires - données réelles avec fallback de test
  const popularServicesData: PopularService[] = popularServices || testPopularServices;

  // Planning du jour - données réelles avec fallback de test
  const todaySchedule: Appointment[] = todayAppointments || testTodaySchedule;
  
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

  // Configuration des graphiques selon la période
  const getGraphConfig = (period: string) => {
    const configs = {
      Day: {
        dataPoints: 7,
        width: 360,
        startX: 20,
        endX: 380,
        smooth: true
      },
      Week: {
        dataPoints: 7,
        width: 360,
        startX: 20,
        endX: 380,
        smooth: true
      },
      Month: {
        dataPoints: 7,
        width: 360,
        startX: 20,
        endX: 380,
        smooth: true
      },
      Year: {
        dataPoints: 7,
        width: 360,
        startX: 20,
        endX: 380,
        smooth: true
      }
    };
    return configs[period as keyof typeof configs] || configs.Week;
  };

  if (statsLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        {/* Header horizontal avec logo et navigation */}
        <ProHeader currentPage="dashboard" />
        <MobileBottomNav userType="pro" />
        
        {/* Contenu principal avec marge pour header fixe */}
        <div className="pt-20 md:pt-24 pb-20 md:pb-8">
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

  // Fonction pour copier le lien de partage
  const handleCopyShareLink = async () => {
    if (!publicSlug) return;
    
    try {
      const shareUrl = `${BASE_URL}/salon/${publicSlug}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de votre salon a été copié dans le presse-papier.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour gérer la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implémenter la logique de recherche
  };

  // Fonction pour afficher les détails des revenus
  const handleViewRevenueDetails = () => {
    setLocation('/revenue-details');
  };
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header horizontal avec logo et navigation */}
      <ProHeader currentPage="dashboard" />
      <MobileBottomNav userType="pro" />

      {/* Contenu principal avec marge pour header fixe */}
      <div className="pt-20 md:pt-24 pb-20 md:pb-8">
        <div className="p-4 sm:p-5 md:p-6 lg:p-8 max-w-full">
          {/* Affichage du lien partageable comme avant */}
          {/* Encart de partage du lien public (affiché si publicSlug trouvé) */}
          {publicSlug && (
            <div className="w-full flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-green-500 rounded-xl bg-green-50 p-6 shadow-lg">
                  <div className="font-semibold text-green-800 mb-4 text-center text-lg">Lien à partager à vos clients :</div>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex-1 w-full">
                      <div className="flex gap-2 items-center bg-white rounded-lg p-3 border border-green-200">
                        <span className="text-sm text-gray-600 whitespace-nowrap font-mono">{BASE_URL}/salon/</span>
                        <input
                          type="text"
                          value={publicSlug}
                          readOnly
                          className="flex-1 text-sm bg-transparent border-none outline-none min-w-0 font-mono"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleCopyShareLink}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 whitespace-nowrap font-medium"
                    >
                      Copier le lien
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col space-y-4 sm:space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6 md:mb-7 lg:mb-8">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Tableau de Bord</h1>
              {/* Message de bienvenue dynamique */}
              {userData?.user && (
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Bonjour {userData.user.firstName || userData.user.businessName || 'Professionnel'} 👋
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <div className="relative flex-shrink-0 w-full sm:w-auto md:w-64 lg:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                />
              </div>
              
              <Button 
                onClick={() => setLocation('/direct-messaging')}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden lg:inline">Messages</span>
                <span className="lg:hidden">Chat</span>
              </Button>
              
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
                onClick={() => setLocation('/staff')}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">Équipe</span>
                <span className="lg:hidden">Équipe</span>
              </Button>
              
              <Button 
                onClick={() => setLocation('/salon-policies')}
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
                <span className="text-white font-semibold text-sm sm:text-base">
                  {salonName ? salonName.substring(0, 2).toUpperCase() : 'SA'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 w-full">
            {/* Graphique des revenus - Section principale gauche */}
            <div className="lg:col-span-8 w-full">
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
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hidden md:flex items-center space-x-2"
                      onClick={handleViewRevenueDetails}
                    >
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
                  
                  {/* Graphique dynamique basé sur les données */}
                  <div className="relative h-28 sm:h-32 mb-4">
                    <svg className="w-full h-full touch-manipulation" viewBox="0 0 400 120">
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Génération dynamique de la courbe basée sur les données */}
                      {(() => {
                        const data = revenueData.data;
                        const config = getGraphConfig(selectedPeriod);
                        const maxValue = Math.max(...data);
                        const minValue = Math.min(...data.filter(v => v > 0));
                        const range = maxValue - minValue || 1;
                        
                        // Calcul des points de la courbe avec configuration adaptative
                        const points = data.map((value, index) => {
                          const x = config.startX + (index * config.width) / (config.dataPoints - 1);
                          const y = 100 - ((value - minValue) / range) * 60;
                          return { x, y };
                        });
                        
                        // Vérification que nous avons bien 7 points (Lun à Dim)
                        if (points.length !== 7) {
                          console.warn('Nombre de points incorrect:', points.length, 'attendu: 7');
                        }
                        
                        // Génération d'une courbe lisse avec courbes de Bézier
                        const createSmoothPath = (points: {x: number, y: number}[]) => {
                          if (points.length < 2) return '';
                          
                          // Commencer par le premier point (Lun)
                          let path = `M ${points[0].x},${points[0].y}`;
                          
                          // Créer des courbes lisses entre tous les points
                          for (let i = 1; i < points.length; i++) {
                            const prev = points[i - 1];
                            const curr = points[i];
                            
                            // Utiliser des courbes de Bézier pour plus de fluidité
                            const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                            const cp1y = prev.y;
                            const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                            const cp2y = curr.y;
                            
                            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
                          }
                          
                          return path;
                        };
                        
                        const smoothPath = createSmoothPath(points);
                        const areaPath = `${smoothPath} L ${config.endX},100 L ${config.startX},100 Z`;
                        
                        return (
                          <>
                            {/* Zone sous la courbe */}
                            <path 
                              d={areaPath}
                              fill="url(#revenueGradient)"
                            />
                            {/* Courbe principale lisse */}
                            <path 
                              d={smoothPath}
                              stroke="#8B5CF6" 
                              strokeWidth="2" 
                              fill="none"
                              className="drop-shadow-sm"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Points sur la courbe */}
                            {points.map((point, index) => (
                              <circle 
                                key={index}
                                cx={point.x} 
                                cy={point.y} 
                                r="3" 
                                fill="#8B5CF6"
                                className="hover:r-4 transition-all"
                              />
                            ))}
                          </>
                        );
                      })()}
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
                    {popularServicesData.length > 0 ? (
                      popularServicesData.map((service, index) => (
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
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">Aucun service populaire pour le moment.</p>
                        <p className="text-xs mt-1">Les données apparaîtront après vos premiers rendez-vous.</p>
                      </div>
                    )}
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
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      {todaySchedule.length} RDV{todaySchedule.length > 1 ? 's' : ''}
                    </div>
                    <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => setLocation('/planning')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="hidden lg:inline">Voir Planning</span>
                      <span className="lg:hidden">Planning</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((appointment, index) => (
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
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Aucun rendez-vous aujourd'hui.</p>
                      <p className="text-xs mt-1">Votre planning apparaîtra ici quand vous aurez des rendez-vous.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}