import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, MapPin, Filter, CheckCircle, X, CalendarDays, MoreVertical } from "lucide-react";
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

export default function Planning() {
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

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/appointments/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été modifié.",
      });
    },
  });

  const form = useForm<InsertAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: 0,
      serviceId: 0,
      appointmentDate: selectedDate,
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  // Fonction pour obtenir la semaine actuelle
  const getCurrentWeek = () => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour commencer lundi
    const monday = new Date(date.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day.toISOString().split('T')[0]);
    }
    return week;
  };

  const currentWeek = getCurrentWeek();

  // Filtrer les rendez-vous avec useMemo pour l'optimisation
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

  // Vue jour avec design Avyento
  const renderDayView = () => (
    <div className="space-y-4">
      {timeSlots.map((time) => {
        const appointmentsAtTime = getAppointmentsForSlot(selectedDate, time);
        
        return (
          <motion.div
            key={time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="text-sm font-medium text-violet-600 min-w-[60px]">
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
                          className="glass-card-violet p-3 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-4 w-4 text-violet-600" />
                                <span className="font-medium">
                                  {client ? `${client.firstName} ${client.lastName}` : 'Client inconnu'}
                                </span>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {service?.name} - {appointment.startTime} → {appointment.endTime}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Libre</div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // Vue semaine avec design Avyento
  const renderWeekView = () => (
    <div className="space-y-4">
      {/* En-têtes des jours */}
      <div className="grid grid-cols-8 gap-2">
        <div className="text-sm font-medium text-gray-500 p-2"></div>
        {currentWeek.map((date, index) => {
          const dayDate = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          
          return (
            <div
              key={date}
              className={`text-center p-2 rounded-lg ${
                isToday ? 'glass-card-violet text-violet-700' : 'glass-card'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {weekDays[index]}
              </div>
              <div className="text-sm font-medium">
                {dayDate.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grille horaire */}
      <div className="max-h-[500px] overflow-y-auto">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-sm font-medium text-violet-600 p-2 text-right">
              {time}
            </div>
            {currentWeek.map((date) => {
              const appointmentsAtTime = getAppointmentsForSlot(date, time);
              
              return (
                <div
                  key={`${date}-${time}`}
                  className="min-h-[60px] glass-card p-1 rounded-lg border border-white/20 hover:border-violet-200 transition-colors"
                >
                  {appointmentsAtTime.map((appointment) => {
                    const client = (clients as Client[]).find(c => c.id === appointment.clientId);
                    
                    return (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card-violet p-2 rounded text-xs cursor-pointer"
                      >
                        <div className="font-medium truncate">
                          {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                        </div>
                        <div className="text-violet-600 truncate">
                          {appointment.startTime}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin h-8 w-8 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header avec navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Navigation de date */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeDate(-1)}
                className="glass-button-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center min-w-[200px]">
                <h1 className="text-xl font-bold text-gray-800">
                  {viewMode === 'day' ? formatDate(selectedDate) : formatWeekRange()}
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredAppointments.length} rendez-vous
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeDate(1)}
                className="glass-button-secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Toggle vue jour/semaine */}
            <div className="flex items-center gap-2 bg-white/50 p-1 rounded-xl">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                className={viewMode === 'day' ? 'glass-button-violet' : 'glass-button-secondary'}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Jour
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className={viewMode === 'week' ? 'glass-button-violet' : 'glass-button-secondary'}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Semaine
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 glass-input">
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

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="glass-button-violet">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau RDV
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-modal max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Nouveau rendez-vous</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client</FormLabel>
                            <FormControl>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <SelectTrigger className="glass-input">
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
                            <FormLabel>Service</FormLabel>
                            <FormControl>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <SelectTrigger className="glass-input">
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

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Début</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} className="glass-input" />
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
                              <FormLabel>Fin</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} className="glass-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full glass-button-violet"
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

        {/* Contenu principal */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'day' ? renderDayView() : renderWeekView()}
        </motion.div>

        {filteredAppointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-violet-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Aucun rendez-vous
              </h3>
              <p className="text-gray-500 text-sm">
                {viewMode === 'day' 
                  ? 'Aucun rendez-vous prévu pour cette journée'
                  : 'Aucun rendez-vous prévu pour cette semaine'
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}