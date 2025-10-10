import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, TrendingUp, Filter, Sparkles, BarChart3, Settings, Users, Search, Bell, MoreHorizontal, CheckCircle, AlertCircle, XCircle, Edit, Trash2, Eye, EyeOff, MapPin, Phone, Mail, Star, Heart, Zap, Target, Award, BookOpen, Briefcase, Home, Car, Plane, Coffee, Utensils, Dumbbell, Music, Camera, Palette, Gamepad2, ShoppingBag, Gift, Wrench, Shield, Lock, Unlock, Key, Database, Server, Cloud, Wifi, Bluetooth, Battery, Volume2, Mic, Video, Headphones, Monitor, Smartphone, Tablet, Laptop, Printer, HardDrive, MemoryStick, Cpu, Usb, Router, Antenna, Satellite, Radar, Compass, Map, Globe, Earth, Moon, Sun, Star as StarIcon, Space, Rocket, Satellite as SatelliteIcon, Telescope, Microscope, Binoculars, Camera as CameraIcon, Video as VideoIcon, Film, Tv, Radio, Podcast, Music as MusicIcon, Headphones as HeadphonesIcon, Speaker, Volume1, VolumeX, Play as PlayIcon, Pause as PauseIcon, SkipBack, SkipForward, Rewind, FastForward, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { ProHeader } from "@/components/ProHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useProNotifications, usePlanningRealtime } from "@/hooks/useSupabaseRealtime";
import React from "react";

// Types pour les données
interface Appointment {
  id: string | number;
  clientId?: number;
  serviceId?: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
  client?: {
    name: string;
  };
  service?: {
    name: string;
  };
  clientName?: string;
  serviceName?: string;
}

interface Client {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
}

