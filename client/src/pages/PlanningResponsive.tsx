import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Filter, Share, Settings, Download, Euro, Target, TrendingUp, Clock, User, Users, Calendar, X, Scissors, Palette, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type InsertAppointmentForm = {
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

type Employee = {
  id: string;
  name: string;
  color: string;
  avatar: string;
  specialties: string[];
};

type ServiceType = {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
  color: string;
};

const appointmentFormSchema = insertAppointmentSchema.extend({
  notes: insertAppointmentSchema.shape.notes.optional(),
});

// Configuration des créneaux horaires (9h à 20h)
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Employés du salon
const employees: Employee[] = [
  { 
    id: "1", 
    name: "Sarah Martin", 
    color: "#8B5CF6", 
    avatar: "SM",
    specialties: ["Coiffure", "Coloration"]
  },
  { 
    id: "2", 
    name: "Emma Dubois", 
    color: "#EC4899", 
    avatar: "ED",
    specialties: ["Manucure", "Pédicure"]
  },
  { 
    id: "3", 
    name: "Julie Moreau", 
    color: "#06B6D4", 
    avatar: "JM",
    specialties: ["Soins visage", "Massage"]
  },
  { 
    id: "4", 
    name: "Léa Bernard", 
    color: "#10B981", 
    avatar: "LB",
    specialties: ["Extensions", "Lissage"]
  }
];

// Services beauté avec couleurs
const beautyServices: ServiceType[] = [
  { id: 1, name: "Coupe + Brushing", category: "Coiffure", duration: 60, price: 65, color: "#8B5CF6" },
  { id: 2, name: "Coloration", category: "Coiffure", duration: 120, price: 85, color: "#7C3AED" },
  { id: 3, name: "Mèches", category: "Coiffure", duration: 180, price: 120, color: "#6D28D9" },
  { id: 4, name: "Manucure", category: "Ongles", duration: 45, price: 35, color: "#EC4899" },
  { id: 5, name: "Pédicure", category: "Ongles", duration: 60, price: 45, color: "#DB2777" },
  { id: 6, name: "Pose Vernis Semi", category: "Ongles", duration: 30, price: 25, color: "#BE185D" },
  { id: 7, name: "Soin Visage", category: "Soins", duration: 90, price: 80, color: "#06B6D4" },
  { id: 8, name: "Massage Relaxant", category: "Soins", duration: 60, price: 70, color: "#0891B2" },
  { id: 9, name: "Extensions", category: "Coiffure", duration: 240, price: 200, color: "#10B981" },
  { id: 10, name: "Lissage Brésilien", category: "Coiffure", duration: 180, price: 150, color: "#059669" }
];

export default function PlanningResponsive() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [appointmentType, setAppointmentType] = useState<"appointment" | "block">("appointment");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [] } = useQuery({
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
      setIsBlockDialogOpen(false);
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
      appointmentDate: "",
      startTime: "",
      endTime: "",
      notes: "",
      clientId: 0,
      serviceId: 0,
    },
  });

  // Calcul des dates de la semaine
  const { currentWeek, currentMonth, currentYear } = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    
    return {
      currentWeek: week,
      currentMonth: startOfWeek.toLocaleDateString('fr-FR', { month: 'long' }),
      currentYear: startOfWeek.getFullYear()
    };
  }, [currentWeekOffset]);

  // Rendez-vous beauté simulés
  const beautySampleEvents = [
    // Aujourd'hui - Sarah Martin
    { 
      id: 1, 
      title: "Coupe + Brushing", 
      client: "Marie Durand",
      time: "09:00-10:00", 
      day: new Date().getDay(), 
      serviceId: 1,
      employeeId: "1",
      status: "confirmed",
      notes: "Première visite"
    },
    { 
      id: 2, 
      title: "Coloration", 
      client: "Sophie Laurent",
      time: "10:30-12:30", 
      day: new Date().getDay(), 
      serviceId: 2,
      employeeId: "1",
      status: "confirmed",
      notes: "Châtain clair"
    },
    // Emma Dubois - même créneau
    { 
      id: 3, 
      title: "Manucure", 
      client: "Claire Moreau",
      time: "10:00-10:45", 
      day: new Date().getDay(), 
      serviceId: 4,
      employeeId: "2",
      status: "scheduled",
      notes: "French manucure"
    },
    { 
      id: 4, 
      title: "Pédicure", 
      client: "Anna Petit",
      time: "11:00-12:00", 
      day: new Date().getDay(), 
      serviceId: 5,
      employeeId: "2",
      status: "confirmed",
      notes: ""
    },
    // Julie Moreau
    { 
      id: 5, 
      title: "Soin Visage", 
      client: "Lucie Bernard",
      time: "14:00-15:30", 
      day: new Date().getDay(), 
      serviceId: 7,
      employeeId: "3",
      status: "confirmed",
      notes: "Peau sensible"
    },
    // Léa Bernard
    { 
      id: 6, 
      title: "Extensions", 
      client: "Nina Roux",
      time: "09:00-13:00", 
      day: new Date().getDay(), 
      serviceId: 9,
      employeeId: "4",
      status: "scheduled",
      notes: "Extensions blondes 60cm"
    },
    // Demain
    { 
      id: 7, 
      title: "Lissage Brésilien", 
      client: "Emma Girard",
      time: "09:00-12:00", 
      day: (new Date().getDay() + 1) % 7, 
      serviceId: 10,
      employeeId: "1",
      status: "confirmed",
      notes: "Cheveux très frisés"
    },
    { 
      id: 8, 
      title: "Pose Vernis Semi", 
      client: "Camille Blanc",
      time: "14:00-14:30", 
      day: (new Date().getDay() + 1) % 7, 
      serviceId: 6,
      employeeId: "2",
      status: "scheduled",
      notes: "Rouge classique"
    },
    // Blocage de créneau
    { 
      id: 9, 
      title: "PAUSE DÉJEUNER", 
      client: "",
      time: "12:00-13:00", 
      day: new Date().getDay(), 
      serviceId: 0,
      employeeId: "all",
      status: "blocked",
      notes: "Pause équipe",
      isBlock: true
    }
  ];

  // Fonction pour obtenir la position de l'événement
  const getEventPosition = (time: string) => {
    const startTime = time.split('-')[0];
    if (!startTime) return 0;
    const [hour, minute] = startTime.split(':').map(Number);
    if (hour === undefined || minute === undefined) return 0;
    const totalMinutes = (hour - 9) * 60 + minute;
    return (totalMinutes / 30) * 40; // 40px par demi-heure
  };

  // Fonction pour calculer la hauteur de l'événement
  const getEventHeight = (time: string) => {
    const [start, end] = time.split('-');
    if (!start || !end) return 40;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    if (startHour === undefined || startMin === undefined || endHour === undefined || endMin === undefined) return 40;
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return Math.max((duration / 30) * 20, 30); // Minimum 30px
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  // Fonction pour obtenir la couleur du service
  const getServiceColor = (serviceId: number) => {
    const service = beautyServices.find(s => s.id === serviceId);
    return service ? service.color : "#6B7280";
  };

  // Fonction pour obtenir l'employé
  const getEmployee = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  // Filtrer les événements par employé
  const filteredEvents = selectedEmployee === "all" 
    ? beautySampleEvents 
    : beautySampleEvents.filter(event => 
        event.employeeId === selectedEmployee || event.employeeId === "all"
      );

  // Calcul des insights CA
  const dailyRevenue = 1847;
  const weeklyRevenue = 8392;
  const monthlyRevenue = 28450;
  const avgTicket = 67;

  const openQuickAdd = (type: "appointment" | "block") => {
    setAppointmentType(type);
    if (type === "appointment") {
      setIsDialogOpen(true);
    } else {
      setIsBlockDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 lg:max-w-none lg:w-full">
      <div className="container mx-auto p-4 lg:p-6">
        
        {/* Header avec insights */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Insights CA au-dessus */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CA Jour</p>
                    <p className="text-2xl font-bold text-purple-600">{dailyRevenue}€</p>
                  </div>
                  <Euro className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CA Semaine</p>
                    <p className="text-2xl font-bold text-blue-600">{weeklyRevenue}€</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CA Mois</p>
                    <p className="text-2xl font-bold text-amber-600">{monthlyRevenue}€</p>
                  </div>
                  <Target className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ticket Moyen</p>
                    <p className="text-2xl font-bold text-green-600">{avgTicket}€</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Header du calendrier */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Planning Beauté</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekOffset(0)}
                  className="bg-white/80 backdrop-blur-sm border-gray-200"
                >
                  Aujourd'hui
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium text-gray-700 capitalize">
                  {currentMonth} {currentYear}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 backdrop-blur-sm"
                onClick={() => openQuickAdd("appointment")}
              >
                <Plus className="h-4 w-4 mr-1" />
                RDV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 backdrop-blur-sm"
                onClick={() => openQuickAdd("block")}
              >
                <X className="h-4 w-4 mr-1" />
                Bloquer
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Share className="h-4 w-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>

          {/* Sélection d'employé */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Équipe:</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedEmployee === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEmployee("all")}
                className="bg-white/80 backdrop-blur-sm"
              >
                <Users className="h-4 w-4 mr-1" />
                Tous
              </Button>
              {employees.map((employee) => (
                <Button
                  key={employee.id}
                  variant={selectedEmployee === employee.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEmployee(employee.id)}
                  className="bg-white/80 backdrop-blur-sm"
                  style={{
                    backgroundColor: selectedEmployee === employee.id ? employee.color : undefined,
                    borderColor: employee.color,
                    color: selectedEmployee === employee.id ? 'white' : employee.color
                  }}
                >
                  <User className="h-4 w-4 mr-1" />
                  {employee.name}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vue calendrier hebdomadaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          {/* En-tête des jours */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 text-sm font-medium text-gray-500 border-r border-gray-200">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Heures</span>
              </div>
            </div>
            {currentWeek.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={index} className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-purple-50' : ''}`}>
                  <div className="text-sm font-medium text-gray-500">
                    {weekDays[date.getDay()]} {date.getDate()}
                  </div>
                  {isToday && (
                    <Badge variant="secondary" className="mt-1 text-xs bg-purple-100 text-purple-700">
                      Aujourd'hui
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grille horaire */}
          <div className="relative">
            <div className="grid grid-cols-8">
              {/* Colonne des heures */}
              <div className="border-r border-gray-200">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="h-20 flex items-start justify-end pr-2 pt-1 text-xs text-gray-500 border-b border-gray-100">
                    {slot}
                  </div>
                ))}
              </div>

              {/* Colonnes des jours */}
              {currentWeek.map((date, dayIndex) => (
                <div key={dayIndex} className="relative border-r border-gray-200 last:border-r-0">
                  {timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="h-20 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                    />
                  ))}
                  
                  {/* Événements pour ce jour */}
                  {filteredEvents
                    .filter(event => event.day === dayIndex)
                    .map((event) => {
                      const employee = getEmployee(event.employeeId);
                      const isBlocked = event.isBlock;
                      const serviceColor = isBlocked ? "#EF4444" : getServiceColor(event.serviceId);
                      
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 border rounded-md p-2 text-xs font-medium shadow-sm z-10 ${
                            isBlocked 
                              ? 'bg-red-100 border-red-300 text-red-800' 
                              : 'bg-white border-gray-300 text-gray-800'
                          }`}
                          style={{
                            top: `${getEventPosition(event.time)}px`,
                            height: `${getEventHeight(event.time)}px`,
                            minHeight: '35px',
                            borderLeftColor: serviceColor,
                            borderLeftWidth: '4px'
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="truncate font-semibold">{event.title}</div>
                            {event.status === 'confirmed' && !isBlocked && (
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          {!isBlocked && (
                            <div className="truncate text-gray-600 mb-1">{event.client}</div>
                          )}
                          <div className="text-xs opacity-75 mb-1">{event.time}</div>
                          {employee && selectedEmployee === "all" && (
                            <div 
                              className="text-xs px-1 py-0.5 rounded text-white"
                              style={{ backgroundColor: employee.color }}
                            >
                              {employee.name}
                            </div>
                          )}
                          {event.notes && (
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {event.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Légende des services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Légende des Services
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {beautyServices.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: service.color }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  <div className="text-xs text-gray-500">{service.duration}min - {service.price}€</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dialog pour créer un RDV */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Scissors className="h-5 w-5 mr-2" />
                Nouveau rendez-vous
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {beautyServices.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded" 
                                  style={{ backgroundColor: service.color }}
                                />
                                <span>{service.name} - {service.price}€ ({service.duration}min)</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(clients) && clients.map((client: any) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.firstName} {client.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Début" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notes du rendez-vous..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {createMutation.isPending ? "Création..." : "Créer RDV"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog pour bloquer un créneau */}
        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <X className="h-5 w-5 mr-2" />
                Bloquer un créneau
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Motif du blocage</label>
                <Input placeholder="Ex: Pause déjeuner, Formation..." className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Durée</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Durée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="240">4 heures</SelectItem>
                      <SelectItem value="480">Journée complète</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Employé(s) concerné(s)</label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toute l'équipe</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsBlockDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  Bloquer créneau
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}