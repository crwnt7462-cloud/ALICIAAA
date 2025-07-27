import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Star, Heart, Gift } from "lucide-react";

export default function ClientAccueil() {
  const [, setLocation] = useLocation();
  const [clientData, setClientData] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<any[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    // Récupérer les données client depuis localStorage
    const storedClientData = localStorage.getItem('clientData');
    if (storedClientData) {
      const client = JSON.parse(storedClientData);
      setClientData(client);
      setLoyaltyPoints(client.loyaltyPoints || 0);
    }

    // Données de démonstration pour les rendez-vous à venir
    setUpcomingAppointments([
      {
        id: 1,
        serviceName: "Coupe + Brushing",
        salonName: "Salon Excellence Paris",
        date: "2025-01-30",
        time: "14:30",
        price: "45€",
        status: "confirmed"
      },
      {
        id: 2,
        serviceName: "Soin visage",
        salonName: "Institut Belle Peau",
        date: "2025-02-05",
        time: "16:00",
        price: "65€",
        status: "pending"
      }
    ]);

    // Services favoris
    setFavoriteServices([
      {
        id: 1,
        name: "Coupe + Brushing",
        salon: "Salon Excellence Paris",
        price: "45€",
        rating: 4.8
      },
      {
        id: 2,
        name: "Manucure gel",
        salon: "Beauty Nails",
        price: "35€",
        rating: 4.9
      }
    ]);
  }, []);

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

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
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Accueil</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-lg mx-auto px-6 py-8 space-y-8">
        {/* Salutation */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour {clientData.firstName} !
          </h2>
          <p className="text-gray-600">
            Découvrez vos prochains rendez-vous et services favoris
          </p>
        </div>

        {/* Points de fidélité */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm mb-1">Points de fidélité</p>
                <p className="text-3xl font-bold">{loyaltyPoints}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Gift className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                className="bg-white text-violet-600 hover:bg-gray-100"
                size="sm"
              >
                Voir mes récompenses
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prochains rendez-vous */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/client-rdv')}
              className="text-violet-600"
            >
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
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
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {upcomingAppointments.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucun rendez-vous programmé</p>
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

        {/* Services favoris */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services favoris</h3>
          
          <div className="space-y-3">
            {favoriteServices.map((service) => (
              <Card key={service.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.salon}
                      </p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600">{service.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 mb-2">{service.price}</p>
                      <Button 
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        Réserver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setLocation('/search')}
              className="h-20 bg-violet-600 hover:bg-violet-700 flex flex-col items-center justify-center"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span className="text-sm">Nouveau RDV</span>
            </Button>
            
            <Button 
              onClick={() => setLocation('/search')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center border-2"
            >
              <Heart className="w-6 h-6 mb-2" />
              <span className="text-sm">Mes favoris</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}