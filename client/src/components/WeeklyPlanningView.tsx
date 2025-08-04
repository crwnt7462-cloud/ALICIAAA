import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, startOfWeek, addDays, startOfDay, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Appointment {
  id: number;
  clientName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  staffId?: number;
  staffName?: string;
  status: string;
  price?: number;
}

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  color: string;
  specialties?: string[];
}

interface WeeklyPlanningViewProps {
  appointments: Appointment[];
  staff: Staff[];
  onNewAppointment?: (date: string, time: string, staffId?: number) => void;
  showStaffView?: boolean;
  selectedStaffId?: number;
}

export default function WeeklyPlanningView({ 
  appointments, 
  staff, 
  onNewAppointment,
  showStaffView = false,
  selectedStaffId 
}: WeeklyPlanningViewProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { locale: fr }));
  const [viewMode, setViewMode] = useState<'group' | 'individual'>('group');
  
  // Generate hours from 8:00 to 20:00
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  
  // Get days of current week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // Filter appointments for current week
  const weekAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.appointmentDate);
    return weekDays.some(day => isSameDay(aptDate, day));
  });

  // Filter staff if individual view
  const displayStaff = showStaffView && selectedStaffId 
    ? staff.filter(s => s.id === selectedStaffId)
    : staff;

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'prev' ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(startOfWeek(new Date(), { locale: fr }));
  };

  const getAppointmentsForDayAndHour = (day: Date, hour: number, staffId?: number) => {
    return weekAppointments.filter(apt => {
      const aptDate = parseISO(apt.appointmentDate);
      const aptHour = parseInt(apt.startTime.split(':')[0]);
      const matchesDay = isSameDay(aptDate, day);
      const matchesHour = aptHour === hour;
      const matchesStaff = !staffId || apt.staffId === staffId;
      
      return matchesDay && matchesHour && matchesStaff;
    });
  };

  const isPremiumDay = (day: Date) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 6; // Saturday
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-black">Planning Hebdomadaire</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="h-8 w-8 p-1 glass-button hover:glass-effect"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={goToCurrentWeek}
                className="px-4 text-sm glass-button hover:glass-effect text-black"
              >
                {format(currentWeek, 'w', { locale: fr })}e semaine {format(currentWeek, 'yyyy')}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="h-8 w-8 p-1 glass-button hover:glass-effect"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          {showStaffView && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'group' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('group')}
                className="glass-button hover:glass-effect text-black"
              >
                Vue Groupe
              </Button>
              <Button
                variant={viewMode === 'individual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('individual')}
                className="glass-button hover:glass-effect text-black"
              >
                Vue Individuelle
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="p-6">
        <Card className="glass-card border-white/40">
          <CardContent className="p-0">
            {/* Days Header */}
            <div className="sticky top-0 bg-white/60 backdrop-blur-sm border-b border-white/30">
              <div className="grid grid-cols-8 gap-0">
                <div className="p-4 border-r border-white/30">
                  <div className="text-sm font-medium text-gray-600">Heure</div>
                </div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-4 text-center border-r border-white/30 last:border-r-0">
                    <div className="font-medium text-black">
                      {format(day, 'EEEE', { locale: fr })}
                    </div>
                    <div className="text-lg font-bold text-black">
                      {format(day, 'd MMM', { locale: fr })}
                    </div>
                    {isPremiumDay(day) && (
                      <div className="text-xs text-violet-600 font-medium">
                        Tarif majoré
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="max-h-[70vh] overflow-y-auto">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-0 border-b border-white/20 min-h-[80px]">
                  {/* Hour Column */}
                  <div className="p-3 border-r border-white/30 bg-white/30 flex items-start">
                    <div className="text-sm font-medium text-gray-700">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  </div>

                  {/* Day Columns */}
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-r border-white/30 last:border-r-0 p-2 min-h-[80px] relative">
                      {viewMode === 'group' ? (
                        // Group View - Show all staff appointments
                        <div className="space-y-1">
                          {getAppointmentsForDayAndHour(day, hour).map((apt) => {
                            const staffMember = staff.find(s => s.id === apt.staffId);
                            return (
                              <div
                                key={apt.id}
                                className="p-2 rounded-lg text-xs"
                                style={{
                                  backgroundColor: staffMember?.color + '20',
                                  borderLeft: `3px solid ${staffMember?.color || '#8B5CF6'}`
                                }}
                              >
                                <div className="font-medium text-gray-900 truncate">
                                  {apt.clientName}
                                </div>
                                <div className="text-gray-600 truncate">
                                  {apt.serviceName}
                                </div>
                                {staffMember && (
                                  <div className="text-xs text-gray-500">
                                    {staffMember.firstName}
                                  </div>
                                )}
                                <div className="text-xs font-medium">
                                  {apt.startTime}-{apt.endTime}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Individual View - Staff-specific appointments
                        displayStaff.map((staffMember) => (
                          <div key={staffMember.id} className="mb-2">
                            <div className="text-xs text-gray-500 mb-1">
                              {staffMember.firstName} {staffMember.lastName}
                            </div>
                            {getAppointmentsForDayAndHour(day, hour, staffMember.id).map((apt) => (
                              <div
                                key={apt.id}
                                className="p-2 rounded-lg text-xs mb-1"
                                style={{
                                  backgroundColor: staffMember.color + '20',
                                  borderLeft: `3px solid ${staffMember.color}`
                                }}
                              >
                                <div className="font-medium text-gray-900 truncate">
                                  {apt.clientName}
                                </div>
                                <div className="text-gray-600 truncate">
                                  {apt.serviceName}
                                </div>
                                <div className="text-xs font-medium">
                                  {apt.startTime}-{apt.endTime}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      )}

                      {/* Add Appointment Button */}
                      {onNewAppointment && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onNewAppointment(format(day, 'yyyy-MM-dd'), `${hour}:00`)}
                          className="absolute bottom-1 right-1 h-6 w-6 p-0 glass-button hover:glass-effect opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        {staff.length > 0 && (
          <div className="mt-4 p-4 glass-card border-white/40">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Équipe</h3>
            <div className="flex flex-wrap gap-3">
              {staff.map((staffMember) => (
                <div key={staffMember.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: staffMember.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {staffMember.firstName} {staffMember.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}