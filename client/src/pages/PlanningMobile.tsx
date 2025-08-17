import { useState, useMemo, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Clock, User, Users, X, Scissors, CalendarDays, Target, TrendingUp, BarChart3, Calendar, Star, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";

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

type AppointmentType = {
  id: string;
  clientName: string;
  serviceName: string;
  employee: string;
  startTime: string;
  endTime: string;
  date: Date;
  status: string;
  price: number;
};

const appointmentFormSchema = insertAppointmentSchema.extend({
  notes: insertAppointmentSchema.shape.notes.optional(),
});

// Créneaux horaires mobiles optimisés (24h complet)
const mobileTimeSlots: string[] = [];
for (let hour = 0; hour <= 23; hour++) {
  mobileTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  mobileTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
}

// Heures principales pour affichage
const mainHours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

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
  }
];

// Rendez-vous simulés
const simulatedAppointments: AppointmentType[] = [
  {
    id: "1",
    clientName: "Marie Dubois",
    serviceName: "Coupe & Brushing",
    employee: "1",
    startTime: "10:00",
    endTime: "11:30",
    date: new Date(),
    status: "confirmed",
    price: 65
  },
  {
    id: "2",
    clientName: "Sophie Laurent",
    serviceName: "Manucure",
    employee: "2",
    startTime: "14:00",
    endTime: "15:00",
    date: new Date(),
    status: "confirmed",
    price: 35
  },
  {
    id: "3",
    clientName: "Julie Bernard",
    serviceName: "Soin Visage",
    employee: "3",
    startTime: "16:00",
    endTime: "17:30",
    date: new Date(),
    status: "confirmed",
    price: 80
  }
];

