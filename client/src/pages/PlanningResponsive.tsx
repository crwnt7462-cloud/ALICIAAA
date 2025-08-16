import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, MapPin, Filter, CheckCircle, X, CalendarDays, MoreVertical, TrendingUp, Sparkles, Euro, Target, TrendingDown, Users, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type Appointment, type Client, type Service } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

export default function PlanningResponsive() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAppointmentForm) => 
      apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été programmé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le rendez-vous.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointmentDate: selectedDate,
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  // Calcul de la semaine actuelle
  const currentWeek = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      week.push(day.toISOString().split('T')[0]);
    }
    return week;
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
      scheduled: { label: "Programmé", variant: "secondary" as const },
      confirmed: { label: "Confirmé", variant: "default" as const },
      completed: { label: "Terminé", variant: "outline" as const },
      cancelled: { label: "Annulé", variant: "destructive" as const },
      "no-show": { label: "Absent", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const onSubmit = (data: InsertAppointmentForm) => {
    createMutation.mutate(data);
  };

  // Vue jour avec design Landing 
  const renderDayView = () => (
    <div className="space-y-3">
      {timeSlots.map((time, index) => {
        const appointmentsAtTime = getAppointmentsForSlot(selectedDate, time);
        
        return (
          <motion.div
            key={time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-purple-600 min-w-[50px]">
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

  // Vue semaine responsive avec glassmorphism
  const renderWeekView = () => (
    <div className="space-y-4">
      {/* En-têtes des jours - responsive grid */}
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
                  className={`text-center p-3 rounded-xl transition-all cursor-pointer ${
                    isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-xs font-medium mb-1">
                    {weekDays[index]}
                  </div>
                  <div className="text-lg font-bold">
                    {dayDate.getDate()}
                  </div>
                  <div className="text-xs opacity-75">
                    {dayAppointments.length} RDV
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé des RDV de la semaine */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentWeek.map((date) => {
          const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
          if (dayAppointments.length === 0) return null;
          
          return (
            <Card key={date} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-purple-600 mb-2">
                  {formatDate(date)}
                </div>
                <div className="space-y-2">
                  {dayAppointments.map((apt) => {
                    const client = (clients as Client[]).find(c => c.id === apt.clientId);
                    const service = (services as Service[]).find(s => s.id === apt.serviceId);
                    
                    return (
                      <div key={apt.id} className="flex justify-between items-center text-xs">
                        <div>
                          <div className="font-medium">
                            {apt.startTime} - {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                          </div>
                          <div className="text-gray-500">
                            {service?.name}
                          </div>
                        </div>
                        <div className="text-purple-600 font-bold">
                          {service?.price}€
                        </div>
                      </div>
                    );
                  })}
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Effects - Avyento Style */}
      <div className="absolute inset-0">
        {/* Floating emojis backdrop - diffus et subtil */}
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-bounce" style={{animationDelay: '0s'}}>💄</div>
        <div className="absolute top-40 right-20 text-3xl opacity-10 animate-bounce" style={{animationDelay: '1s'}}>💅</div>
        <div className="absolute top-60 left-1/4 text-4xl opacity-10 animate-bounce" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute bottom-40 right-10 text-3xl opacity-10 animate-bounce" style={{animationDelay: '3s'}}>🌟</div>
        <div className="absolute bottom-20 left-16 text-4xl opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}>💋</div>
        <div className="absolute top-32 right-1/3 text-3xl opacity-10 animate-bounce" style={{animationDelay: '1.5s'}}>🎀</div>
        <div className="absolute bottom-60 left-1/3 text-4xl opacity-10 animate-bounce" style={{animationDelay: '2.5s'}}>👑</div>
      </div>

      {/* Container responsive avec glassmorphism */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-md lg:max-w-none lg:w-full xl:max-w-7xl min-h-screen">
        {/* Header avec navigation - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Titre */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                <Sparkles className="inline w-6 h-6 mr-2 text-purple-600" />
                Planning Pro
              </h1>
              <p className="text-sm text-gray-600">
                {viewMode === 'day' ? formatDate(selectedDate) : formatWeekRange()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Sélecteur de mode */}
              <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-white/40">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="rounded-lg"
                >
                  Jour
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="rounded-lg"
                >
                  Semaine
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeDate(-1)}
                  className="rounded-xl bg-white/80 backdrop-blur-sm border-white/40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeDate(1)}
                  className="rounded-xl bg-white/80 backdrop-blur-sm border-white/40"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Bouton Nouveau RDV */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium px-4"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Nouveau RDV</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-sm border-white/40">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-purple-600" />
                      Nouveau Rendez-vous
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className="rounded-xl border-gray-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
          </div>
        </motion.div>

        {/* Statistiques CA en style Landing - Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
            Chiffre d'Affaires - {getPeriodLabel()}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CA Total */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Euro className="w-5 h-5 text-gray-700" />
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
                  <Target className="w-5 h-5 text-gray-700" />
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

        {/* Contenu principal - Responsive */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center lg:text-left">
            {viewMode === 'day' ? 'Planning du jour' : 'Aperçu de la semaine'}
          </h2>
          
          {filteredAppointments.length === 0 ? (
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucun rendez-vous
                </h3>
                <p className="text-gray-500 text-sm">
                  {viewMode === 'day' 
                    ? 'Aucun rendez-vous prévu pour cette journée'
                    : 'Aucun rendez-vous prévu pour cette semaine'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {viewMode === 'day' ? renderDayView() : renderWeekView()}
            </div>
          )}
        </motion.div>

        {/* Footer Avyento - identique à la page d'accueil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="text-center text-xs text-gray-500 pb-4">
            <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}