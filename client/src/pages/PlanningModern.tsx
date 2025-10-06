import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, TrendingUp, Filter, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type Appointment, type Client, type Service } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useProNotifications, usePlanningRealtime } from "@/hooks/useSupabaseRealtime";

type InsertAppointmentForm = {
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

const appointmentFormSchema = insertAppointmentSchema.extend({
  notes: insertAppointmentSchema.shape.notes.optional(),
});

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function PlanningModern() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Récupération du salon ID pour l'utilisateur connecté
  const { data: userSalon } = useQuery({
    queryKey: ['/api/salon/my-salon'],
    queryFn: async () => {
      const response = await fetch('/api/salon/my-salon', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Salon non trouvé');
      }
      return response.json();
    }
  });

  const salonId = userSalon?.id;

  // 🔔 HOOKS TEMPS RÉEL pour le planning
  // Notifications de nouveaux RDV (toasts + notifications navigateur)
  useProNotifications(salonId);

  // Mise à jour automatique du planning en temps réel
  usePlanningRealtime(salonId, undefined, () => {
    // Callback appelé quand un RDV est modifié/ajouté/supprimé
    console.log('🔄 Rechargement du planning suite à une mise à jour temps réel');
    queryClient.invalidateQueries({ 
      queryKey: ['/api/appointments'] 
    });
  });

  // Queries
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments'],
    retry: 1
  });

  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
    retry: 1
  });

  const { data: services } = useQuery({
    queryKey: ['/api/services'],
    retry: 1
  });

  // Form
  const form = useForm<InsertAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointmentDate: selectedDate,
      startTime: "",
      endTime: "",
      notes: ""
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: InsertAppointmentForm) => apiRequest('/api/appointments', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Rendez-vous créé avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    }
  });

  // Logique de calcul des semaines et dates
  const currentWeek = useMemo(() => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
    const monday = new Date(date.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day.toISOString().split('T')[0];
    });
  }, [selectedDate]);

  // Filtrage des rendez-vous
  const filteredAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];
    
    return (appointments as Appointment[]).filter(apt => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      
      if (viewMode === 'day') {
        return apt.appointmentDate === selectedDate;
      } else {
        return currentWeek.includes(apt.appointmentDate);
      }
    });
  }, [appointments, statusFilter, selectedDate, viewMode, currentWeek]);

  // Navigation de date
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (days * 7));
    } else {
      newDate.setDate(newDate.getDate() + days);
    }
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  // Formatage des dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatWeekRange = () => {
    const start = new Date(currentWeek[0]);
    const end = new Date(currentWeek[6]);
    return `${start.getDate()} ${start.toLocaleDateString('fr-FR', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('fr-FR', { month: 'short' })}`;
  };

  // Obtenir les rendez-vous pour un créneau horaire spécifique
  const getAppointmentsForSlot = (date: string, time: string) => {
    return filteredAppointments.filter(apt => 
      apt.appointmentDate === date && apt.startTime === time
    );
  };

  // Calcul du chiffre d'affaires
  const calculateRevenue = () => {
    const completedAppointments = filteredAppointments.filter(apt => 
      apt.status === 'completed' || apt.status === 'confirmed'
    );
    
    const revenue = completedAppointments.reduce((total, apt) => {
      const service = (services as Service[]).find(s => s.id === apt.serviceId);
      return total + (service?.price || 0);
    }, 0);

    const totalAppointments = completedAppointments.length;
    const averageTicket = totalAppointments > 0 ? revenue / totalAppointments : 0;

    return { revenue, totalAppointments, averageTicket };
  };

  const revenueStats = calculateRevenue();

  // Statistiques par période
  const getPeriodLabel = () => {
    if (viewMode === 'day') return 'Aujourd\'hui';
    return 'Cette semaine';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'scheduled': { label: 'Programmé', variant: 'secondary' as const },
      'confirmed': { label: 'Confirmé', variant: 'default' as const },
      'completed': { label: 'Terminé', variant: 'outline' as const },
      'cancelled': { label: 'Annulé', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const onSubmit = (data: InsertAppointmentForm) => {
    createMutation.mutate(data);
  };

  // Vue jour avec design Landing 
  const renderDayView = () => (
    <div className="space-y-3 lg:grid lg:grid-cols-5 lg:gap-3 lg:space-y-0">
      {timeSlots.map((time, index) => {
        const appointmentsAtTime = getAppointmentsForSlot(selectedDate, time);
        
        return (
          <motion.div
            key={time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-4 lg:p-3">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-purple-600 min-w-[50px] lg:min-w-[45px]">
                    {time}
                  </div>
                  
                  <div className="flex-1">
                    {appointmentsAtTime.length > 0 ? (
                      <div className="space-y-2">
                        {appointmentsAtTime.map((appointment) => {
                          const client = (clients as Client[]).find(c => c.id === appointment.clientId);
                          const service = (services as Service[]).find(s => s.id === appointment.serviceId);
                          
                          return (
                            <motion.div
                              key={appointment.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-gradient-to-r from-gray-50 to-purple-50/30 p-3 rounded-xl cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium text-gray-900 text-sm">
                                      {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                                    </span>
                                    {getStatusBadge(appointment.status)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {service?.name} • {appointment.endTime}
                                  </div>
                                </div>
                                <div className="text-sm font-bold text-purple-600">
                                  {service?.price}€
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm py-2">
                        Créneaux libre
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  // Vue semaine avec design Landing
  const renderWeekView = () => (
    <div className="space-y-4">
      {/* En-têtes des jours */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {currentWeek.map((date, index) => {
              const dayDate = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
              
              return (
                <div
                  key={date}
                  className={`text-center p-3 rounded-xl transition-all ${
                    isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-medium mb-1">
                    {weekDays[index]}
                  </div>
                  <div className="text-lg font-bold">
                    {dayDate.getDate()}
                  </div>
                  <div className={`text-xs mt-1 ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                    {dayAppointments.length} RDV
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé des rendez-vous par jour */}
      <div className="space-y-3">
        {currentWeek.map((date) => {
          const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
          const dayDate = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          
          if (dayAppointments.length === 0) return null;
          
          return (
            <Card key={date} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isToday ? 'bg-purple-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-semibold text-gray-900">
                      {weekDays[dayDate.getDay()]} {dayDate.getDate()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {dayAppointments.length} RDV
                  </span>
                </div>
                
                <div className="space-y-2">
                  {dayAppointments.slice(0, 3).map((appointment) => {
                    const client = (clients as Client[]).find(c => c.id === appointment.clientId);
                    const service = (services as Service[]).find(s => s.id === appointment.serviceId);
                    
                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-purple-50/30 p-2 rounded-lg"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.startTime} - {client?.firstName} {client?.lastName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {service?.name}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-purple-600">
                          {service?.price}€
                        </div>
                      </div>
                    );
                  })}
                  
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayAppointments.length - 3} autres rendez-vous
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 flex items-center justify-center"
      >
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 lg:p-6"
    >
      <div className="max-w-md lg:max-w-none lg:w-full lg:mx-0 mx-auto space-y-6">
        {/* Header Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-4 pt-8 lg:pt-4 relative"
        >
          {/* Icônes flottantes diffuses - style FAQ */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Mobile - 3 emojis plus diffus */}
            <div className="lg:hidden">
              <div className="absolute top-2 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/20 to-purple-300/15 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-12">
                <span className="text-lg opacity-60">📅</span>
              </div>
              <div className="absolute top-6 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/20 to-green-300/15 backdrop-blur-sm flex items-center justify-center animate-bounce transform -rotate-6" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                <span className="text-lg opacity-60">⏰</span>
              </div>
              <div className="absolute top-12 left-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-300/15 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-45" style={{ animationDelay: '2s' }}>
                <span className="text-lg opacity-60">✨</span>
              </div>
            </div>
            
            {/* Desktop - 8 emojis plus diffus et répartis */}
            <div className="hidden lg:block">
              <div className="absolute top-4 left-16 w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/15 to-purple-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-12">
                <span className="text-lg opacity-40">📅</span>
              </div>
              <div className="absolute top-8 right-24 w-12 h-12 rounded-full bg-gradient-to-br from-pink-200/15 to-rose-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform -rotate-6" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                <span className="text-lg opacity-40">⏰</span>
              </div>
              <div className="absolute top-2 left-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/15 to-cyan-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-45" style={{ animationDelay: '2s' }}>
                <span className="text-lg opacity-40">✨</span>
              </div>
              <div className="absolute top-12 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/15 to-orange-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-12" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
                <span className="text-lg opacity-40">📋</span>
              </div>
              <div className="absolute top-6 right-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/15 to-green-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform -rotate-12" style={{ animationDelay: '1.5s' }}>
                <span className="text-lg opacity-40">🎯</span>
              </div>
              <div className="absolute top-10 right-12 w-12 h-12 rounded-full bg-gradient-to-br from-teal-200/15 to-cyan-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-6" style={{ animationDelay: '3s', animationDuration: '5s' }}>
                <span className="text-lg opacity-40">📊</span>
              </div>
              <div className="absolute top-1 left-2/3 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-200/15 to-purple-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform -rotate-3" style={{ animationDelay: '2.5s' }}>
                <span className="text-lg opacity-40">🔔</span>
              </div>
              <div className="absolute top-14 right-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-rose-200/15 to-pink-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-18" style={{ animationDelay: '4s', animationDuration: '6s' }}>
                <span className="text-lg opacity-40">💼</span>
              </div>
            </div>
          </div>
          
          <div className="lg:text-left lg:flex lg:items-center lg:justify-between relative z-10">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Planning
              </h1>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                Gérez vos rendez-vous avec intelligence
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation et sélecteur de vue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Navigation de date */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between lg:justify-start lg:space-x-8 lg:max-w-none">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeDate(-1)}
                  className="h-10 w-10 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm lg:text-base">
                    {viewMode === 'day' ? formatDate(selectedDate) : formatWeekRange()}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500">
                    {filteredAppointments.length} rendez-vous
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeDate(1)}
                  className="h-10 w-10 rounded-xl"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Toggle vues et actions */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-2">
                  <button
                    onClick={() => setViewMode('day')}
                    className={`p-3 text-xs font-medium transition-all ${
                      viewMode === 'day' 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Jour
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`p-3 text-xs font-medium transition-all ${
                      viewMode === 'week' 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Semaine
                  </button>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200">
                  <CardContent className="p-3 text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">Nouveau RDV</div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Nouveau rendez-vous</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Client</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger className="rounded-xl border-gray-200">
                                <SelectValue placeholder="Sélectionner un client" />
                              </SelectTrigger>
                              <SelectContent>
                                {(clients as Client[]).map((client: Client) => (
                                  <SelectItem key={client.id} value={client.id.toString()}>
                                    {client.firstName} {client.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Service</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger className="rounded-xl border-gray-200">
                                <SelectValue placeholder="Sélectionner un service" />
                              </SelectTrigger>
                              <SelectContent>
                                {(services as Service[]).map((service: Service) => (
                                  <SelectItem key={service.id} value={service.id.toString()}>
                                    {service.name} - {service.price}€
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Début</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="rounded-xl border-gray-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Fin</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="rounded-xl border-gray-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-xl font-medium py-3"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Création..." : "Créer le rendez-vous"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Statistiques CA en style Landing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center lg:text-left">
            Chiffre d'Affaires - {getPeriodLabel()}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {/* CA Total */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  CA Total
                </h3>
                <p className="text-lg font-bold text-purple-600">
                  {revenueStats.revenue.toFixed(0)}€
                </p>
                <p className="text-xs text-gray-600">
                  {revenueStats.totalAppointments} RDV
                </p>
              </CardContent>
            </Card>

            {/* Ticket moyen */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Ticket moyen
                </h3>
                <p className="text-lg font-bold text-emerald-600">
                  {revenueStats.averageTicket.toFixed(0)}€
                </p>
                <p className="text-xs text-gray-600">
                  Par client
                </p>
              </CardContent>
            </Card>

            {/* Objectif */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Objectif
                </h3>
                <p className="text-lg font-bold text-amber-600">
                  {viewMode === 'day' ? '250' : '1500'}€
                </p>
                <p className="text-xs text-gray-600">
                  {((revenueStats.revenue / (viewMode === 'day' ? 250 : 1500)) * 100).toFixed(0)}% atteint
                </p>
              </CardContent>
            </Card>

            {/* Filtre */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-0 shadow-none">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="confirmed">Confirmés</SelectItem>
                    <SelectItem value="scheduled">Programmés</SelectItem>
                    <SelectItem value="completed">Terminés</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center lg:text-left">
            {viewMode === 'day' ? 'Planning du jour' : 'Aperçu de la semaine'}
          </h2>
          
          {filteredAppointments.length === 0 ? (
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-8 text-center lg:p-12">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
                  Aucun rendez-vous
                </h3>
                <p className="text-gray-500 text-sm lg:text-base">
                  {viewMode === 'day' 
                    ? 'Aucun rendez-vous prévu pour cette journée'
                    : 'Aucun rendez-vous prévu pour cette semaine'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="lg:grid lg:grid-cols-6 lg:gap-4 lg:space-y-0 space-y-4">
              {/* Colonne principale - Planning */}
              <div className="lg:col-span-5">
                {viewMode === 'day' ? renderDayView() : renderWeekView()}
              </div>
              
              {/* Sidebar desktop - Informations supplémentaires */}
              <div className="hidden lg:block space-y-4">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Résumé du jour</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total RDV</span>
                        <span className="font-semibold">{filteredAppointments.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">CA estimé</span>
                        <span className="font-semibold text-purple-600">{revenueStats.revenue.toFixed(0)}€</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ticket moyen</span>
                        <span className="font-semibold text-emerald-600">{revenueStats.averageTicket.toFixed(0)}€</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Actions rapides</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start rounded-xl"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau RDV
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start rounded-xl"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Vue mensuelle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start rounded-xl"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filtres avancés
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}