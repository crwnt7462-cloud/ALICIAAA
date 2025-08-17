import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Share, Settings, Download, Euro, Target, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

// Configuration des créneaux horaires (12 PM à 8 PM comme dans l'image)
const timeSlots = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Couleurs pour les différents types d'événements
const eventColors = [
  { bg: 'bg-green-200', border: 'border-green-300', text: 'text-green-800' }, // Lunch
  { bg: 'bg-purple-200', border: 'border-purple-300', text: 'text-purple-800' }, // Meetings
  { bg: 'bg-blue-200', border: 'border-blue-300', text: 'text-blue-800' }, // Projects
  { bg: 'bg-yellow-200', border: 'border-yellow-300', text: 'text-yellow-800' }, // Creative
  { bg: 'bg-pink-200', border: 'border-pink-300', text: 'text-pink-800' }, // Family
  { bg: 'bg-indigo-200', border: 'border-indigo-300', text: 'text-indigo-800' }, // Networking
];

export default function PlanningResponsive() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'week'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments"],
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

  const form = useForm<InsertAppointmentForm>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointmentDate: "",
      startTime: "",
      endTime: "",
      notes: "",
      clientId: 0,
      serviceId: 0,
    },
  });

  // Calcul des dates de la semaine
  const { currentWeek, currentMonth, currentYear } = useMemo(() => {
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
      currentYear: startOfWeek.getFullYear()
    };
  }, [currentWeekOffset]);

  // Données d'exemple pour reproduire le planning de l'image
  const sampleEvents = [
    // Dimanche 18
    { id: 1, title: "Lunch", time: "12:00-13:00", day: 0, color: 0, duration: 2 },
    { id: 2, title: "Hobbies", time: "16:00-18:00", day: 0, color: 4, duration: 4 },
    { id: 3, title: "Family Time", time: "18:00-19:00", day: 0, color: 4, duration: 2 },
    
    // Lundi 19
    { id: 4, title: "Lunch", time: "12:00-13:00", day: 1, color: 0, duration: 2 },
    { id: 5, title: "Meet", time: "15:00-16:00", day: 1, color: 1, duration: 2 },
    { id: 6, title: "Creative Brainstorm", time: "16:00-20:00", day: 1, color: 3, duration: 8 },
    
    // Mardi 20
    { id: 7, title: "Lunch with Emma", time: "12:00-13:00", day: 2, color: 1, duration: 2 },
    { id: 8, title: "Meet with @Ei", time: "13:00-14:00", day: 2, color: 1, duration: 2 },
    { id: 9, title: "Networking Event", time: "14:00-16:00", day: 2, color: 5, duration: 4 },
    { id: 10, title: "Product Development", time: "16:00-17:00", day: 2, color: 2, duration: 2 },
    
    // Mercredi 21
    { id: 11, title: "Lunch", time: "12:00-13:00", day: 3, color: 0, duration: 2 },
    { id: 12, title: "Team Meeting", time: "14:00-15:00", day: 3, color: 2, duration: 2 },
    { id: 13, title: "Project A", time: "17:00-18:00", day: 3, color: 2, duration: 2 },
    
    // Jeudi 22
    { id: 14, title: "Lunch with Emma", time: "12:00-13:00", day: 4, color: 1, duration: 2 },
    { id: 15, title: "Project Start", time: "14:00-15:00", day: 4, color: 2, duration: 2 },
    { id: 16, title: "Project Review", time: "17:00-18:00", day: 4, color: 2, duration: 2 },
  ];

  // Fonction pour obtenir la position de l'événement
  const getEventPosition = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const totalMinutes = (hour - 12) * 60 + minute;
    return (totalMinutes / 30) * 40; // 40px par demi-heure
  };

  // Fonction pour calculer la hauteur de l'événement
  const getEventHeight = (duration: number) => {
    return duration * 20; // 20px par demi-heure
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  // Calcul des insights CA
  const dailyRevenue = 1847;
  const weeklyRevenue = 8392;
  const monthlyRevenue = 28450;
  const monthlyGoal = 35000;
  const goalProgress = (monthlyRevenue / monthlyGoal) * 100;
  const avgTicket = 67;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 lg:max-w-none lg:w-full">
      <div className="container mx-auto p-4 lg:p-6">
        
        {/* Header avec insights */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Insights CA au-dessus */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CA Jour</p>
                    <p className="text-2xl font-bold text-purple-600">{dailyRevenue}€</p>
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
                    <p className="text-2xl font-bold text-blue-600">{weeklyRevenue}€</p>
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
                    <p className="text-2xl font-bold text-amber-600">{monthlyRevenue}€</p>
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
                    <p className="text-2xl font-bold text-green-600">{avgTicket}€</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Header du calendrier */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekOffset(0)}
                  className="bg-white/80 backdrop-blur-sm border-gray-200"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium text-gray-700 capitalize">
                  {currentMonth} {currentYear}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value="week">
                <SelectTrigger className="w-24 bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Vue calendrier hebdomadaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          {/* En-tête des jours */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 text-sm font-medium text-gray-500 border-r border-gray-200">
              UTC +7
            </div>
            {currentWeek.map((date, index) => (
              <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-medium text-gray-500">
                  {weekDays[date.getDay()]} {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Événements all day */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 text-sm font-medium text-gray-500 border-r border-gray-200">
              All day
            </div>
            <div className="p-2 border-r border-gray-200 bg-blue-50">
              <div className="text-sm font-medium text-blue-700">Photo Session</div>
            </div>
            <div className="p-2 border-r border-gray-200 bg-purple-50">
              <div className="text-sm font-medium text-purple-700">Brain Training</div>
            </div>
            <div className="p-2 border-r border-gray-200 bg-green-50">
              <div className="text-sm font-medium text-green-700">Skill Enhancement</div>
            </div>
            <div className="p-2 border-r border-gray-200 bg-yellow-50">
              <div className="text-sm font-medium text-yellow-700">Call Mom</div>
            </div>
            <div className="p-2 border-r border-gray-200"></div>
            <div className="p-2 border-r border-gray-200"></div>
            <div className="p-2"></div>
          </div>

          {/* Grille horaire */}
          <div className="relative">
            <div className="grid grid-cols-8">
              {/* Colonne des heures */}
              <div className="border-r border-gray-200">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="h-20 flex items-start justify-end pr-2 pt-1 text-xs text-gray-500 border-b border-gray-100">
                    {slot}
                  </div>
                ))}
              </div>

              {/* Colonnes des jours */}
              {currentWeek.map((date, dayIndex) => (
                <div key={dayIndex} className="relative border-r border-gray-200 last:border-r-0">
                  {timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="h-20 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                    />
                  ))}
                  
                  {/* Événements pour ce jour */}
                  {sampleEvents
                    .filter(event => event.day === dayIndex)
                    .map((event) => {
                      const colorScheme = eventColors[event.color];
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text} border rounded-md p-1 text-xs font-medium shadow-sm z-10`}
                          style={{
                            top: `${getEventPosition(event.time.split('-')[0])}px`,
                            height: `${getEventHeight(event.duration)}px`,
                            minHeight: '30px'
                          }}
                        >
                          <div className="truncate">{event.title}</div>
                          <div className="text-xs opacity-75">{event.time}</div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Panel latéral Meet (reproduisant celui de l'image) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6 hidden lg:block"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Meet</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Thursday, 18 September</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">3:00</span>
              <span className="text-sm text-gray-600">4:00</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">All day</span>
              <span className="text-sm">Yearly</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  N
                </div>
                <span className="text-sm font-medium">Nazmi Javier</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  E
                </div>
                <span className="text-sm">Emilia Inder</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm text-blue-600 underline">
                https://meet.google.com/izp-srs...
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Jakarta, Indonesia
              </div>
            </div>
            
            <div className="text-sm text-gray-700 leading-relaxed">
              You're invited to join our Google Meet session for an important discussion.
            </div>
            
            <div className="text-sm text-blue-600">
              Link: https://meet.google.com/izp-srsk-txf
            </div>
            
            <div className="text-sm text-gray-600">
              We look forward to your participation!
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Add Reminders</div>
              <div className="flex space-x-2">
                {['', '', '', '', '', '', '', ''].map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${
                    i === 0 ? 'bg-red-500' :
                    i === 1 ? 'bg-orange-500' :
                    i === 2 ? 'bg-pink-500' :
                    i === 3 ? 'bg-yellow-500' :
                    i === 4 ? 'bg-green-500' :
                    i === 5 ? 'bg-blue-500' :
                    i === 6 ? 'bg-purple-500' : 'bg-gray-400'
                  }`} />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="ghost" className="text-gray-600">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
            </div>
          </div>
        </motion.div>

        {/* Dialog pour créer un RDV */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg lg:hidden"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client: any) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.firstName} {client.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service: any) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - {service.price}€
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure début</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Début" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure fin</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Notes du rendez-vous..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createMutation.isPending ? "Création..." : "Créer"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}