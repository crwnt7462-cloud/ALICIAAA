import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Share, Download, Euro, Target, TrendingUp, Clock, User, Users, X, Scissors, Palette, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MobileBottomNav } from "@/components/MobileBottomNav";

type InsertAppointmentForm = {
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

type QuickAppointmentForm = InsertAppointmentForm & {
  employeeId: string;
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

// Configuration des créneaux horaires étendus (minuit à 23h)
// Créneaux horaires complets 24h avec demi-heures pour scroll détaillé
const allTimeSlots: string[] = [];
for (let hour = 0; hour <= 23; hour++) {
  allTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  allTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
}

// Créneaux principaux visibles (9h à 19h)
// Heures principales visibles (toutes les heures entières pour affichage)
const mainTimeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

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

// Services beauté avec couleurs pastel
const beautyServices: ServiceType[] = [
  { id: 1, name: "Coupe + Brushing", category: "Coiffure", duration: 60, price: 65, color: "#E9D5FF" },
  { id: 2, name: "Coloration", category: "Coiffure", duration: 120, price: 85, color: "#DDD6FE" },
  { id: 3, name: "Mèches", category: "Coiffure", duration: 180, price: 120, color: "#C4B5FD" },
  { id: 4, name: "Manucure", category: "Ongles", duration: 45, price: 35, color: "#FBCFE8" },
  { id: 5, name: "Pédicure", category: "Ongles", duration: 60, price: 45, color: "#F9A8D4" },
  { id: 6, name: "Pose Vernis Semi", category: "Ongles", duration: 30, price: 25, color: "#F472B6" },
  { id: 7, name: "Soin Visage", category: "Soins", duration: 90, price: 80, color: "#A5F3FC" },
  { id: 8, name: "Massage Relaxant", category: "Soins", duration: 60, price: 70, color: "#67E8F9" },
  { id: 9, name: "Extensions", category: "Coiffure", duration: 240, price: 200, color: "#A7F3D0" },
  { id: 10, name: "Lissage Brésilien", category: "Coiffure", duration: 180, price: 150, color: "#86EFAC" }
];

type EditAppointmentData = {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  price: number;
  services: ServiceType[];
  products: any[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
};

export default function PlanningResponsive() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [isEmployeePopupOpen, setIsEmployeePopupOpen] = useState(false);
  const [isTimeSlotMenuOpen, setIsTimeSlotMenuOpen] = useState(false);
  const [selectedEmployeeForPopup, setSelectedEmployeeForPopup] = useState<Employee | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{time: string, date: Date, dayIndex: number} | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<EditAppointmentData | null>(null);
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
  const [timeScrollContainer, setTimeScrollContainer] = useState<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Données simulées pour le planning beauté avec rendez-vous réalistes
  const simulatedAppointments = [
    {
      id: "1",
      clientName: "Marie Dupont",
      serviceName: "Coupe + Brushing",
      employee: "1",
      startTime: "10:00",
      endTime: "11:00",
      date: new Date(),
      status: "confirmed",
      price: 65,
      services: [beautyServices[0]],
      products: [],
      totalPrice: 65,
      paymentMethod: "card",
      paymentStatus: "paid"
    },
    {
      id: "2",
      clientName: "Sophie Martin",
      serviceName: "Manucure",
      employee: "2",
      startTime: "14:00",
      endTime: "14:45",
      date: new Date(),
      status: "scheduled",
      price: 35,
      services: [beautyServices[3]],
      products: [],
      totalPrice: 35,
      paymentMethod: "cash",
      paymentStatus: "pending"
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
      price: 80,
      services: [beautyServices[6]],
      products: [],
      totalPrice: 80,
      paymentMethod: "card",
      paymentStatus: "partial"
    }
  ];

  // Initialiser le scroll sur les heures principales (6h du matin)
  const initializeTimeScroll = () => {
    if (timeScrollContainer) {
      const targetTime = "06:00";
      const targetIndex = allTimeSlots.indexOf(targetTime);
      const scrollPosition = targetIndex * 5; // 5px par demi-heure (10px par heure)
      timeScrollContainer.scrollTop = scrollPosition;
    }
  };

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

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment({
      id: appointment.id,
      clientName: appointment.clientName,
      serviceName: appointment.serviceName,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      price: appointment.price,
      services: appointment.services,
      products: appointment.products || [],
      totalPrice: appointment.totalPrice,
      paymentMethod: appointment.paymentMethod,
      paymentStatus: appointment.paymentStatus
    });
    setIsEditAppointmentOpen(true);
  };

  const addServiceToAppointment = (service: ServiceType) => {
    if (!selectedAppointment) return;
    
    const updatedServices = [...selectedAppointment.services, service];
    const newTotal = updatedServices.reduce((sum, s) => sum + s.price, 0);
    
    setSelectedAppointment({
      ...selectedAppointment,
      services: updatedServices,
      totalPrice: newTotal
    });
  };

  const removeServiceFromAppointment = (serviceId: number) => {
    if (!selectedAppointment) return;
    
    const updatedServices = selectedAppointment.services.filter(s => s.id !== serviceId);
    const newTotal = updatedServices.reduce((sum, s) => sum + s.price, 0);
    
    setSelectedAppointment({
      ...selectedAppointment,
      services: updatedServices,
      totalPrice: newTotal
    });
  };

  const updatePaymentMethod = (method: string) => {
    if (!selectedAppointment) return;
    
    setSelectedAppointment({
      ...selectedAppointment,
      paymentMethod: method
    });
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployeeForPopup(employee);
    setIsEmployeePopupOpen(true);
  };

  // Navigation depuis la vue mensuelle vers la vue hebdomadaire
  const navigateToWeekFromDate = (selectedDate: Date) => {
    // Calculer l'offset de semaine basé sur la date sélectionnée
    const today = new Date();
    
    // Trouver le lundi de la semaine de la date sélectionnée
    const dayOfWeek = selectedDate.getDay();
    const mondayOfSelectedWeek = new Date(selectedDate);
    mondayOfSelectedWeek.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // Trouver le lundi de la semaine actuelle
    const todayDayOfWeek = today.getDay();
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() - (todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1));
    
    // Calculer la différence en semaines
    const diffInMs = mondayOfSelectedWeek.getTime() - mondayOfCurrentWeek.getTime();
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    
    // Changer vers la vue hebdomadaire avec le bon offset
    setCurrentWeekOffset(diffInWeeks);
    setViewMode('week');
  };

  // Navigation vers la semaine actuelle (bouton "Aujourd'hui") - version corrigée
  const goToTodayWeek = () => {
    setCurrentWeekOffset(0);
    setViewMode('week');
  };

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

  const quickForm = useForm<QuickAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema.extend({
      employeeId: insertAppointmentSchema.shape.notes.optional()
    })),
    defaultValues: {
      appointmentDate: "",
      startTime: "",
      endTime: "",
      notes: "",
      clientId: 0,
      serviceId: 0,
      employeeId: "",
    },
  });

  // Calcul des dates selon le mode de vue
  const { currentWeek, currentMonth, currentYear, monthDays, currentDay } = useMemo(() => {
    if (viewMode === 'day') {
      const today = new Date();
      const selectedDay = new Date(today);
      selectedDay.setDate(today.getDate() + currentWeekOffset);
      
      return {
        currentWeek: [],
        currentMonth: selectedDay.toLocaleDateString('fr-FR', { month: 'long' }),
        currentYear: selectedDay.getFullYear(),
        monthDays: [],
        currentDay: selectedDay
      };
    } else if (viewMode === 'week') {
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
        currentYear: startOfWeek.getFullYear(),
        monthDays: [],
        currentDay: null
      };
    } else {
      // Vue mensuelle
      const firstDay = new Date(selectedYear, selectedMonth, 1);
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const monthDays = [];
      for (let i = 0; i < 42; i++) { // 6 semaines max
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        monthDays.push(day);
      }
      
      return {
        currentWeek: [],
        currentMonth: firstDay.toLocaleDateString('fr-FR', { month: 'long' }),
        currentYear: selectedYear,
        monthDays,
        currentDay: null
      };
    }
  }, [currentWeekOffset, viewMode, selectedMonth, selectedYear]);

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

  // Fonctions pour calculer la position et hauteur des événements (6h-23h)
  const getEventPositionExtended = (startTime: string) => {
    const index = allTimeSlots.indexOf(startTime);
    return index >= 0 ? index * 5 : 0; // 5px par demi-heure
  };

  const getEventHeightExtended = (startTime: string, endTime: string) => {
    const startIndex = allTimeSlots.indexOf(startTime);
    const endIndex = allTimeSlots.indexOf(endTime);
    if (startIndex >= 0 && endIndex >= 0) {
      return (endIndex - startIndex) * 5; // 5px par demi-heure
    }
    
    // Fallback: calculer manuellement
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return Math.max(duration / 30 * 5, 20); // 5px par demi-heure, minimum 20px
  };

  // Fonction pour gérer le clic sur un créneau vide - menu contextuel
  const handleTimeSlotClick = (timeSlot: string, dayIndex: number, selectedDate: Date) => {
    setSelectedTimeSlot({
      time: timeSlot,
      date: selectedDate,
      dayIndex: dayIndex
    });
    setIsTimeSlotMenuOpen(true);
  };

  const handleCreateAppointment = () => {
    if (!selectedTimeSlot) return;
    
    const appointmentDate = selectedTimeSlot.date.toISOString().split('T')[0];
    
    // Pré-remplir le formulaire avec les informations du créneau sélectionné
    quickForm.reset({
      appointmentDate,
      startTime: selectedTimeSlot.time,
      endTime: calculateEndTime(selectedTimeSlot.time, 60), // Durée par défaut de 60min
      notes: "",
      clientId: 0,
      serviceId: 0,
      employeeId: ""
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
      duration: 60, // 1 heure par défaut
      employeeId: 'all'
    });
    
    setIsTimeSlotMenuOpen(false);
    setIsBlockDialogOpen(true);
  };

  // Fonction pour calculer l'heure de fin
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    if (hours === undefined || minutes === undefined) return startTime;
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day' || viewMode === 'week') {
      setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
    } else {
      if (direction === 'next') {
        if (selectedMonth === 11) {
          setSelectedMonth(0);
          setSelectedYear(selectedYear + 1);
        } else {
          setSelectedMonth(selectedMonth + 1);
        }
      } else {
        if (selectedMonth === 0) {
          setSelectedMonth(11);
          setSelectedYear(selectedYear - 1);
        } else {
          setSelectedMonth(selectedMonth - 1);
        }
      }
    }
  };

  const goToToday = () => {
    const today = new Date();
    if (viewMode === 'day' || viewMode === 'week') {
      setCurrentWeekOffset(0);
    } else {
      setSelectedMonth(today.getMonth());
      setSelectedYear(today.getFullYear());
    }
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
    if (type === "appointment") {
      setIsDialogOpen(true);
    } else {
      setIsBlockDialogOpen(true);
    }
  };

  // Fonctions pour version mobile selon maquette
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Calcul position en fonction des heures (8h = position 0, chaque heure = 80px)
    return Math.max(0, (hours - 8) * 80 + (minutes / 60) * 80);
  };

  const getAppointmentsForDate = (date: Date) => {
    return beautySampleEvents.filter(event => {
      // Simuler des rendez-vous pour la date sélectionnée
      const eventDate = new Date();
      eventDate.setHours(parseInt(event.time.split(':')[0]));
      return date.toDateString() === new Date().toDateString();
    }).map(event => ({
      id: event.id,
      serviceName: event.title,
      clientName: event.client,
      startTime: event.time.split('-')[0],
      endTime: event.time.split('-')[1],
      status: event.status,
      notes: event.notes
    }));
  };

  const isAppointmentCurrent = (appointment: any) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
    const [endHour, endMinute] = appointment.endTime.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return currentTime >= startTime && currentTime <= endTime;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Version Mobile - Interface selon maquette */}
      <div className="lg:hidden min-h-screen bg-white">
        {/* Header mobile avec navigation */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Appointment date</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sélecteur de mois */}
        <div className="bg-white px-4 py-2 border-b border-gray-100">
          <Select value={currentMonth.toLowerCase()} onValueChange={(value) => {
            const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            const monthIndex = monthNames.indexOf(value);
            if (monthIndex !== -1) {
              setSelectedMonth(monthIndex);
            }
          }}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'].map((month) => (
                <SelectItem key={month} value={month}>{month.charAt(0).toUpperCase() + month.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calendrier mensuel compact */}
        <div className="bg-white p-4 border-b border-gray-200">
          {/* En-tête des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.slice(0, 35).map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isCurrentMonth = date.getMonth() === selectedMonth;
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`w-10 h-10 text-sm rounded-lg transition-all ${
                    !isCurrentMonth 
                      ? 'text-gray-300' 
                      : isSelected
                        ? 'bg-green-500 text-white font-bold'
                        : isToday
                          ? 'bg-purple-100 text-purple-700 font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline des rendez-vous */}
        <div className="bg-white flex-1 overflow-y-auto pb-20">
          <div className="relative p-4">
            {/* Ligne d'heure actuelle (violette selon votre demande) */}
            <div 
              className="absolute left-0 right-0 z-10 flex items-center px-4"
              style={{ top: `${getCurrentTimePosition()}px` }}
            >
              <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
              <div className="flex-1 h-0.5 bg-purple-500 ml-2"></div>
            </div>

            {/* Rendez-vous de la journée sélectionnée */}
            {getAppointmentsForDate(selectedDate || new Date()).map((appointment, index) => {
              const isCurrentAppointment = isAppointmentCurrent(appointment);
              
              return (
                <div key={index} className="relative mb-6">
                  {/* Ligne de temps */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Point de temps */}
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <span className="text-xs text-gray-500 mb-2 font-medium">
                        {appointment.startTime}
                      </span>
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isCurrentAppointment 
                          ? 'bg-purple-500 border-purple-500' 
                          : appointment.status === 'confirmed'
                            ? 'bg-green-500 border-green-500'
                            : 'bg-gray-300 border-gray-300'
                      }`}></div>
                    </div>
                    
                    <div className={`flex-1 p-3 rounded-lg border ${
                      isCurrentAppointment 
                        ? 'bg-purple-50 border-purple-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h3 className="font-semibold text-gray-900 mb-1">{appointment.serviceName}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <User className="w-3 h-3 mr-1" />
                        <span>{appointment.clientName}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>{selectedDate?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Message si pas de rendez-vous */}
            {getAppointmentsForDate(selectedDate || new Date()).length === 0 && (
              <div className="p-8 text-center">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun rendez-vous prévu</p>
              </div>
            )}
          </div>
        </div>

        {/* Bouton flottant d'ajout */}
        <div className="fixed bottom-20 right-4">
          <Button 
            size="lg" 
            className="w-14 h-14 rounded-full bg-black hover:bg-gray-800 shadow-xl"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Navigation mobile */}
        <MobileBottomNav />
      </div>

      {/* Version Desktop - Inchangée */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 lg:max-w-none lg:w-full">
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
                  onClick={goToToday}
                  className="bg-white/80 backdrop-blur-sm border-gray-200"
                >
                  Aujourd'hui
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('prev')}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('next')}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Sélecteurs mois et année pour vue mensuelle */}
                {viewMode === 'month' ? (
                  <div className="flex items-center space-x-2">
                    <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                      <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {new Date(2024, i, 1).toLocaleDateString('fr-FR', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-20 bg-white/80 backdrop-blur-sm border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
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
                  <span className="text-lg font-medium text-gray-700 capitalize">
                    {viewMode === 'day' && currentDay ? 
                      `${currentDay.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` :
                      `${currentMonth} ${currentYear}`
                    }
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              <div className="flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className={`px-2 lg:px-3 py-1 text-xs ${viewMode === 'day' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="hidden sm:inline">Jour</span>
                  <span className="sm:hidden">J</span>
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className={`px-2 lg:px-3 py-1 text-xs ${viewMode === 'week' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="hidden sm:inline">Semaine</span>
                  <span className="sm:hidden">S</span>
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className={`px-2 lg:px-3 py-1 text-xs ${viewMode === 'month' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="hidden sm:inline">Mois</span>
                  <span className="sm:hidden">M</span>
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 backdrop-blur-sm hidden sm:flex"
                onClick={() => openQuickAdd("appointment")}
              >
                <Plus className="h-4 w-4 mr-1" />
                RDV
              </Button>
              <Button 
                variant="default" 
                size="icon"
                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white sm:hidden rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 fixed bottom-24 right-6 z-50"
                onClick={() => openQuickAdd("appointment")}
              >
                <Plus className="h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 backdrop-blur-sm hidden lg:flex"
                onClick={() => openQuickAdd("block")}
              >
                <X className="h-4 w-4 mr-1" />
                Bloquer
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hidden lg:flex">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white hidden lg:flex">
                <Share className="h-4 w-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>

          {/* Sélection d'employé - masquée sur mobile */}
          <div className="hidden lg:flex items-center space-x-4 mb-6">
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

        {/* Vue mobile uniquement - Design moderne exact */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Today's Tasks</h3>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>
            
              {/* Liste verticale des tâches avec design exact de votre maquette */}
              <div className="space-y-4">
                {/* Carte 1 - Turquoise/Bleu */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-3xl p-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                  }}
                >
                  <div className="flex items-start justify-between text-white">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">
                        Morning Skincare
                      </h4>
                      <p className="text-blue-100 text-sm mb-3">
                        Marie Dubois • 09:00-10:30
                      </p>
                      <div className="flex items-center text-sm text-blue-100">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>1h 30min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">85€</div>
                      <div className="w-3 h-3 bg-green-400 rounded-full mt-2 ml-auto" />
                    </div>
                  </div>
                  
                  {/* Décoration d'arrière-plan */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                </motion.div>

                {/* Carte 2 - Violet/Rose */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative overflow-hidden rounded-3xl p-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  }}
                >
                  <div className="flex items-start justify-between text-white">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">
                        Hair Treatment
                      </h4>
                      <p className="text-purple-100 text-sm mb-3">
                        Sophie Martin • 11:00-12:15
                      </p>
                      <div className="flex items-center text-sm text-purple-100">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>1h 15min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">120€</div>
                      <div className="w-3 h-3 bg-green-400 rounded-full mt-2 ml-auto" />
                    </div>
                  </div>
                  
                  {/* Décoration d'arrière-plan */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                </motion.div>

                {/* Carte 3 - Orange/Rouge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative overflow-hidden rounded-3xl p-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                  }}
                >
                  <div className="flex items-start justify-between text-white">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">
                        Lunch Break
                      </h4>
                      <p className="text-orange-100 text-sm mb-3">
                        Blocked • 12:30-13:30
                      </p>
                      <div className="flex items-center text-sm text-orange-100">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>1h</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-3 h-3 bg-red-300 rounded-full mt-2 ml-auto" />
                    </div>
                  </div>
                  
                  {/* Décoration d'arrière-plan */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                </motion.div>

                {/* Carte 4 - Vert/Emeraude */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative overflow-hidden rounded-3xl p-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  }}
                >
                  <div className="flex items-start justify-between text-white">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">
                        Nail Art Session
                      </h4>
                      <p className="text-emerald-100 text-sm mb-3">
                        Emma Laurent • 14:00-15:30
                      </p>
                      <div className="flex items-center text-sm text-emerald-100">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>1h 30min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">95€</div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 ml-auto" />
                    </div>
                  </div>
                  
                  {/* Décoration d'arrière-plan */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Vue desktop - grille existante */}
          <div className="hidden lg:block">
          {viewMode === 'day' ? (
            <>
              {/* Vue jour - 4 colonnes (professionnels) */}
              <div className="grid grid-cols-5 border-b border-gray-200">
                <div className="p-2 lg:p-4 text-sm font-medium text-gray-500 border-r border-gray-200">
                  <div className="flex items-center space-x-1 lg:space-x-2">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden lg:inline">Heures</span>
                  </div>
                </div>
                {employees.map((employee) => (
                  <div key={employee.id} className="p-2 lg:p-4 text-center border-r border-gray-200 last:border-r-0">
                    <div className="text-xs lg:text-sm font-medium text-gray-700">{employee.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{employee.specialties[0]}</div>
                  </div>
                ))}
              </div>
              
              {/* Grille horaire jour */}
              <div className="grid grid-cols-5 max-h-96 lg:max-h-[500px] overflow-y-auto">
                <div className="border-r border-gray-200 w-12 lg:w-16">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="h-12 flex items-center justify-center text-xs text-gray-500 border-b border-gray-100 font-medium">
                      {slot}
                    </div>
                  ))}
                </div>
                
                {employees.map((employee, empIndex) => (
                  <div key={employee.id} className="relative border-r border-gray-200 last:border-r-0 min-w-0">
                    {timeSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="h-8 border-b border-gray-100 hover:bg-purple-50 hover:border-purple-200 cursor-pointer relative transition-all duration-150"
                        onClick={() => handleTimeSlotClick(slot, new Date().getDay(), employee.id)}
                        title={`Créer un rendez-vous à ${slot} avec ${employee.name}`}
                      />
                    ))}
                    
                    {/* Événements pour cet employé */}
                    {beautySampleEvents
                      .filter(event => event.employeeId === employee.id)
                      .map((event) => {
                        const isBlocked = event.isBlock;
                        const serviceColor = isBlocked ? "#EF4444" : getServiceColor(event.serviceId);
                        
                        return (
                          <div
                            key={event.id}
                            className={`absolute left-0.5 right-0.5 rounded-md p-1 lg:p-2 text-xs font-medium shadow-sm z-10 border ${
                              isBlocked 
                                ? 'bg-red-100 border-red-300 text-red-800' 
                                : 'border-gray-200'
                            }`}
                            style={{
                              top: `${getEventPosition(event.time)}px`,
                              height: `${getEventHeight(event.time)}px`,
                              minHeight: '25px',
                              backgroundColor: isBlocked ? '#FEE2E2' : serviceColor
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="truncate font-semibold text-gray-800">{event.title}</div>
                              {event.status === 'confirmed' && !isBlocked && (
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            {!isBlocked && (
                              <div className="truncate text-gray-700 text-xs">{event.client}</div>
                            )}
                            <div className="text-xs text-gray-600 truncate">{event.time}</div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </>
          ) : viewMode === 'week' ? (
            <>
              {/* En-tête avec employé + heures + jours - Vue hebdomadaire responsive */}
              <div className="grid grid-cols-9 lg:grid-cols-10 border-b border-gray-200 text-xs">
                {/* Colonne employé */}
                <div className="p-1 text-xs font-medium text-gray-500 border-r border-gray-200 w-12 lg:w-16">
                  <div className="flex items-center justify-center">
                    <User className="h-3 w-3" />
                  </div>
                </div>
                {/* Colonne heures */}
                <div className="p-1 text-xs font-medium text-gray-500 border-r border-gray-200 w-8 lg:w-10">
                  <div className="flex items-center justify-center">
                    <Clock className="h-3 w-3" />
                  </div>
                </div>
                {/* Colonnes des jours */}
                {currentWeek.map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={index} className={`p-1 text-center border-r border-gray-200 last:border-r-0 min-w-0 ${isToday ? 'bg-purple-50' : ''}`}>
                      <div className="text-xs font-medium text-gray-700 truncate">
                        {weekDays[date.getDay()]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.getDate()}
                      </div>
                      {isToday && (
                        <div 
                          className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1 cursor-pointer hover:bg-purple-600" 
                          onClick={() => goToTodayWeek()}
                          title="Aller à la semaine actuelle"
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grille horaire - Vue hebdomadaire avec scroll 24h complet */}
              <div 
                ref={setTimeScrollContainer}
                className="relative max-h-[500px] lg:max-h-[600px] overflow-y-auto scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                <div className="grid grid-cols-9 lg:grid-cols-10">
                  {/* Colonne employé - affichage compact avec noms complets */}
                  <div className="border-r border-gray-200 w-12 lg:w-16 sticky left-0 bg-white z-20">
                    {employees.map((employee, empIndex) => (
                      <div key={empIndex} className="relative">
                        {/* Affichage employé sur plusieurs créneaux pour visibilité */}
                        <div 
                          className="sticky top-0 bg-white border-b border-gray-200 p-1 z-30"
                          style={{ height: `${Math.ceil(allTimeSlots.length / employees.length) * 20}px` }}
                        >
                          <button
                            onClick={() => handleEmployeeClick(employee)}
                            className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-50 rounded transition-colors"
                          >
                            <div 
                              className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-1"
                              style={{ backgroundColor: employee.color }}
                            >
                              {employee.avatar}
                            </div>
                            <span className="text-xs font-medium text-gray-700 truncate max-w-full leading-tight">
                              {employee.name.split(' ')[0]}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Colonne des heures - largeur réduite */}
                  <div className="border-r border-gray-200 w-8 lg:w-10 sticky left-12 lg:left-16 bg-white z-19">
                    {allTimeSlots.map((slot, index) => {
                      const isMainHour = mainTimeSlots.includes(slot);
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center justify-center text-xs border-b border-gray-100 font-medium ${
                            isMainHour 
                              ? 'text-gray-800 bg-gray-50 h-6 lg:h-8' 
                              : 'text-gray-400 h-4 lg:h-5'
                          }`}
                        >
                          {isMainHour ? slot : slot.endsWith(':30') ? '30' : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Colonnes des jours - hauteurs réduites et responsive */}
                  {currentWeek.map((date, dayIndex) => (
                    <div key={dayIndex} className="relative border-r border-gray-200 last:border-r-0 min-w-0">
                      {allTimeSlots.map((slot, slotIndex) => {
                        const isMainHour = mainTimeSlots.includes(slot);
                        return (
                          <div
                            key={slotIndex}
                            className={`border-b border-gray-100 hover:bg-purple-50 hover:border-purple-200 cursor-pointer relative transition-all duration-150 ${
                              isMainHour ? 'h-6 lg:h-8 bg-white' : 'h-4 lg:h-5 bg-gray-50/30'
                            }`}
                            onClick={() => handleTimeSlotClick(slot, dayIndex, date)}
                            title={`Créer un rendez-vous à ${slot} le ${date.toLocaleDateString('fr-FR')}`}
                          />
                        );
                      })}
                      
                      {/* Événements simulés pour ce jour - meilleure lisibilité */}
                      {simulatedAppointments
                        .filter(appointment => {
                          const appointmentDate = new Date(appointment.date);
                          return appointmentDate.toDateString() === date.toDateString();
                        })
                        .map((appointment) => {
                          const employee = employees.find(e => e.id === appointment.employee);
                          
                          return (
                            <div
                              key={appointment.id}
                              className="absolute left-0.5 right-0.5 rounded-md p-1 lg:p-2 text-xs font-medium shadow-lg z-10 border cursor-pointer hover:shadow-xl transition-all bg-white border-gray-300 hover:border-gray-400"
                              style={{
                                top: `${getEventPositionExtended(appointment.startTime)}px`,
                                height: `${getEventHeightExtended(appointment.startTime, appointment.endTime)}px`,
                                minHeight: '30px',
                                borderLeftColor: employee?.color || '#6B7280',
                                borderLeftWidth: '4px'
                              }}
                              onClick={() => handleAppointmentClick(appointment)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="truncate font-bold text-gray-900 text-xs">{appointment.serviceName}</div>
                                {appointment.status === 'confirmed' && (
                                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <div className="truncate text-gray-800 text-xs font-medium">{appointment.clientName}</div>
                              <div className="text-xs text-gray-700 truncate font-medium">{appointment.startTime} - {appointment.endTime}</div>
                              <div className="text-xs font-bold" style={{ color: employee?.color || '#6B7280' }}>{appointment.price}€</div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* En-tête des jours - Vue mensuelle */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {weekDays.map((day, index) => (
                  <div key={index} className="p-1 lg:p-3 text-center border-r border-gray-200 last:border-r-0">
                    <div className="text-xs lg:text-sm font-medium text-gray-500">{day}</div>
                  </div>
                ))}
              </div>

              {/* Grille mensuelle */}
              <div className="grid grid-cols-7">
                {monthDays.map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isCurrentMonth = date.getMonth() === selectedMonth;
                  const dayEvents = filteredEvents.filter(event => {
                    const eventDate = new Date(selectedYear, selectedMonth, date.getDate());
                    return eventDate.toDateString() === date.toDateString();
                  });
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[80px] lg:min-h-[100px] p-1 lg:p-2 border-r border-b border-gray-200 last:border-r-0 hover:bg-gray-50 cursor-pointer ${
                        !isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : ''
                      } ${isToday ? 'bg-purple-50' : ''}`}
                      onClick={() => navigateToWeekFromDate(date)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isToday ? 'text-purple-600' : ''}`}>
                          {date.getDate()}
                        </span>
                        {isToday && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Événements du jour */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const employee = getEmployee(event.employeeId);
                          const isBlocked = event.isBlock;
                          const serviceColor = isBlocked ? "#EF4444" : getServiceColor(event.serviceId);
                          
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border-l-2 ${
                                isBlocked 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-white text-gray-800'
                              }`}
                              style={{ borderLeftColor: serviceColor }}
                            >
                              <div className="truncate font-medium">{event.title}</div>
                              {!isBlocked && (
                                <div className="truncate text-gray-600">{event.client}</div>
                              )}
                              <div className="text-xs opacity-75">{event.time.split('-')[0]}</div>
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 3} autre{dayEvents.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
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

        {/* Popup employé - comme dans l'image */}
        <Dialog open={isEmployeePopupOpen} onOpenChange={setIsEmployeePopupOpen}>
          <DialogContent className="max-w-sm p-0 bg-white/95 backdrop-blur-sm border-gray-200">
            {selectedEmployeeForPopup && (
              <div className="space-y-4">
                {/* En-tête avec profil employé */}
                <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: selectedEmployeeForPopup.color }}
                  >
                    {selectedEmployeeForPopup.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedEmployeeForPopup.name}</h3>
                    <p className="text-sm text-gray-500">{selectedEmployeeForPopup.specialties.join(', ')}</p>
                  </div>
                </div>

                {/* Options de vue */}
                <div className="px-4 space-y-3">
                  <button 
                    onClick={() => {
                      setViewMode('day');
                      setIsEmployeePopupOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Vue par jour</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Affichage sur 3 jours</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setViewMode('week');
                      setIsEmployeePopupOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Vue par semaine</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setViewMode('month');
                      setIsEmployeePopupOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Affichage du mois</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Actions</h4>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <Plus className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Ajouter un rendez-vous</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <X className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Ajouter un créneau bloqué</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Ajouter des congés</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Afficher le membre de l'équipe</span>
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                          <SelectItem value="1">Sophie Martin</SelectItem>
                          <SelectItem value="2">Marie Dubois</SelectItem>
                          <SelectItem value="3">Emma Laurent</SelectItem>
                          <SelectItem value="4">Julie Bernard</SelectItem>
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

        {/* Dialog pour créer un RDV depuis un créneau cliqué */}
        <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
          <DialogContent className="max-w-sm mx-auto p-0 bg-gradient-to-br from-blue-500 to-purple-600 border-0 rounded-3xl lg:max-w-md lg:bg-white lg:bg-none lg:border lg:rounded-xl">
            {/* Version mobile moderne */}
            <div className="lg:hidden">
              <div className="text-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Add Task</h2>
                  <button 
                    onClick={() => setIsAppointmentDialogOpen(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-1 text-sm mb-2">
                    <span className="text-white/70">March 2020</span>
                    <span className="font-semibold">April 2020</span>
                    <span className="text-white/70">May 2020</span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-white/70 py-1">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      const isSelected = day === 17;
                      return (
                        <button
                          key={day}
                          className={`p-2 rounded-lg text-sm font-medium ${
                            isSelected 
                              ? 'bg-white text-blue-600 shadow-lg' 
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-t-3xl p-6">
                <Form {...quickForm}>
                  <form onSubmit={quickForm.handleSubmit((data) => {
                    createMutation.mutate(data);
                    setIsAppointmentDialogOpen(false);
                  })} className="space-y-4">
                
                    <FormField
                      control={quickForm.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium">Task Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Daily UI Challenge"
                              className="border-gray-200 rounded-lg" 
                              {...field}
                              value={field.value?.toString() || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={quickForm.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Start Time</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                className="border-gray-200 rounded-lg" 
                                {...field} 
                                defaultValue="10:00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={quickForm.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-medium">End Time</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                className="border-gray-200 rounded-lg" 
                                {...field} 
                                defaultValue="11:00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <label className="text-gray-900 font-medium text-sm block mb-3">Color</label>
                      <div className="flex space-x-3">
                        {[
                          'bg-blue-400', 'bg-teal-400', 'bg-green-400', 'bg-orange-400'
                        ].map((color, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`w-8 h-8 rounded-full ${color} ${index === 0 ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
                    >
                      {createMutation.isPending ? "Adding..." : "Add"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
            
            {/* Version desktop classique */}
            <div className="hidden lg:block p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Nouveau rendez-vous
                  {selectedTimeSlot && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTimeSlot.time} - {selectedTimeSlot.employee ? getEmployee(selectedTimeSlot.employee)?.name : 'Équipe'}
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <Form {...quickForm}>
                <form onSubmit={quickForm.handleSubmit((data) => {
                  createMutation.mutate(data);
                  setIsAppointmentDialogOpen(false);
                })} className="space-y-4">
                  
                  <FormField
                    control={quickForm.control}
                    name="serviceId"
                    render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        const service = beautyServices.find(s => s.id === parseInt(value));
                        if (service && selectedTimeSlot) {
                          quickForm.setValue('endTime', calculateEndTime(selectedTimeSlot.time, service.duration));
                        }
                      }}>
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
                  control={quickForm.control}
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
                          <SelectItem value="1">Sophie Martin</SelectItem>
                          <SelectItem value="2">Marie Dubois</SelectItem>
                          <SelectItem value="3">Emma Laurent</SelectItem>
                          <SelectItem value="4">Julie Bernard</SelectItem>
                          <SelectItem value="5">Camille Blanc</SelectItem>
                          <SelectItem value="6">Nina Roux</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={quickForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure début</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure fin</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={quickForm.control}
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
                    onClick={() => setIsAppointmentDialogOpen(false)}
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
            </div>
          </DialogContent>
        </Dialog>

        {/* Menu contextuel pour créneaux */}
        <Dialog open={isTimeSlotMenuOpen} onOpenChange={setIsTimeSlotMenuOpen}>
          <DialogContent className="max-w-sm p-4">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Action sur le créneau
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
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
              >
                <Scissors className="h-4 w-4 mr-2" />
                Créer un rendez-vous
              </Button>
              <Button
                onClick={handleCreateBlock}
                className="w-full justify-start bg-red-600 hover:bg-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Bloquer ce créneau
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog pour bloquer un créneau - amélioré */}
        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <X className="h-5 w-5 mr-2" />
                Bloquer un créneau
              </DialogTitle>
            </DialogHeader>
            {blockFormData && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Créneau sélectionné</p>
                  <p className="text-sm text-gray-600">
                    {blockFormData.startTime} - {new Date(blockFormData.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Motif du blocage</label>
                  <Input 
                    placeholder="Ex: Pause déjeuner, Formation..." 
                    className="mt-1" 
                    value={blockFormData.reason}
                    onChange={(e) => setBlockFormData({...blockFormData, reason: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Durée (minutes)</label>
                  <Select 
                    value={blockFormData.duration.toString()}
                    onValueChange={(value) => setBlockFormData({...blockFormData, duration: parseInt(value)})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="90">1h30</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="240">4 heures</SelectItem>
                      <SelectItem value="480">Journée complète</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Employé(s) concerné(s)</label>
                  <Select 
                    value={blockFormData.employeeId}
                    onValueChange={(value) => setBlockFormData({...blockFormData, employeeId: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
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
                    onClick={() => {
                      setIsBlockDialogOpen(false);
                      setBlockFormData(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      // Ici on pourrait ajouter la logique de sauvegarde du blocage
                      toast({
                        title: "Créneau bloqué",
                        description: `Créneau bloqué: ${blockFormData.reason || 'Sans motif'} (${blockFormData.duration}min)`,
                      });
                      setIsBlockDialogOpen(false);
                      setBlockFormData(null);
                    }}
                  >
                    Bloquer créneau
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog d'édition de rendez-vous avec panier et paiement */}
        <Dialog open={isEditAppointmentOpen} onOpenChange={setIsEditAppointmentOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Scissors className="h-5 w-5 mr-2" />
                Éditer le rendez-vous
              </DialogTitle>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-6">
                {/* Informations client */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                  <p className="text-lg font-medium">{selectedAppointment.clientName}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                </div>

                {/* Services actuels */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Services sélectionnés</h3>
                  <div className="space-y-2">
                    {selectedAppointment.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-600">{service.duration} min</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{service.price}€</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeServiceFromAppointment(service.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ajouter des services */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ajouter des services</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {beautyServices.map((service) => (
                      <Button
                        key={service.id}
                        size="sm"
                        variant="outline"
                        onClick={() => addServiceToAppointment(service)}
                        className="justify-start p-2 h-auto"
                      >
                        <div className="text-left">
                          <div className="font-medium text-xs">{service.name}</div>
                          <div className="text-xs text-gray-600">{service.duration}min - {service.price}€</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Total et paiement */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-purple-600">{selectedAppointment.totalPrice}€</span>
                  </div>

                  {/* Méthode de paiement */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Méthode de paiement</label>
                    <Select value={selectedAppointment.paymentMethod} onValueChange={updatePaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="check">Chèque</SelectItem>
                        <SelectItem value="transfer">Virement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Statut de paiement */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm font-medium">Statut:</span>
                    <Badge 
                      variant={selectedAppointment.paymentStatus === 'paid' ? 'default' : 
                               selectedAppointment.paymentStatus === 'partial' ? 'secondary' : 'outline'}
                    >
                      {selectedAppointment.paymentStatus === 'paid' ? 'Payé' :
                       selectedAppointment.paymentStatus === 'partial' ? 'Acompte versé' : 'En attente'}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditAppointmentOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Enregistrer les modifications
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Encaisser
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Navigation mobile */}
      <MobileBottomNav userType="pro" />
    </div>
  );
}