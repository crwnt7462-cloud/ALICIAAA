import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, User, Filter, Sparkles, Euro, Target } from "lucide-react";
import { motion } from "framer-motion";
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
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
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
      appointmentDate: selectedDate || "",
      startTime: "",
      endTime: "",
      notes: "",
      clientId: 0,
      serviceId: 0,
    },
  });

  // Calcul de la semaine actuelle
  const currentWeek = useMemo(() => {
    const start = new Date(selectedDate || new Date().toISOString().split('T')[0]);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      week.push(day.toISOString().split('T')[0]);
    }
    return week;
  }, [selectedDate]);

  // Rendez-vous simulés pour le test avec dates variées
  const getDateOffset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const simulatedAppointments = [
    // Aujourd'hui
    {
      id: 1001,
      clientId: 1,
      serviceId: 1,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "10:00",
      status: "confirmed",
      notes: "Coupe + Couleur"
    },
    {
      id: 1002,
      clientId: 2,
      serviceId: 2,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "10:30",
      endTime: "11:30",
      status: "scheduled",
      notes: "Manucure complète"
    },
    {
      id: 1003,
      clientId: 3,
      serviceId: 3,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "14:00",
      endTime: "15:30",
      status: "completed",
      notes: "Soin visage premium"
    },
    {
      id: 1004,
      clientId: 1,
      serviceId: 2,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "16:30",
      endTime: "17:30",
      status: "confirmed",
      notes: "Brushing + styling"
    },
    // Demain
    {
      id: 1005,
      clientId: 2,
      serviceId: 1,
      appointmentDate: getDateOffset(1),
      startTime: "09:30",
      endTime: "10:30",
      status: "scheduled",
      notes: "Coupe moderne"
    },
    {
      id: 1006,
      clientId: 3,
      serviceId: 3,
      appointmentDate: getDateOffset(1),
      startTime: "15:00",
      endTime: "16:30",
      status: "confirmed",
      notes: "Soin anti-âge"
    },
    // Dans 3 jours
    {
      id: 1007,
      clientId: 1,
      serviceId: 2,
      appointmentDate: getDateOffset(3),
      startTime: "11:00",
      endTime: "12:00",
      status: "scheduled",
      notes: "Pédicure"
    },
    // Dans 5 jours
    {
      id: 1008,
      clientId: 2,
      serviceId: 1,
      appointmentDate: getDateOffset(5),
      startTime: "14:30",
      endTime: "15:30",
      status: "confirmed",
      notes: "Retouche couleur"
    },
    {
      id: 1009,
      clientId: 3,
      serviceId: 3,
      appointmentDate: getDateOffset(5),
      startTime: "16:00",
      endTime: "17:00",
      status: "scheduled",
      notes: "Consultation beauté"
    },
    // Dans une semaine
    {
      id: 1010,
      clientId: 1,
      serviceId: 1,
      appointmentDate: getDateOffset(7),
      startTime: "10:00",
      endTime: "11:30",
      status: "scheduled",
      notes: "Coupe + Brushing"
    }
  ];

  // Clients simulés pour les noms
  const simulatedClients = [
    { id: 1, firstName: "Sophie", lastName: "Martin" },
    { id: 2, firstName: "Emma", lastName: "Dubois" },
    { id: 3, firstName: "Léa", lastName: "Bernard" }
  ];

  // Services simulés pour les prix
  const simulatedServices = [
    { id: 1, name: "Coupe + Couleur", price: 85 },
    { id: 2, name: "Manucure", price: 45 },
    { id: 3, name: "Soin Visage", price: 120 }
  ];

  // Fusionner les vraies données avec les données simulées
  const allAppointments = [...(appointments || []), ...simulatedAppointments];
  const allClients = [...(clients || []), ...simulatedClients];
  const allServices = [...(services || []), ...simulatedServices];

  // Filtrage des rendez-vous
  const filteredAppointments = useMemo(() => {
    if (!allAppointments || !Array.isArray(allAppointments) || allAppointments.length === 0) return [];
    
    return (allAppointments as Appointment[]).filter(apt => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      
      if (viewMode === 'day') {
        return apt.appointmentDate === selectedDate;
      } else if (viewMode === 'week') {
        return currentWeek.includes(apt.appointmentDate || '');
      } else { // month
        const aptDate = new Date(apt.appointmentDate || '');
        const selectedDateObj = new Date(selectedDate || '');
        return aptDate.getMonth() === selectedDateObj.getMonth() && 
               aptDate.getFullYear() === selectedDateObj.getFullYear();
      }
    });
  }, [allAppointments, statusFilter, selectedDate, viewMode, currentWeek]);

  // Navigation de date
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate || new Date().toISOString().split('T')[0]);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (days * 7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + days);
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
    const start = new Date(currentWeek[0] || new Date().toISOString().split('T')[0]);
    const end = new Date(currentWeek[6] || new Date().toISOString().split('T')[0]);
    return `${start.getDate()} ${start.toLocaleDateString('fr-FR', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('fr-FR', { month: 'short' })}`;
  };

  const formatMonthRange = () => {
    const date = new Date(selectedDate || new Date().toISOString().split('T')[0]);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
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
      const service = allServices.find(s => s.id === apt.serviceId);
      return total + (Number(service?.price) || 0);
    }, 0);

    const totalAppointments = completedAppointments.length;
    const averageTicket = totalAppointments > 0 ? revenue / totalAppointments : 0;

    return { revenue, totalAppointments, averageTicket };
  };

  const revenueStats = calculateRevenue();

  // Statistiques par période
  const getPeriodLabel = () => {
    if (viewMode === 'day') return 'Aujourd\'hui';
    if (viewMode === 'week') return 'Cette semaine';
    return 'Ce mois';
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
        const appointmentsAtTime = getAppointmentsForSlot(selectedDate || '', time);
        
        return (
          <motion.div
            key={time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-sm lg:text-base font-semibold text-purple-600 min-w-[50px] lg:min-w-[70px]">
                    {time}
                  </div>
                  
                  <div className="flex-1">
                    {appointmentsAtTime.length > 0 ? (
                      <div className="space-y-2">
                        {appointmentsAtTime.map((appointment) => {
                          const client = allClients.find(c => c.id === appointment.clientId);
                          const service = allServices.find(s => s.id === appointment.serviceId);
                          
                          return (
                            <motion.div
                              key={appointment.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-gradient-to-r from-gray-50 to-purple-50/30 p-3 lg:p-4 rounded-xl cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium text-gray-900 text-sm lg:text-base">
                                      {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                                    </span>
                                    {getStatusBadge(appointment.status)}
                                  </div>
                                  <div className="text-xs lg:text-sm text-gray-600">
                                    {service?.name} • {appointment.endTime}
                                  </div>
                                </div>
                                <div className="text-sm lg:text-lg font-bold text-purple-600">
                                  {service?.price}€
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm lg:text-base py-2">
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

  // Vue semaine simplifiée avec calendrier 7 jours
  const renderWeekView = () => (
    <div className="space-y-4">
      {/* Calendrier semaine - 7 jours en grille */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-7 gap-2 lg:gap-4">
            {currentWeek.map((date, index) => {
              const dayDate = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
              
              return (
                <motion.div
                  key={date}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-3 lg:p-4 rounded-xl cursor-pointer transition-all min-h-[120px] lg:min-h-[160px]
                    ${isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' 
                      : 'bg-white/50 hover:bg-purple-50'
                    }
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  {/* En-tête du jour */}
                  <div className="text-center mb-2 lg:mb-3">
                    <div className="text-xs lg:text-sm font-medium opacity-75">
                      {weekDays[index]}
                    </div>
                    <div className="text-lg lg:text-xl font-bold">
                      {dayDate.getDate()}
                    </div>
                  </div>
                  
                  {/* Rendez-vous du jour */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((apt, aptIndex) => {
                      const client = allClients.find(c => c.id === apt.clientId);
                      return (
                        <div
                          key={aptIndex}
                          className={`text-xs p-1.5 rounded text-center truncate ${
                            isToday 
                              ? 'bg-white/20 text-white' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          <div className="font-medium">{apt.startTime}</div>
                          <div className="truncate">{client?.firstName}</div>
                        </div>
                      );
                    })}
                    {dayAppointments.length > 3 && (
                      <div className={`text-xs text-center font-medium ${
                        isToday ? 'text-white/80' : 'text-purple-600'
                      }`}>
                        +{dayAppointments.length - 3} autres
                      </div>
                    )}
                    {dayAppointments.length === 0 && (
                      <div className={`text-xs text-center ${
                        isToday ? 'text-white/60' : 'text-gray-400'
                      }`}>
                        Libre
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé hebdomadaire */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la semaine</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {filteredAppointments.length}
              </div>
              <div className="text-sm text-gray-600">RDV total</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">
                {filteredAppointments.filter(apt => apt.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Terminés</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-600">
                {revenueStats.revenue.toFixed(0)}€
              </div>
              <div className="text-sm text-gray-600">Chiffre d'affaires</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Vue mois avec calendrier style Avyento
  const renderMonthView = () => {
    const selectedDateObj = new Date(selectedDate || new Date().toISOString().split('T')[0]);
    const firstDayOfMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
    const lastDayOfMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0);
    
    // Obtenir le premier lundi de la grille (peut être du mois précédent)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - ((firstDayOfMonth.getDay() + 6) % 7));
    
    // Créer les 42 jours de la grille (6 semaines × 7 jours)
    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      calendarDays.push(day);
    }

    return (
      <div className="space-y-4">
        {/* En-têtes des jours de la semaine */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="text-center font-semibold text-purple-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === selectedDateObj.getMonth();
                const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                const dayString = day.toISOString().split('T')[0];
                const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === dayString);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      aspect-square p-2 rounded-xl cursor-pointer transition-all
                      ${isCurrentMonth ? 'bg-white/50' : 'bg-gray-50/30'} 
                      ${isToday ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' : ''}
                      hover:bg-purple-100
                    `}
                    onClick={() => setSelectedDate(dayString)}
                  >
                    <div className="h-full flex flex-col">
                      <div className={`text-sm font-bold mb-1 ${!isCurrentMonth ? 'opacity-40' : ''}`}>
                        {day.getDate()}
                      </div>
                      {dayAppointments.length > 0 && (
                        <div className="flex-1 space-y-1">
                          {dayAppointments.slice(0, 2).map((apt, aptIndex) => {
                            const client = allClients.find(c => c.id === apt.clientId);
                            return (
                              <div
                                key={aptIndex}
                                className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate"
                              >
                                {apt.startTime} {client?.firstName}
                              </div>
                            );
                          })}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-purple-600 font-medium">
                              +{dayAppointments.length - 2} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Résumé mensuel détaillé */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé du mois</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredAppointments.length}
                </div>
                <div className="text-sm text-gray-600">RDV total</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredAppointments.filter(apt => apt.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Terminés</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">
                  {revenueStats.revenue.toFixed(0)}€
                </div>
                <div className="text-sm text-gray-600">Chiffre d'affaires</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
                Planning
              </h1>
              <p className="text-sm text-gray-600">
                {viewMode === 'day' ? formatDate(selectedDate) : 
                 viewMode === 'week' ? formatWeekRange() : formatMonthRange()}
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
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="rounded-lg"
                >
                  Mois
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
                                  {allClients.map((client: any) => (
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
                                  {allServices.map((service: any) => (
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
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* CA Total */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Euro className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1">
                  CA Total
                </h3>
                <p className="text-lg lg:text-2xl font-bold text-purple-600">
                  {revenueStats.revenue.toFixed(0)}€
                </p>
                <p className="text-xs lg:text-sm text-gray-600">
                  {revenueStats.totalAppointments} RDV
                </p>
              </CardContent>
            </Card>

            {/* Ticket moyen */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1">
                  Ticket moyen
                </h3>
                <p className="text-lg lg:text-2xl font-bold text-emerald-600">
                  {revenueStats.averageTicket.toFixed(0)}€
                </p>
                <p className="text-xs lg:text-sm text-gray-600">
                  Par client
                </p>
              </CardContent>
            </Card>

            {/* Objectif */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1">
                  Objectif
                </h3>
                <p className="text-lg lg:text-2xl font-bold text-amber-600">
                  {viewMode === 'day' ? '250' : viewMode === 'week' ? '1500' : '6000'}€
                </p>
                <p className="text-xs lg:text-sm text-gray-600">
                  {((revenueStats.revenue / (viewMode === 'day' ? 250 : viewMode === 'week' ? 1500 : 6000)) * 100).toFixed(0)}% atteint
                </p>
              </CardContent>
            </Card>

            {/* Filtre */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-4 lg:p-6">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-0 shadow-none">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
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
            {viewMode === 'day' ? 'Planning du jour' : 
             viewMode === 'week' ? 'Aperçu de la semaine' : 'Aperçu du mois'}
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
              {viewMode === 'day' ? renderDayView() : 
           viewMode === 'week' ? renderWeekView() : renderMonthView()}
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