type InsertAppointmentForm = {
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

// Schema temporaire pour le formulaire
const appointmentFormSchema = {
  clientId: { required: true },
  serviceId: { required: true },
  appointmentDate: { required: true },
  startTime: { required: true },
  endTime: { required: true },
  notes: { required: false }
};

// Time slots générés dynamiquement
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

// Configuration des statuts dynamique
const statusConfig = {
  'confirmed': { label: 'Confirmé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'pending': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  'cancelled': { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle },
  'completed': { label: 'Terminé', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  'no-show': { label: 'Absent', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  'rescheduled': { label: 'Reporté', color: 'bg-orange-100 text-orange-800', icon: Clock }
};

// Données de test pour les calendriers
const calendarData = [
  { id: 'work', name: 'Work', color: 'bg-green-500', checked: true },
  { id: 'education', name: 'Education', color: 'bg-orange-500', checked: true },
  { id: 'personal', name: 'Personal', color: 'bg-purple-500', checked: true }
];

// Données de test pour les plateformes
const platformData = [
  { id: 'google-meet', name: 'Google Meet', logo: '🔗', checked: true },
  { id: 'slack', name: 'Slack', logo: '💬', checked: true },
  { id: 'zoom', name: 'Zoom', logo: '📹', checked: true },
  { id: 'discord', name: 'Discord', logo: '🎮', checked: false },
  { id: 'skype', name: 'Skype', logo: '📞', checked: false }
];

// Données de test pour les événements
const mockEvents = [
  {
    id: 1,
    title: 'Fitness',
    start: '07:00',
    end: '08:00',
    date: '2024-01-15',
    color: 'bg-purple-500',
    recurring: true,
    calendar: 'personal'
  },
  {
    id: 2,
    title: 'Daily meeting',
    start: '08:00',
    end: '09:00',
    date: '2024-01-15',
    color: 'bg-green-500',
    recurring: true,
    calendar: 'work',
    attendees: 12,
    meetingLink: 'meet.google.com/ld-ypmu-ndb'
  },
  {
    id: 3,
    title: 'Meeting wit...',
    start: '11:00',
    end: '12:00',
    date: '2024-01-15',
    color: 'bg-green-500',
    recurring: false,
    calendar: 'work'
  },
  {
    id: 4,
    title: 'Harry\'s Birthday',
    start: '15:00',
    end: '20:00',
    date: '2024-01-15',
    color: 'bg-purple-500',
    recurring: false,
    calendar: 'personal'
  },
  {
    id: 5,
    title: 'English lesson',
    start: '18:30',
    end: '20:00',
    date: '2024-01-15',
    color: 'bg-blue-500',
    recurring: false,
    calendar: 'education'
  }
];

export default function Planning() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [clickedTimeSlot, setClickedTimeSlot] = useState<{date: string, time: string} | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  // Récupérer les données du salon
  const { data: userSalon } = useQuery({
    queryKey: ['/api/salon/my-salon'],
    queryFn: async () => {
      const response = await fetch('/api/salon/my-salon', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du salon');
      }
      return response.json();
    },
    retry: 1
  });

  const salonId = userSalon?.id;
  const salonTimezone = userSalon?.timezone || 'Europe/Paris'; // Fuseau horaire du salon

  // Récupérer les clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients', salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/clients?salon_id=${salonId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.error('Erreur lors du chargement des clients:', response.statusText);
        return [];
      }
      return response.json();
    },
    enabled: !!salonId,
    retry: 1
  });

  // Récupérer les services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services', salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/services?salon_id=${salonId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.error('Erreur lors du chargement des services:', response.statusText);
        return [];
      }
      return response.json();
    },
    enabled: !!salonId,
    retry: 1
  });

  // Récupérer les rendez-vous avec données réelles et synchronisation temps réel
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments', salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/appointments?salon_id=${salonId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.error('Erreur lors du chargement des rendez-vous:', response.statusText);
        return [];
      }
      return response.json();
    },
    enabled: !!salonId,
    retry: 2,
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes pour synchronisation
    staleTime: 5000 // Considérer les données comme fraîches pendant 5 secondes
  });

  // Synchronisation temps réel avec les réservations client
  usePlanningRealtime(salonId?.toString() || '', 'appointments', () => {
    queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
    queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
  });

  // Récupérer les professionnels du salon (hook au niveau du composant)
  const { data: professionals } = useQuery({
    queryKey: ['/api/salons', salonId, 'professionals'],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/salons/${salonId}/professionals`, {
        credentials: 'include'
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!salonId
  });

  const queryClient = useQueryClient();

  // Mutation pour créer un client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: { name: string; email: string; phone: string }) => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...clientData, salon_id: salonId })
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }
      return response.json();
    },
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      setShowNewClientForm(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPhone('');
      toast({ title: 'Client créé avec succès' });
      // Mettre à jour le formulaire avec le nouveau client
      form.setValue('clientId', newClient.id);
    },
    onError: () => {
      toast({ title: 'Erreur lors de la création du client', variant: 'destructive' });
    }
  });

  // Mutation pour créer un rendez-vous
  const createMutation = useMutation({
    mutationFn: async (data: InsertAppointmentForm) => {
      // Vérifier si le créneau est disponible
      const selectedDay = data.appointmentDate;
      const selectedTime = data.startTime;
      const selectedEndTime = data.endTime;
      
      // Vérifier les conflits avec les rendez-vous existants
      const existingAppointments = appointments.filter((apt: Appointment) => 
        apt.appointmentDate === selectedDay
      );
      
      // Vérifier les conflits de plage horaire
      const hasConflict = existingAppointments.some((apt: Appointment) => {
        const aptStart = new Date(`2000-01-01T${apt.startTime}`);
        const aptEnd = new Date(`2000-01-01T${apt.endTime}`);
        const newStart = new Date(`2000-01-01T${selectedTime}`);
        const newEnd = new Date(`2000-01-01T${selectedEndTime}`);
        
        // Vérifier si les plages se chevauchent
        return (newStart < aptEnd && newEnd > aptStart);
      });
      
      if (hasConflict) {
        throw new Error('Ce créneau chevauche avec un rendez-vous existant');
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          ...data, 
          salon_id: salonId,
          timezone: salonTimezone // Inclure le fuseau horaire du salon
        })
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setIsDialogOpen(false);
      toast({ title: 'Rendez-vous créé avec succès' });
    },
    onError: (error: any) => {
      toast({ 
        title: error.message || 'Erreur lors de la création', 
        variant: 'destructive' 
      });
    }
  });

  const form = useForm<InsertAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema as any),
    defaultValues: {
      clientId: 0,
      serviceId: 0,
      appointmentDate: '',
      startTime: '',
      endTime: '',
      notes: ''
    }
  });

  const onSubmit = useCallback((data: InsertAppointmentForm) => {
    setIsLoading(true);
    createMutation.mutate(data, {
      onSettled: () => setIsLoading(false)
    });
  }, [createMutation]);

  // Fonction pour gérer le clic sur un créneau
  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    // Vérifier si le créneau est disponible
    const isAvailable = isTimeSlotAvailable(time);
    
    if (isAvailable) {
      setClickedTimeSlot({ date, time });
      setIsDialogOpen(true);
      
      // Pré-remplir le formulaire avec la date et l'heure
      form.setValue('appointmentDate', date);
      form.setValue('startTime', time);
      
      // Calculer l'heure de fin (par défaut +1h)
      const startTime = new Date(`2000-01-01T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1h
      const endTimeString = endTime.toTimeString().slice(0, 5);
      form.setValue('endTime', endTimeString);
    } else {
      // Trouver le rendez-vous qui occupe ce créneau
      const selectedDay = date;
      const dayAppointments = appointments?.filter((apt: Appointment) => {
        const aptDate = apt.appointmentDate;
        if (typeof aptDate === 'string') {
          return aptDate.split('T')[0] === selectedDay;
        }
        return aptDate === selectedDay;
      }) || [];
      
      const appointmentAtTime = dayAppointments.find((apt: Appointment) => {
        const aptStart = new Date(`2000-01-01T${apt.startTime}`);
        const aptEnd = new Date(`2000-01-01T${apt.endTime}`);
        const currentTime = new Date(`2000-01-01T${time}`);
        
        return currentTime >= aptStart && currentTime < aptEnd;
      });
      
      if (appointmentAtTime) {
        setSelectedEvent(appointmentAtTime);
        setIsDetailDialogOpen(true);
      }
    }
  }, [form, toast, appointments]);

  // Fonction pour vérifier si un créneau est disponible (version globale)
  const isTimeSlotAvailable = useCallback((time: string) => {
    if (!appointments || appointments.length === 0) return true;
    
    const selectedDay = selectedDate.toISOString().split('T')[0];
    const dayAppointments = appointments.filter((apt: Appointment) => {
      const aptDate = apt.appointmentDate;
      if (typeof aptDate === 'string') {
        return aptDate.split('T')[0] === selectedDay;
      }
      return aptDate === selectedDay;
    });
    
    return !dayAppointments.some(apt => {
      const startTime = apt.startTime;
      const endTime = apt.endTime;
      
      const aptStart = new Date(`2000-01-01T${startTime}`);
      const aptEnd = new Date(`2000-01-01T${endTime}`);
      const currentTime = new Date(`2000-01-01T${time}`);
      
      return currentTime >= aptStart && currentTime < aptEnd;
    });
  }, [appointments, selectedDate]);

  // Navigation optimisée avec feedback
  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  }, [selectedDate]);

  // Navigation par mois
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  }, [selectedDate]);

  // Aller à aujourd'hui
  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // Gestion des événements avec feedback tactile
  const handleEventClick = useCallback((event: any) => {
    setSelectedEvent(event);
    // Feedback haptique sur mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const handleEventHover = useCallback((eventId: string | null) => {
    setHoveredEvent(eventId);
  }, []);

  // Générer la semaine actuelle avec vraies dates
  const currentWeek = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    // Ajuster pour commencer le lundi (jour 1) au lieu du dimanche (jour 0)
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(selectedDate.getDate() + daysToMonday);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  }, [selectedDate]);

  // Obtenir le mois et l'année actuels
  const currentMonth = selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const currentYear = selectedDate.getFullYear();
  const currentMonthNumber = selectedDate.getMonth();

  // Générer les jours du mois pour le mini-calendrier
  const monthDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonthNumber, 1);
    const lastDay = new Date(currentYear, currentMonthNumber + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const prevMonth = new Date(currentYear, currentMonthNumber - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonthNumber - 1, daysInPrevMonth - i).toISOString().split('T')[0]
      });
    }
    
    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthNumber, day).toISOString().split('T')[0];
      const isToday = date === new Date().toISOString().split('T')[0];
      const isSelected = date === selectedDate.toISOString().split('T')[0];
      
      days.push({
        day,
        isCurrentMonth: true,
        date,
        isToday,
        isSelected
      });
    }
    
    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonthNumber + 1, day).toISOString().split('T')[0]
      });
    }
    
    return days;
  }, [currentYear, currentMonthNumber, currentWeek]);

  // Filtrer les rendez-vous pour la semaine avec données réelles
  const filteredAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];
    
    return appointments.filter((apt: Appointment) => {
      // Vérifier que l'appointment a les bonnes propriétés
      if (!apt.appointmentDate) return false;
      
      // Convertir la date en format ISO si nécessaire
      let appointmentDate = apt.appointmentDate;
      if (typeof appointmentDate === 'string' && !appointmentDate.includes('T')) {
        // Si c'est juste une date (YYYY-MM-DD), l'utiliser directement
        appointmentDate = appointmentDate.split('T')[0];
      } else if (appointmentDate && typeof appointmentDate === 'object' && 'toISOString' in appointmentDate) {
        appointmentDate = (appointmentDate as Date).toISOString().split('T')[0];
      }
      
      return currentWeek.includes(appointmentDate);
    });
  }, [appointments, currentWeek]);

  // Statistiques des rendez-vous
  const appointmentStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter((apt: Appointment) => apt.appointmentDate === today);
    const weekAppointments = filteredAppointments;
    const monthAppointments = appointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.getMonth() === currentMonthNumber && aptDate.getFullYear() === currentYear;
    });

    return {
      today: todayAppointments.length,
      week: weekAppointments.length,
      month: monthAppointments.length,
      total: appointments.length
    };
  }, [appointments, filteredAppointments, currentMonthNumber, currentYear]);

  // Générer les créneaux horaires optimisés pour la vue jour
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Vue jour avec grille horaire détaillée
  const renderDayView = () => {
    const selectedDay = selectedDate.toISOString().split('T')[0];
    const dayAppointments = appointments.filter((apt: Appointment) => {
      const aptDate = apt.appointmentDate;
      if (typeof aptDate === 'string') {
        return aptDate.split('T')[0] === selectedDay;
      }
      return aptDate === selectedDay;
    });

    // Fonction pour calculer la durée d'un rendez-vous en créneaux
    const getAppointmentDuration = (startTime: string, endTime: string) => {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return Math.ceil(diffMinutes / 30); // Nombre de créneaux de 30min
    };

    // Fonction pour vérifier si un créneau est disponible
    const isTimeSlotAvailable = (time: string) => {
      return !dayAppointments.some(apt => {
        const startTime = apt.startTime;
        const endTime = apt.endTime;
        const duration = getAppointmentDuration(startTime, endTime);
        
        // Vérifier si le créneau est dans la plage du rendez-vous
        const aptStart = new Date(`2000-01-01T${startTime}`);
        const aptEnd = new Date(`2000-01-01T${endTime}`);
        const currentTime = new Date(`2000-01-01T${time}`);
        
        return currentTime >= aptStart && currentTime < aptEnd;
      });
    };

    // Fonction pour obtenir le rendez-vous qui occupe un créneau
    const getAppointmentForTimeSlot = (time: string) => {
      return dayAppointments.find(apt => {
        const startTime = apt.startTime;
        const endTime = apt.endTime;
        
        const aptStart = new Date(`2000-01-01T${startTime}`);
        const aptEnd = new Date(`2000-01-01T${endTime}`);
        const currentTime = new Date(`2000-01-01T${time}`);
        
        return currentTime >= aptStart && currentTime < aptEnd;
      });
    };
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Header du jour avec navigation */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          {/* Navigation jour */}
          <div className="flex items-center justify-between mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevDay = new Date(selectedDate);
                  prevDay.setDate(selectedDate.getDate() - 1);
                  setSelectedDate(prevDay);
                }}
                className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Jour précédent
              </Button>
            </motion.div>
            <div className="text-center cursor-pointer" onClick={goToToday}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              <p className="text-sm text-gray-500">
                Fuseau horaire: {salonTimezone}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextDay = new Date(selectedDate);
                  nextDay.setDate(selectedDate.getDate() + 1);
                  setSelectedDate(nextDay);
                }}
                className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
              >
                Jour suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
          
          {/* Informations et actions */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {dayAppointments.length} rendez-vous
                {dayAppointments.length > 0 && (
                  <span className="ml-2 text-purple-600 font-medium">
                    • {dayAppointments.filter(apt => apt.status === 'confirmed').length} confirmés
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau RDV
            </Button>
          </div>
        </div>

        {/* Grille horaire du jour - Vue complète sans scroll */}
        <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
          {timeSlots.map((time, index) => {
            const appointment = getAppointmentForTimeSlot(time);
            const isAvailable = isTimeSlotAvailable(time);
            const isStartTime = appointment && appointment.startTime === time;
            
            // Calculer la hauteur du bloc de rendez-vous
            const getAppointmentBlockHeight = (apt: Appointment) => {
              const start = new Date(`2000-01-01T${apt.startTime}`);
              const end = new Date(`2000-01-01T${apt.endTime}`);
              const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
              return Math.ceil(diffMinutes / 30) * 60; // Hauteur en pixels (60px par créneau)
            };
            
            return (
              <motion.div 
                key={time} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className={`grid grid-cols-12 gap-4 border-b border-gray-100 min-h-[60px] hover:bg-gray-50 transition-colors p-3 relative ${
                  appointment ? 'bg-blue-50' : ''
                }`}
              >
                <div className="col-span-2 text-sm text-gray-500 flex items-center justify-end pr-4 font-medium">
                  {time}
                </div>
                <div className="col-span-10 flex items-center relative">
                  {appointment && isStartTime ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-2 rounded-lg cursor-pointer transition-all duration-200 w-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-500 text-white' 
                          : appointment.status === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : appointment.status === 'cancelled'
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white'
                      }`}
                      style={{
                        height: `${getAppointmentBlockHeight(appointment)}px`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10
                      }}
                      onClick={() => handleEventClick(appointment)}
                    >
                      <div className="font-medium text-sm">{appointment.client?.name || appointment.clientName || 'Client'}</div>
                      <div className="text-white/80 text-xs">{appointment.service?.name || appointment.serviceName || 'Service'}</div>
                      <div className="text-white/80 text-xs">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </motion.div>
                  ) : appointment ? (
                    <div className="w-full h-full flex items-center opacity-0">
                      {/* Créneau occupé mais pas le début - invisible pour éviter la duplication */}
                    </div>
                  ) : (
                    <div 
                      className={`text-sm p-2 rounded transition-colors ${
                        isAvailable 
                          ? 'cursor-pointer hover:bg-gray-100 text-green-600 italic hover:text-green-700' 
                          : 'cursor-not-allowed text-red-500 bg-red-50'
                      }`}
                      onClick={() => {
                        if (isAvailable) {
                          handleTimeSlotClick(selectedDay, time);
                        }
                      }}
                    >
                      {isAvailable ? 'Libre - Cliquez pour réserver' : 'Occupé - Cliquez pour voir les détails'}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Vue semaine avec interface Chronicle améliorée
  const renderWeekView = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Header avec jours de la semaine et navigation */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          {/* Navigation semaine */}
          <div className="flex items-center justify-between mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Semaine précédente
              </Button>
            </motion.div>
            <div className="text-center cursor-pointer" onClick={goToToday}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              <p className="text-sm text-gray-500">Semaine du {currentWeek[0]} au {currentWeek[6]}</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
              >
                Semaine suivante
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
          
          {/* Grille des jours */}
          <div className="grid grid-cols-8 gap-2">
            <div className="text-sm font-medium text-gray-600">Heure</div>
            {currentWeek.map((date, index) => {
              const dayDate = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
              
              return (
                <motion.div 
                  key={date} 
                  className="text-center cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setSelectedDate(dayDate);
                    setViewMode('day');
                  }}
                >
                  <div className={`text-sm font-medium ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                    {dayDate.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-gray-700'}`}>
                    {dayDate.getDate()}
                  </div>
                  {dayAppointments.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs text-gray-500 mt-1"
                    >
                      {dayAppointments.length} RDV
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Grille horaire avec scroll optimisé - Responsive */}
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <AnimatePresence>
            {timeSlots.map((time, index) => (
              <motion.div 
                key={time} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className="grid grid-cols-8 gap-1 sm:gap-2 border-b border-gray-100 min-h-[50px] hover:bg-gray-50 transition-colors"
              >
                <div className="text-xs sm:text-sm text-gray-500 p-1 sm:p-2 flex items-center justify-end pr-2 sm:pr-4 font-medium">
                  {time}
                </div>
                {currentWeek.map((date) => {
                  const dayAppointments = filteredAppointments.filter((apt: Appointment) => {
                    if (apt.appointmentDate !== date) return false;
                    
                    // Afficher seulement au créneau de début pour éviter la duplication
                    return apt.startTime === time;
                  });
                  
                  return (
                    <div 
                      key={`${date}-${time}`} 
                      className="border-r border-gray-100 p-0.5 sm:p-1 relative group cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleTimeSlotClick(date, time)}
                    >
                      {dayAppointments.map((appointment: Appointment) => {
                        // Calculer la hauteur du bloc de rendez-vous pour la vue semaine
                        const getAppointmentBlockHeight = (apt: Appointment) => {
                          const start = new Date(`2000-01-01T${apt.startTime}`);
                          const end = new Date(`2000-01-01T${apt.endTime}`);
                          const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
                          return Math.ceil(diffMinutes / 30) * 50; // Hauteur en pixels (50px par créneau)
                        };
                        
                        return (
                          <motion.div
                            key={appointment.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ 
                              scale: 1.02, 
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              zIndex: 10
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-500 text-white' 
                                : appointment.status === 'pending'
                                  ? 'bg-yellow-500 text-white'
                                  : appointment.status === 'cancelled'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-blue-500 text-white'
                            } text-xs p-1 sm:p-2 rounded cursor-pointer transition-all duration-200 w-full ${
                              hoveredEvent === appointment.id ? 'ring-2 ring-blue-300' : ''
                            }`}
                            style={{
                              height: `${getAppointmentBlockHeight(appointment)}px`,
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              zIndex: 10
                            }}
                            onClick={() => handleEventClick(appointment)}
                            onMouseEnter={() => handleEventHover(appointment.id.toString())}
                            onMouseLeave={() => handleEventHover(null)}
                          >
                            <div className="font-medium truncate text-xs sm:text-sm">{appointment.client?.name || 'Client'}</div>
                            <div className="text-white/80 truncate text-xs">{appointment.service?.name || 'Service'}</div>
                            <div className="text-white/80 text-xs">{appointment.startTime} - {appointment.endTime}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // Vue mois avec calendrier complet
  const renderMonthView = () => {
    const monthStart = new Date(currentYear, currentMonthNumber, 1);
    const monthEnd = new Date(currentYear, currentMonthNumber + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Commencer le lundi
    
    const monthDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      monthDays.push(date);
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Header du mois */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="grid grid-cols-7 gap-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
              <div key={day} className="text-sm font-medium text-gray-600 text-center py-2">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Grille du mois - Responsive */}
        <div className="grid grid-cols-7 gap-1 p-2 sm:p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {monthDays.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === currentMonthNumber;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayAppointments = filteredAppointments.filter(apt => apt.appointmentDate === dateStr);
            
            return (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                whileHover={{ scale: 1.05 }}
                className={`min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 ${
                  isToday 
                    ? 'bg-purple-600 text-white' 
                    : isCurrentMonth 
                      ? 'bg-white hover:bg-gray-50' 
                      : 'bg-gray-50 text-gray-400'
                }`}
                onClick={() => {
                  setSelectedDate(new Date(date));
                  // Changer automatiquement en vue jour quand on clique sur une date
                  setViewMode('day');
                }}
              >
                <div className={`text-xs sm:text-sm font-medium ${isToday ? 'text-white' : 'text-gray-700'}`}>
                  {date.getDate()}
                </div>
                {dayAppointments.length > 0 && (
                  <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`text-xs p-0.5 sm:p-1 rounded truncate ${
                          isToday 
                            ? 'bg-white text-purple-600' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {appointment.client?.name || 'Client'}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 2} autres
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProHeader currentPage="planning" />
      
        <div className="pt-20 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar gauche - Style Chronicle - Responsive */}
            <div className="w-full lg:w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 h-fit lg:sticky lg:top-20 order-2 lg:order-1">
              {/* Mini-calendrier avec vraies dates */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{currentMonth}</h3>
                  <div className="flex gap-1">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                        className="h-6 w-6 p-0 hover:bg-purple-50"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                        className="h-6 w-6 p-0 hover:bg-purple-50"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {monthDays.map((dayData, index) => {
                    const isSelected = dayData.date === selectedDate.toISOString().split('T')[0];
                    
                    return (
                      <motion.div
                        key={`${dayData.date}-${index}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-sm py-2 cursor-pointer rounded-full transition-all duration-200 ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold' 
                            : dayData.isToday 
                              ? 'bg-purple-100 text-purple-600 font-medium' 
                              : dayData.isCurrentMonth 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedDate(new Date(dayData.date));
                          // Changer automatiquement en vue jour quand on clique sur une date
                          setViewMode('day');
                        }}
                      >
                        {dayData.day}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Statistiques des rendez-vous */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-700">Aujourd'hui</span>
                    <span className="text-sm font-semibold text-purple-600">{appointmentStats.today}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Cette semaine</span>
                    <span className="text-sm font-semibold text-blue-600">{appointmentStats.week}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Ce mois</span>
                    <span className="text-sm font-semibold text-green-600">{appointmentStats.month}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Total</span>
                    <span className="text-sm font-semibold text-gray-600">{appointmentStats.total}</span>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Actions rapides</h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau RDV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={goToToday}
                    className="w-full text-sm"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Aujourd'hui
                  </Button>
                </div>
              </div>

              {/* Filtres par statut */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Filtres</h4>
                <div className="space-y-2">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = appointments.filter(apt => apt.status === status).length;
                    return (
                      <div key={status} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <config.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{config.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contenu principal - Responsive */}
            <div className="flex-1 order-1 lg:order-2">
              {/* Header avec navigation améliorée */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateWeek('prev')}
                        className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.h2 
                      key={selectedDate.toISOString()}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl lg:text-2xl font-bold text-gray-900"
                    >
                      {currentMonth}
                    </motion.h2>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateWeek('next')}
                        className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                        className="transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        Aujourd'hui
                      </Button>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {(['day', 'week', 'month'] as const).map((mode) => (
                      <motion.div
                        key={mode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={viewMode === mode ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode(mode)}
                          className={`transition-all duration-200 text-sm ${
                            viewMode === mode 
                              ? 'bg-purple-600 hover:bg-purple-700' 
                              : 'hover:bg-purple-50 hover:border-purple-300'
                          }`}
                        >
                          {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Calendrier principal avec vues dynamiques */}
              {appointmentsLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des rendez-vous...</p>
                  </div>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  {viewMode === 'day' && (
                    <motion.div
                      key="day"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderDayView()}
                    </motion.div>
                  )}
                  {viewMode === 'week' && (
                    <motion.div
                      key="week"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderWeekView()}
                    </motion.div>
                  )}
                  {viewMode === 'month' && (
                    <motion.div
                      key="month"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderMonthView()}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog pour créer un rendez-vous avec animations */}
      <Dialog open={isDialogOpen || isDetailDialogOpen} onOpenChange={(open) => {
        if (!open) {
          if (isDetailDialogOpen) {
            setIsDetailDialogOpen(false);
            setSelectedEvent(null);
          } else if (isDialogOpen) {
            setIsDialogOpen(false);
            setClickedTimeSlot(null);
            form.reset();
          }
        }
      }}>
        <DialogContent className="max-w-md">
          {isDetailDialogOpen && selectedEvent ? (
            // Affichage des détails du rendez-vous
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Détails du Rendez-vous
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Informations complètes sur le rendez-vous.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4 text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Client</p>
                    <p className="text-base">{selectedEvent.client?.name || selectedEvent.clientName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service</p>
                    <p className="text-base">{selectedEvent.service?.name || selectedEvent.serviceName || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base">{new Date(selectedEvent.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Heure</p>
                    <p className="text-base">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <div className="mt-1">
                    {selectedEvent.status === 'confirmed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmé
                      </span>
                    )}
                    {selectedEvent.status === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En attente
                      </span>
                    )}
                    {selectedEvent.status === 'cancelled' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Annulé
                      </span>
                    )}
                    {selectedEvent.status === 'completed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Terminé
                      </span>
                    )}
                  </div>
                </div>
                {selectedEvent.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-base text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{selectedEvent.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => setIsDetailDialogOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Fermer
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            // Formulaire de création de rendez-vous
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Nouveau rendez-vous
                </DialogTitle>
              </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Client</FormLabel>
                        <Select onValueChange={(value) => {
                          if (value === 'new-client') {
                            setShowNewClientForm(true);
                          } else {
                            field.onChange(value);
                          }
                        }} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500">
                              <SelectValue placeholder="Sélectionner un client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(clients as Client[]).map((client: Client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="new-client" className="text-purple-600 font-medium">
                              + Nouveau client
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Formulaire nouveau client */}
                {showNewClientForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <h4 className="text-sm font-medium text-purple-900 mb-3">Nouveau client</h4>
                    <div className="space-y-3">
                      <Input
                        placeholder="Nom du client"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Email (optionnel)"
                        type="email"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Téléphone (optionnel)"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (newClientName.trim()) {
                              createClientMutation.mutate({
                                name: newClientName.trim(),
                                email: newClientEmail.trim(),
                                phone: newClientPhone.trim()
                              });
                            }
                          }}
                          disabled={!newClientName.trim() || createClientMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                        >
                          {createClientMutation.isPending ? 'Création...' : 'Créer'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowNewClientForm(false);
                            setNewClientName('');
                            setNewClientEmail('');
                            setNewClientPhone('');
                          }}
                          className="text-sm"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Service</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500">
                              <SelectValue placeholder="Sélectionner un service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(services as Service[]).map((service: Service) => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Début</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700">Fin</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200" 
                    disabled={createMutation.isPending || isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    {isLoading ? 'Création...' : 'Créer le rendez-vous'}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails d'un événement avec animations */}
      <AnimatePresence>
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <User className="w-5 h-5 text-purple-600" />
                      {selectedEvent.client?.name || 'Client'}
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="ghost" size="sm" className="hover:bg-purple-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </DialogTitle>
                </DialogHeader>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    {new Date(selectedEvent.appointmentDate).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-purple-600" />
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    {selectedEvent.service?.name || 'Service'}
                  </div>
                  {selectedEvent.notes && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg"
                    >
                      <strong>Notes :</strong> {selectedEvent.notes}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}