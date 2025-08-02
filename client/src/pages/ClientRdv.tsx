import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, MapPin, Search, Filter, MoreVertical } from "lucide-react";

export default function ClientRdv() {
  const [, setLocation] = useLocation();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Données de démonstration pour les rendez-vous
    setAppointments([
      {
        id: 1,
        serviceName: "Coupe + Brushing",
        salonName: "Mon Salon de Beauté",
        date: "2025-01-30",
        time: "14:30",
        price: "45€",
        status: "confirmed",
        type: "upcoming"
      },
      {
        id: 2,
        serviceName: "Soin visage",
        salonName: "Institut Belle Peau",
        date: "2025-02-05",
        time: "16:00",
        price: "65€",
        status: "pending",
        type: "upcoming"
      },
      {
        id: 3,
        serviceName: "Manucure gel",
        salonName: "Beauty Nails",
        date: "2025-01-15",
        time: "10:00",
        price: "35€",
        status: "completed",
        type: "past"
      },
      {
        id: 4,
        serviceName: "Coloration",
        salonName: "Mon Salon de Beauté",
        date: "2024-12-20",
        time: "15:00",
        price: "85€",
        status: "completed",
        type: "past"
      },
      {
        id: 5,
        serviceName: "Massage relaxant",
        salonName: "Spa Détente",
        date: "2025-01-28",
        time: "11:00",
        price: "70€",
        status: "cancelled",
        type: "cancelled"
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.salonName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || appointment.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {appointment.serviceName}
            </h4>
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {appointment.salonName}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(appointment.date).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.time}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 mb-2">{appointment.price}</p>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </div>
        </div>
        
        {appointment.status === 'confirmed' && appointment.type === 'upcoming' && (
          <div className="flex gap-2 pt-3 border-t">
            <Button size="sm" variant="outline" className="flex-1">
              Modifier
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200">
              Annuler
            </Button>
          </div>
        )}
        
        {appointment.status === 'completed' && (
          <div className="flex gap-2 pt-3 border-t">
            <Button size="sm" variant="outline" className="flex-1">
              Laisser un avis
            </Button>
            <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700">
              Reprendre RDV
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Mes rendez-vous</h1>
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-lg mx-auto px-6 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Rechercher un rendez-vous..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-gray-50 border-0 rounded-2xl"
            />
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-2xl p-1">
            <TabsTrigger value="upcoming" className="rounded-xl text-sm">À venir</TabsTrigger>
            <TabsTrigger value="past" className="rounded-xl text-sm">Passés</TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-xl text-sm">Annulés</TabsTrigger>
            <TabsTrigger value="all" className="rounded-xl text-sm">Tous</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous dans cette catégorie'}
                </p>
                <Button 
                  onClick={() => setLocation('/search')}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Réserver maintenant
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bouton flottant */}
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={() => setLocation('/search')}
            className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg"
          >
            <Calendar className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}