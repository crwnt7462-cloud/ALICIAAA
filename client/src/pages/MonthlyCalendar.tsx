import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: number;
  clientName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: string;
  clientPhone: string;
}

interface Props {
  userId: string;
}

export default function MonthlyCalendar({ userId }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<{ [key: string]: Appointment[] }>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  useEffect(() => {
    fetchMonthlyAppointments();
  }, [currentDate, userId]);

  const fetchMonthlyAppointments = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      // Récupérer les appointments pour le mois actuel
      const response = await fetch(`/api/appointments/${userId}?month=${month}&year=${year}`);
      const data = await response.json();
      
      // Grouper les appointments par date
      const appointmentsByDate: { [key: string]: Appointment[] } = {};
      data.forEach((appointment: any) => {
        const date = new Date(appointment.appointmentDate).toISOString().split('T')[0];
        if (!appointmentsByDate[date]) {
          appointmentsByDate[date] = [];
        }
        appointmentsByDate[date].push({
          id: appointment.id,
          clientName: appointment.clientName || 'Client',
          serviceName: appointment.service?.name || 'Service',
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          totalPrice: appointment.totalPrice || '0',
          clientPhone: appointment.clientPhone || '',
        });
      });
      
      setAppointments(appointmentsByDate);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Jours vides pour commencer le mois
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const handleDayClick = (day: number) => {
    const dateString = getDateString(day);
    const dayAppointments = appointments[dateString] || [];
    setSelectedDay(dateString);
    setSelectedAppointments(dayAppointments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement du planning...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="border border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Planning Mensuel - {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigateMonth('prev')}
                className="border border-gray-300 rounded-xl"
              >
                ← Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
                className="border border-gray-300 rounded-xl"
              >
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateMonth('next')}
                className="border border-gray-300 rounded-xl"
              >
                Suivant →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((dayName) => (
              <div key={dayName} className="text-center font-medium text-gray-500 py-2">
                {dayName}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square"></div>;
              }

              const dateString = getDateString(day);
              const dayAppointments = appointments[dateString] || [];
              const isToday = dateString === today;

              return (
                <div
                  key={day}
                  className={`
                    aspect-square border border-gray-200 rounded-xl p-2 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${isToday ? 'bg-purple-50 border-purple-200' : 'bg-white'}
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((appointment, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-1 rounded bg-purple-100 text-purple-800 truncate"
                      >
                        {appointment.startTime} - {appointment.clientName}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour afficher les détails d'une journée */}
      <Dialog open={selectedDay !== null} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Rendez-vous du {selectedDay && new Date(selectedDay + 'T12:00:00').toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun rendez-vous prévu ce jour
              </p>
            ) : (
              selectedAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{appointment.clientName}</h4>
                      <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>⏰ {appointment.startTime} - {appointment.endTime}</div>
                    {appointment.totalPrice && (
                      <div>💰 {appointment.totalPrice} € TTC</div>
                    )}
                    {appointment.clientPhone && (
                      <div>📞 {appointment.clientPhone}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}