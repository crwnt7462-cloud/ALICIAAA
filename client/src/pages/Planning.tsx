import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

export default function Planning() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket();

  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["/api/appointments", selectedDate],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Listen for real-time updates
  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      refetch();
    }
  }, [lastMessage, refetch]);

  const form = useForm({
    resolver: zodResolver(insertAppointmentSchema.extend({
      appointmentDate: insertAppointmentSchema.shape.appointmentDate.default(selectedDate),
    })),
    defaultValues: {
      appointmentDate: selectedDate,
      startTime: "09:00",
      endTime: "10:00",
      status: "scheduled",
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createAppointmentMutation.mutate(data);
  };

  // Generate time slots from 8:00 to 20:00
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const getAppointmentForSlot = (time: string) => {
    return appointments.find((apt: any) => apt.startTime === time);
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Planning</h2>
          <p className="text-xs text-gray-600 mt-1 flex items-center">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
            {new Date(selectedDate).toLocaleDateString('fr-FR', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-bg text-white px-3 py-1.5 rounded-lg font-medium shadow-md hover:scale-105 transition-all duration-200 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Nouveau RDV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Client</Label>
                <Select onValueChange={(value) => form.setValue('clientId', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Service</Label>
                <Select onValueChange={(value) => form.setValue('serviceId', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service: any) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - {service.price}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Heure de début</Label>
                  <Input
                    type="time"
                    {...form.register('startTime')}
                  />
                </div>
                <div>
                  <Label>Heure de fin</Label>
                  <Input
                    type="time"
                    {...form.register('endTime')}
                  />
                </div>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  {...form.register('appointmentDate')}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createAppointmentMutation.isPending}>
                {createAppointmentMutation.isPending ? "Création..." : "Créer le rendez-vous"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Selector */}
      <div className="mb-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        {timeSlots.map((time) => {
          const appointment = getAppointmentForSlot(time);
          
          return (
            <Card key={time} className="border border-gray-200 dark:border-gray-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16">
                      {time}
                    </div>
                    <div className="flex-1">
                      {appointment ? (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-primary">
                                {appointment.client 
                                  ? `${appointment.client.firstName} ${appointment.client.lastName}`
                                  : appointment.clientName
                                }
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {appointment.service?.name || 'Service non spécifié'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {appointment.endTime ? 
                                  `${Math.round((new Date(`1970-01-01T${appointment.endTime}:00`) - new Date(`1970-01-01T${appointment.startTime}:00`)) / 60000)}min` 
                                  : ''
                                } - {appointment.totalPrice}€
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
                              >
                                <Phone className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="p-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Créneau libre
                          </p>
                          <button 
                            className="text-primary text-sm hover:underline mt-1"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            Programmer un RDV
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
