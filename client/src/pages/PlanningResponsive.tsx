import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Plus, User, Filter, Euro, Target, Eye, CreditCard, CheckCircle, FileText, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
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
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
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

  // Calcul des semaines avec navigation
  const { currentWeek, currentMonth, currentYear } = useMemo(() => {
    const baseDate = new Date(selectedDate || new Date().toISOString().split('T')[0]);
    
    if (viewMode === 'day') {
      // Pour le mode jour, calcul simple de la semaine
      const start = new Date(baseDate);
      start.setDate(start.getDate() - start.getDay() + 1);
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(day.getDate() + i);
        week.push(day.toISOString().split('T')[0]);
      }
      return {
        currentWeek: week,
        currentMonth: baseDate.toLocaleDateString('fr-FR', { month: 'long' }),
        currentYear: baseDate.getFullYear()
      };
    } else {
      // Pour le mode semaine, calcul avec navigation par semaines
      const startOfYear = new Date(baseDate.getFullYear(), 0, 1);
      const startOfFirstWeek = new Date(startOfYear);
      startOfFirstWeek.setDate(startOfFirstWeek.getDate() - startOfFirstWeek.getDay() + 1);
      
      const targetWeekStart = new Date(startOfFirstWeek);
      targetWeekStart.setDate(targetWeekStart.getDate() + (currentWeekIndex * 7));
      
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(targetWeekStart);
        day.setDate(day.getDate() + i);
        week.push(day.toISOString().split('T')[0]);
      }
      
      return {
        currentWeek: week,
        currentMonth: targetWeekStart.toLocaleDateString('fr-FR', { month: 'long' }),
        currentYear: targetWeekStart.getFullYear()
      };
    }
  }, [selectedDate, viewMode, currentWeekIndex]);

  // Rendez-vous simulés pour le test avec dates variées
  const getDateOffset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const simulatedAppointments = [
    // Aujourd'hui - Sarah Martin
    {
      id: 1001,
      clientId: 1,
      serviceId: 1,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "10:00",
      status: "confirmed",
      notes: "Coupe + Couleur",
      employeeId: "1",
      paymentStatus: "payé",
      totalAmount: 85,
      depositAmount: 0,
      remainingAmount: 0,
      paymentMethod: "CB"
    },
    {
      id: 1002,
      clientId: 2,
      serviceId: 2,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "10:30",
      endTime: "11:30",
      status: "scheduled",
      notes: "Manucure complète",
      employeeId: "2",
      paymentStatus: "à compléter",
      totalAmount: 45,
      depositAmount: 15,
      remainingAmount: 30,
      paymentMethod: "Espèces"
    },
    // RDV simultanés pour tester le rendu multi-employés
    {
      id: 1014,
      clientId: 1,
      serviceId: 1,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "10:30",
      endTime: "11:30",
      status: "confirmed",
      notes: "Coupe couleur premium",
      employeeId: "1",
      paymentStatus: "à régler",
      totalAmount: 85,
      depositAmount: 0,
      remainingAmount: 85,
      paymentMethod: null
    },
    {
      id: 1015,
      clientId: 3,
      serviceId: 3,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "10:30",
      endTime: "11:30",
      status: "scheduled",
      notes: "Soin visage relaxant",
      employeeId: "3",
      paymentStatus: "à compléter",
      totalAmount: 120,
      depositAmount: 50,
      remainingAmount: 70,
      paymentMethod: "Virement"
    },
    {
      id: 1003,
      clientId: 3,
      serviceId: 3,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "14:00",
      endTime: "15:30",
      status: "completed",
      notes: "Soin visage premium",
      employeeId: "1",
      paymentStatus: "payé",
      totalAmount: 120,
      depositAmount: 0,
      remainingAmount: 0,
      paymentMethod: "CB"
    },
    {
      id: 1004,
      clientId: 1,
      serviceId: 2,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "16:30",
      endTime: "17:30",
      status: "confirmed",
      notes: "Brushing + styling",
      employeeId: "3",
      paymentStatus: "à compléter",
      totalAmount: 45,
      depositAmount: 20,
      remainingAmount: 25,
      paymentMethod: "CB"
    },
    // Autres RDV simultanés pour tester
    {
      id: 1016,
      clientId: 2,
      serviceId: 1,
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "16:30",
      endTime: "17:30",
      status: "scheduled",
      notes: "Coupe tendance",
      employeeId: "1",
      paymentStatus: "à régler",
      totalAmount: 85,
      depositAmount: 0,
      remainingAmount: 85,
      paymentMethod: null
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
      notes: "Coupe moderne",
      employeeId: "2"
    },
    {
      id: 1006,
      clientId: 3,
      serviceId: 3,
      appointmentDate: getDateOffset(1),
      startTime: "15:00",
      endTime: "16:30",
      status: "confirmed",
      notes: "Soin anti-âge",
      employeeId: "1"
    },
    {
      id: 1011,
      clientId: 1,
      serviceId: 2,
      appointmentDate: getDateOffset(1),
      startTime: "11:00",
      endTime: "12:00",
      status: "confirmed",
      notes: "Manucure française",
      employeeId: "3"
    },
    // Dans 2 jours (pour vue semaine)
    {
      id: 1017,
      clientId: 2,
      serviceId: 1,
      appointmentDate: getDateOffset(2),
      startTime: "09:00",
      endTime: "10:00",
      status: "confirmed",
      notes: "Coupe moderne",
      employeeId: "2",
      paymentStatus: "à régler",
      totalAmount: 85,
      depositAmount: 0,
      remainingAmount: 85,
      paymentMethod: null
    },
    {
      id: 1018,
      clientId: 1,
      serviceId: 3,
      appointmentDate: getDateOffset(2),
      startTime: "14:30",
      endTime: "16:00",
      status: "scheduled",
      notes: "Soin visage complet",
      employeeId: "1",
      paymentStatus: "à compléter",
      totalAmount: 120,
      depositAmount: 40,
      remainingAmount: 80,
      paymentMethod: "CB"
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
      notes: "Pédicure",
      employeeId: "2"
    },
    {
      id: 1012,
      clientId: 2,
      serviceId: 1,
      appointmentDate: getDateOffset(3),
      startTime: "14:00",
      endTime: "15:00",
      status: "confirmed",
      notes: "Coupe tendance",
      employeeId: "1"
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
      notes: "Retouche couleur",
      employeeId: "1"
    },
    {
      id: 1009,
      clientId: 3,
      serviceId: 3,
      appointmentDate: getDateOffset(5),
      startTime: "16:00",
      endTime: "17:00",
      status: "scheduled",
      notes: "Consultation beauté",
      employeeId: "2"
    },
    {
      id: 1013,
      clientId: 1,
      serviceId: 2,
      appointmentDate: getDateOffset(5),
      startTime: "10:00",
      endTime: "11:00",
      status: "scheduled",
      notes: "Nail art",
      employeeId: "3"
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
      notes: "Coupe + Brushing",
      employeeId: "1"
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

  // Employés avec couleurs cohérentes et distinctives
  const simulatedEmployees = [
    { 
      id: "all", 
      name: "Vue d'ensemble", 
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800", 
      borderColor: "border-purple-300",
      cardColor: "from-purple-100 to-purple-200"
    },
    { 
      id: "1", 
      name: "Sarah Martin", 
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-300", 
      cardColor: "from-blue-100 to-blue-200"
    },
    { 
      id: "2", 
      name: "Julie Dupont", 
      color: "emerald",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800",
      borderColor: "border-emerald-300",
      cardColor: "from-emerald-100 to-emerald-200"
    },
    { 
      id: "3", 
      name: "Emma Laurent", 
      color: "amber",
      bgColor: "bg-amber-100", 
      textColor: "text-amber-800",
      borderColor: "border-amber-300",
      cardColor: "from-amber-100 to-amber-200"
    }
  ];

  // Fusionner les vraies données avec les données simulées
  const allAppointments = Array.isArray(appointments) ? [...appointments, ...simulatedAppointments] : simulatedAppointments;
  const allClients = Array.isArray(clients) ? [...clients, ...simulatedClients] : simulatedClients;
  const allServices = Array.isArray(services) ? [...services, ...simulatedServices] : simulatedServices;

  // Filtrage des rendez-vous
  const filteredAppointments = useMemo(() => {
    if (!allAppointments || !Array.isArray(allAppointments) || allAppointments.length === 0) return [];
    
    return (allAppointments as any[]).filter(apt => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      if (selectedEmployee !== 'all' && apt.employeeId !== selectedEmployee) return false;
      
      if (viewMode === 'day') {
        return apt.appointmentDate === selectedDate;
      } else { // week
        return currentWeek.includes(apt.appointmentDate || '');
      }
    });
  }, [allAppointments, statusFilter, selectedEmployee, selectedDate, viewMode, currentWeek]);

  // Navigation de date et semaines
  const changeDate = (direction: number) => {
    if (viewMode === 'day') {
      const newDate = new Date(selectedDate || new Date().toISOString().split('T')[0]);
      newDate.setDate(newDate.getDate() + direction);
      setSelectedDate(newDate.toISOString().split('T')[0]);
    } else { // week
      setCurrentWeekIndex(prev => prev + direction);
    }
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
    return 'Cette semaine';
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'à régler':
        return <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">À régler</Badge>
      case 'à compléter':
        return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">À compléter</Badge>
      case 'payé':
        return <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">Payé</Badge>
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-300 bg-gray-50">À régler</Badge>
    }
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setPaymentDetailsOpen(true);
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
                          const employee = simulatedEmployees.find(e => e.id === appointment.employeeId);
                          
                          return (
                            <motion.div
                              key={appointment.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleAppointmentClick(appointment)}
                              className={`bg-gradient-to-r ${employee?.cardColor || 'from-gray-50 to-purple-50/30'} p-3 lg:p-4 rounded-xl cursor-pointer border-l-4 ${employee?.borderColor || 'border-purple-300'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`text-xs px-2 py-1 rounded-full ${employee?.bgColor} ${employee?.textColor} font-medium`}>
                                      {employee?.name || 'Employé'}
                                    </span>
                                    <span className="font-medium text-gray-900 text-sm lg:text-base">
                                      {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                                    </span>
                                    {getPaymentStatusBadge(appointment.paymentStatus || 'à régler')}
                                  </div>
                                  <div className="text-xs lg:text-sm text-gray-600">
                                    {service?.name} • {appointment.endTime}
                                  </div>
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
          <div className="grid grid-cols-3 md:grid-cols-7 gap-1 sm:gap-2 lg:gap-4">
            {currentWeek.map((date, index) => {
              const dayDate = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
              
              return (
                <motion.div
                  key={date}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-1 sm:p-2 md:p-3 lg:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all 
                    min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[160px]
                    ${isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-white/60 hover:bg-purple-50 border border-white/40'
                    }
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  {/* En-tête du jour */}
                  <div className="text-center mb-1 md:mb-2 lg:mb-3">
                    <div className={`text-xs md:text-xs lg:text-sm font-medium opacity-75 ${isToday ? 'text-white' : 'text-gray-600'}`}>
                      {weekDays[index].slice(0, 3)}
                    </div>
                    <div className={`text-base md:text-lg lg:text-xl font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                      {dayDate.getDate()}
                    </div>
                  </div>
                  
                  {/* Rendez-vous du jour avec détails visibles */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 4).map((apt, aptIndex) => {
                      const client = allClients.find(c => c.id === apt.clientId);
                      const service = allServices.find(s => s.id === apt.serviceId);
                      const employee = simulatedEmployees.find(e => e.id === apt.employeeId);
                      
                      return (
                        <div
                          key={aptIndex}
                          className={`text-xs p-1 md:p-2 rounded-md md:rounded-lg border ${
                            isToday 
                              ? 'bg-white/20 text-white border-white/30' 
                              : `${employee?.bgColor || 'bg-purple-100'} ${employee?.textColor || 'text-purple-800'} ${employee?.borderColor || 'border-purple-200'}`
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-xs md:text-xs">{apt.startTime}</div>
                            <div className="text-xs opacity-75 hidden md:block">{service?.price}€</div>
                          </div>
                          <div className="truncate font-medium text-xs">{client?.firstName}</div>
                          <div className="text-xs opacity-75 truncate hidden md:block">{service?.name}</div>
                          {selectedEmployee === 'all' && (
                            <div className="text-xs opacity-75 truncate mt-1 hidden lg:block">{employee?.name.split(' ')[0]}</div>
                          )}
                        </div>
                      );
                    })}
                    {dayAppointments.length > 4 && (
                      <div className={`text-xs text-center font-medium p-1 ${
                        isToday ? 'text-white/80' : 'text-purple-600'
                      }`}>
                        +{dayAppointments.length - 4} autres
                      </div>
                    )}
                    {dayAppointments.length === 0 && (
                      <div className={`text-xs text-center p-2 ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

  // Vue mois moderne - Seulement les jours du mois en cours
  const renderMonthView = () => {
    const selectedDateObj = new Date(selectedDate || new Date().toISOString().split('T')[0]);
    const firstDayOfMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
    const lastDayOfMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0);
    
    // Créer seulement les jours du mois en cours
    const calendarDays = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDay = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), day);
      calendarDays.push(currentDay);
    }

    return (
      <div className="space-y-4">
        {/* Grille moderne des jours du mois */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 lg:p-6">
            {/* Grille responsive des jours */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
              {calendarDays.map((day, index) => {
                const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                const dayString = day.toISOString().split('T')[0];
                const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === dayString);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      aspect-square p-2 sm:p-3 rounded-xl cursor-pointer transition-all
                      ${isToday 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg' 
                        : 'bg-white/60 border border-white/40 hover:bg-purple-50'
                      }
                    `}
                    onClick={() => setSelectedDate(dayString)}
                  >
                    <div className="h-full flex flex-col justify-between">
                      {/* Numéro du jour */}
                      <div className={`text-base lg:text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                        {day.getDate()}
                      </div>
                      
                      {/* Aperçu détaillé des RDV */}
                      {dayAppointments.length > 0 ? (
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 2).map((apt, aptIndex) => {
                            const client = allClients.find(c => c.id === apt.clientId);
                            const service = allServices.find(s => s.id === apt.serviceId);
                            const employee = simulatedEmployees.find(e => e.id === apt.employeeId);
                            
                            return (
                              <div
                                key={aptIndex}
                                className={`text-xs p-1.5 rounded border ${
                                  isToday 
                                    ? 'bg-white/20 text-white border-white/30' 
                                    : `${employee?.bgColor || 'bg-purple-100'} ${employee?.textColor || 'text-purple-800'} ${employee?.borderColor || 'border-purple-200'}`
                                }`}
                              >
                                <div className="font-bold">{apt.startTime}</div>
                                <div className="truncate">{client?.firstName}</div>
                                <div className="text-xs opacity-75 truncate">{service?.name}</div>
                                {selectedEmployee === 'all' && (
                                  <div className="text-xs opacity-75 truncate">{employee?.name.split(' ')[0]}</div>
                                )}
                              </div>
                            );
                          })}
                          {dayAppointments.length > 2 && (
                            <div className={`text-xs text-center font-medium ${isToday ? 'text-white/80' : 'text-purple-600'}`}>
                              +{dayAppointments.length - 2}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`text-xs text-center ${isToday ? 'text-white/60' : 'text-gray-400'}`}>
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

        {/* Résumé mensuel détaillé */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé du mois</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-white/40 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {filteredAppointments.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">RDV total</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-white/40 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                  {filteredAppointments.filter(apt => apt.status === 'completed').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Terminés</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-white/40 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  {revenueStats.revenue.toFixed(0)}€
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Chiffre d'affaires</div>
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
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >


      {/* Container responsive avec glassmorphism */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-md lg:max-w-none lg:w-full xl:max-w-7xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-4 lg:p-8">
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
                {viewMode === 'day' ? formatDate(selectedDate) : formatWeekRange()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sélecteur d'employé */}
              <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-white/40">
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="border-0 shadow-none bg-transparent min-w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {simulatedEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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

              {/* Indicateur mois/année pour navigation semaines */}
              {viewMode === 'week' && (
                <div className="text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/40">
                  {currentMonth} {currentYear}
                </div>
              )}

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
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
          className="space-y-4 lg:space-y-6 w-full max-w-md mx-auto md:max-w-4xl lg:max-w-none xl:max-w-7xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {viewMode === 'day' ? 'Planning du jour' : 'Aperçu de la semaine'}
            </h2>
            {selectedEmployee !== 'all' && (
              <div className="text-sm text-purple-600 font-medium">
                {simulatedEmployees.find(e => e.id === selectedEmployee)?.name}
              </div>
            )}
          </div>
          
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
          className="mt-12 pt-8 border-t border-gray-200/30"
        >
          <div className="text-center text-xs text-gray-500 pb-4">
            <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
          </div>
        </motion.div>

          </div>
        </div>
        
        {/* Bottom Navigation Mobile */}
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/30 z-50 shadow-2xl"
        >
          <div className="flex justify-around py-3 px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('day')}
              className={`flex flex-col items-center gap-1 ${viewMode === 'day' ? 'text-purple-600' : 'text-gray-500'}`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Jour</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('week')}
              className={`flex flex-col items-center gap-1 ${viewMode === 'week' ? 'text-purple-600' : 'text-gray-500'}`}
            >
              <CalendarDays className="w-5 h-5" />
              <span className="text-xs">Semaine</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDialogOpen(true)}
              className="flex flex-col items-center gap-1 text-purple-600"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">Nouveau</span>
            </Button>
          </div>
        </motion.nav>

        {/* Modal détails de RDV */}
        <Dialog open={paymentDetailsOpen} onOpenChange={setPaymentDetailsOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Détails du rendez-vous
              </DialogTitle>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-6">
                {(() => {
              const client = allClients.find(c => c.id === selectedAppointment.clientId);
              const service = allServices.find(s => s.id === selectedAppointment.serviceId);
              const employee = simulatedEmployees.find(e => e.id === selectedAppointment.employeeId);
              
              // Simulation dernière prestation effectuée
              const lastCompletedService = {
                name: "Coloration + coupe",
                date: "2025-01-10",
                employee: "Sarah",
                notes: "Client satisfaite du résultat, prochaine couleur dans 6 semaines"
              };
              
              // Simulation notes de suivi client  
              const clientNotes = [
                { date: "2025-01-10", note: "Allergique aux produits à base d'ammoniaque", type: "Allergie" },
                { date: "2025-01-05", note: "Préfère les RDV le matin", type: "Préférence" },
                { date: "2024-12-20", note: "Fidèle depuis 2 ans, très ponctuelle", type: "Général" }
              ];
                  
              return (
                <>
                  {/* Informations cliente */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      Informations cliente
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Nom:</span>
                        <div className="font-medium">{client?.firstName} {client?.lastName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Téléphone:</span>
                        <div className="font-medium">{client?.phone || "06 12 34 56 78"}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <div className="font-medium text-purple-600">{client?.email || "cliente@email.com"}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Première visite:</span>
                        <div className="font-medium">Mars 2023</div>
                      </div>
                  </div>
                  </div>

                  {/* Prestation réservée */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      Prestation réservée
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-lg">{service?.name}</span>
                        <span className="text-lg font-bold text-amber-600">{service?.price}€</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Durée: {service?.duration || "60"} min</span>
                        <span>Avec: {employee?.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(selectedAppointment.appointmentDate || '').toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Horaire:</strong> {selectedAppointment.startTime} - {selectedAppointment.endTime}
                      </div>
                      {selectedAppointment.notes && (
                        <div className="text-sm text-gray-600 bg-white p-2 rounded border-l-4 border-amber-400">
                          <strong>Notes RDV:</strong> {selectedAppointment.notes}
                        </div>
                      )}
                  </div>
                  </div>

                  {/* Dernière prestation effectuée */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Dernière prestation effectuée
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{lastCompletedService.name}</span>
                        <span className="text-sm text-gray-600">{new Date(lastCompletedService.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Réalisée par: <span className="font-medium">{lastCompletedService.employee}</span>
                      </div>
                      <div className="text-sm text-gray-600 bg-white p-2 rounded border-l-4 border-green-400">
                        <strong>Notes:</strong> {lastCompletedService.notes}
                      </div>
                  </div>
                  </div>

                  {/* Notes de suivi client */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Notes de suivi client
                    </h3>
                    <div className="space-y-3 max-h-32 overflow-y-auto">
                      {clientNotes.map((note, index) => (
                        <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-400">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {note.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(note.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{note.note}</p>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une note
                  </Button>
                  </div>

                  {/* Statut de paiement */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                      Informations de paiement
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Statut du paiement:</span>
                      {getPaymentStatusBadge(selectedAppointment.paymentStatus || 'à régler')}
                    </div>

                    {/* Détails financiers */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex justify-between">
                        <span>Montant total:</span>
                        <span className="font-medium">{selectedAppointment.totalAmount}€</span>
                      </div>
                      
                      {selectedAppointment.depositAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Acompte versé:</span>
                          <span className="font-medium">{selectedAppointment.depositAmount}€</span>
                        </div>
                      )}
                      
                      {selectedAppointment.remainingAmount > 0 && (
                        <div className="flex justify-between text-amber-600">
                          <span>Reste à payer:</span>
                          <span className="font-medium">{selectedAppointment.remainingAmount}€</span>
                        </div>
                      )}
                      
                      {selectedAppointment.paymentMethod && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Mode de paiement:</span>
                          <span>{selectedAppointment.paymentMethod}</span>
                        </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  {selectedAppointment.paymentStatus !== 'payé' && (
                    <div className="flex gap-2 pt-4 border-t">
                      {selectedAppointment.paymentStatus === 'à régler' && (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            toast({
                              title: "Paiement enregistré",
                              description: "Le paiement a été marqué comme payé."
                            });
                            setPaymentDetailsOpen(false);
                          }}
                        >
                          Marquer comme payé
                        </Button>
                      )}
                      
                      {selectedAppointment.paymentStatus === 'à compléter' && (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            toast({
                              title: "Paiement complété",
                              description: "Le solde restant a été encaissé."
                            });
                            setPaymentDetailsOpen(false);
                          }}
                        >
                          Encaisser le solde
                        </Button>
                      )}
                    </div>
                  )}
                  </div>
                </>
              );
            })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}