import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStaffManagement } from "@/hooks/useStaffManagement";

export default function ProfessionalSelection() {
  const [, setLocation] = useLocation();
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  
  // Récupérer le service sélectionné depuis localStorage
  const selectedServiceData = localStorage.getItem('selectedService');
  const selectedService = selectedServiceData ? JSON.parse(selectedServiceData) : null;

  // Utiliser le hook de gestion du staff synchronisé (lecture seule)
  const { professionals } = useStaffManagement();

  const handleContinue = () => {
    if (selectedProfessional) {
      // Stocker la sélection et passer à la sélection date/heure
      localStorage.setItem('selectedProfessional', JSON.stringify(
        professionals.find(p => p.id === selectedProfessional)
      ));
      setLocation('/booking-datetime');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/salon')}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choisir un professionnel</h1>
            {selectedService && (
              <p className="text-sm text-gray-600 mt-1">
                Service: <span className="font-medium">{selectedService.name}</span> • {selectedService.duration} • {selectedService.price}€
              </p>
            )}
          </div>
        </div>

        {/* Liste des professionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {professionals.map((professional) => (
            <Card
              key={professional.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedProfessional === professional.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              }`}
              onClick={() => setSelectedProfessional(professional.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={professional.photo}
                    alt={professional.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{professional.name}</h3>
                    <p className="text-sm text-violet-600 font-medium">{professional.role}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{professional.rating}</span>
                      <span className="text-sm text-gray-500">({professional.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Spécialités :</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-violet-100 text-violet-700"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {professional.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{professional.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Prochaine disponibilité :</p>
                    <p className="text-sm font-medium text-green-600">{professional.nextAvailable}</p>
                  </div>

                  {professional.bio && (
                    <div>
                      <p className="text-sm text-gray-500 line-clamp-2">{professional.bio}</p>
                    </div>
                  )}
                </div>

                {selectedProfessional === professional.id && (
                  <div className="mt-4 pt-4 border-t border-violet-200">
                    <div className="flex items-center justify-center">
                      <Badge className="bg-violet-500 text-white">
                        Sélectionné
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton de continuation */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedProfessional}
            className="w-full md:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}