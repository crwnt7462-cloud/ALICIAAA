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
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { MobileBottomNav } from "@/components/MobileBottomNav";

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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-100">
      {/* Sidebar Desktop - Glassmorphism */}
      <div className="hidden lg:flex lg:w-60 fixed left-0 top-0 h-full z-30" 
           style={{
             backdropFilter: 'blur(20px) saturate(180%)',
             background: 'rgba(255, 255, 255, 0.75)',
             borderRight: '1px solid rgba(255, 255, 255, 0.25)',
             boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
           }}>
        <div className="flex flex-col w-full">
          {/* Logo section - Glassmorphism */}
          <div className="px-6 py-8">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Avyento
              </span>
            </div>
          </div>
          
          {/* Navigation - Glassmorphism avec icônes */}
          <nav className="flex-1 px-4 space-y-1">
            <div className="flex items-center space-x-4 px-4 py-4 rounded-2xl text-indigo-600 font-medium"
                 style={{
                   backdropFilter: 'blur(10px) saturate(180%)',
                   background: 'rgba(99, 102, 241, 0.1)',
                   border: '1px solid rgba(99, 102, 241, 0.2)',
                   boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                 }}>
              <div className="w-6 h-6 bg-indigo-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-indigo-200/50">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </div>
            
            <button 
              onClick={() => setLocation('/client-parametres')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-700 hover:text-indigo-600 rounded-2xl transition-all duration-200"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <div className="w-6 h-6 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">Profil</span>
            </button>
            
            <button 
              onClick={() => setLocation('/search')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-700 hover:text-indigo-600 rounded-2xl transition-all duration-200"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <div className="w-6 h-6 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-medium">Réserver</span>
            </button>
            
            <button 
              onClick={() => setLocation('/client-rdv')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-700 hover:text-indigo-600 rounded-2xl transition-all duration-200"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <div className="w-6 h-6 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Star className="w-4 h-4" />
              </div>
              <span className="font-medium">Mes RDV</span>
            </button>
            
            <button 
              onClick={() => setLocation('/client-parametres')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-700 hover:text-indigo-600 rounded-2xl transition-all duration-200"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <div className="w-6 h-6 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium">Paramètres</span>
            </button>
          </nav>
          
          {/* Section inférieure avec déconnexion */}
          <div className="px-4 pb-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-4 py-4 text-red-600 hover:text-red-700 rounded-2xl transition-all duration-200"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <div className="w-6 h-6 bg-red-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-red-200/50">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Glassmorphism scrollable */}
      <div className="flex-1 lg:ml-60 min-h-screen overflow-y-auto pb-20 lg:pb-8">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header - Glassmorphism */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-sm mb-1">Bonjour {clientData.firstName || 'Client'},</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate" style={{ color: '#8b5cf6' }}>
                Bienvenue sur votre espace
              </h1>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <button
                onClick={() => setLocation('/salon-search')}
                className="glass-button px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-2xl font-medium text-white shadow-lg border-0 transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap flex items-center"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Nouveau rendez-vous</span>
                <span className="xs:hidden">RDV</span>
              </button>
            </div>
          </div>

          {/* Cards - Glassmorphism responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Total RDV */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Rendez-vous</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {safeStats.totalAppointments}
                  </h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 text-sm font-medium">+12%</span>
                    <span className="text-gray-600 text-sm ml-1">ce mois</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                     style={{
                       background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
                       backdropFilter: 'blur(10px)'
                     }}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            {/* RDV à venir */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">À venir</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {safeStats.upcomingAppointments}
                  </h3>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-indigo-500 mr-1" />
                    <span className="text-indigo-500 text-sm font-medium">Cette semaine</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                     style={{
                       background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.8) 100%)',
                       backdropFilter: 'blur(10px)'
                     }}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Total dépensé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total dépensé</p>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                    {safeStats.totalSpent}€
                  </h3>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-amber-500 mr-1" />
                    <span className="text-amber-500 text-sm font-medium">Points fidélité</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                     style={{
                       background: 'linear-gradient(135deg, rgba(139, 69, 219, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)',
                       backdropFilter: 'blur(10px)'
                     }}>
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Grid - Responsive */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Rendez-vous à venir */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Prochains rendez-vous</h2>
                  <button
                    onClick={() => setLocation('/salon-search')}
                    className="glass-button text-white rounded-xl border-0 shadow-lg font-medium px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all duration-300 hover:scale-105 flex items-center whitespace-nowrap"
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Réserver
                  </button>
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
                      <div key={appointment.id} className="rounded-2xl p-4"
                           style={{
                             backdropFilter: 'blur(10px) saturate(180%)',
                             background: 'rgba(255, 255, 255, 0.6)',
                             border: '1px solid rgba(255, 255, 255, 0.4)'
                           }}>
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
              </div>
            </motion.div>

            {/* Historique des rendez-vous */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Historique</h2>
                <button
                  onClick={() => setLocation('/appointment-history')}
                  className="glass-button text-white rounded-xl border-0 shadow-lg font-medium px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  Voir tout
                </button>
              </div>
                
                <div className="space-y-4">
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">Aucun rendez-vous passé</p>
                    </div>
                  ) : (
                    pastAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="rounded-2xl p-4"
                           style={{
                             backdropFilter: 'blur(10px) saturate(180%)',
                             background: 'rgba(255, 255, 255, 0.6)',
                             border: '1px solid rgba(255, 255, 255, 0.4)'
                           }}>
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
              </motion.div>
            </div>
          </div>
        </div>

      {/* Modal d'annulation - Glassmorphism */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 p-4" 
             style={{
               background: 'rgba(0, 0, 0, 0.4)',
               backdropFilter: 'blur(8px)'
             }}>
          <div className="flex items-center justify-center min-h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-3xl p-6 max-w-md w-full shadow-xl"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.25)'
              }}
            >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                   style={{
                     background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                     backdropFilter: 'blur(10px)'
                   }}>
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Annuler le rendez-vous</h3>
                <p className="text-sm text-gray-600">Cette action est irréversible</p>
              </div>
            </div>
            
            <div className="rounded-2xl p-4 mb-6" 
                 style={{
                   backdropFilter: 'blur(10px) saturate(180%)',
                   background: 'rgba(255, 255, 255, 0.6)',
                   border: '1px solid rgba(255, 255, 255, 0.4)'
                 }}>
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
        </div>
      )}


      
      {/* Navigation mobile */}
      <MobileBottomNav userType="client" />
    </div>
  );
}