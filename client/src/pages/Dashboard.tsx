import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, TrendingUp, Users, Clock, ChevronRight, Plus, Award, Star, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [] } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ["/api/dashboard/upcoming-appointments"],
  });

  const { data: topServices = [] } = useQuery({
    queryKey: ["/api/dashboard/top-services"],
  });

  const { data: staffPerformance = [] } = useQuery({
    queryKey: ["/api/dashboard/staff-performance"],
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      // Could refetch all dashboard data here
    }
  }, [lastMessage]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-600 mt-2 flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-purple-500" />
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="gradient-bg text-white shadow-luxury hover:scale-105 transition-all duration-200 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {(stats as any)?.todayAppointments || 0}
                </p>
                <p className="text-sm text-gray-500">Rendez-vous</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">CA Semaine</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {(stats as any)?.weekRevenue ? `${(stats as any).weekRevenue}€` : '0€'}
                </p>
                <p className="text-sm text-green-600">+12% vs sem. prec.</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {(stats as any)?.totalClients || 0}
                </p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux remplissage</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">82%</p>
                <p className="text-sm text-gray-500">Cette semaine</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Évolution du chiffre d'affaires</CardTitle>
          <p className="text-sm text-gray-500">30 derniers jours</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.isArray(revenueChart) ? revenueChart : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
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
