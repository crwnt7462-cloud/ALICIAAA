import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Clock, Settings, Share2, Plus, Bell, Search, Filter, ChevronRight, CalendarCheck, UserCheck, Award, Heart } from "lucide-react";

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
      <div className="p-6 space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Aujourd'hui • {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => setLocation('/notifications')}>
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm" onClick={() => setLocation('/booking')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover:glass-card-hover transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">RDV aujourd'hui</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:glass-card-hover transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">0€</p>
                <p className="text-sm text-gray-600">CA du mois</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:glass-card-hover transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Clients ce mois</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:glass-card-hover transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card hover:glass-card-hover transition-all duration-300 cursor-pointer" onClick={() => setLocation('/booking')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Nouveau RDV</h3>
                <p className="text-sm text-gray-600">Créer un rendez-vous</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:glass-card-hover transition-all duration-300 cursor-pointer" onClick={() => setLocation('/planning')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Planning</h3>
                <p className="text-sm text-gray-600">Voir le planning</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:glass-card-hover transition-all duration-300 cursor-pointer" onClick={() => setLocation('/clients')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-50 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Clients</h3>
                <p className="text-sm text-gray-600">Gérer les clients</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section salon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Mon salon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/salon-editor')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Modifier mon salon
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/salon/demo-user')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Voir ma page publique
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Aucune activité récente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}