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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  
  // États des dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Position de la ligne d'heure actuelle
  const getCurrentTimeLinePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 8 * 60; // 8h00
    const endMinutes = 20 * 60; // 20h00
    
    if (totalMinutes < startMinutes || totalMinutes > endMinutes) return null;
    
    const progress = (totalMinutes - startMinutes) / (endMinutes - startMinutes);
    return progress * 100; // Pourcentage de la journée
  };

  // Rendez-vous d'exemple pour la timeline mobile
  const sampleAppointmentsMobile = [
    {
      id: 1,
      serviceName: "Coupe + Brushing",
      clientName: "Sophie Martin",
      startTime: "09:00",
      endTime: "10:00",
      status: "confirmed",
      date: new Date(),
    },
    {
      id: 2, 
      serviceName: "Coloration",
      clientName: "Emma Dubois",
      startTime: "10:30",
      endTime: "12:30", 
      status: "confirmed",
      date: new Date(),
    },
    {
      id: 3,
      serviceName: "Manucure",
      clientName: "Julie Laurent", 
      startTime: "14:00",
      endTime: "14:45",
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

  // Fonction pour gérer le nouveau RDV
  const handleNewAppointment = () => {
    // Placeholder pour le moment - will be implemented later
    console.log("Nouveau rendez-vous demandé");
  };
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  // Fonctions pour version mobile
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return Math.max(0, (hours - 8) * 80 + (minutes / 60) * 80);
  };

  // Fonction supprimée car dupliquée avec version plus haut

  // Fonction supprimée car dupliquée plus haut

  // Fonction supprimée car dupliquée plus haut

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Version Mobile EXACTE selon votre maquette - SANS SIDEBAR */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* Header mobile avec navigation */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Appointment date</h1>
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

        {/* Sélecteur de mois EXACTEMENT comme votre maquette */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-end">
          <Select value="january" onValueChange={() => {}}>
            <SelectTrigger className="w-28 h-8 text-sm border border-gray-300 rounded-lg">
              <SelectValue placeholder="January" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="may">May</SelectItem>
              <SelectItem value="june">June</SelectItem>
              <SelectItem value="july">July</SelectItem>
              <SelectItem value="august">August</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="october">October</SelectItem>
              <SelectItem value="november">November</SelectItem>
              <SelectItem value="december">December</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendrier mensuel EXACTEMENT comme votre maquette */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          {/* En-tête des jours */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier - Exactement comme votre photo */}
          <div className="grid grid-cols-7 gap-2">
            {/* Première semaine */}
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">1</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">2</button>
            <button className="w-10 h-10 text-sm text-white bg-green-500 rounded-lg font-bold shadow-lg">3</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">4</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">5</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">6</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">7</button>
            
            {/* Deuxième semaine */}
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">8</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">9</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">10</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">11</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">12</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">13</button>
            <button className="w-10 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all">14</button>
          </div>
        </div>

        {/* Timeline des rendez-vous avec ligne violette EXACTE comme votre photo */}
        <div className="bg-white flex-1 overflow-y-auto pb-20 px-4">
          <div className="relative">
            {/* Ligne verticale grise - timeline principale */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Rendez-vous exactement comme votre maquette */}
            <div className="py-4 space-y-6">
              {/* RDV 1 - Team meeting */}
              <div className="flex items-start relative">
                <div className="flex flex-col items-center w-16 mr-4">
                  <span className="text-xs text-gray-400 mb-2 font-medium">08:00 AM</span>
                  <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-white relative z-10"></div>
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Team meeting</h3>
                  <div className="text-xs text-gray-500 mb-1">📍 Meeting room level 9</div>
                  <div className="text-xs text-gray-500 mb-1">📅 january 3, 2022</div>
                  <div className="text-xs text-gray-500">⏰ 08:00 - 09:00 AM</div>
                </div>
              </div>

              {/* RDV 2 - Present a plan (ACTUEL avec effet vert) */}
              <div className="flex items-start relative">
                <div className="flex flex-col items-center w-16 mr-4">
                  <span className="text-xs text-gray-900 mb-2 font-bold">09:00 AM</span>
                  <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white relative z-10 shadow-lg"></div>
                </div>
                <div className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200 relative">
                  {/* Ligne verte horizontale EXACTE comme votre photo - effet surbrillance */}
                  <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 flex items-center z-20">
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="w-16 h-0.5 bg-green-500 ml-1"></div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">Present a plan</h3>
                  <div className="text-xs text-green-600 mb-1">📍 Meeting room level 9</div>
                  <div className="text-xs text-green-600 mb-1">📅 january 3, 2022</div>
                  <div className="text-xs text-green-600">⏰ 09:00 - 10:00 AM</div>
                </div>
              </div>

              {/* RDV 3 - Meeting summary */}
              <div className="flex items-start relative">
                <div className="flex flex-col items-center w-16 mr-4">
                  <span className="text-xs text-gray-400 mb-2 font-medium">10:00 AM</span>
                  <div className="w-3 h-3 rounded-full bg-green-300 border-2 border-white relative z-10"></div>
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Meeting summary</h3>
                  <div className="text-xs text-gray-500 mb-1">📍 Meeting room level 9</div>
                  <div className="text-xs text-gray-500 mb-1">📅 january 3, 2022</div>
                  <div className="text-xs text-gray-500">⏰ 10:00 - 11:00 AM</div>
                </div>
              </div>

              {/* RDV 4 - Design first draft */}
              <div className="flex items-start relative">
                <div className="flex flex-col items-center w-16 mr-4">
                  <span className="text-xs text-gray-400 mb-2 font-medium">11:00 AM</span>
                  <div className="w-3 h-3 rounded-full bg-green-300 border-2 border-white relative z-10"></div>
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Design first draft</h3>
                  <div className="text-xs text-gray-500 mb-1">📍 Meeting room level 9</div>
                  <div className="text-xs text-gray-500 mb-1">📅 january 3, 2022</div>
                  <div className="text-xs text-gray-500">⏰ 11:00 - 12:00 AM</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bouton flottant noir EXACTEMENT comme votre maquette */}
        <div className="fixed bottom-6 right-1/2 transform translate-x-1/2 z-20">
          <button 
            onClick={() => alert("Nouveau RDV à venir")}
            className="w-14 h-14 bg-black text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation en bas comme votre maquette */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around items-center">
            <button className="p-3 text-gray-400">☀️</button>
            <button className="p-3 text-gray-400">📅</button>
            <div className="w-14 h-14"></div> {/* Espace pour bouton + */}
            <button className="p-3 text-gray-400">✉️</button>
            <button className="p-3 text-gray-400">📤</button>
          </div>
        </div>
      </div>

      {/* Version Desktop - Fonctionnelle avec vues dynamiques */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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

                <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
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

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border rounded-lg ${
                        !isCurrentMonth 
                          ? 'bg-gray-50 text-gray-400' 
                          : isToday
                            ? 'bg-purple-50 border-purple-200'
                            : 'bg-white border-gray-200'
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
    </div>
  );
}