export default function PlanningMobile() {
  const [, setLocation] = useLocation();
  const [isTimeSlotMenuOpen, setIsTimeSlotMenuOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{time: string; date: Date; dayIndex: number} | null>(null);
  const [blockFormData, setBlockFormData] = useState<{
    date: string;
    startTime: string;
    reason: string;
    duration: number;
    employeeId: string;
  } | null>(null);
  
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Formulaire pour rendez-vous
  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: 0,
      serviceId: 0,
      appointmentDate: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  // Calculer la semaine actuelle
  const currentWeek = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + (currentWeekOffset * 7);
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [currentWeekOffset]);

  // Navigation
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (viewMode === 'week') {
      setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
    } else if (viewMode === 'month') {
      if (direction === 'next') {
        if (selectedMonth === 11) {
          setSelectedMonth(0);
          setSelectedYear(prev => prev + 1);
        } else {
          setSelectedMonth(prev => prev + 1);
        }
      } else {
        if (selectedMonth === 0) {
          setSelectedMonth(11);
          setSelectedYear(prev => prev - 1);
        } else {
          setSelectedMonth(prev => prev - 1);
        }
      }
    }
  };

  const goToToday = () => {
    setCurrentWeekOffset(0);
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  };

  // Gestion des créneaux
  const handleTimeSlotClick = (time: string, dayIndex: number, selectedDate: Date) => {
    setSelectedTimeSlot({
      time,
      date: selectedDate,
      dayIndex
    });
    setIsTimeSlotMenuOpen(true);
  };

  const handleCreateAppointment = () => {
    if (!selectedTimeSlot) return;
    
    const appointmentDate = selectedTimeSlot.date.toISOString().split('T')[0];
    const endTime = calculateEndTime(selectedTimeSlot.time, 60);
    
    form.reset({
      appointmentDate,
      startTime: selectedTimeSlot.time,
      endTime,
      notes: "",
      clientId: 0,
      serviceId: 0,
    });
    
    setIsTimeSlotMenuOpen(false);
    setIsAppointmentDialogOpen(true);
  };

  const handleCreateBlock = () => {
    if (!selectedTimeSlot) return;
    
    const dateString = selectedTimeSlot.date.toISOString().split('T')[0];
    setBlockFormData({
      date: dateString,
      startTime: selectedTimeSlot.time,
      reason: '',
      duration: 60,
      employeeId: 'all'
    });
    
    setIsTimeSlotMenuOpen(false);
    setIsBlockDialogOpen(true);
  };

  // Calculer heure de fin
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  // Position et taille des événements
  const getEventPosition = (startTime: string): number => {
    const timeIndex = mobileTimeSlots.indexOf(startTime);
    return timeIndex * 20; // 20px par créneau mobile
  };

  const getEventHeight = (startTime: string, endTime: string): number => {
    const startIndex = mobileTimeSlots.indexOf(startTime);
    const endIndex = mobileTimeSlots.indexOf(endTime);
    if (startIndex === -1 || endIndex === -1) return 40;
    return Math.max((endIndex - startIndex) * 20, 40);
  };

  // Mutation pour créer rendez-vous
  const createMutation = useMutation({
    mutationFn: (data: InsertAppointmentForm) => 
      apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsAppointmentDialogOpen(false);
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

  const onSubmit = (data: InsertAppointmentForm) => {
    createMutation.mutate(data);
  };

  // Scroll automatique vers 9h au montage
  useEffect(() => {
    if (scrollContainerRef.current && viewMode === 'week') {
      const targetTime = "09:00";
      const targetIndex = mobileTimeSlots.indexOf(targetTime);
      if (targetIndex !== -1) {
        scrollContainerRef.current.scrollTop = targetIndex * 20;
      }
    }
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 p-2 lg:p-4">
      <div className="max-w-md mx-auto lg:max-w-7xl">
        
        {/* Analytics rapides - Mobile d'abord */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 mb-4"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="text-center">
                <Target className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-600">RDV Jour</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="text-center">
                <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">850€</div>
                <div className="text-xs text-gray-600">CA Jour</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="text-center">
                <CalendarDays className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">68</div>
                <div className="text-xs text-gray-600">RDV Semaine</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Header Navigation Mobile-First */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-3 mb-4"
        >
          {/* Navigation principale */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('prev')}
                className="p-2 hover:bg-purple-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center min-w-0">
                {viewMode === 'month' ? (
                  <div className="flex items-center space-x-1">
                    <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                      <SelectTrigger className="w-20 h-8 text-xs bg-white/80">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {month.substring(0, 4)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-16 h-8 text-xs bg-white/80">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - 2 + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {viewMode === 'week' 
                      ? `${currentWeek[0].toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - ${currentWeek[6].toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`
                      : monthNames[selectedMonth]
                    }
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('next')}
                className="p-2 hover:bg-purple-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="sm"
              onClick={goToToday}
              className="bg-purple-600 text-white hover:bg-purple-700 px-3 py-1 text-xs"
            >
              Aujourd'hui
            </Button>
          </div>

          {/* Vues et actions */}
          <div className="flex items-center justify-between">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {['day', 'week', 'month'].map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
                  className={`px-3 py-1 text-xs ${
                    viewMode === mode 
                      ? 'bg-white text-purple-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white p-2"
                onClick={() => setIsAppointmentDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white p-2"
                onClick={() => setIsBlockDialogOpen(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sélection employé - scroll horizontal */}
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              <Button
                variant={selectedEmployee === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedEmployee("all")}
                className={`flex-shrink-0 px-3 py-1 text-xs ${
                  selectedEmployee === "all" 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/80 text-gray-600'
                }`}
              >
                <Users className="h-3 w-3 mr-1" />
                Tous
              </Button>
              {employees.map((employee) => (
                <Button
                  key={employee.id}
                  variant={selectedEmployee === employee.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedEmployee(employee.id)}
                  className="flex-shrink-0 px-3 py-1 text-xs bg-white/80"
                  style={{
                    backgroundColor: selectedEmployee === employee.id ? employee.color : undefined,
                    color: selectedEmployee === employee.id ? 'white' : employee.color
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: employee.color }}
                  ></div>
                  {employee.name.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Planning Vue Semaine - Structure Desktop comme l'image */}
        {viewMode === 'week' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
          >
            {/* En-tête avec colonne employé + jours - Structure exacte */}
            <div className="grid grid-cols-9 lg:grid-cols-9 bg-gray-50/80 border-b border-gray-200">
              {/* Colonne Employé - plus large */}
              <div className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 w-24 lg:w-32">
                <div className="flex flex-col items-center">
                  <User className="h-4 w-4 mb-1" />
                  <span>Équipe</span>
                </div>
              </div>
              
              {/* Colonnes des 7 jours */}
              {currentWeek.map((date, index) => {
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div key={index} className={`p-2 text-center border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-purple-100' : ''}`}>
                    <div className="text-sm font-bold text-purple-600 mb-1">
                      {date.getDate()}
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {weekDays[date.getDay()]}
                    </div>
                    {isToday && (
                      <div className="w-3 h-3 bg-purple-600 rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grille avec employés et créneaux - Structure comme l'image */}
            <div 
              ref={scrollContainerRef}
              className="relative max-h-[600px] lg:max-h-[700px] overflow-y-auto"
            >
              {/* Chaque employé a sa ligne complète avec créneaux horaires */}
              {(selectedEmployee === "all" ? employees : employees.filter(e => e.id === selectedEmployee)).map((employee, empIndex) => (
                <div key={employee.id} className="grid grid-cols-9 lg:grid-cols-9 border-b border-gray-200">
                  {/* Colonne info employé - comme dans l'image */}
                  <div className="border-r border-gray-200 w-24 lg:w-32 bg-gray-50/30 p-3">
                    <div className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: employee.color }}
                      >
                        {employee.avatar}
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">
                          {employee.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {employee.specialties[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Colonnes des 7 jours avec créneaux horaires */}
                  {currentWeek.map((date, dayIndex) => (
                    <div key={dayIndex} className="relative border-r border-gray-200 last:border-r-0 min-h-[200px]">
                      {/* Créneaux horaires pour ce jour */}
                      {mainHours.slice(9, 20).map((hour, hourIndex) => {
                        const slotKey = `${empIndex}-${dayIndex}-${hourIndex}`;
                        return (
                          <div
                            key={slotKey}
                            className="h-8 lg:h-10 border-b border-gray-100 hover:bg-purple-50 cursor-pointer relative transition-colors group"
                            onClick={() => handleTimeSlotClick(hour, dayIndex, date)}
                            title={`${employee.name} - ${hour} - ${date.toLocaleDateString('fr-FR')}`}
                          >
                            {/* Indicateur d'heure visible au hover */}
                            <div className="absolute left-1 top-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {hour}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Événements/rendez-vous pour cet employé et ce jour */}
                      {simulatedAppointments
                        .filter(appointment => {
                          const appointmentDate = new Date(appointment.date);
                          return appointmentDate.toDateString() === date.toDateString() && 
                                 appointment.employee === employee.id;
                        })
                        .map((appointment) => {
                          const startHourIndex = mainHours.slice(9, 20).indexOf(appointment.startTime);
                          const endHourIndex = mainHours.slice(9, 20).indexOf(appointment.endTime);
                          
                          if (startHourIndex === -1) return null;
                          
                          const height = endHourIndex > startHourIndex ? (endHourIndex - startHourIndex) * 40 : 80;
                          
                          return (
                            <div
                              key={appointment.id}
                              className="absolute left-1 right-1 rounded-lg p-2 text-xs font-medium shadow-lg z-20 border cursor-pointer hover:shadow-xl transition-all"
                              style={{
                                top: `${startHourIndex * 40}px`,
                                height: `${height}px`,
                                backgroundColor: employee.color + '20',
                                borderLeftColor: employee.color,
                                borderLeftWidth: '4px',
                                borderColor: employee.color + '40'
                              }}
                              title={`${appointment.clientName} - ${appointment.serviceName}`}
                            >
                              <div className="font-bold text-gray-900 truncate text-xs mb-1">
                                {appointment.startTime} - {appointment.endTime}
                              </div>
                              <div className="text-gray-800 truncate text-xs font-medium">
                                {appointment.serviceName}
                              </div>
                              <div className="text-gray-600 truncate text-xs">
                                {appointment.clientName}
                              </div>
                              <div className="text-xs font-bold mt-1" style={{ color: employee.color }}>
                                {appointment.price}€
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Menu contextuel pour créneaux */}
        <Dialog open={isTimeSlotMenuOpen} onOpenChange={setIsTimeSlotMenuOpen}>
          <DialogContent className="max-w-xs mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-base">
                <Clock className="h-4 w-4 mr-2" />
                Nouveau créneau
              </DialogTitle>
              {selectedTimeSlot && (
                <p className="text-sm text-gray-600">
                  {selectedTimeSlot.time} - {selectedTimeSlot.date.toLocaleDateString('fr-FR')}
                </p>
              )}
            </DialogHeader>
            <div className="space-y-3">
              <Button
                onClick={handleCreateAppointment}
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              >
                <Scissors className="h-4 w-4 mr-2" />
                Créer un rendez-vous
              </Button>
              <Button
                onClick={handleCreateBlock}
                className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Bloquer ce créneau
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog création rendez-vous mobile */}
        <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
          <DialogContent className="max-w-xs mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-sm" />
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
                        <FormLabel className="text-sm">Heure</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Client</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Marie Dubois</SelectItem>
                          <SelectItem value="2">Sophie Laurent</SelectItem>
                          <SelectItem value="3">Julie Bernard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Service</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Sélectionner un service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Coupe & Brushing - 65€</SelectItem>
                          <SelectItem value="2">Manucure - 35€</SelectItem>
                          <SelectItem value="3">Soin Visage - 80€</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Notes (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notes sur le rendez-vous..."
                          className="resize-none text-sm"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2 pt-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsAppointmentDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "..." : "Créer"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog blocage créneau mobile */}
        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogContent className="max-w-xs mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Bloquer un créneau</DialogTitle>
            </DialogHeader>
            {blockFormData && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Créneau sélectionné</p>
                  <p className="text-sm text-gray-600">
                    {blockFormData.startTime} - {new Date(blockFormData.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <Input 
                  placeholder="Motif du blocage..." 
                  value={blockFormData.reason}
                  onChange={(e) => setBlockFormData({...blockFormData, reason: e.target.value})}
                  className="text-sm"
                />
                
                <Select 
                  value={blockFormData.duration.toString()}
                  onValueChange={(value) => setBlockFormData({...blockFormData, duration: parseInt(value)})}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="480">Journée complète</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsBlockDialogOpen(false);
                      setBlockFormData(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      toast({
                        title: "Créneau bloqué",
                        description: `Bloqué: ${blockFormData.reason || 'Sans motif'} (${blockFormData.duration}min)`,
                      });
                      setIsBlockDialogOpen(false);
                      setBlockFormData(null);
                    }}
                  >
                    Bloquer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>

      {/* Barre de navigation mobile - Style Glassmorphique comme ClientDashboard */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 rounded-3xl" 
           style={{
             backdropFilter: 'blur(20px) saturate(180%)',
             background: 'rgba(255, 255, 255, 0.95)',
             border: '1px solid rgba(255, 255, 255, 0.4)',
             boxShadow: '0 8px 32px rgba(31, 38, 135, 0.25)'
           }}>
        <div className="grid grid-cols-4 gap-1 p-3">
          <button
            onClick={() => setLocation('/dashboard')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 text-gray-600"
            style={{
              background: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setLocation('/planning')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200"
            style={{
              background: 'rgba(147, 51, 234, 0.1)',
              color: '#9333ea'
            }}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Planning</span>
          </button>
          
          <button
            onClick={() => setLocation('/clients-modern')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 text-gray-600"
            style={{
              background: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Clients</span>
          </button>
          
          <button
            onClick={() => setLocation('/salon-settings-modern')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 text-gray-600"
            style={{
              background: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
}