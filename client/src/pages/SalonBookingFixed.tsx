import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { RetryPanel } from '../components/RetryPanel';
import { useSalonLoader } from '../hooks/useSalonLoader';

export default function SalonBookingFixed() {
  const { loading, error, salon, services, retry } = useSalonLoader();
  
  // États simplifiés sans hooks conditionnels
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="glass-card p-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-purple-700">Chargement du salon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <RetryPanel onRetry={retry} message={error} />;
  }

  if (!salon) {
    return <RetryPanel onRetry={retry} message="Aucun salon trouvé" />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
        {/* Header */}
        <div className="glass-header sticky top-0 z-50 backdrop-blur-lg bg-white/30 border-b border-purple-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-purple-700 hover:bg-purple-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-purple-900">{salon.name}</h1>
                <p className="text-sm text-purple-600">{salon.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sélection de service */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-purple-900 mb-4">
                    Choisissez un service
                  </h2>
                  
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-purple-600">Aucun service disponible pour ce salon</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedService?.id === service.id
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                          onClick={() => setSelectedService(service)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-purple-900">{service.name}</h3>
                              <Badge variant="outline" className="mt-1">
                                {service.price}€
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Résumé */}
            <div>
              <Card className="glass-card sticky top-32">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">
                    Résumé
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-purple-600">Salon</p>
                      <p className="font-medium text-purple-900">{salon.name}</p>
                    </div>
                    
                    {selectedService && (
                      <div>
                        <p className="text-sm text-purple-600">Service</p>
                        <p className="font-medium text-purple-900">{selectedService.name}</p>
                        <p className="text-lg font-bold text-purple-900">{selectedService.price}€</p>
                      </div>
                    )}
                  </div>

                  {selectedService && (
                    <Button 
                      className="w-full mt-6 glass-button-pink"
                      onClick={() => setCurrentStep(2)}
                    >
                      Continuer
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}