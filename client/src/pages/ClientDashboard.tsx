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
  Search,
  Settings,
  Bell,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3
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
        <div className="flex-1 p-8">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Espace Client</h1>
                <p className="text-gray-600">Bienvenue {clientData.firstName || 'Client'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un salon..."
                  className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-64"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/salon-search')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Nouveau RDV
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/client-settings')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
              
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-violet-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-violet-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900">{safeStats.totalAppointments}</h3>
                <p className="text-sm text-gray-600">Rendez-vous total</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-bold text-2xl text-gray-900">{safeStats.upcomingAppointments}</h3>
                <p className="text-sm text-gray-600">RDV à venir</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="font-bold text-2xl text-gray-900">{safeStats.favoriteServices?.length || 0}</h3>
                <p className="text-sm text-gray-600">Services favoris</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <h3 className="font-bold text-2xl text-gray-900">{safeStats.totalSpent || 0}€</h3>
                <p className="text-sm text-gray-600">Total dépensé</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rendez-vous à venir */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Rendez-vous à venir</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/salon-search')}
                    className="text-violet-600 border-violet-600 hover:bg-violet-50"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Nouveau RDV
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun rendez-vous à venir</p>
                      <p className="text-sm">Réservez votre prochain rendez-vous</p>
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-gray-900">{appointment.service?.name}</span>
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
                            <div className="mt-2">
                              <span className="text-lg font-semibold text-violet-600">{appointment.service?.price}€</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLocation(`/booking-edit/${appointment.id}`)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
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
          </motion.div>

          {/* Historique des rendez-vous */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Historique</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/appointment-history')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Voir tout
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun rendez-vous passé</p>
                    </div>
                  ) : (
                    pastAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-700">{appointment.service?.name}</span>
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
                            <div className="text-sm font-medium text-gray-700">{appointment.service?.price}€</div>
                            {appointment.review ? (
                              <div className="flex items-center mt-1">
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
                                className="mt-1 text-xs"
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
          </motion.div>
        </div>
      </div>

      {/* Modal d'annulation */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Annuler le rendez-vous</h3>
                <p className="text-sm text-gray-600">Cette action est irréversible</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">{selectedAppointment.service?.name}</div>
                <div className="text-gray-600">
                  {format(new Date(selectedAppointment.dateTime), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                </div>
                <div className="text-gray-600">{selectedAppointment.salon?.name}</div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedAppointment(null)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => cancelAppointmentMutation.mutate(selectedAppointment.id)}
                disabled={cancelAppointmentMutation.isPending}
                className="flex-1"
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