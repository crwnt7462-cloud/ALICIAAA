import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Globe, Settings, Sparkles, Home, Calendar, Users, MessageSquare, MapPin, BarChart3, Activity, User, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: todayAppointments } = useQuery({
    queryKey: ["/api/dashboard/today-appointments"],
  });

  const { data: popularServices } = useQuery({
    queryKey: ["/api/dashboard/popular-services"],
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
      {/* Navigation supprimée - gérée par BottomNavigation globale */}
      
      {/* Zone principale pleine largeur */}
      <div className="w-full p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen pb-20 md:pb-8 pt-8 md:pt-12">
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

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="rounded-xl p-4 bg-white/40 backdrop-blur-sm border border-white/25 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900">{stats?.monthlyRevenue || 0}€</h3>
            <p className="text-sm text-gray-600">Revenus mensuel</p>
          </div>

          <div className="rounded-xl p-4 bg-white/40 backdrop-blur-sm border border-white/25 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-bold text-2xl text-gray-900">{stats?.totalClients || 0}</h3>
            <p className="text-sm text-gray-600">Clients totaux</p>
          </div>

          <div className="rounded-xl p-4 bg-white/40 backdrop-blur-sm border border-white/25 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="font-bold text-2xl text-gray-900">{todayAppointments?.length || 0}</h3>
            <p className="text-sm text-gray-600">RDV aujourd'hui</p>
          </div>

          <div className="rounded-xl p-4 bg-white/40 backdrop-blur-sm border border-white/25 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="font-bold text-2xl text-gray-900">{weeklyNewClients?.count || 0}</h3>
            <p className="text-sm text-gray-600">Nouveaux cette semaine</p>
          </div>
        </div>

        {/* Services populaires */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/25 shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Services Populaires</h3>
                <p className="text-sm text-gray-500">Vos prestations les plus demandées</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {popularServices && popularServices.length > 0 ? (
              popularServices.map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.price}€ • {service.duration}min</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-purple-600">{service.bookings || 0} réservations</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun service configuré</p>
                <button 
                  onClick={() => setLocation('/services-management')}
                  className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Ajouter des services
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}