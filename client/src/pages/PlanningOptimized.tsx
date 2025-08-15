import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, addWeeks, addMonths, subWeeks, subMonths, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, TrendingUp, Target, Plus, ChevronLeft, ChevronRight,
  Euro, BarChart3, Eye, CalendarDays, Calendar as CalendarIcon,
  Filter, Download
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

  // Query pour récupérer les rendez-vous
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments', selectedDate, viewMode],
    enabled: true
  });

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

  // Rendu des icônes flottantes style Landing
  const renderFloatingIcons = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Mobile - 3 emojis diffus */}
      <div className="lg:hidden">
        <div className="absolute top-2 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/20 to-purple-300/15 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-12">
          <span className="text-lg opacity-60">📅</span>
        </div>
        <div className="absolute top-6 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/20 to-green-300/15 backdrop-blur-sm flex items-center justify-center animate-bounce transform -rotate-6" style={{ animationDelay: '1s', animationDuration: '3s' }}>
          <span className="text-lg opacity-60">⏰</span>
        </div>
        <div className="absolute top-12 left-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-300/15 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-45" style={{ animationDelay: '2s' }}>
          <span className="text-lg opacity-60">✨</span>
        </div>
      </div>
      
      {/* Desktop - 8 emojis diffus */}
      <div className="hidden lg:block">
        <div className="absolute top-4 left-16 w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/15 to-purple-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-12">
          <span className="text-lg opacity-40">📅</span>
        </div>
        <div className="absolute top-8 right-24 w-12 h-12 rounded-full bg-gradient-to-br from-pink-200/15 to-rose-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform -rotate-6" style={{ animationDelay: '1s', animationDuration: '3s' }}>
          <span className="text-lg opacity-40">⏰</span>
        </div>
        <div className="absolute top-2 left-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/15 to-cyan-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform rotate-45" style={{ animationDelay: '2s' }}>
          <span className="text-lg opacity-40">✨</span>
        </div>
        <div className="absolute top-12 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/15 to-orange-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-12" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
          <span className="text-lg opacity-40">📋</span>
        </div>
        <div className="absolute top-6 right-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/15 to-green-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform -rotate-12" style={{ animationDelay: '1.5s' }}>
          <span className="text-lg opacity-40">🎯</span>
        </div>
        <div className="absolute top-10 right-12 w-12 h-12 rounded-full bg-gradient-to-br from-teal-200/15 to-cyan-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-6" style={{ animationDelay: '3s', animationDuration: '5s' }}>
          <span className="text-lg opacity-40">📊</span>
        </div>
        <div className="absolute top-1 left-2/3 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-200/15 to-purple-300/10 backdrop-blur-sm flex items-center justify-center animate-pulse transform -rotate-3" style={{ animationDelay: '2.5s' }}>
          <span className="text-lg opacity-40">🔔</span>
        </div>
        <div className="absolute top-14 right-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-rose-200/15 to-pink-300/10 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-18" style={{ animationDelay: '4s', animationDuration: '6s' }}>
          <span className="text-lg opacity-40">💼</span>
        </div>
      </div>
    </div>
  );

  // Rendu des KPIs style Landing
  const renderAnalytics = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-900 text-center lg:text-left">
        Chiffre d'Affaires - Aujourd'hui
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* CA Jour */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-500 mb-1">CA Jour</div>
            <div className="text-lg font-bold text-gray-900">
              {analytics.daily.revenue}€
            </div>
            <div className="text-xs text-gray-400">
              {analytics.daily.appointments} RDV
            </div>
          </CardContent>
        </Card>

        {/* CA Semaine */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-500 mb-1">CA Semaine</div>
            <div className="text-lg font-bold text-gray-900">
              {analytics.weekly.revenue}€
            </div>
            <div className="text-xs text-gray-400">
              {analytics.weekly.appointments} RDV
            </div>
          </CardContent>
        </Card>

        {/* CA Mois */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-sm text-gray-500 mb-1">CA Mois</div>
            <div className="text-lg font-bold text-gray-900">
              {analytics.monthly.revenue}€
            </div>
            <div className="text-xs text-gray-400">
              {analytics.monthly.appointments} RDV
            </div>
          </CardContent>
        </Card>

        {/* Ticket Moyen */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Euro className="w-5 h-5 text-pink-600" />
            </div>
            <div className="text-sm text-gray-500 mb-1">Ticket Moyen</div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(analytics.avgTicket)}€
            </div>
            <div className="text-xs text-green-600">
              +12% vs hier
            </div>
          </CardContent>
        </Card>

        {/* Objectif Jour */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 text-violet-600" />
            </div>
            <div className="text-sm text-gray-500 mb-1">Objectif Jour</div>
            <div className="text-lg font-bold text-gray-900">
              {analytics.objectives.daily}€
            </div>
            <div className="text-xs text-blue-600">
              {Math.round((analytics.daily.revenue / analytics.objectives.daily) * 100)}% atteint
            </div>
          </CardContent>
        </Card>

        {/* Bouton Vue Avancée */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer">
          <CardContent className="p-4 text-center h-full flex flex-col justify-center">
            <BarChart3 className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">
              Vue Avancée
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  // Vue jour par employé
  const renderStaffDayView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {staffMembers.map(staff => (
        <Card key={staff.id} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: staff.color }}
              >
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{staff.name}</div>
                <div className="text-sm text-gray-500">{staff.role}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {timeSlots.slice(2, 20).map(time => {
                const staffAppointments = appointments.filter((apt: Appointment) => 
                  apt.staffId === staff.id && 
                  apt.startTime === time &&
                  isSameDay(new Date(apt.date), selectedDate)
                );
                
                return (
                  <div key={time} className="flex items-center gap-2 py-1">
                    <div className="text-xs text-gray-500 w-12">{time}</div>
                    <div className="flex-1">
                      {staffAppointments.length > 0 ? (
                        staffAppointments.map((apt: Appointment) => (
                          <div
                            key={apt.id}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-2 text-xs"
                          >
                            <div className="font-semibold">{apt.clientName}</div>
                            <div className="text-gray-600">{apt.serviceName}</div>
                            <div className="text-purple-600 font-medium">{apt.price}€</div>
                          </div>
                        ))
                      ) : (
                        <div className="h-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                          <Plus className="w-3 h-3 text-gray-400" />
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

  // Vue d'ensemble
  const renderOverviewView = () => (
    <div className="space-y-6">
      {/* Planning principal */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Colonne horaires */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-500 mb-4">Horaires</div>
                {timeSlots.slice(2, 20).map(time => (
                  <div key={time} className="text-sm text-gray-600 py-2">
                    {time}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Colonnes employés */}
            {staffMembers.map(staff => (
              <div key={staff.id} className="lg:col-span-1">
                <div 
                  className="text-sm font-semibold text-white p-3 rounded-lg mb-4 text-center"
                  style={{ backgroundColor: staff.color }}
                >
                  {staff.name}
                </div>
                <div className="space-y-4">
                  {timeSlots.slice(2, 20).map(time => {
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
                              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-md p-1 text-xs h-full flex flex-col justify-center"
                            >
                              <div className="font-medium truncate">{apt.clientName}</div>
                              <div className="text-gray-600 truncate">{apt.serviceName}</div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full bg-gray-50 rounded-md border border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                            <Plus className="w-3 h-3 text-gray-400" />
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
    </div>
  );

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
                Planning Pro
              </h1>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                Gérez votre salon avec intelligence artificielle
              </p>
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
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between lg:justify-start lg:space-x-8 lg:max-w-none">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="h-10 w-10 p-0 bg-white/50 border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointments.length} rendez-vous
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="h-10 w-10 p-0 bg-white/50 border-gray-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contrôles de vue */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Mode de vue */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-3">
                  {(['day', 'week', 'month'] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'ghost'}
                      className={`rounded-none h-12 text-xs font-medium ${
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

            {/* Type de vue */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-2">
                  <Button
                    variant={viewType === 'overview' ? 'default' : 'ghost'}
                    className={`rounded-none h-12 text-xs font-medium ${
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
                    className={`rounded-none h-12 text-xs font-medium ${
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

            {/* Filtre employé */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardContent className="p-2">
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger className="h-8 border-0 bg-transparent">
                    <SelectValue placeholder="Employé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les employés</SelectItem>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Button className="h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau RDV
            </Button>

            <Button variant="outline" className="h-12 bg-white/50 border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>

            <Button variant="outline" className="h-12 bg-white/50 border-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
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