import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from "lucide-react";

type Employee = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

type Appointment = {
  id: string;
  employeeId: string;
  title: string;
  client: string;
  startTime: string;
  endTime: string;
  day: number; // 0-6 (dimanche à samedi)
  color: string;
  status: 'confirmed' | 'pending';
};

const appointments: Appointment[] = [
  // Lundi (jour 1) - Coupe et Coloration
  {
    id: '1',
    employeeId: '1',
    title: 'Coupe + Coloration',
    client: 'Sophie Martin',
    startTime: '09:00',
    endTime: '11:30',
    day: 1,
    color: '#EC4899',
    status: 'confirmed'
  },
  {
    id: '2',
    employeeId: '1',
    title: 'Brushing',
    client: 'Marie Dubois',
    startTime: '12:00',
    endTime: '12:45',
    day: 1,
    color: '#8B5CF6',
    status: 'confirmed'
  },
  {
    id: '3',
    employeeId: '1',
    title: 'Coupe Homme',
    client: 'Pierre Laurent',
    startTime: '14:00',
    endTime: '14:30',
    day: 1,
    color: '#06B6D4',
    status: 'confirmed'
  },
  {
    id: '4',
    employeeId: '1',
    title: 'Soin Capillaire',
    client: 'Emma Roussel',
    startTime: '15:30',
    endTime: '16:30',
    day: 1,
    color: '#10B981',
    status: 'confirmed'
  },
  // Mardi (jour 2) - Planning chargé
  {
    id: '5',
    employeeId: '1',
    title: 'Balayage',
    client: 'Julie Bernard',
    startTime: '09:00',
    endTime: '12:00',
    day: 2,
    color: '#F59E0B',
    status: 'confirmed'
  },
  {
    id: '6',
    employeeId: '1',
    title: 'Coupe Enfant',
    client: 'Lucas Petit',
    startTime: '13:30',
    endTime: '14:00',
    day: 2,
    color: '#EF4444',
    status: 'confirmed'
  },
  {
    id: '7',
    employeeId: '1',
    title: 'Lissage',
    client: 'Camille Blanc',
    startTime: '14:30',
    endTime: '16:30',
    day: 2,
    color: '#8B5CF6',
    status: 'confirmed'
  },
  // Mercredi (jour 3) - Planning modéré
  {
    id: '8',
    employeeId: '1',
    title: 'Permanente',
    client: 'Nina Roux',
    startTime: '10:00',
    endTime: '13:00',
    day: 3,
    color: '#06B6D4',
    status: 'confirmed'
  },
  {
    id: '9',
    employeeId: '1',
    title: 'Coupe Femme',
    client: 'Sarah Dubois',
    startTime: '15:00',
    endTime: '16:00',
    day: 3,
    color: '#EC4899',
    status: 'confirmed'
  },
  // Jeudi (jour 4) - Journée légère
  {
    id: '10',
    employeeId: '1',
    title: 'Consultation',
    client: 'Amélie Moreau',
    startTime: '10:30',
    endTime: '11:00',
    day: 4,
    color: '#10B981',
    status: 'pending'
  },
  {
    id: '11',
    employeeId: '1',
    title: 'Mèches',
    client: 'Léa Garcia',
    startTime: '14:00',
    endTime: '16:00',
    day: 4,
    color: '#F59E0B',
    status: 'confirmed'
  },
  // Vendredi (jour 5) - Journée complète
  {
    id: '12',
    employeeId: '1',
    title: 'Coupe + Couleur',
    client: 'Isabelle Martin',
    startTime: '09:30',
    endTime: '12:30',
    day: 5,
    color: '#EC4899',
    status: 'confirmed'
  },
  {
    id: '13',
    employeeId: '1',
    title: 'Brushing',
    client: 'Céline Laurent',
    startTime: '13:30',
    endTime: '14:15',
    day: 5,
    color: '#8B5CF6',
    status: 'confirmed'
  },
  {
    id: '14',
    employeeId: '1',
    title: 'Coupe Homme',
    client: 'Thomas Dupont',
    startTime: '15:00',
    endTime: '15:30',
    day: 5,
    color: '#06B6D4',
    status: 'confirmed'
  },
  {
    id: '15',
    employeeId: '1',
    title: 'Soin Profond',
    client: 'Manon Petit',
    startTime: '16:00',
    endTime: '17:00',
    day: 5,
    color: '#10B981',
    status: 'confirmed'
  },
  // Samedi (jour 6) - Week-end actif
  {
    id: '16',
    employeeId: '1',
    title: 'Balayage',
    client: 'Clara Roussel',
    startTime: '09:00',
    endTime: '11:30',
    day: 6,
    color: '#F59E0B',
    status: 'confirmed'
  },
  {
    id: '17',
    employeeId: '1',
    title: 'Coupe + Styling',
    client: 'Océane Bernard',
    startTime: '12:30',
    endTime: '14:00',
    day: 6,
    color: '#EC4899',
    status: 'confirmed'
  },
  {
    id: '18',
    employeeId: '1',
    title: 'Coupe Enfant',
    client: 'Hugo Blanc',
    startTime: '14:30',
    endTime: '15:00',
    day: 6,
    color: '#EF4444',
    status: 'confirmed'
  },
  // Dimanche (jour 0) - Fermé
  {
    id: '19',
    employeeId: '1',
    title: 'FERMÉ',
    client: '',
    startTime: '09:00',
    endTime: '19:00',
    day: 0,
    color: '#9CA3AF',
    status: 'confirmed'
  }
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const weekDays = [
  { short: 'lundi', full: 'lundi', index: 1 },
  { short: 'mardi', full: 'mardi', index: 2 },
  { short: 'mercredi', full: 'mercredi', index: 3 },
  { short: 'jeudi', full: 'jeudi', index: 4 },
  { short: 'vendredi', full: 'vendredi', index: 5 },
  { short: 'samedi', full: 'samedi', index: 6 },
  { short: 'dimanche', full: 'dimanche', index: 0 }
];

export default function PlanningFresha() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Calcul des dates de la semaine courante
  const currentWeek = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeekOffset * 7)); // Commence lundi
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }, [currentWeekOffset]);

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const goToToday = () => {
    setCurrentWeekOffset(0);
  };

  // Fonction pour calculer la position des rendez-vous
  const getAppointmentStyle = (appointment: Appointment) => {
    const startTimeParts = appointment.startTime.split(':');
    const endTimeParts = appointment.endTime.split(':');
    
    const startHour = parseInt(startTimeParts[0] || '9');
    const startMinute = parseInt(startTimeParts[1] || '0');
    const endHour = parseInt(endTimeParts[0] || '10');
    const endMinute = parseInt(endTimeParts[1] || '0');

    const startSlotIndex = timeSlots.findIndex(slot => parseInt((slot.split(':')[0] || '9')) === startHour);
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;
    const durationMinutes = totalEndMinutes - totalStartMinutes;

    const top = (startSlotIndex * 60) + ((startMinute / 60) * 60); // 60px par heure
    const height = (durationMinutes / 60) * 60; // 60px par heure

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: appointment.color,
      opacity: 0.8
    };
  };

  const formatWeekRange = () => {
    const start = currentWeek[0];
    const end = currentWeek[6];
    if (!start || !end) return '';
    return `${start.getDate()} ${start.toLocaleDateString('fr-FR', { month: 'short' })} – ${end.getDate()} ${end.toLocaleDateString('fr-FR', { month: 'short' })}, ${end.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header style Fresha */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et navigation */}
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold text-gray-900">fresha</div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={goToToday} className="text-sm">
                Aujourd'hui
              </Button>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => navigate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 min-w-[180px] text-center">
                  {formatWeekRange()}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            <Select defaultValue="team">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Toute l'équipe</SelectItem>
                <SelectItem value="alicia">Alicia</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Select defaultValue="week">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Jour</SelectItem>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      {/* Planning principal */}
      <div className="p-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header des jours */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              {/* Colonne employé */}
              <div className="p-4 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-sm font-medium flex items-center justify-center">
                    A
                  </div>
                  <span className="font-medium text-gray-900">Alicia</span>
                </div>
              </div>

              {/* Colonnes des jours */}
              {weekDays.map((weekDay, index) => {
                const date = currentWeek[index];
                const isToday = date && date.toDateString() === new Date().toDateString();
                
                return (
                  <div key={weekDay.index} className={`p-4 border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {date?.getDate()} {weekDay.short}
                      </div>
                      {isToday && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grille horaire */}
            <div className="relative">
              <div className="grid grid-cols-8">
                {/* Colonne des heures */}
                <div className="border-r border-gray-200 bg-white">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-start justify-center pt-2 text-xs text-gray-500 border-b border-gray-100 font-medium" style={{ height: '60px' }}>
                      {slot}
                    </div>
                  ))}
                </div>

                {/* Colonnes des jours */}
                {weekDays.map((weekDay) => (
                  <div key={weekDay.index} className="relative border-r border-gray-200 last:border-r-0">
                    {/* Créneaux horaires */}
                    {timeSlots.map((_, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="h-15 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                        style={{ height: '60px' }}
                      />
                    ))}
                    
                    {/* Rendez-vous pour ce jour */}
                    {appointments
                      .filter(apt => apt.day === weekDay.index)
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="absolute left-1 right-1 rounded text-xs font-medium text-white p-2 z-10 border border-gray-300"
                          style={getAppointmentStyle(appointment)}
                        >
                          <div className="font-semibold">{appointment.startTime} - {appointment.endTime}</div>
                          <div className="mt-1">{appointment.title}</div>
                          {appointment.client && (
                            <div className="text-gray-200 text-xs">{appointment.client}</div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}