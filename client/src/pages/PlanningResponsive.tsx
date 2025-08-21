import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Plus, Euro, Target, TrendingUp, Clock, User, Palette, X } from "lucide-react";
import { motion } from "framer-motion";
import { MobileBottomNav } from "@/components/MobileBottomNav";
// import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

// Types simplifiés pour éviter les erreurs

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
  clientName: string;
  service: string;
  employee: string;
  date: string;
  time: string;
  endTime?: string;
  duration: number;
  notes: string;
  type: 'client' | 'blocked';
};

type BlockTimeState = {
  clientName: string;
  service: string;
  employee: string;
  date: string;
  time: string;
  endTime?: string;
  duration: number;
  notes: string;
  type: string;
};

// Suppression temporaire du schema pour corriger l'erreur

const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Générer les heures de 06h00 à 23h00 par tranches de 5min
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Employés du salon
const employees: Employee[] = [
  { 
    id: "1", 
    name: "Sarah Martin", 
    color: "#8B5CF6", 
    avatar: "SM",
    specialties: ["Coupe", "Coloration", "Lissage"]
  },
  { 
    id: "2", 
    name: "Emma Dubois", 
    color: "#06B6D4", 
    avatar: "ED",
    specialties: ["Manucure", "Pédicure", "Nail Art"]
  },
  { 
    id: "3", 
    name: "Julie Moreau", 
    color: "#F59E0B", 
    avatar: "JM",
    specialties: ["Soins visage", "Épilation", "Massage"]
  },
  { 
    id: "4", 
    name: "Léa Bernard", 
    color: "#EF4444", 
    avatar: "LB",
    specialties: ["Extensions", "Tresses", "Coiffure mariée"]
  }
];

// Clients existants pour l'autocomplétion
const existingClients = [
  { id: 1, name: "Sophie Martin", phone: "06 12 34 56 78", email: "sophie.martin@email.com", lastVisit: "2024-08-15" },
  { id: 2, name: "Emma Dubois", phone: "06 23 45 67 89", email: "emma.dubois@email.com", lastVisit: "2024-08-18" },
  { id: 3, name: "Julie Laurent", phone: "06 34 56 78 90", email: "julie.laurent@email.com", lastVisit: "2024-08-10" },
  { id: 4, name: "Marie Dupont", phone: "06 45 67 89 01", email: "marie.dupont@email.com", lastVisit: "2024-08-12" },
  { id: 5, name: "Claire Moreau", phone: "06 56 78 90 12", email: "claire.moreau@email.com", lastVisit: "2024-08-19" },
  { id: 6, name: "Léa Bernard", phone: "06 67 89 01 23", email: "lea.bernard@email.com", lastVisit: "2024-08-14" },
  { id: 7, name: "Camille Rousseau", phone: "06 78 90 12 34", email: "camille.rousseau@email.com", lastVisit: "2024-08-16" },
  { id: 8, name: "Manon Petit", phone: "06 89 01 23 45", email: "manon.petit@email.com", lastVisit: "2024-08-17" },
  { id: 9, name: "Alice Roux", phone: "06 90 12 34 56", email: "alice.roux@email.com", lastVisit: "2024-08-13" },
  { id: 10, name: "Lucie Simon", phone: "06 01 23 45 67", email: "lucie.simon@email.com", lastVisit: "2024-08-11" }
];

