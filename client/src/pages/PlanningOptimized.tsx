import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, addWeeks, addMonths, subWeeks, subMonths, subDays, eachDayOfInterval, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, TrendingUp, Target, Plus, ChevronLeft, ChevronRight,
  Euro, Eye, CalendarDays
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Types pour les données
interface Staff {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  color: string;
  activeHours: { start: string; end: string };
}

interface Appointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  serviceName: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

interface Analytics {
  daily: { revenue: number; appointments: number };
  weekly: { revenue: number; appointments: number };
  monthly: { revenue: number; appointments: number };
  avgTicket: number;
  objectives: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

const PlanningOptimized: React.FC = () => {
  // États
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [viewType, setViewType] = useState<'staff' | 'overview'>('overview');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  // Données staff mockées (remplacer par vraies données)
  const staffMembers: Staff[] = [
    { id: '1', name: 'Sophie Martin', role: 'Coiffeuse Senior', color: '#8b5cf6', activeHours: { start: '09:00', end: '18:00' } },
    { id: '2', name: 'Léa Dubois', role: 'Esthéticienne', color: '#06b6d4', activeHours: { start: '10:00', end: '19:00' } },
    { id: '3', name: 'Marie Claire', role: 'Nail Artist', color: '#f59e0b', activeHours: { start: '09:30', end: '17:30' } },
    { id: '4', name: 'Julie Chen', role: 'Massothérapeute', color: '#10b981', activeHours: { start: '11:00', end: '20:00' } }
  ];

  // Données de démonstration pour les rendez-vous
  const mockAppointments: Appointment[] = [
    // Aujourd'hui
    { id: '1', clientName: 'Sophie Dubois', serviceName: 'Coupe + Brushing', staffId: '1', date: format(new Date(), 'yyyy-MM-dd'), startTime: '09:00', endTime: '10:00', duration: 60, price: 45, status: 'confirmed' },
    { id: '2', clientName: 'Marie Martin', serviceName: 'Coloration', staffId: '1', date: format(new Date(), 'yyyy-MM-dd'), startTime: '14:00', endTime: '16:00', duration: 120, price: 85, status: 'confirmed' },
    { id: '3', clientName: 'Julie Chen', serviceName: 'Soin visage', staffId: '2', date: format(new Date(), 'yyyy-MM-dd'), startTime: '10:00', endTime: '11:00', duration: 60, price: 60, status: 'completed' },
    { id: '4', clientName: 'Emma Rousseau', serviceName: 'Manucure', staffId: '3', date: format(new Date(), 'yyyy-MM-dd'), startTime: '11:00', endTime: '11:30', duration: 30, price: 25, status: 'confirmed' },
    { id: '5', clientName: 'Léa Bernard', serviceName: 'Massage relaxant', staffId: '4', date: format(new Date(), 'yyyy-MM-dd'), startTime: '15:00', endTime: '16:00', duration: 60, price: 70, status: 'confirmed' },
    
    // Hier (rendez-vous complétés)
    { id: '6', clientName: 'Anna Leroy', serviceName: 'Coupe femme', staffId: '1', date: format(addDays(new Date(), -1), 'yyyy-MM-dd'), startTime: '10:00', endTime: '11:00', duration: 60, price: 40, status: 'completed' },
    { id: '7', clientName: 'Clara Morin', serviceName: 'Épilation jambes', staffId: '2', date: format(addDays(new Date(), -1), 'yyyy-MM-dd'), startTime: '14:00', endTime: '15:00', duration: 60, price: 35, status: 'completed' },
    { id: '8', clientName: 'Océane Petit', serviceName: 'Pédicure', staffId: '3', date: format(addDays(new Date(), -1), 'yyyy-MM-dd'), startTime: '16:00', endTime: '17:00', duration: 60, price: 30, status: 'completed' },
    
    // Demain
    { id: '9', clientName: 'Sarah Laurent', serviceName: 'Balayage', staffId: '1', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '09:30', endTime: '11:30', duration: 120, price: 95, status: 'confirmed' },
    { id: '10', clientName: 'Camille Durand', serviceName: 'Soins du visage', staffId: '2', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '13:00', endTime: '14:00', duration: 60, price: 55, status: 'confirmed' },
    
    // Cette semaine
    { id: '11', clientName: 'Chloé Garcia', serviceName: 'Coupe + Couleur', staffId: '1', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), startTime: '10:00', endTime: '12:00', duration: 120, price: 75, status: 'confirmed' },
    { id: '12', clientName: 'Inès Moreau', serviceName: 'Extensions', staffId: '1', date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), startTime: '14:00', endTime: '17:00', duration: 180, price: 150, status: 'confirmed' },
    { id: '13', clientName: 'Luna Simon', serviceName: 'Massage dos', staffId: '4', date: format(addDays(new Date(), 4), 'yyyy-MM-dd'), startTime: '11:00', endTime: '12:00', duration: 60, price: 65, status: 'confirmed' },
  ];

  // Query pour récupérer les rendez-vous (avec fallback sur données de démo)
  const { data: apiAppointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments', selectedDate, viewMode],
    enabled: true
  });

  // Utilise les données de l'API si disponibles, sinon les données de démo
  const appointments = apiAppointments.length > 0 ? apiAppointments : mockAppointments;

  // Calculs d'analytics
  const analytics: Analytics = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const startOfThisWeek = startOfWeek(today, { locale: fr });
    const endOfThisWeek = endOfWeek(today, { locale: fr });
    
    const startOfThisMonth = startOfMonth(today);
    const endOfThisMonth = endOfMonth(today);

    const todayAppointments = appointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.date);
      return aptDate >= startOfToday && aptDate <= endOfToday && apt.status === 'completed';
    });

    const weekAppointments = appointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.date);
      return aptDate >= startOfThisWeek && aptDate <= endOfThisWeek && apt.status === 'completed';
    });

    const monthAppointments = appointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.date);
      return aptDate >= startOfThisMonth && aptDate <= endOfThisMonth && apt.status === 'completed';
    });

    const dailyRevenue = todayAppointments.reduce((sum: number, apt: Appointment) => sum + apt.price, 0);
    const weeklyRevenue = weekAppointments.reduce((sum: number, apt: Appointment) => sum + apt.price, 0);
    const monthlyRevenue = monthAppointments.reduce((sum: number, apt: Appointment) => sum + apt.price, 0);

    const totalAppointments = [...todayAppointments, ...weekAppointments, ...monthAppointments].length;
    const totalRevenue = dailyRevenue + weeklyRevenue + monthlyRevenue;

    return {
      daily: { revenue: dailyRevenue, appointments: todayAppointments.length },
      weekly: { revenue: weeklyRevenue, appointments: weekAppointments.length },
      monthly: { revenue: monthlyRevenue, appointments: monthAppointments.length },
      avgTicket: totalAppointments > 0 ? totalRevenue / totalAppointments : 0,
      objectives: {
        daily: 800,
        weekly: 4000,
        monthly: 15000
      }
    };
  }, [appointments]);

  // Génération des créneaux horaires
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  // Navigation de dates
  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setSelectedDate(direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1));
    } else if (viewMode === 'week') {
      setSelectedDate(direction === 'next' ? addWeeks(selectedDate, 1) : subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(direction === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
    }
  };

  // Fonction pour créer un nouveau rendez-vous
  const handleCreateAppointment = (staffId: string, time: string, date?: Date) => {
    const appointmentDate = date || selectedDate;
    const staff = staffMembers.find(s => s.id === staffId);
    
    const newAppointment = {
      clientName: prompt('Nom du client :') || '',
      serviceName: prompt('Nom du service :') || '',
      staffId: staffId,
      date: format(appointmentDate, 'yyyy-MM-dd'),
      startTime: time,
      endTime: time, // Simplifier pour la démo
      price: parseInt(prompt('Prix (€) :') || '0')
    };

    if (newAppointment.clientName && newAppointment.serviceName) {
      alert(`RDV créé pour ${newAppointment.clientName} ${staff ? `avec ${staff.name}` : ''} le ${format(appointmentDate, 'd MMMM', { locale: fr })} à ${time}`);
      // Ici on pourrait envoyer à l'API
    }
  };

  // Rendu des icônes flottantes minimalistes
  const renderFloatingIcons = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Mobile - 2 emojis plus espacés */}
      <div className="lg:hidden">
        <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-violet-200/10 to-purple-300/5 backdrop-blur-sm flex items-center justify-center animate-pulse">
          <span className="text-sm opacity-40">📅</span>
        </div>
        <div className="absolute top-12 right-12 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-200/10 to-green-300/5 backdrop-blur-sm flex items-center justify-center animate-pulse" style={{ animationDelay: '2s' }}>
          <span className="text-sm opacity-40">⏰</span>
        </div>
      </div>
      
      {/* Desktop - 4 emojis bien espacés */}
      <div className="hidden lg:block">
        <div className="absolute top-8 left-32 w-10 h-10 rounded-full bg-gradient-to-br from-violet-200/8 to-purple-300/4 backdrop-blur-sm flex items-center justify-center animate-pulse">
          <span className="text-sm opacity-30">📅</span>
        </div>
        <div className="absolute top-12 right-48 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-200/8 to-green-300/4 backdrop-blur-sm flex items-center justify-center animate-pulse" style={{ animationDelay: '2s' }}>
          <span className="text-sm opacity-30">⏰</span>
        </div>
        <div className="absolute top-16 left-2/3 w-10 h-10 rounded-full bg-gradient-to-br from-blue-200/8 to-cyan-300/4 backdrop-blur-sm flex items-center justify-center animate-pulse" style={{ animationDelay: '4s' }}>
          <span className="text-sm opacity-30">📊</span>
        </div>
        <div className="absolute top-6 right-1/3 w-10 h-10 rounded-full bg-gradient-to-br from-amber-200/8 to-orange-300/4 backdrop-blur-sm flex items-center justify-center animate-pulse" style={{ animationDelay: '6s' }}>
          <span className="text-sm opacity-30">🎯</span>
        </div>
      </div>
    </div>
  );

  // Rendu des KPIs minimalistes
  const renderAnalytics = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-4"
    >      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA selon vue actuelle */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">CA {viewMode === 'day' ? 'Jour' : viewMode === 'week' ? 'Semaine' : 'Mois'}</div>
            <div className="text-xl font-bold text-gray-900">
              {viewMode === 'day' ? analytics.daily.revenue : viewMode === 'week' ? analytics.weekly.revenue : analytics.monthly.revenue}€
            </div>
            <div className="text-xs text-gray-400">
              {viewMode === 'day' ? analytics.daily.appointments : viewMode === 'week' ? analytics.weekly.appointments : analytics.monthly.appointments} RDV
            </div>
          </CardContent>
        </Card>

        {/* Ticket Moyen */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Ticket Moyen</div>
            <div className="text-xl font-bold text-gray-900">
              {Math.round(analytics.avgTicket)}€
            </div>
            <div className="text-xs text-green-600">
              +12%
            </div>
          </CardContent>
        </Card>

        {/* Objectif */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Objectif</div>
            <div className="text-xl font-bold text-gray-900">
              {viewMode === 'day' ? analytics.objectives.daily : viewMode === 'week' ? analytics.objectives.weekly : analytics.objectives.monthly}€
            </div>
            <div className="text-xs text-blue-600">
              {Math.round(((viewMode === 'day' ? analytics.daily.revenue : viewMode === 'week' ? analytics.weekly.revenue : analytics.monthly.revenue) / (viewMode === 'day' ? analytics.objectives.daily : viewMode === 'week' ? analytics.objectives.weekly : analytics.objectives.monthly)) * 100)}%
            </div>
          </CardContent>
        </Card>

        {/* Nouveau RDV */}
        <Button className="h-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau
        </Button>
      </div>
    </motion.div>
  );

  // Vue semaine calendrier
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { locale: fr });
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(selectedDate, { locale: fr })
    });

    return (
      <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-8 gap-2">
            {/* Header horaires */}
            <div className="text-center text-sm font-medium text-gray-500 py-2">Horaires</div>
            
            {/* Headers jours */}
            {weekDays.map(day => (
              <div key={day.toISOString()} className="text-center py-2">
                <div className="text-sm font-medium text-gray-900">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className="text-xs text-gray-500">
                  {format(day, 'd')}
                </div>
              </div>
            ))}
            
            {/* Grille horaires */}
            {timeSlots.slice(2, 18).map(time => (
              <React.Fragment key={time}>
                <div className="text-xs text-gray-500 py-2 text-center">{time}</div>
                {weekDays.map(day => {
                  const dayAppointments = appointments.filter(apt => 
                    isSameDay(new Date(apt.date), day) && apt.startTime === time
                  );
                  
                  return (
                    <div 
                      key={`${day.toISOString()}-${time}`} 
                      className="h-12 bg-gray-50 rounded border border-dashed border-gray-200 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors group p-1"
                      onClick={() => dayAppointments.length === 0 && handleCreateAppointment('', time, day)}
                      title={dayAppointments.length > 0 ? `${dayAppointments[0].clientName} - ${dayAppointments[0].serviceName}` : `Créer un RDV le ${format(day, 'd MMM')} à ${time}`}
                    >
                      {dayAppointments.length > 0 ? (
                        <div className="text-center">
                          <div className="text-xs font-medium text-purple-600 truncate">
                            {dayAppointments[0].clientName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {dayAppointments[0].serviceName}
                          </div>
                        </div>
                      ) : (
                        <Plus className="w-3 h-3 text-gray-400 group-hover:text-purple-500" />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Vue mois calendrier
  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { locale: fr });
    const calendarEnd = endOfWeek(monthEnd, { locale: fr });
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
        <CardContent className="p-6">
          {/* Header jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(day => {
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`h-20 rounded-lg border-2 border-dashed p-2 cursor-pointer transition-colors ${
                    isCurrentMonth 
                      ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' 
                      : 'border-gray-100 bg-gray-25'
                  } ${
                    isToday 
                      ? 'border-purple-300 bg-purple-50' 
                      : ''
                  }`}
                >
                  <div className={`text-sm ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${
                    isToday ? 'font-bold text-purple-600' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 space-y-1">
                    {/* Affichage des RDV du jour */}
                    {appointments
                      .filter(apt => isSameDay(new Date(apt.date), day))
                      .slice(0, 2)
                      .map((apt, index) => (
                        <div key={apt.id} className="w-full h-1 bg-purple-400 rounded"></div>
                      ))
                    }
                    {appointments.filter(apt => isSameDay(new Date(apt.date), day)).length > 2 && (
                      <div className="text-xs text-purple-600 font-medium">+{appointments.filter(apt => isSameDay(new Date(apt.date), day)).length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Vue jour par employé
  const renderStaffDayView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {staffMembers.map(staff => (
        <Card key={staff.id} className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{ backgroundColor: staff.color }}
              >
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{staff.name}</div>
                <div className="text-xs text-gray-500">{staff.role}</div>
              </div>
            </div>
            
            <div className="space-y-1">
              {timeSlots.slice(2, 18).map(time => {
                const staffAppointments = appointments.filter((apt: Appointment) => 
                  apt.staffId === staff.id && 
                  apt.startTime === time &&
                  isSameDay(new Date(apt.date), selectedDate)
                );
                
                return (
                  <div key={time} className="flex items-center gap-2 py-1">
                    <div className="text-xs text-gray-500 w-10">{time}</div>
                    <div className="flex-1">
                      {staffAppointments.length > 0 ? (
                        staffAppointments.map((apt: Appointment) => (
                          <div
                            key={apt.id}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded p-2 text-xs cursor-pointer hover:from-purple-200 hover:to-pink-200 transition-colors"
                            title={`${apt.clientName} - ${apt.serviceName} (${apt.price}€)`}
                          >
                            <div className="font-medium text-gray-900">{apt.clientName}</div>
                            <div className="text-gray-600 truncate">{apt.serviceName}</div>
                            <div className="text-purple-600 font-medium">{apt.price}€</div>
                          </div>
                        ))
                      ) : (
                        <div 
                          className="h-6 bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors group"
                          onClick={() => handleCreateAppointment(staff.id, time)}
                          title={`Créer un RDV avec ${staff.name} à ${time}`}
                        >
                          <Plus className="w-3 h-3 text-gray-400 group-hover:text-purple-500" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Vue d'ensemble selon le mode
  const renderOverviewView = () => {
    if (viewMode === 'week') return renderWeekView();
    if (viewMode === 'month') return renderMonthView();
    
    // Vue jour d'ensemble
    return (
      <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Colonne horaires */}
            <div className="lg:col-span-1">
              <div className="text-sm font-medium text-gray-500 mb-4 text-center">Horaires</div>
              {timeSlots.slice(2, 18).map(time => (
                <div key={time} className="text-sm text-gray-600 py-2 text-center">
                  {time}
                </div>
              ))}
            </div>
            
            {/* Colonnes employés */}
            {staffMembers.map(staff => (
              <div key={staff.id} className="lg:col-span-1">
                <div 
                  className="text-sm font-medium text-white p-2 rounded-lg mb-4 text-center"
                  style={{ backgroundColor: staff.color }}
                >
                  {staff.name.split(' ')[0]}
                </div>
                <div className="space-y-2">
                  {timeSlots.slice(2, 18).map(time => {
                    const staffAppointments = appointments.filter((apt: Appointment) => 
                      apt.staffId === staff.id && 
                      apt.startTime === time &&
                      isSameDay(new Date(apt.date), selectedDate)
                    );
                    
                    return (
                      <div key={time} className="h-8">
                        {staffAppointments.length > 0 ? (
                          staffAppointments.map((apt: Appointment) => (
                            <div
                              key={apt.id}
                              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded p-1 text-xs h-full flex flex-col justify-center cursor-pointer hover:from-purple-200 hover:to-pink-200 transition-colors"
                              title={`${apt.clientName} - ${apt.serviceName} (${apt.price}€)`}
                            >
                              <div className="font-medium truncate">{apt.clientName}</div>
                              <div className="text-gray-600 truncate text-xs">{apt.serviceName}</div>
                            </div>
                          ))
                        ) : (
                          <div 
                            className="h-full bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors group"
                            onClick={() => handleCreateAppointment(staff.id, time)}
                            title={`Créer un RDV avec ${staff.name} à ${time}`}
                          >
                            <Plus className="w-3 h-3 text-gray-400 group-hover:text-purple-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 flex items-center justify-center"
      >
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 lg:p-6"
    >
      <div className="max-w-md lg:max-w-none lg:w-full lg:mx-0 mx-auto space-y-6">
        {/* Header Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-4 pt-8 lg:pt-4 relative"
        >
          {renderFloatingIcons()}
          
          <div className="lg:text-left lg:flex lg:items-center lg:justify-between relative z-10">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Planning
              </h1>
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-800">
                  Studio Beauté Avyento
                </p>
                <p className="text-sm text-gray-600">
                  15 Avenue des Champs-Élysées, 75008 Paris
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation et contrôles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Navigation de date */}
          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="h-8 w-8 p-0 bg-white/50 border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    {viewMode === 'day' 
                      ? format(selectedDate, 'EEEE d MMMM', { locale: fr })
                      : viewMode === 'week'
                      ? `Semaine du ${format(startOfWeek(selectedDate, { locale: fr }), 'd MMM', { locale: fr })}`
                      : format(selectedDate, 'MMMM yyyy', { locale: fr })
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointments.length} rendez-vous
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="h-8 w-8 p-0 bg-white/50 border-gray-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contrôles de vue */}
          <div className="flex gap-3">
            {/* Mode de vue */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {(['day', 'week', 'month'] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'ghost'}
                      className={`rounded-none h-10 text-sm font-medium px-4 ${
                        viewMode === mode
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setViewMode(mode)}
                    >
                      {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Type de vue pour jour seulement */}
            {viewMode === 'day' && (
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <Button
                      variant={viewType === 'overview' ? 'default' : 'ghost'}
                      className={`rounded-none h-10 text-sm font-medium px-4 ${
                        viewType === 'overview'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setViewType('overview')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Vue d'ensemble
                    </Button>
                    <Button
                      variant={viewType === 'staff' ? 'default' : 'ghost'}
                      className={`rounded-none h-10 text-sm font-medium px-4 ${
                        viewType === 'staff'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setViewType('staff')}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Par employé
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Analytics KPIs */}
        {renderAnalytics()}

        {/* Contenu principal du planning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {viewType === 'staff' ? (
              <motion.div
                key="staff"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStaffDayView()}
              </motion.div>
            ) : (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderOverviewView()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlanningOptimized;