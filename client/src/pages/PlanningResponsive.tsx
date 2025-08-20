import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Euro, Target, TrendingUp, Clock, User, CalendarDays, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { MobileBottomNav } from "@/components/MobileBottomNav";

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

// Suppression temporaire du schema pour corriger l'erreur

const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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
  // Variables simplifiées sans dépendances externes problématiques

  // États pour la navigation
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  
  // États pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  // Fonction pour gérer le nouveau RDV
  const handleNewAppointment = () => {
    // Placeholder pour le moment - will be implemented later
    console.log("Nouveau rendez-vous demandé");
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

  // Rendez-vous simulés
  const beautySampleEvents = [
    { 
      id: 1, 
      title: "Coupe + Brushing", 
      client: "Marie Durand",
      time: "09:00-10:00", 
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
      serviceId: 2,
      employeeId: "1",
      status: "confirmed",
      notes: "Châtain clair"
    },
    { 
      id: 3, 
      title: "Manucure", 
      client: "Claire Moreau",
      time: "10:00-10:45", 
      serviceId: 4,
      employeeId: "2",
      status: "scheduled",
      notes: "French manucure"
    },
    { 
      id: 4, 
      title: "Soin Visage", 
      client: "Lucie Bernard",
      time: "14:00-15:30", 
      serviceId: 7,
      employeeId: "3",
      status: "confirmed",
      notes: "Peau sensible"
    }
  ];

  // Fonction supprimée car non utilisée

  // Fonction supprimée car dupliquée avec version plus haut

  // Fonction supprimée car dupliquée plus haut

  // Fonction supprimée car dupliquée plus haut

  return (
    <>
      {/* Version Mobile - Interface COMPLÈTEMENT indépendante pleine largeur SANS SIDEBAR */}
      <div className="lg:hidden block fixed inset-0 bg-white z-[9999] overflow-hidden"
           style={{ 
             width: '100vw', 
             height: '100vh', 
             left: 0, 
             top: 0
           }}>
        {/* Header mobile avec navigation */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Planning Pro - DÉMO</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>



        {/* Navigation mois avec flèches */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
                setSelectedMonth(newMonth);
              }}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-lg font-semibold text-gray-900">
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
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div className="bg-white px-4 py-2 border-b border-gray-100">
          <div className="flex gap-2">
            <Button 
              onClick={() => handleNewAppointment()} 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau RDV
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
              size="sm"
            >
              <Clock className="h-4 w-4 mr-2" />
              Bloquer créneau
            </Button>
          </div>
        </div>



        {/* Calendrier mensuel compact */}
        <div className="bg-white p-4 border-b border-gray-200">
          {/* En-tête des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
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
                <div
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🎯 Date MOBILE cliquée:', date.toDateString());
                    setSelectedDate(date);
                    // Forcer un re-render avec une notification visuelle
                    console.log('🎯 Date sélectionnée mise à jour:', date.toDateString());
                  }}
                  className={`w-10 h-10 text-sm rounded-lg transition-all relative cursor-pointer select-none flex items-center justify-center ${
                    !isCurrentMonth 
                      ? 'text-gray-300 pointer-events-none' 
                      : isSelected
                        ? 'bg-purple-500 text-white font-bold shadow-lg'
                        : isToday
                          ? 'bg-purple-400 text-white font-bold ring-2 ring-purple-200'
                          : 'text-gray-700 hover:bg-purple-100 active:bg-purple-200 border border-transparent hover:border-purple-300'
                  }`}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  {date.getDate()}
                  {/* Repère supplémentaire pour aujourd'hui */}
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border border-white"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline des rendez-vous avec ligne violette d'heure actuelle */}
        <div className="bg-white flex-1 overflow-y-auto pb-20">
          <div className="relative p-4">
            {/* Ligne violette d'heure actuelle - indicateur temps réel */}
            <div className="absolute left-0 right-0 z-20 flex items-center px-4" style={{ top: '20%' }}>
              <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="flex-1 h-0.5 bg-purple-500 ml-2"></div>
              <div className="text-xs font-medium text-purple-600 ml-2 bg-white px-2 py-1 rounded shadow border border-purple-200">
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Rendez-vous de la journée sélectionnée */}
            {getAppointmentsForDate(selectedDate || new Date()).map((appointment, index) => {
              const isCurrentAppointment = isAppointmentCurrent(appointment);
              const isFinishedAppointment = isAppointmentFinished(appointment);
              
              return (
                <div key={index} className="relative mb-6">
                  {/* Ligne de temps verticale grise */}
                  <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Point de temps */}
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <span className="text-xs text-gray-500 mb-2 font-medium">
                        {appointment.startTime}
                      </span>
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isCurrentAppointment 
                          ? 'bg-purple-500 border-purple-500 animate-pulse' 
                          : isFinishedAppointment
                            ? 'bg-green-500 border-green-500'
                            : appointment.status === 'confirmed'
                              ? 'bg-gray-400 border-gray-400'
                              : 'bg-gray-300 border-gray-300'
                      }`}></div>
                      
                      {/* Point violet pour RDV en cours */}
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
            onClick={handleNewAppointment}
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Navigation mobile */}
        <MobileBottomNav />
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

                      {/* Événements de la journée */}
                      <div className="space-y-2 min-h-[600px] relative">
                        {dayEvents.map((event, eventIndex) => {
                          const service = beautyServices.find(s => s.id === event.serviceId);
                          const serviceColor = service?.color || '#8B5CF6';

                          return (
                            <div
                              key={eventIndex}
                              className="bg-white p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              style={{ borderLeftColor: serviceColor }}
                            >
                              <div className="font-medium text-sm">{event.title}</div>
                              <div className="text-xs text-gray-600">{event.client}</div>
                              <div className="text-xs text-gray-500">{event.time}</div>
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

      {/* Suppression temporaire du Dialog problématique */}
    </>
  );
}