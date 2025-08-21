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

export default function AvyentoStyleBooking() {
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentStep, setCurrentStep] = useState<'service' | 'time' | 'details'>('service');

  const salon = {
    name: "Salon Excellence Paris",
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-16 border-b border-violet-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full bg-violet-100/50 hover:bg-violet-200/70"
            >
              <ArrowLeft className="h-4 w-4 text-violet-700" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">{salon.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3 text-violet-600" />
                <span>{salon.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 h-screen overflow-y-auto">
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card 
                    key={service.id}
                    className="bg-white/70 backdrop-blur-12 border border-violet-200/50 hover:border-violet-300/70 hover:bg-white/80 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-base lg:text-lg">{service.name}</h4>
                          </div>
                          {service.description && (
                            <p className="text-sm text-gray-600 mb-3 lg:mb-2">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-violet-600" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center lg:text-right flex-shrink-0">
                          <div className="text-xl lg:text-2xl font-bold text-violet-700 mb-2">
                            {service.price}
                          </div>
                          <Button 
                            size="sm"
                            className="bg-violet-600/90 backdrop-blur-8 hover:bg-violet-700 text-white px-4 lg:px-6 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            Choisir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Section avis */}
            <Card className="mt-6 bg-white/70 backdrop-blur-12 border border-violet-200/50 shadow-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-violet-600/90 backdrop-blur-8 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-sm">
                    {salon.rating}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-base">Accueil</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{salon.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">
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

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="h-12 lg:h-14 bg-white/70 backdrop-blur-8 border-violet-200/50 hover:border-violet-400/70 hover:bg-violet-600/90 hover:text-white transition-all duration-200 font-medium text-base shadow-sm hover:shadow-md"
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

            <Card className="bg-white/70 backdrop-blur-12 border border-violet-200/50 shadow-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold text-gray-900">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-semibold text-gray-900">{selectedService.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Horaire</span>
                    <span className="font-semibold text-gray-900">Aujourd'hui à 14:00</span>
                  </div>
                  <div className="border-t border-violet-200/30 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-lg">Total</span>
                    <span className="text-2xl font-bold text-violet-700">{selectedService.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleBooking}
              className="w-full h-12 lg:h-14 bg-violet-600/90 backdrop-blur-8 hover:bg-violet-700 text-white font-semibold text-base lg:text-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Confirmer la réservation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}