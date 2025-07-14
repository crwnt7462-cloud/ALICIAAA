import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, TrendingUp, Users, Clock, ChevronRight, Plus, Award, Star, Calendar, Settings, UserCheck, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDashboard } from "@/components/ui/loading-spinner";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      // Could refetch all dashboard data here
    }
  }, [lastMessage]);

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (statsLoading || revenueLoading || appointmentsLoading || servicesLoading || staffLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-600 mt-1 flex items-center text-xs">
            <Calendar className="w-3 h-3 mr-1.5 text-purple-500" />
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg text-xs px-3 py-1.5"
            onClick={() => setLocation('/ai')}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Analytics
          </Button>
          <Button 
            size="sm" 
            className="gradient-bg text-white shadow-md hover:scale-105 transition-all duration-200 rounded-lg text-xs px-3 py-1.5"
            onClick={() => setLocation('/booking')}
          >
            <Plus className="w-3 h-3 mr-1" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Quick Access Menu */}
      <div className="grid grid-cols-2 gap-3 mb-4">

        <Button 
          variant="outline"
          className="h-14 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
          onClick={() => setLocation("/booking")}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle réservation
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          className="h-16 flex-col border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs"
          onClick={() => setLocation("/services")}
        >
          <Settings className="w-5 h-5 mb-1" />
          Services
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs"
          onClick={() => setLocation("/staff")}
        >
          <UserCheck className="w-5 h-5 mb-1" />
          Équipe
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs"
          onClick={() => setLocation("/clients")}
        >
          <Users className="w-5 h-5 mb-1" />
          Clients
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl text-xs"
          onClick={() => setLocation("/planning")}
        >
          <Calendar className="w-5 h-5 mb-1" />
          Planning
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Aujourd'hui</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.todayAppointments || 0}
                </p>
                <p className="text-xs text-gray-500">RDV</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">CA Semaine</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.weekRevenue ? `${(stats as any).weekRevenue}€` : '0€'}
                </p>
                <p className="text-xs text-emerald-600 font-medium">+12%</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Clients</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.totalClients || 0}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Taux</p>
                <p className="text-xl font-bold text-gray-900 mt-1">82%</p>
                <p className="text-xs text-amber-600 font-medium">Semaine</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-0 shadow-luxury bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">Évolution du chiffre d'affaires</CardTitle>
          <p className="text-sm text-gray-500">30 derniers jours</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.isArray(revenueChart) ? revenueChart : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                  formatter={(value) => [`${value}€`, 'Chiffre d\'affaires']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Prestations les plus vendues</CardTitle>
            <p className="text-sm text-gray-500">30 derniers jours</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Array.isArray(topServices) ? topServices : []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="serviceName" 
                    stroke="#6b7280" 
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Nombre de ventes' : 'Chiffre d\'affaires']} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Classement équipe</CardTitle>
            <p className="text-sm text-gray-500">Chiffre d'affaires par personne</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(staffPerformance) && staffPerformance.map((staff: any, index: number) => (
                <div key={staff.staffName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{staff.staffName}</p>
                      <p className="text-sm text-gray-500">{staff.appointmentCount} RDV</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{staff.revenue}€</p>
                    {index === 0 && <Award className="w-4 h-4 text-yellow-500 ml-auto" />}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune donnée de performance disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Prochains rendez-vous</CardTitle>
          <p className="text-sm text-gray-500">7 prochains jours</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.isArray(upcomingAppointments) && upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.clientName}</p>
                      <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Aucun rendez-vous prévu</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
