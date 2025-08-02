import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Clock, Calendar, User } from "lucide-react";

interface Service {
  id: number;
  name: string;
  duration: string;
  price: string;
  description?: string;
}

export default function PlanityStyleBooking() {
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentStep, setCurrentStep] = useState<'service' | 'time' | 'details'>('service');

  const salon = {
    name: "Mon Salon de Beauté",
    address: "45 Avenue Victor Hugo, 75116 Paris",
    rating: 4.9,
    reviewCount: 343,
    verified: true
  };

  const services: Service[] = [
    {
      id: 1,
      name: "Coupe Signature",
      duration: "30min",
      price: "39 €",
      description: "Coupe personnalisée avec consultation morphologique"
    },
    {
      id: 2,
      name: "Coupe Dégradée",
      duration: "45min", 
      price: "46 €",
      description: "Coupe moderne avec dégradé sur-mesure"
    },
    {
      id: 3,
      name: "Coupe Transformation",
      duration: "45min",
      price: "45 €",
      description: "Changement complet de style avec conseils"
    }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('time');
  };

  const handleBooking = () => {
    setLocation('/booking-success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">{salon.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{salon.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* En-tête réservation */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Réserver en ligne pour un RDV chez {salon.name}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>24h/24 • Gratuitement • Confirmation immédiate</span>
          </div>
        </div>

        {currentStep === 'service' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Choix de la prestation</h3>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-3">Cheveux</div>
              
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className="border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          {service.price}
                        </div>
                        <Button 
                          size="sm"
                          className="bg-gray-900 hover:bg-gray-800 text-white px-4"
                        >
                          Choisir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Section avis */}
            <Card className="mt-6 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium">
                    {salon.rating}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium text-gray-900">Accueil</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{salon.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {salon.reviewCount} clients ont donné leur avis
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'time' && selectedService && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep('service')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h3 className="font-medium text-gray-900">{selectedService.name}</h3>
                <p className="text-sm text-gray-600">{selectedService.duration} • {selectedService.price}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choisir un créneau</h3>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>Aujourd'hui, 27 janvier 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="h-12 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    onClick={() => setCurrentStep('details')}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'details' && selectedService && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep('time')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h3 className="font-medium text-gray-900">Récapitulatif</h3>
                <p className="text-sm text-gray-600">{selectedService.name} • 14:00</p>
              </div>
            </div>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-medium">{selectedService.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Horaire</span>
                    <span className="font-medium">Aujourd'hui à 14:00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-xl font-semibold text-gray-900">{selectedService.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleBooking}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              Confirmer la réservation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}