// Services beauté
const beautyServices: ServiceType[] = [
  { id: 1, name: "Coupe + Brushing", category: "Coiffure", duration: 60, price: 45, color: "#8B5CF6" },
  { id: 2, name: "Coloration", category: "Coiffure", duration: 120, price: 85, color: "#7C3AED" },
  { id: 3, name: "Balayage", category: "Coiffure", duration: 180, price: 120, color: "#6366F1" },
  { id: 4, name: "Manucure", category: "Ongles", duration: 45, price: 25, color: "#06B6D4" },
  { id: 5, name: "Pédicure", category: "Ongles", duration: 60, price: 35, color: "#0891B2" },
  { id: 6, name: "Pose Vernis Semi", category: "Ongles", duration: 30, price: 20, color: "#0E7490" },
  { id: 7, name: "Soin Visage", category: "Esthétique", duration: 90, price: 65, color: "#F59E0B" },
  { id: 8, name: "Épilation Sourcils", category: "Esthétique", duration: 15, price: 15, color: "#D97706" },
  { id: 9, name: "Extensions", category: "Coiffure", duration: 240, price: 200, color: "#EF4444" },
  { id: 10, name: "Lissage Brésilien", category: "Coiffure", duration: 180, price: 150, color: "#DC2626" }
];

export default function PlanningResponsive() {
  const isMobile = useIsMobile();
  // Variables simplifiées sans dépendances externes problématiques

  // États pour la navigation
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  
  // États pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // États pour les popups
  const [isActionChoiceOpen, setIsActionChoiceOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{time: string, date: Date} | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    clientName: '',
    service: '',
    employee: '',
    date: '',
    time: '',
    duration: 60,
    notes: '',
    type: 'client' // 'client' ou 'blocked'
  });
  const [blockReason, setBlockReason] = useState('');
  
  // États pour l'autocomplétion des clients
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);

  // Suppression des fonctions non utilisées pour corriger les erreurs

  // Rendez-vous d'exemple pour démonstration avec différents statuts
  const currentHour = new Date().getHours();
  
  const sampleAppointmentsMobile = [
    {
      id: 1,
      serviceName: "Coupe + Brushing",
      clientName: "Sophie Martin",
      startTime: "08:00",
      endTime: "09:00", 
      status: "confirmed",
      date: new Date(),
    },
    {
      id: 2, 
      serviceName: "Coloration",
      clientName: "Emma Dubois",
      startTime: String(Math.max(8, currentHour - 1)).padStart(2, '0') + ":00",
      endTime: String(Math.min(20, currentHour + 1)).padStart(2, '0') + ":00",
      status: "confirmed",
      date: new Date(),
    },
    {
      id: 3,
      serviceName: "Manucure",
      clientName: "Julie Laurent", 
      startTime: String(Math.min(18, currentHour + 2)).padStart(2, '0') + ":00",
      endTime: String(Math.min(19, currentHour + 3)).padStart(2, '0') + ":00",
      status: "pending",
      date: new Date(),
    }
  ];

  // Fonction pour récupérer les RDV d'une date
  const getAppointmentsForDate = (date: Date) => {
    return sampleAppointmentsMobile.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  // Fonction pour vérifier si un RDV est en cours
  const isAppointmentCurrent = (appointment: any) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= appointment.startTime && currentTime <= appointment.endTime;
  };

  // Fonction pour vérifier si un RDV est terminé
  const isAppointmentFinished = (appointment: any) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime > appointment.endTime;
  };

  // Fonction pour gérer le clic sur un créneau
  const handleTimeSlotClick = (timeSlot: string, date: Date) => {
    setSelectedTimeSlot({ time: timeSlot, date });
    setIsActionChoiceOpen(true);
  };

  // Fonction pour filtrer les clients selon la recherche
  const handleClientSearch = (searchTerm: string) => {
    setClientSearchTerm(searchTerm);
    setNewAppointment({...newAppointment, clientName: searchTerm});
    
    if (searchTerm.length > 0) {
      const filtered = existingClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowClientSuggestions(filtered.length > 0);
    } else {
      setFilteredClients([]);
      setShowClientSuggestions(false);
    }
  };

  // Fonction pour sélectionner un client suggéré
  const handleSelectClient = (client: any) => {
    setNewAppointment({...newAppointment, clientName: client.name});
    setClientSearchTerm(client.name);
    setShowClientSuggestions(false);
  };

  // Fonction pour créer un nouveau RDV client
  const handleNewAppointment = (timeSlot?: string, date?: Date) => {
    setNewAppointment({
      clientName: '',
      service: '',
      employee: selectedEmployee === 'all' ? '' : selectedEmployee,
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: timeSlot || '08:00',
      duration: 60,
      notes: '',
      type: 'client'
    });
    setClientSearchTerm('');
    setShowClientSuggestions(false);
    setIsNewAppointmentOpen(true);
    setIsActionChoiceOpen(false);
  };

  // Fonction pour bloquer un créneau
  const handleBlockTime = (timeSlot?: string, date?: Date) => {
    setNewAppointment({
      clientName: '',
      service: '',
      employee: selectedEmployee === 'all' ? '' : selectedEmployee,
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: timeSlot || '08:00',
      duration: 60,
      notes: '',
      type: 'blocked'
    });
    setBlockReason('');
    setIsBlockTimeOpen(true);
    setIsActionChoiceOpen(false);
  };

  // Fonction pour sauvegarder le nouveau RDV
  const handleSaveAppointment = () => {
    console.log("Nouveau RDV créé:", newAppointment);
    // Ici on ajouterait la logique pour sauvegarder en base
    setIsNewAppointmentOpen(false);
    resetAppointmentForm();
  };

  // Fonction pour sauvegarder le blocage de créneau
  const handleSaveBlockTime = () => {
    const blockedSlot = {
      ...newAppointment,
      type: 'blocked',
      title: newAppointment.clientName || 'BLOQUÉ',
      client: newAppointment.clientName || 'Créneau bloqué',
      service: blockReason || 'Créneau bloqué',
      notes: blockReason
    };
    console.log("Créneau bloqué:", blockedSlot);
    // Ici on ajouterait la logique pour sauvegarder en base
    setIsBlockTimeOpen(false);
    resetAppointmentForm();
  };

  // Fonction pour réinitialiser le formulaire
  const resetAppointmentForm = () => {
    setNewAppointment({
      clientName: '',
      service: '',
      employee: '',
      date: '',
      time: '',
      duration: 60,
      notes: '',
      type: 'client'
    });
    setBlockReason('');
    setSelectedTimeSlot(null);
  };

  // Calcul des données calendrier
  const { currentWeek, currentMonth, monthDays } = useMemo(() => {
    if (viewMode === 'week') {
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
        monthDays: [],
      };
    } else {
      const firstDay = new Date(selectedYear, selectedMonth, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const monthDays = [];
      for (let i = 0; i < 42; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        monthDays.push(day);
      }
      
      return {
        currentWeek: [],
        currentMonth: firstDay.toLocaleDateString('fr-FR', { month: 'long' }),
        monthDays,
      };
    }
  }, [currentWeekOffset, viewMode, selectedMonth, selectedYear]);

  // Rendez-vous simulés avec types
  const beautySampleEvents = [
    { 
      id: 1, 
      title: "Coupe + Brushing", 
      client: "Marie Durand",
      time: "09:00-10:00", 
      serviceId: 1,
      employeeId: "1",
      status: "confirmed",
      notes: "Première visite",
      type: "client"
    },
    { 
      id: 2, 
      title: "Coloration", 
      client: "Sophie Laurent",
      time: "10:30-12:30", 
      serviceId: 2,
      employeeId: "1",
      status: "confirmed",
      notes: "Châtain clair",
      type: "client"
    },
    { 
      id: 3, 
      title: "Manucure", 
      client: "Claire Moreau",
      time: "10:00-10:45", 
      serviceId: 4,
      employeeId: "2",
      status: "scheduled",
      notes: "French manucure",
      type: "client"
    },
    { 
      id: 4, 
      title: "Soin Visage", 
      client: "Lucie Bernard",
      time: "14:00-15:30", 
      serviceId: 7,
      employeeId: "3",
      status: "confirmed",
      notes: "Peau sensible",
      type: "client"
    },
    // Exemples de créneaux bloqués
    { 
      id: 5, 
      title: "BLOQUÉ", 
      client: "Pause déjeuner",
      time: "12:00-13:00", 
      serviceId: null,
      employeeId: "1",
      status: "blocked",
      notes: "Pause déjeuner",
      type: "blocked"
    },
    { 
      id: 6, 
      title: "BLOQUÉ", 
      client: "Formation",
      time: "16:00-17:00", 
      serviceId: null,
      employeeId: "2",
      status: "blocked",
      notes: "Formation produits",
      type: "blocked"
    }
  ];

  // Fonction supprimée car non utilisée

  // Fonction supprimée car dupliquée avec version plus haut

  // Fonction supprimée car dupliquée plus haut

  // Fonction supprimée car dupliquée plus haut

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative">
      {/* Sidebar Desktop uniquement */}
      <div className="hidden lg:flex lg:w-20 fixed left-0 top-0 h-full bg-slate-50/80 backdrop-blur-16 border-r border-slate-400/20"></div>
      
      {/* Contenu principal */}
      <div className={`flex-1 relative ${isMobile ? 'max-w-md mx-auto pb-20' : 'lg:ml-20 lg:max-w-none lg:w-full lg:pb-0'}`}>
        <MobileBottomNav userType="pro" />
        {/* Version Mobile - Interface propre */}
        <div className="lg:hidden w-full min-h-screen bg-gray-50">
        {/* Header mobile simple */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-center text-gray-900">Planning</h1>
        </div>



        {/* Navigation respectant la DA - Minimaliste et épuré */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
                setSelectedMonth(newMonth);
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-lg font-medium text-gray-900">
              {new Date(selectedYear, selectedMonth).toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
                setSelectedMonth(newMonth);
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-base font-medium text-gray-900 capitalize">
              {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </h3>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => handleNewAppointment()} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>



        {/* PLUS DE CALENDRIER SIDEBAR - SUPPRIMÉ */}

        {/* Grille horaire complète 6h-23h */}
        <div className="bg-white pb-24">
          <div className="relative">
            {/* Ligne violette d'heure actuelle */}
            {(() => {
              const now = new Date();
              const currentHour = now.getHours();
              const currentMinutes = now.getMinutes();
              const isToday = selectedDate.toDateString() === now.toDateString();
              
              if (isToday && currentHour >= 6 && currentHour <= 23) {
                const topPosition = ((currentHour - 6) * 60 + currentMinutes) * (60 / 60); // 60px par heure
                return (
                  <div 
                    className="absolute left-0 right-0 z-20 flex items-center px-4" 
                    style={{ top: `${topPosition + 40}px` }}
                  >
                    <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="flex-1 h-0.5 bg-purple-500 ml-2"></div>
                    <div className="text-xs font-medium text-purple-600 ml-2 bg-white px-2 py-1 rounded shadow border border-purple-200">
                      {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Grille des heures */}
            {Array.from({ length: 18 }, (_, i) => {
              const hour = i + 6; // De 6h à 23h
              const hourStr = `${hour.toString().padStart(2, '0')}:00`;
              const appointments = getAppointmentsForDate(selectedDate).filter(apt => 
                parseInt(apt.startTime?.split(':')[0] || '0') === hour
              );
              
              return (
                <div key={hour} className="border-b border-gray-100 relative">
                  {/* Ligne d'heure */}
                  <div className="flex items-start p-4 min-h-[60px]">
                    {/* Heure */}
                    <div className="w-16 text-sm font-medium text-gray-600 pt-1">
                      {hourStr}
                    </div>
                    
                    {/* Zone cliquable pour ajouter RDV ou bloquer créneau */}
                    <div 
                      className="flex-1 min-h-[40px] cursor-pointer rounded-lg transition-all hover:bg-purple-50 border border-transparent hover:border-purple-200 p-2"
                      onClick={() => {
                        console.log(`📱 Mobile - Clic sur créneau: ${hourStr}`);
                        handleTimeSlotClick(hourStr, selectedDate);
                      }}
                    >
                      {/* RDV existants pour cette heure */}
                      {appointments.map((appointment, index) => {
                        const isCurrentAppointment = isAppointmentCurrent(appointment);
                        const isFinishedAppointment = isAppointmentFinished(appointment);
                        
                        return (
                          <div 
                            key={index} 
                            className={`mb-2 p-3 rounded-lg border-l-4 ${
                              isCurrentAppointment 
                                ? 'bg-purple-100 border-purple-500 animate-pulse shadow-lg' 
                                : isFinishedAppointment
                                  ? 'bg-green-50 border-green-500'
                                  : 'bg-gray-50 border-gray-400'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-gray-900 text-sm">{appointment.serviceName}</h4>
                              <span className="text-xs text-gray-500">
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{appointment.clientName}</p>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                              isCurrentAppointment
                                ? 'bg-purple-200 text-purple-800'
                                : isFinishedAppointment
                                  ? 'bg-green-200 text-green-800'
                                  : appointment.status === 'confirmed' 
                                    ? 'bg-gray-200 text-gray-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {isCurrentAppointment ? 'En cours' : isFinishedAppointment ? 'Terminé' : appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Zone vide cliquable */}
                      {appointments.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Cliquer pour ajouter un RDV
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Interface de création de créneaux mobile */}
        <div className="bg-white p-4 space-y-2">
          {Array.from({ length: 12 }, (_, i) => {
            const hour = 8 + i;
            const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
            const dayEvents = beautySampleEvents.filter(() => Math.random() > 0.7);
            const eventsAtThisTime = dayEvents.filter(event => event.time.startsWith(timeSlot));
            const hasClientEvent = eventsAtThisTime.some(event => event.type === 'client');
            
            return (
              <div key={`mobile-slot-${hour}`} className="relative min-h-[60px] border border-gray-200 rounded-lg">
                {/* Heure */}
                <div className="absolute left-3 top-3 text-sm font-medium text-gray-600">
                  {timeSlot}
                </div>
                
                {/* Zone cliquable si pas de RDV client */}
                {!hasClientEvent && eventsAtThisTime.length === 0 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => {
                      console.log(`📱 Mobile - Clic sur créneau: ${timeSlot}`);
                      handleTimeSlotClick(timeSlot, selectedDate);
                    }}
                  >
                    <Plus className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Ajouter</span>
                  </div>
                )}
                
                {/* Événements existants */}
                <div className="pl-16 pr-3 py-3 space-y-1">
                  {eventsAtThisTime.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`p-2 rounded border-l-4 ${
                        event.type === 'blocked' 
                          ? 'bg-orange-50 border-orange-400 border-dashed'
                          : 'bg-white border-l-purple-400'
                      }`}
                    >
                      <div className={`text-sm font-medium ${event.type === 'blocked' ? 'text-orange-700' : 'text-gray-900'}`}>
                        {event.title}
                      </div>
                      <div className={`text-xs ${event.type === 'blocked' ? 'text-orange-600' : 'text-gray-600'}`}>
                        {event.client}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation mobile - Barre en bas REMISE */}

      </div>

      {/* Version Desktop - Fonctionnelle avec vues dynamiques */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20"
           style={{ width: '100%', height: '100vh' }}>
        <div className="container mx-auto p-6">
          {/* Header avec insights */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Insights CA au-dessus */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">CA Jour</p>
                      <p className="text-2xl font-bold text-purple-600">1847€</p>
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
                      <p className="text-2xl font-bold text-blue-600">8392€</p>
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
                      <p className="text-2xl font-bold text-amber-600">28450€</p>
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
                      <p className="text-2xl font-bold text-green-600">67€</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Header du calendrier */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">Planning</h1>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium text-gray-700 px-4">
                    {viewMode === 'month' 
                      ? new Date(selectedYear, selectedMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                      : currentMonth + ' ' + new Date().getFullYear()
                    }
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sélecteur de vue */}
                <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semaine</SelectItem>
                    <SelectItem value="month">Mois</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sélecteur d'employé */}
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les employés</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: employee.color }}
                          />
                          <span>{employee.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={() => handleNewAppointment()} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau RDV
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Vue Semaine */}
          {viewMode === 'week' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6"
            >
              <div className="grid grid-cols-8 gap-4">
                {/* Colonne des heures */}
                <div className="space-y-16 pt-12">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="text-sm text-gray-500 text-right">
                      {String(8 + i).padStart(2, '0')}:00
                    </div>
                  ))}
                </div>

                {/* Colonnes des jours */}
                {currentWeek.map((day, dayIndex) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayEvents = beautySampleEvents.filter(() => Math.random() > 0.7);

                  return (
                    <div key={dayIndex} className="space-y-2">
                      {/* En-tête du jour */}
                      <div className={`text-center p-3 rounded-lg ${
                        isToday ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        <div className="text-xs font-medium">
                          {weekDays[day.getDay()]}
                        </div>
                        <div className={`text-lg font-bold ${isToday ? 'text-purple-700' : 'text-gray-900'}`}>
                          {day.getDate()}
                        </div>
                      </div>

                      {/* Événements de la journée avec créneaux cliquables */}
                      <div className="space-y-2 min-h-[600px] relative">
                        {/* Créneaux horaires cliquables toutes les heures */}
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = 8 + i;
                          const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                          const eventsAtThisTime = dayEvents.filter(event => event.time.startsWith(timeSlot));
                          const hasClientEvent = eventsAtThisTime.some(event => event.type === 'client');
                          const hasBlockedEvent = eventsAtThisTime.some(event => event.type === 'blocked');
                          
                          return (
                            <div key={`slot-${hour}`} className="relative h-16 mb-2">
                              {/* Zone cliquable seulement s'il n'y a pas de RDV client */}
                              {!hasClientEvent && (
                                <div
                                  className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors flex items-center justify-center text-gray-400 hover:text-purple-600"
                                  onClick={() => {
                                    console.log(`🕒 Clic sur le créneau: ${timeSlot}`);
                                    handleTimeSlotClick(timeSlot, day);
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </div>
                              )}
                              
                              {/* Événements existants à cette heure - superposition possible */}
                              {eventsAtThisTime.map((event, eventIndex) => {
                                let eventColor = '#8B5CF6';
                                let eventStyle = {};
                                let eventClass = "absolute p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer";
                                
                                if (event.type === 'blocked') {
                                  // Créneau bloqué - style orange avec transparence
                                  eventColor = '#F59E0B';
                                  eventStyle = { 
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                    borderLeft: '4px solid #F59E0B',
                                    border: '1px dashed #F59E0B'
                                  };
                                  eventClass += " z-10"; // Au-dessus des autres
                                } else {
                                  // RDV client - style normal
                                  const service = beautyServices.find(s => s.id === event.serviceId);
                                  eventColor = service?.color || '#8B5CF6';
                                  eventStyle = { 
                                    backgroundColor: 'white',
                                    borderLeft: `4px solid ${eventColor}`
                                  };
                                  eventClass += " z-20"; // Au-dessus des bloqués
                                }

                                // Position en fonction du nombre d'événements
                                const offset = eventIndex * 4;
                                
                                return (
                                  <div
                                    key={eventIndex}
                                    className={eventClass}
                                    style={{
                                      ...eventStyle,
                                      inset: `${offset}px`,
                                      left: `${offset}px`,
                                      right: `${offset}px`
                                    }}
                                  >
                                    <div className={`font-medium text-xs truncate ${event.type === 'blocked' ? 'text-orange-700' : 'text-gray-900'}`}>
                                      {event.title}
                                    </div>
                                    <div className={`text-xs truncate ${event.type === 'blocked' ? 'text-orange-600' : 'text-gray-600'}`}>
                                      {event.client}
                                    </div>
                                    <div className={`text-xs truncate ${event.type === 'blocked' ? 'text-orange-500' : 'text-gray-500'}`}>
                                      {event.time}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Vue Mois */}
          {viewMode === 'month' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6"
            >
              {/* En-tête des jours de la semaine */}
              <div className="grid grid-cols-7 gap-4 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center font-medium text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille du mois */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isCurrentMonth = date.getMonth() === selectedMonth;
                  const dayEvents = beautySampleEvents.filter(() => Math.random() > 0.8).slice(0, 3);

                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖥️ Date DESKTOP cliquée:', date.toDateString());
                        setSelectedDate(date);
                        console.log('🖥️ Date desktop sélectionnée:', date.toDateString());
                      }}
                      className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all ${
                        !isCurrentMonth 
                          ? 'bg-gray-50 text-gray-400 pointer-events-none' 
                          : isSelected
                            ? 'bg-purple-100 border-purple-300 shadow-lg'
                            : isToday
                              ? 'bg-purple-50 border-purple-200'
                              : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-purple-700' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.map((event, eventIndex) => {
                          const service = beautyServices.find(s => s.id === event.serviceId);
                          const serviceColor = service?.color || '#8B5CF6';

                          return (
                            <div
                              key={eventIndex}
                              className="text-xs p-1 rounded border-l-2 bg-white"
                              style={{ borderLeftColor: serviceColor }}
                            >
                              <div className="truncate font-medium">{event.title}</div>
                              <div className="truncate text-gray-600">{event.client}</div>
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
            </motion.div>
          )}

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
        </div>
      </div>

      {/* Dialog de choix d'action - OPTIMISÉ MOBILE selon l'image */}
      <Dialog open={isActionChoiceOpen} onOpenChange={setIsActionChoiceOpen}>
        <DialogContent className="max-w-[95vw] w-[280px] p-0 bg-white rounded-3xl border-0 shadow-2xl mx-auto overflow-hidden">
          <div className="relative">
            {/* Bouton fermer optimisé */}
            <button
              onClick={() => setIsActionChoiceOpen(false)}
              className="absolute right-4 top-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
            
            <div className="p-6">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-xl font-bold text-gray-900 text-center pr-8">
                  Que souhaitez-vous faire ?
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => selectedTimeSlot && handleNewAppointment(selectedTimeSlot.time, selectedTimeSlot.date)}
                  className="w-full h-12 bg-purple-100 hover:bg-purple-200 text-gray-900 border-0 rounded-2xl transition-all duration-200 font-medium text-xs flex items-center justify-start px-3"
                >
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-2">
                    <User className="h-5 w-5 text-purple-700" />
                  </div>
                  <span className="text-left leading-tight">Ajouter un RDV client</span>
                </Button>
                
                <Button 
                  onClick={() => selectedTimeSlot && handleBlockTime(selectedTimeSlot.time, selectedTimeSlot.date)}
                  className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 border-0 rounded-2xl transition-all duration-200 font-medium text-xs flex items-center justify-start px-3"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <Clock className="h-5 w-5 text-gray-700" />
                  </div>
                  <span className="text-left leading-tight">Bloquer créneau</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour nouveau RDV */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau Rendez-vous Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                value={clientSearchTerm || newAppointment.clientName}
                onChange={(e) => handleClientSearch(e.target.value)}
                onFocus={() => {
                  if (clientSearchTerm.length > 0 && filteredClients.length > 0) {
                    setShowClientSuggestions(true);
                  }
                }}
                placeholder="Commencez à taper le nom du client..."
                className="w-full"
              />
              
              {/* Suggestions d'autocomplétion */}
              {showClientSuggestions && filteredClients.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">
                        📞 {client.phone} • ✉️ {client.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        Dernière visite: {new Date(client.lastVisit).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="service">Service</Label>
              <Select 
                value={newAppointment.service} 
                onValueChange={(value) => setNewAppointment({...newAppointment, service: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un service" />
                </SelectTrigger>
                <SelectContent>
                  {beautyServices.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} - {service.duration}min - {service.price}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employee">Employé</Label>
              <Select 
                value={newAppointment.employee} 
                onValueChange={(value) => setNewAppointment({...newAppointment, employee: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time">Heure</Label>
                <Select 
                  value={newAppointment.time} 
                  onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir l'heure" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="py-3">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                placeholder="Remarques particulières..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsNewAppointmentOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveAppointment}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!newAppointment.clientName || !newAppointment.service || !newAppointment.date || !newAppointment.time}
              >
                Créer le RDV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour bloquer un créneau - RESPONSIVE SELON L'IMAGE */}
      <Dialog open={isBlockTimeOpen} onOpenChange={setIsBlockTimeOpen}>
        <DialogContent 
          className="max-w-[95vw] w-[320px] sm:w-[400px] mx-auto bg-white rounded-2xl border-0 shadow-2xl overflow-hidden p-0 max-h-[85vh]"
          aria-describedby="block-time-description"
        >
          <div className="relative p-3 sm:p-4">
            {/* Bouton fermer compact */}
            <button
              onClick={() => setIsBlockTimeOpen(false)}
              className="absolute right-2 top-2 z-10 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="h-3 w-3 text-gray-600" />
            </button>
            
            <DialogHeader className="pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 text-center pr-6">
                Bloquer un créneau
              </DialogTitle>
              <p id="block-time-description" className="sr-only">
                Formulaire pour bloquer un créneau horaire dans le planning
              </p>
            </DialogHeader>

            <div className="space-y-3">
              {/* Ligne 1: Employé + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                    Employé
                  </Label>
                  <Select 
                    value={newAppointment.employee} 
                    onValueChange={(value) => setNewAppointment({...newAppointment, employee: value})}
                  >
                    <SelectTrigger className="h-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-purple-500">
                      <SelectValue placeholder="Employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    className="h-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Ligne 2: Horaires */}
              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Horaires
                </Label>
                <div className="flex items-center gap-2">
                  <Select 
                    value={newAppointment.time} 
                    onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
                  >
                    <SelectTrigger className="flex-1 h-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-purple-500">
                      <SelectValue placeholder="Début" />
                    </SelectTrigger>
                    <SelectContent className="max-h-40">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="text-gray-400 text-xs">à</span>
                  
                  <Select 
                    value={newAppointment.endTime || ""} 
                    onValueChange={(value) => setNewAppointment({...newAppointment, endTime: value} as any)}
                  >
                    <SelectTrigger className="flex-1 h-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-purple-500">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent className="max-h-40">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ligne 3: Nom du créneau */}
              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Nom du créneau
                </Label>
                <Input
                  value={newAppointment.clientName}
                  onChange={(e) => setNewAppointment({...newAppointment, clientName: e.target.value})}
                  placeholder="Ex: Pause déjeuner..."
                  className="h-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-purple-500"
                />
              </div>

              {/* Ligne 4: Raison (optionnelle et compacte) */}
              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Raison (optionnel)
                </Label>
                <Input
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Détails..."
                  className="h-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-purple-500"
                />
              </div>

              {/* Boutons compacts */}
              <div className="flex gap-2 pt-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsBlockTimeOpen(false)}
                  className="flex-1 h-10 text-xs sm:text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveBlockTime}
                  className="flex-1 h-10 text-xs sm:text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  disabled={!newAppointment.employee || !newAppointment.date || !newAppointment.time}
                >
                  Bloquer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      

      </div>
    </div>
  );
}