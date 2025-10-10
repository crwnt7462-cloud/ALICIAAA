import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, CheckCircle } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  photo: string;
  role: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  nextAvailable: string;
  experience: string;
}

export default function ProfessionalSelection() {
  const [currentLocation, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);

  // Récupérer le salon ID depuis preBookingData ou sessionStorage
  const [salonId, setSalonId] = useState<string | null>(null);
  
  // Récupérer le salon ID au chargement
  useEffect(() => {
    try {
      // Essayer d'abord preBookingData
      const preBookingData = sessionStorage.getItem('preBookingData');
      if (preBookingData) {
        const data = JSON.parse(preBookingData);
        if (data.salonSlug || data.salonId) {
          setSalonId(data.salonSlug || data.salonId);
          return;
        }
      }
      
      // Fallback: sessionStorage
      const storedSalonId = sessionStorage.getItem('salonId') || sessionStorage.getItem('salonSlug');
      if (storedSalonId) {
        setSalonId(storedSalonId);
        return;
      }
      
      // Fallback final: utiliser le slug du salon de correct@gmail.com
      setSalonId('salon-15228957'); // Salon de correct@gmail.com
    } catch (e) {
      console.warn('Erreur récupération salon ID:', e);
      setSalonId('salon-15228957'); // Fallback vers le salon de correct@gmail.com
    }
  }, []);

  // Récupérer les données du salon et des professionnels
  const { data: salonData, isLoading: salonLoading } = useQuery({
    queryKey: ['salon-data', salonId],
    queryFn: async () => {
      if (!salonId) throw new Error('Salon ID manquant');
      
      // Essayer d'abord avec l'API publique (pour les slugs)
      let response = await fetch(`/api/public/salon/${salonId}`);
      if (!response.ok) {
        // Fallback: essayer avec l'API directe
        const response2 = await fetch(`/api/salon/${salonId}`);
        if (!response2.ok) throw new Error('Salon non trouvé');
        return response2.json();
      }
      return response.json();
    },
    enabled: !!salonId,
    retry: 1
  });

  // Résoudre l'UUID du salon (depuis l'API publique) et le persister
  const resolvedSalonUuid: string | undefined = (salonData as any)?.salon?.id || (salonData as any)?.id;
  useEffect(() => {
    try {
      if (salonId) sessionStorage.setItem('salonSlug', salonId);
      if (resolvedSalonUuid) sessionStorage.setItem('salonUuid', resolvedSalonUuid);
    } catch {}
  }, [salonId, resolvedSalonUuid]);

  // Récupérer les professionnels depuis la DB (colonne membres)
  const { data: dbProfessionals, isLoading: prosLoading } = useQuery({
    queryKey: ['salon-professionals', resolvedSalonUuid],
    queryFn: async () => {
      if (!resolvedSalonUuid) return [] as any[];
      const res = await fetch(`/api/salons/${resolvedSalonUuid}/professionals`);
      if (!res.ok) return [] as any[];
      return res.json();
    },
    enabled: !!resolvedSalonUuid,
    retry: 1,
  });

  // Préférer la liste DB, sinon fallback sur les champs embarqués
  const professionals = (dbProfessionals && Array.isArray(dbProfessionals) && dbProfessionals.length > 0)
    ? dbProfessionals
    : (salonData?.salon?.teamMembers || salonData?.teamMembers || salonData?.professionals || []);

  // Normaliser les données des professionnels pour s'assurer qu'ils ont tous les champs requis
  const normalizedProfessionals = professionals.map((pro: any) => ({
    id: pro.id || `professional-${Math.random()}`,
    name: pro.name || 'Professionnel',
    photo: pro.avatar || pro.photo || '/api/placeholder/100/100',
    role: pro.role || 'Professionnel',
    rating: pro.rating || 0,
    reviewCount: pro.reviewsCount || pro.reviewCount || 0,
    specialties: pro.specialties || [],
    bio: pro.bio || '',
    nextAvailable: pro.nextSlot || pro.nextAvailable || 'Disponible',
    experience: pro.experience || ''
  }));


  // Utiliser uniquement les données réelles du salon normalisées
  const professionalsToRender = normalizedProfessionals;

  // Fonction pour mettre à jour le wizard state
  const setSelectedPro = useCallback((professionalId: string, professional: Professional) => {
    try {
      sessionStorage.setItem('selectedProfessional', JSON.stringify(professional));
  } catch (e) {
      console.warn('Erreur sauvegarde selectedProfessional:', e);
    }
  }, []);

  // Utiliser directement les professionnels sans filtrage complexe
  const filteredAndSortedProfessionals = professionalsToRender;

  const handleProfessionalSelect = useCallback((professionalId: string) => {
    setSelectedProfessional(professionalId);
    const professional = filteredAndSortedProfessionals.find((p: Professional) => p.id === professionalId);
    if (professional) {
      setSelectedPro(professionalId, professional);
      
      // Mettre à jour preBookingData
      try {
        const existing = sessionStorage.getItem('preBookingData');
        const parsed = existing ? JSON.parse(existing) : {};
        const updatedData = {
          ...parsed,
          salonSlug: salonId,
          salonId: resolvedSalonUuid || salonId,
          professionalId: professional.id,
          professionalName: professional.name
        };
        sessionStorage.setItem('preBookingData', JSON.stringify(updatedData));
      } catch (e) {
        console.warn('Erreur sauvegarde preBookingData:', e);
      }
      
      // Navigation vers BookingDateTime
      setLocation('/booking-datetime');
    }
  }, [professionalsToRender, setSelectedPro, setLocation]);

  const handleContinue = useCallback(() => {
    if (selectedProfessional) {
      const professional = filteredAndSortedProfessionals.find((p: Professional) => p.id === selectedProfessional);
      if (professional) {
        setSelectedPro(selectedProfessional, professional);
        
        // Mettre à jour preBookingData
        try {
          const existing = sessionStorage.getItem('preBookingData');
          const parsed = existing ? JSON.parse(existing) : {};
        const updatedData = {
            ...parsed,
          salonSlug: salonId,
          salonId: resolvedSalonUuid || salonId,
            professionalId: professional.id,
            professionalName: professional.name
          };
          sessionStorage.setItem('preBookingData', JSON.stringify(updatedData));
        } catch (e) {
          console.warn('Erreur sauvegarde preBookingData:', e);
        }
        
        // Navigation vers BookingDateTime
        setLocation('/booking-datetime');
      }
    }
  }, [selectedProfessional, professionalsToRender, setSelectedPro, setLocation]);

  if (salonLoading || prosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des professionnels...</p>
        </div>
      </div>
    );
  }

  if (!professionalsToRender || professionalsToRender.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucun professionnel disponible pour ce salon</p>
          <p className="text-sm text-gray-500 mb-6">Le salon n'a pas encore configuré son équipe</p>
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
        {/* Header simple */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Choisissez votre professionnel
          </h1>
          <p className="text-gray-600">
            Sélectionnez le professionnel qui vous convient le mieux
          </p>
        </div>

        {/* Liste des professionnels - Interface minimaliste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredAndSortedProfessionals.map((professional: Professional) => (
            <Card
              key={professional.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedProfessional === professional.id
                  ? 'ring-2 ring-violet-500 bg-violet-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleProfessionalSelect(professional.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <img
                      src={professional.photo}
                      alt={professional.name}
                    className="w-12 h-12 rounded-full object-cover"
                    />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-500">{professional.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  {selectedProfessional === professional.id && (
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton continuer simple */}
        {selectedProfessional && (
          <div className="text-center">
          <Button
            onClick={handleContinue}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3"
          >
            Continuer
          </Button>
        </div>
        )}
      </div>
    </div>
  );
}
