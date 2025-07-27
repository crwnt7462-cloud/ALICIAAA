import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Calendar, Plus, ChevronLeft, ChevronRight,
  Clock, User, Phone, MapPin, Edit3, X
} from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  notes?: string;
}

export default function PlanningModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showAddForm, setShowAddForm] = useState(false);

  // Récupérer les rendez-vous
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments', selectedDate.toISOString().split('T')[0]],
    initialData: []
  });

  // Données de démonstration
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      clientName: 'Sophie Martin',
      clientPhone: '06 12 34 56 78',
      service: 'Coupe + Couleur',
      professional: 'Marie',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 120,
      status: 'confirmed',
      price: 85,
      notes: 'Première visite'
    },
    {
      id: '2',
      clientName: 'Emma Dubois',
      clientPhone: '06 87 65 43 21',
      service: 'Soin Visage',
      professional: 'Lisa',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      duration: 60,
      status: 'confirmed',
      price: 65
    },
    {
      id: '3',
      clientName: 'Claire Bernard',
      clientPhone: '06 11 22 33 44',
      service: 'Manucure',
      professional: 'Anna',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      duration: 45,
      status: 'pending',
      price: 35
    },
    {
      id: '4',
      clientName: 'Julie Moreau',
      clientPhone: '06 55 66 77 88',
      service: 'Coupe',
      professional: 'Marie',
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      duration: 45,
      status: 'confirmed',
      price: 45
    }
  ];

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(8 + i * 0.5);
    const minute = (i * 30) % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getAppointmentForTime = (time: string) => {
    return mockAppointments.find(apt => apt.time === time);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <div className="relative">
        
        {/* Bouton retour */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-4 z-10 p-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Container principal */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto">
            
            {/* Logo */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-violet-600">Planning</h1>
            </div>

            {/* Navigation date */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-gray-200 rounded-full">
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-sm font-medium text-gray-900 capitalize">
                    {formatDate(selectedDate)}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {mockAppointments.length} rendez-vous
                  </p>
                </div>
                
                <button onClick={() => navigateDate('next')} className="p-2 hover:bg-gray-200 rounded-full">
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Stats du jour */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-violet-600">{mockAppointments.filter(a => a.status === 'confirmed').length}</div>
                  <div className="text-xs text-gray-500">Confirmés</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{mockAppointments.filter(a => a.status === 'pending').length}</div>
                  <div className="text-xs text-gray-500">En attente</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">€{mockAppointments.reduce((sum, a) => sum + a.price, 0)}</div>
                  <div className="text-xs text-gray-500">CA prévu</div>
                </div>
              </div>
            </div>

            {/* Bouton nouveau RDV */}
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="h-4 w-4" />
              Nouveau rendez-vous
            </button>

            {/* Planning des créneaux */}
            <div className="space-y-2">
              {timeSlots.map(time => {
                const appointment = getAppointmentForTime(time);
                
                return (
                  <div key={time} className="flex items-center gap-3">
                    <div className="w-12 text-xs text-gray-500 text-right">
                      {time}
                    </div>
                    
                    <div className="flex-1">
                      {appointment ? (
                        <div className={`border rounded-2xl p-3 ${getStatusColor(appointment.status)}`}>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm">{appointment.clientName}</h3>
                            <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                              <Edit3 className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs opacity-80">{appointment.service}</p>
                            <div className="flex items-center gap-2 text-xs opacity-70">
                              <User className="h-3 w-3" />
                              <span>{appointment.professional}</span>
                              <Clock className="h-3 w-3 ml-1" />
                              <span>{appointment.duration}min</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs opacity-70">€{appointment.price}</span>
                              <Phone className="h-3 w-3 opacity-70" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="w-full h-8 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors"
                        >
                          Créneau libre
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vue des RDV en liste */}
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-4">Rendez-vous du jour</h3>
              <div className="space-y-3">
                {mockAppointments.map(appointment => (
                  <div key={appointment.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{appointment.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Edit3 className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{appointment.clientName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{appointment.service}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{appointment.professional}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{appointment.duration}min</span>
                        <span>€{appointment.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}