import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  price: string;
  description?: string;
  duration?: number;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  slug: string;
}

export default function SalonBookingSimple() {
  const { toast } = useToast();
  const [match, params] = useRoute('/salon-booking/:slug');
  const salonSlug = params?.slug;

  // Récupérer les informations du salon
  const { data: salon, isLoading: salonLoading } = useQuery({
    queryKey: ['/api/salons/by-slug', salonSlug],
    queryFn: async () => {
      const response = await fetch(`/api/salons/by-slug/${salonSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch salon');
      }
      return response.json();
    },
    enabled: !!salonSlug,
  });

  // Récupérer les services du salon
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const response = await fetch(`/api/services?salonId=${salonSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return response.json();
    },
    enabled: !!salonSlug,
  });

  const handleBack = () => {
    window.history.back();
  };

  const handleServiceSelect = (service: Service) => {
    toast({
      title: "Service sélectionné",
      description: `${service.name} - ${service.price}€`,
    });
    // Ici vous pouvez ajouter la logique de navigation vers l'étape suivante
  };

  if (salonLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-purple-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!salon || !services) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erreur de chargement</p>
          <p className="text-sm text-gray-500 mt-2">
            Salon: {salon ? '✓' : '✗'} | Services: {services ? '✓' : '✗'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Slug: {salonSlug}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-3 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-purple-900">{salon.name}</h1>
            <p className="text-sm text-gray-600">{salon.address}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-4">
          Choisissez un service
        </h2>

        <div className="space-y-3">
          {services.map((service: Service) => (
            <Card 
              key={service.id} 
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200"
              onClick={() => handleServiceSelect(service)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-purple-900 mb-1">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-purple-900">
                      {parseFloat(service.price).toFixed(0)}€
                    </p>
                    {service.duration && (
                      <p className="text-xs text-gray-500">
                        {service.duration} min
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Résumé footer */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-purple-900 mb-2">Résumé</h3>
          <p className="text-sm text-gray-600">
            Sélectionnez un service pour continuer votre réservation
          </p>
        </div>
      </div>
    </div>
  );
}