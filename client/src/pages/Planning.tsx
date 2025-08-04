import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeeklyPlanningView from '@/components/WeeklyPlanningView';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, MapPin, Filter, CheckCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type Appointment, type Client, type Service } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type InsertAppointmentForm = {
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

const appointmentFormSchema = insertAppointmentSchema.extend({
  notes: insertAppointmentSchema.shape.notes.optional(),
});

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function Planning() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments", viewMode === 'day' ? selectedDate : 'all'],
  });

  // For month view, get all appointments for the current month
  const currentMonth = new Date(selectedDate).getMonth();
  const currentYear = new Date(selectedDate).getFullYear();
  
  const { data: monthlyAppointments = [] } = useQuery({
    queryKey: ["/api/appointments/monthly", currentYear, currentMonth],
    enabled: viewMode === 'month'
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAppointmentForm) => 
      apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été programmé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le rendez-vous.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/appointments/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été modifié.",
      });
    },
  });

  const form = useForm<InsertAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: 0,
      serviceId: 0,
      appointmentDate: selectedDate,
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  const filteredAppointments = (appointments as any[]).filter((appointment: any) => {
    if (statusFilter === "all") return true;
    return appointment.status === statusFilter;
  });

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Programmé", variant: "secondary" as const },
      confirmed: { label: "Confirmé", variant: "default" as const },
      completed: { label: "Terminé", variant: "outline" as const },
      cancelled: { label: "Annulé", variant: "destructive" as const },
      "no-show": { label: "Absent", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const onSubmit = (data: InsertAppointmentForm) => {
    createMutation.mutate(data);
  };

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = (monthlyAppointments as any[]).filter((apt: any) => 
        apt.appointmentDate === dateStr
      );
      days.push({ day, dateStr, appointments: dayAppointments });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Header avec navigation de date et toggle vue */}
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => viewMode === 'day' ? changeDate(-1) : changeDate(-30)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold capitalize">
              {viewMode === 'day' ? formatDate(selectedDate) : new Date(currentYear, currentMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h1>
            <p className="text-sm text-gray-500">
              {viewMode === 'day' ? `${filteredAppointments.length} rendez-vous` : `${(monthlyAppointments as any[]).length} rendez-vous ce mois`}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => viewMode === 'day' ? changeDate(1) : changeDate(30)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Toggle vue jour/semaine/mois */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Jour
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Semaine
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Mois
          </Button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau RDV
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                          <SelectContent>
                            {(clients as Client[]).map((client: Client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.firstName} {client.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un service" />
                          </SelectTrigger>
                          <SelectContent>
                            {(services as Service[]).map((service: Service) => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {service.name} - {service.price}€
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Début</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
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
                        <FormLabel>Fin</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Création..." : "Créer le rendez-vous"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="confirmed">Confirmés</SelectItem>
            <SelectItem value="scheduled">Programmés</SelectItem>
            <SelectItem value="completed">Terminés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vue mois - Calendrier */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7">
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-2 border-r border-b border-gray-100 ${
                  dayData ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${
                  dayData?.dateStr === selectedDate ? 'bg-purple-50 border-purple-200' : ''
                }`}
                onClick={() => dayData && setSelectedDate(dayData.dateStr)}
              >
                {dayData && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      dayData.dateStr === selectedDate ? 'text-purple-600' : 'text-gray-700'
                    }`}>
                      {dayData.day}
                    </div>
                    
                    {/* Mini indicateurs de rendez-vous */}
                    <div className="space-y-1">
                      {dayData.appointments.slice(0, 3).map((apt: any, aptIndex: number) => (
                        <div
                          key={aptIndex}
                          className={`text-xs px-2 py-1 rounded truncate ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {apt.startTime} {apt.client?.firstName}
                        </div>
                      ))}
                      
                      {dayData.appointments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayData.appointments.length - 3} autres
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue semaine - Planning hebdomadaire */}
      {viewMode === 'week' && (
        <WeeklyPlanningView
          appointments={filteredAppointments.map(apt => ({
            id: apt.id,
            clientName: apt.client?.firstName + ' ' + (apt.client?.lastName || ''),
            serviceName: apt.service?.name || '',
            startTime: apt.startTime,
            endTime: apt.endTime,
            appointmentDate: apt.appointmentDate,
            staffId: apt.staffId,
            staffName: apt.staffId ? `Staff ${apt.staffId}` : undefined,
            status: apt.status,
            price: apt.service?.price
          }))}
          staff={[
            { id: 1, firstName: 'Marie', lastName: 'Dubois', color: '#8B5CF6', specialties: ['Coiffure'] },
            { id: 2, firstName: 'Sophie', lastName: 'Martin', color: '#06B6D4', specialties: ['Manucure'] },
            { id: 3, firstName: 'Julie', lastName: 'Petit', color: '#10B981', specialties: ['Soins'] }
          ]}
          onNewAppointment={(date, time) => {
            setSelectedDate(date);
            form.setValue('appointmentDate', date);
            form.setValue('startTime', time);
            setIsDialogOpen(true);
          }}
          showStaffView={true}
        />
      )}

      {/* Liste des rendez-vous - Vue jour */}
      {viewMode === 'day' && (
        <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Aucun rendez-vous aujourd'hui</p>
              <p className="text-sm text-gray-400">Profitez de cette journée libre !</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment: any) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {appointment.client?.firstName} {appointment.client?.lastName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {appointment.service?.name}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {appointment.service?.price}€
                        </span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 ml-2">
                    {appointment.status === "scheduled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ 
                          id: appointment.id, 
                          status: "confirmed" 
                        })}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {appointment.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateStatusMutation.mutate({ 
                          id: appointment.id, 
                          status: "cancelled" 
                        })}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>
      )}

      {/* Sélecteur de date - Vue jour uniquement */}
      {viewMode === 'day' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Changer de date</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}