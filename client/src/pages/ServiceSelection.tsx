import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Clock, Euro, User, Star, ArrowLeft, CheckCircle } from "lucide-react";
import { formatPrice, formatDuration } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  photo?: string;
}

interface Professional {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
}

interface PreBookingData {
  salonSlug: string;
  professionalId: string;
  professionalName: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: string;
  serviceDuration?: string;
}

export default function ServiceSelection() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [preBookingData, setPreBookingData] = useState<PreBookingData | null>(null);

  // Récupérer les données de pré-réservation
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('preBookingData');
      if (stored) {
        const data = JSON.parse(stored);
        setPreBookingData(data);
      }
    } catch (e) {
      console.warn('Erreur parsing preBookingData:', e);
    }
  }, []);

  // Récupérer les services du salon
  const { data: salonData, isLoading } = useQuery({
    queryKey: ['salon-services', preBookingData?.salonSlug],
    queryFn: async () => {
      if (!preBookingData?.salonSlug) throw new Error('Slug manquant');
      
      // UUID detection
      const uuidRegex = /^[0-9a-fA-F-]{36}$/;
      const isUuid = uuidRegex.test(preBookingData.salonSlug);
      
      let res;
      if (isUuid) {
        res = await fetch(`/api/salon/${preBookingData.salonSlug}`);
      } else {
        res = await fetch(`/api/public/salon/${preBookingData.salonSlug}`);
      }
      
      if (!res.ok) throw new Error('Salon non trouvé');
      const data = await res.json();
      return isUuid ? data : data.salon;
    },
    enabled: !!preBookingData?.salonSlug,
    retry: false
  });

  // Extraire les services de toutes les catégories
  const services: Service[] = useMemo(() => {
    if (!salonData?.serviceCategories) return [];
    
    const allServices: Service[] = [];
    salonData.serviceCategories.forEach((category: { id?: string; services?: any[] }) => {
      if (category.services && Array.isArray(category.services)) {
        category.services.forEach((service: { id?: string; name: string; price: string; duration: string; description?: string; photo?: string }) => {
          allServices.push({
            id: service.id || `${category.id}-${service.name}`,
            name: service.name,
            price: service.price,
            duration: service.duration,
            description: service.description || '',
            photo: service.photo
          });
        });
      }
    });
    
    return allServices;
  }, [salonData]);

  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedService || !preBookingData) return;

    // Mettre à jour les données de pré-réservation avec le service sélectionné
    const updatedData = {
      ...preBookingData,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration
    };

    try {
      sessionStorage.setItem('preBookingData', JSON.stringify(updatedData));
      } catch (e) {
      console.warn('Erreur sauvegarde preBookingData:', e);
    }

    // Redirection selon l'état d'authentification
    if (isAuthenticated) {
      // Client connecté → Page de paiement acompte
      setLocation('/booking-payment');
    } else {
      // Client non connecté → Page de connexion avec marqueur de réservation
      try {
        sessionStorage.setItem('currentBooking', 'true');
      } catch (e) {
        console.warn('Erreur sauvegarde currentBooking:', e);
      }
      setLocation('/client-login');
    }
  }, [selectedService, preBookingData, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (!preBookingData) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucune donnée de réservation trouvée</p>
          <Button onClick={() => setLocation('/')} variant="outline">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/professional-selection')}
            className="mb-6 glass-button text-violet-700 hover:text-violet-800 hover:bg-violet-50/50 px-4 py-2 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Étape 2/4
          </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Choisissez votre service
            </h1>
            <p className="text-gray-600 text-lg">
              Sélectionnez le service que vous souhaitez réserver
            </p>
          </div>
              </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                selectedService?.id === service.id 
                  ? 'ring-2 ring-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl' 
                  : 'hover:shadow-lg glass-button'
              }`}
              onClick={() => handleServiceSelect(service)}
              style={{
                background: selectedService?.id === service.id 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                  : 'transparent',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                    {service.name}
                  </CardTitle>
                  {selectedService?.id === service.id && (
                    <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-violet-600" />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-violet-600 bg-violet-50 px-3 py-2 rounded-lg">
                    <Euro className="w-4 h-4 mr-2" />
                    <span className="font-semibold text-lg">{formatPrice(parseFloat(service.price))}</span>
              </div>
                  
                  <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">{formatDuration(parseInt(service.duration))}</span>
                  </div>
                  
                  {service.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
            </div>

        {/* Continue Button */}
        {selectedService && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 shadow-2xl">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedService.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatPrice(parseFloat(selectedService.price))} • {formatDuration(parseInt(selectedService.duration))}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Avec {preBookingData.professionalName}</p>
                </div>
        </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 py-4 text-lg font-semibold rounded-2xl"
                size="lg"
              >
                {isAuthenticated ? 'Continuer vers le paiement' : 'Se connecter pour réserver'}
              </Button>
            </div>
          </div>
        )}

        {/* No services message */}
        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Aucun service disponible</p>
            <Button onClick={() => setLocation('/professional-selection')} variant="outline">
              Retour
            </Button>
        </div>
        )}
      </div>
    </div>
  );
}
