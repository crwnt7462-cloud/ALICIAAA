import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, CalendarCheck, TrendingUp, Users, Settings, Share2, 
  UserCheck, Plus, Heart, Award
} from "lucide-react";

// Loading component
function LoadingDashboard() {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-violet-50/40 via-purple-50/30 to-indigo-50/40 min-h-full">
      <div className="animate-pulse space-y-8">
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    return <LoadingDashboard />;
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-violet-50/40 via-purple-50/30 to-indigo-50/40 min-h-full">
      {/* Header professionnel */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Tableau de bord</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-violet-500" />
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric' 
              })}
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              ● En ligne
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl px-4 py-2 font-medium shadow-sm"
            onClick={() => setLocation('/ai')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics Pro
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl px-4 py-2 font-medium"
            onClick={() => setLocation('/booking')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Menu d'accès rapide redesigné */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="professional-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
             onClick={() => setLocation("/salon-policies")}>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Politiques</h3>
              <p className="text-sm text-gray-600">Configuration salon</p>
            </div>
          </div>
        </div>

        <div className="professional-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-violet-200"
             onClick={() => {
               console.log('🔥 CLIC MA PAGE depuis Dashboard - Vers SalonPageEditor');
               setLocation("/salon-page-editor");
             }}>
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-full group-hover:bg-violet-200 transition-colors">
              <Share2 className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-violet-700">Ma Page Pro</h3>
              <p className="text-sm text-violet-600">Éditeur de salon</p>
            </div>
          </div>
        </div>

        <div className="professional-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
             onClick={() => setLocation("/staff")}>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Équipe</h3>
              <p className="text-sm text-gray-600">Gestion personnel</p>
            </div>
          </div>
        </div>

        <div className="professional-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
             onClick={() => setLocation("/clients")}>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full group-hover:bg-emerald-200 transition-colors">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Clients</h3>
              <p className="text-sm text-gray-600">Base clientèle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton Planning séparé */}
      <div className="professional-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
           onClick={() => setLocation("/planning")}>
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Planning</h3>
            <p className="text-sm text-gray-600">Gestion des créneaux</p>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="professional-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">RDV Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{(stats as any)?.appointmentsToday || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CalendarCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="professional-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CA Mensuel</p>
              <p className="text-2xl font-bold text-gray-900">{(stats as any)?.monthlyRevenue || 0}€</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="professional-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients Total</p>
              <p className="text-2xl font-bold text-gray-900">{(stats as any)?.totalClients || 0}</p>
            </div>
            <div className="bg-violet-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="professional-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{(stats as any)?.satisfactionRate || 0}%</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}