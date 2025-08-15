import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Plus } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  nextAvailable: string;
}

export default function ProfessionalSelection() {
  const [, setLocation] = useLocation();
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);

  // Données des professionnels du salon Bonhomme
  const professionals: Professional[] = [
    {
      id: "antoine",
      name: "Antoine",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
      rating: 4.9,
      reviewCount: 127,
      specialties: ["Coupe homme", "Barbe", "Coiffure classique"],
      nextAvailable: "Aujourd'hui 14h30"
    },
    {
      id: "marie",
      name: "Marie",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&auto=format",
      rating: 4.8,
      reviewCount: 89,
      specialties: ["Coupe femme", "Coloration", "Brushing"],
      nextAvailable: "Demain 10h00"
    },
    {
      id: "julien",
      name: "Julien",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
      rating: 4.7,
      reviewCount: 156,
      specialties: ["Coupe moderne", "Styling", "Coupe dégradée"],
      nextAvailable: "Aujourd'hui 16h00"
    },
    {
      id: "sophie",
      name: "Sophie",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
      rating: 4.9,
      reviewCount: 203,
      specialties: ["Coiffure mixte", "Extensions", "Chignon"],
      nextAvailable: "Demain 9h30"
    }
  ];

  const handleContinue = () => {
    if (selectedProfessional) {
      // Stocker la sélection et passer à l'étape suivante
      localStorage.setItem('selectedProfessional', selectedProfessional);
      setLocation('/booking-datetime');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/salon/demo-user')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Bonhomme - Paris Archives</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Étape */}
        <div className="mb-6">
          <div className="text-sm text-violet-600 font-medium mb-1">1. Choix du professionnel</div>
          <h2 className="text-xl font-bold text-gray-900">
            Choisissez votre coiffeur
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Sélectionnez le professionnel avec qui vous souhaitez prendre rendez-vous
          </p>
        </div>

        {/* Liste des professionnels */}
        <div className="space-y-3 mb-6">
          {professionals.map((pro) => (
            <Card 
              key={pro.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedProfessional === pro.id 
                  ? 'ring-2 ring-violet-500 border-violet-200 bg-violet-50' 
                  : 'hover:shadow-md border-gray-200'
              }`}
              onClick={() => setSelectedProfessional(pro.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Photo du professionnel */}
                  <div className="relative">
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {selectedProfessional === pro.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Nom et note */}
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {pro.rating} ({pro.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Spécialités */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pro.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {pro.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{pro.specialties.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Prochaine disponibilité */}
                    <p className="text-xs text-green-600 font-medium">
                      Dispo : {pro.nextAvailable}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Option "Pas de préférence" */}
          <Card 
            className={`cursor-pointer transition-all duration-200 border-dashed ${
              selectedProfessional === 'any' 
                ? 'ring-2 ring-violet-500 border-violet-200 bg-violet-50' 
                : 'hover:shadow-md border-gray-300'
            }`}
            onClick={() => setSelectedProfessional('any')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Pas de préférence</h3>
                  <p className="text-sm text-gray-600">
                    Le premier professionnel disponible
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Plus de créneaux disponibles
                  </p>
                </div>
                {selectedProfessional === 'any' && (
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bouton Continuer */}
        <Button
          onClick={handleContinue}
          disabled={!selectedProfessional}
          className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:bg-gray-300"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}