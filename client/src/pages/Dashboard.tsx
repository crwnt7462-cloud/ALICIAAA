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

  const { data: clientRetention, isLoading: retentionLoading } = useQuery({
    queryKey: ["/api/dashboard/client-retention"],
  });

  const webSocketData = null;
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (statsLoading || revenueLoading || appointmentsLoading || servicesLoading || staffLoading || retentionLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Avyento avec glassmorphism */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Tableau de bord</h1>
              <p className="text-white/80 mt-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-amber-300" />
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                className="avyento-glass-button bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-md"
                onClick={() => setLocation('/ai')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Assistant IA
              </Button>
              <Button 
                className="avyento-glass-button bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-md"
                onClick={() => setLocation('/salon-settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Access Menu Avyento */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            className="avyento-glass-button h-16 flex-col border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl"
            onClick={() => setLocation("/planning")}
          >
            <Plus className="w-6 h-6 mb-2" />
            Nouvelle réservation
          </Button>
          
          <Button 
            className="avyento-glass-button h-16 flex-col border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl"
            onClick={() => setLocation("/salon-page-editor")}
          >
            <Settings className="w-6 h-6 mb-2" />
            Ma Page Salon
          </Button>
        </div>

        {/* Grid actions Avyento */}
        <div className="grid grid-cols-4 gap-3">
          <Button 
            className="avyento-glass-button h-16 flex-col border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl text-xs font-bold"
            onClick={() => setLocation("/salon-policies")}
          >
            <Settings className="w-5 h-5 mb-1" />
            POLITIQUES
          </Button>

          <Button 
            className="avyento-glass-button h-16 flex-col border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-bold"
            onClick={() => {
              console.log('🔥 CLIC MA PAGE depuis Dashboard - Vers SalonPageEditor');
              setLocation("/salon-page-editor");
            }}
          >
            <Share2 className="w-5 h-5 mb-1" />
            MA PAGE
          </Button>
          
          <Button 
            className="avyento-glass-button h-16 flex-col border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs"
            onClick={() => setLocation("/staff")}
          >
            <UserCheck className="w-5 h-5 mb-1" />
            Équipe
          </Button>
          
          <Button 
            className="avyento-glass-button h-16 flex-col border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs"
            onClick={() => setLocation("/clients")}
          >
            <Users className="w-5 h-5 mb-1" />
            Clients
          </Button>
        </div>

        {/* Stats Grid Avyento */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="avyento-glass-card border-violet-200/50 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Clients Total</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {stats?.totalClients || 0}
                  </p>
                  <p className="text-xs text-emerald-600">Nouveau salon</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="avyento-glass-card border-violet-200/50 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">CA Mensuel</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {stats?.monthlyRevenue || 0}€
                  </p>
                  <p className="text-xs text-emerald-600">Nouveau salon</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}