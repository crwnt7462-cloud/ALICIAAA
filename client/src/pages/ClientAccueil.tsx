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
        salonName: "Mon Salon de Beauté",
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
        salon: "Mon Salon de Beauté",
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
    <div className="min-h-screen bg-white">
      {/* Header simple */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-base font-medium text-gray-900">Accueil</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Contenu simplifié */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Salutation simple */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Bonjour {clientData.firstName}
          </h2>
          <p className="text-gray-500 text-sm">
            Réservez votre prochain rendez-vous
          </p>
        </div>

        {/* Bouton de réservation principal */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-center">
          <h3 className="text-white font-semibold text-lg mb-2">Nouveau rendez-vous</h3>
          <p className="text-violet-100 text-sm mb-4">Trouvez et réservez en quelques clics</p>
          <Button 
            className="bg-white text-violet-600 hover:bg-gray-100 font-medium"
            onClick={() => setLocation('/search')}
          >
            Rechercher un salon
          </Button>
        </div>

        {/* Prochains rendez-vous - version simplifiée */}
        {upcomingAppointments.length > 0 && (
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-gray-900">Prochain rendez-vous</h3>
                <Button variant="ghost" size="sm" onClick={() => setLocation('/client-rdv')}>
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
              {upcomingAppointments.slice(0, 1).map((appointment) => (
                <div key={appointment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{appointment.serviceName}</span>
                    <span className="text-sm font-semibold text-gray-900">{appointment.price}</span>
                  </div>
                  <div className="text-sm text-gray-600">{appointment.salonName}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{appointment.date}</span>
                    <span>{appointment.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions rapides - version simplifiée */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-center py-3"
            onClick={() => setLocation('/search')}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Rechercher</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-center py-3"
            onClick={() => setLocation('/client-rdv')}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Mes RDV</span>
          </Button>
        </div>
      </div>
    </div>
  );
}