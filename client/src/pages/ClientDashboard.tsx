import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock,
  MapPin,
  Edit3,
  X,
  User,
  Star,
  Settings,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Récupérer les données du client depuis localStorage
  const clientData = JSON.parse(localStorage.getItem('clientData') || '{}');

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/client/appointments"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/client/stats"],
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      return apiRequest(`/api/client/appointments/${appointmentId}/cancel`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/client/stats"] });
      toast({
        title: "Rendez-vous annulé",
        description: "Votre rendez-vous a été annulé avec succès",
      });
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le rendez-vous",
        variant: "destructive"
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    setLocation('/');
  };

  const now = new Date();
  const upcomingAppointments = appointments?.filter(apt => isAfter(new Date(apt.dateTime), now)) || [];
  const pastAppointments = appointments?.filter(apt => isBefore(new Date(apt.dateTime), now)) || [];

  const safeStats = stats || {
    totalAppointments: 0,
    upcomingAppointments: 0,
    favoriteServices: [],
    totalSpent: 0
  };

  if (appointmentsLoading || statsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-60 bg-white shadow-lg"></div>
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
      {/* Sidebar - Style Peymen exact mais adapté client */}
      <div className="hidden lg:flex lg:w-60 bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col w-full">
          {/* Logo section - Style Peymen */}
          <div className="px-6 py-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Avyento</span>
            </div>
          </div>
          
          {/* Navigation - Style Peymen avec icônes dans des carrés */}
          <nav className="flex-1 px-4 space-y-1">
            <div className="flex items-center space-x-4 px-4 py-4 bg-blue-50 rounded-2xl text-blue-600 font-medium">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </div>
            
            <button 
              onClick={() => setLocation('/client-profile')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">Profil</span>
            </button>
            
            <button 
              onClick={() => setLocation('/salon-search')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-medium">Réserver</span>
            </button>
            
            <button 
              onClick={() => setLocation('/client-favorites')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <span className="font-medium">Favoris</span>
            </button>
            
            <button 
              onClick={() => setLocation('/client-messages')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="font-medium">Messages</span>
            </button>

            <button 
              onClick={() => setLocation('/client-settings')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium">Paramètres</span>
            </button>

            <button 
              onClick={() => setLocation('/support')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="font-medium">Support</span>
            </button>
          </nav>
          
          {/* Section inférieure avec déconnexion */}
          <div className="px-4 pb-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Style Peymen exact */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-8">
          {/* Header - Style Peymen */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-500 text-sm mb-1">Bonjour {clientData.firstName || 'Client'},</p>
              <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur votre espace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation('/salon-search')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Nouveau rendez-vous
              </Button>
            </div>
          </div>

          {/* Cards - Style Peymen exact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total RDV */}
            <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Rendez-vous</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{safeStats.totalAppointments}</h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 text-sm font-medium">+12%</span>
                      <span className="text-gray-500 text-sm ml-1">ce mois</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RDV à venir */}
            <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">À venir</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{safeStats.upcomingAppointments}</h3>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-blue-500 text-sm font-medium">Cette semaine</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total dépensé */}
            <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total dépensé</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{safeStats.totalSpent}€</h3>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-amber-500 text-sm font-medium">Points fidélité</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid - Style Peymen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rendez-vous à venir */}
            <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Prochains rendez-vous</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/salon-search')}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-xl"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">Aucun rendez-vous à venir</p>
                      <p className="text-sm">Réservez votre prochain rendez-vous</p>
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-semibold text-gray-900">{appointment.service?.name}</span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {format(new Date(appointment.dateTime), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {appointment.salon?.name}
                              </div>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {appointment.staff?.firstName} {appointment.staff?.lastName}
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="text-lg font-bold text-blue-600">{appointment.service?.price}€</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLocation(`/booking-edit/${appointment.id}`)}
                              className="text-gray-600 hover:text-gray-900 rounded-xl"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 rounded-xl"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Historique des rendez-vous */}
            <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Historique</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/appointment-history')}
                    className="text-gray-600 hover:text-gray-900 rounded-xl"
                  >
                    Voir tout
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">Aucun rendez-vous passé</p>
                    </div>
                  ) : (
                    pastAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="font-semibold text-gray-700">{appointment.service?.name}</span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {format(new Date(appointment.dateTime), 'EEEE d MMMM yyyy', { locale: fr })}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {appointment.salon?.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-700">{appointment.service?.price}€</div>
                            {appointment.review ? (
                              <div className="flex items-center mt-1 justify-end">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < appointment.review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLocation(`/review/${appointment.id}`)}
                                className="mt-1 text-xs rounded-xl"
                              >
                                Laisser un avis
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal d'annulation - Style Peymen */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Annuler le rendez-vous</h3>
                <p className="text-sm text-gray-600">Cette action est irréversible</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="text-sm">
                <div className="font-semibold text-gray-900 mb-1">{selectedAppointment.service?.name}</div>
                <div className="text-gray-600 mb-1">
                  {format(new Date(selectedAppointment.dateTime), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                </div>
                <div className="text-gray-600">{selectedAppointment.salon?.name}</div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 rounded-2xl font-medium"
              >
                Annuler
              </Button>
              <Button
                onClick={() => cancelAppointmentMutation.mutate(selectedAppointment.id)}
                disabled={cancelAppointmentMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium"
              >
                {cancelAppointmentMutation.isPending ? 'Annulation...' : 'Confirmer'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}