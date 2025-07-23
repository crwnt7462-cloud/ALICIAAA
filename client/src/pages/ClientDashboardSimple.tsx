import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, MapPin, Phone, Star, 
  LogOut, Plus, Settings, Bell, ChevronRight,
  CheckCircle2, AlertCircle, XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
}

interface Appointment {
  id: number;
  serviceName: string;
  professionalName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
  status: string;
  salonName: string;
  salonAddress: string;
}

export default function ClientDashboardSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    const data = localStorage.getItem("clientUser") || localStorage.getItem("clientData");
    
    if (!token || !data) {
      setLocation("/client/login");
      return;
    }
    
    try {
      setClientData(JSON.parse(data));
    } catch (error) {
      console.error("Erreur parsing client data:", error);
      setLocation("/client/login");
    }
  }, [setLocation]);

  // Récupération des rendez-vous
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/client/appointments'],
    enabled: !!clientData,
    queryFn: async () => {
      const token = localStorage.getItem("clientToken");
      const response = await fetch('/api/client/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    localStorage.removeItem("clientData");
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    setLocation("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmé': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmé': return <CheckCircle2 className="h-4 w-4" />;
      case 'en_attente': return <AlertCircle className="h-4 w-4" />;
      case 'annulé': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(apt => apt.status === 'confirmé');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header simple */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={clientData.profileImageUrl} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-medium">
                  {clientData.firstName?.[0]}{clientData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-base font-medium text-gray-900">
                  Bonjour {clientData.firstName}
                </h1>
                <p className="text-xs text-gray-500">Mes rendez-vous</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <Bell className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <LogOut className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{upcomingAppointments.length}</div>
              <p className="text-sm text-gray-600">RDV confirmés</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">3</div>
              <p className="text-sm text-gray-600">Salons favoris</p>
            </CardContent>
          </Card>
        </div>

        {/* Nouveau rendez-vous */}
        <Button 
          className="w-full gradient-bg text-white rounded-xl h-12 text-base font-medium"
          onClick={() => setLocation('/booking')}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau rendez-vous
        </Button>

        {/* Prochains rendez-vous */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">
              Mes rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Aucun rendez-vous prévu</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => setLocation('/booking')}
                >
                  Réserver maintenant
                </Button>
              </div>
            ) : (
              appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/40 backdrop-blur-sm">
                  <div className="flex-shrink-0">
                    <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1 text-xs font-medium`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {appointment.serviceName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {appointment.salonName}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.appointmentTime}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              ))
            )}
            
            {appointments.length > 3 && (
              <Button variant="ghost" className="w-full text-purple-600 hover:bg-purple-50">
                Voir tous mes rendez-vous
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Accès rapides */}
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="h-14 flex-col gap-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
            onClick={() => setLocation('/client/messages')}
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs">Messages</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-14 flex-col gap-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
            onClick={() => setLocation('/ai')}
          >
            <Star className="h-4 w-4" />
            <span className="text-xs">IA Beauté</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-14 flex-col gap-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
          >
            <Phone className="h-4 w-4" />
            <span className="text-xs">Support</span>
          </Button>
        </div>

        {/* Section salons favoris */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Mes salons favoris
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Salon Excellence", address: "Paris 16ème", rating: 4.9 },
              { name: "Beauty Center", address: "Paris 15ème", rating: 4.7 },
              { name: "Coiffure Prestige", address: "Paris 3ème", rating: 4.8 }
            ].map((salon, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/40 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm">
                      {salon.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{salon.name}</p>
                    <p className="text-xs text-gray-600">{salon.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{salon.rating}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}