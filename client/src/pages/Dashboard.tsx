import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Settings, 
  Share2, 
  Plus, 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  CalendarCheck, 
  UserCheck, 
  Award, 
  Heart,
  Home,
  User,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Menu
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [], isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-appointments"],
  });

  const { data: topServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/dashboard/top-services"],
  });

  const { data: staffPerformance = [], isLoading: staffLoading } = useQuery({
    queryKey: ["/api/dashboard/staff-performance"],
  });

  const { data: clientRetention, isLoading: retentionLoading } = useQuery({
    queryKey: ["/api/dashboard/client-retention"],
  });

  if (statsLoading || revenueLoading || appointmentsLoading || servicesLoading || staffLoading || retentionLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-sm"></div>
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barre latérale - cachée sur mobile */}
      <div className="hidden lg:flex lg:w-64 bg-white shadow-sm border-r border-gray-100">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Avyento</span>
          </div>
          
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 rounded-xl text-blue-600">
              <Home className="w-5 h-5" />
              <span className="font-medium">Tableau de bord</span>
            </div>
            
            <button 
              onClick={() => setLocation('/profile')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Profil</span>
            </button>
            
            <button 
              onClick={() => setLocation('/planning')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Planning</span>
            </button>
            
            <button 
              onClick={() => setLocation('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </button>
            
            <button 
              onClick={() => setLocation('/messages')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
            
            <button 
              onClick={() => setLocation('/analytics')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
            
            <button 
              onClick={() => setLocation('/support')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </button>
          </nav>
          
          {/* CTA en bas de la sidebar */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-4 text-white">
              <h4 className="font-semibold text-sm mb-2">Passer Premium</h4>
              <p className="text-xs text-blue-100 mb-3">Débloquez toutes les fonctionnalités</p>
              <Button 
                size="sm" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => setLocation('/premium')}
              >
                Découvrir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - adapté mobile */}
        <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo mobile */}
              <div className="lg:hidden w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Bonjour,</p>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Tableau de bord</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Barre de recherche cachée sur mobile */}
              <div className="hidden lg:block relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => setLocation('/notifications')}>
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Contenu - adapté mobile */}
        <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-md mx-auto lg:max-w-none">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 lg:p-3 bg-blue-50 rounded-xl">
                    <CalendarCheck className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Aujourd'hui
                  </Badge>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">0</h3>
                <p className="text-sm text-gray-600">RDV aujourd'hui</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 lg:p-3 bg-violet-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-violet-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Ce mois
                  </Badge>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">0€</h3>
                <p className="text-sm text-gray-600">CA du mois</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 lg:p-3 bg-green-50 rounded-xl">
                    <UserCheck className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Total
                  </Badge>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">0</h3>
                <p className="text-sm text-gray-600">Clients ce mois</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides - première section sur mobile */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setLocation('/booking')}
                className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-0"
              >
                <Plus className="w-4 h-4 mr-3" />
                Nouveau RDV
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/planning')}
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-3" />
                Planning
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/clients')}
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-4 h-4 mr-3" />
                Clients
              </Button>
            </CardContent>
          </Card>

          {/* Zone graphique - adaptée */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <CardTitle className="text-lg font-semibold text-gray-900">Économisé ce mois</CardTitle>
                <div className="flex space-x-2 overflow-x-auto">
                  <Button variant="ghost" size="sm" className="text-gray-500 whitespace-nowrap">Jour</Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 whitespace-nowrap">Semaine</Button>
                  <Button size="sm" className="bg-blue-600 text-white whitespace-nowrap">Mois</Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 whitespace-nowrap">Année</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">0€</h2>
              </div>
              
              {/* Graphique simulé */}
              <div className="h-32 lg:h-48 flex items-end justify-center">
                <div className="text-gray-400 text-center">
                  <BarChart3 className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2" />
                  <p className="text-xs lg:text-sm">Aucune donnée disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte promo - mobile */}
          <Card className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-2xl shadow-sm border-0 text-white lg:hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Plan pour 2025</h3>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="text-lg font-bold">100%</div>
                </div>
              </div>
              <p className="text-sm text-blue-100">Complété</p>
            </CardContent>
          </Card>

          {/* Mon salon */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Mon salon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Modifier mon salon</p>
                  <p className="text-sm text-gray-500">Personnaliser votre salon</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation('/salon-editor')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Voir ma page publique</p>
                  <p className="text-sm text-gray-500">Page visible par vos clients</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation('/salon/demo-user')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucune activité récente</p>
              </div>
            </CardContent>
          </Card>

          {/* Espacement pour navigation mobile */}
          <div className="h-20 lg:hidden"></div>
        </div>
      </div>
    </div>
  );
}