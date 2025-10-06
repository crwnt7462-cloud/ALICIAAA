import { useState, useEffect } from 'react';
import type { Professional } from './useStaffManagement';

// Données mock (reprises exactement du hook original pour compatibilité)
const mockProfessionals: Professional[] = [
  {
    id: "antoine",
    name: "Antoine",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Coupe homme", "Barbe", "Coiffure classique"],
    nextAvailable: "Aujourd'hui 14h30",
    role: "Barbier Senior",
    email: "antoine@salon.fr",
    phone: "06 12 34 56 78",
    bio: "Spécialiste des coupes masculines traditionnelles et modernes",
    experience: "8 ans d'expérience"
  },
  {
    id: "marie",
    name: "Marie",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&auto=format",
    rating: 4.8,
    reviewCount: 89,
    specialties: ["Coupe femme", "Coloration", "Brushing"],
    nextAvailable: "Demain 10h00",
    role: "Coloriste Experte",
    email: "marie@salon.fr",
    phone: "06 98 76 54 32",
    bio: "Experte en colorations et soins capillaires",
    experience: "6 ans d'expérience"
  },
  {
    id: "julien",
    name: "Julien",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
    rating: 4.7,
    reviewCount: 156,
    specialties: ["Coupe moderne", "Styling", "Coupe dégradée"],
    nextAvailable: "Aujourd'hui 16h00",
    role: "Styliste Créatif",
    email: "julien@salon.fr",
    phone: "06 55 44 33 22",
    bio: "Passionné par les coupes tendances et créatives",
    experience: "4 ans d'expérience"
  },
  {
    id: "sophie",
    name: "Sophie",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Coiffure mixte", "Extensions", "Chignon"],
    nextAvailable: "Demain 9h30",
    role: "Coiffeuse Polyvalente",
    email: "sophie@salon.fr",
    phone: "06 77 88 99 00",
    bio: "Experte en coiffures événementielles et extensions",
    experience: "10 ans d'expérience"
  }
];

// Interface pour les données API
interface APIProfessional {
  id: string;
  name: string;
  title: string | null;
  avatarUrl: string | null;
  rating: number | null;
  reviewsCount: number | null;
  tags: string[];
  nextAvailable: string | null;
  bio: string | null;
}

// Mapper API vers format UI
function mapAPIToUIFormat(apiPro: APIProfessional): Professional {
  return {
    id: apiPro.id,
    name: apiPro.name,
    photo: apiPro.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    rating: apiPro.rating || 4.5,
    reviewCount: apiPro.reviewsCount || 0,
    specialties: apiPro.tags || [],
    nextAvailable: apiPro.nextAvailable || "Disponible aujourd'hui",
    role: apiPro.title || "Professionnel",
    email: "",
    phone: "",
    bio: apiPro.bio || "",
    experience: ""
  };
}

export interface UseProfessionalsResult {
  data: Professional[];
  isLoading: boolean;
  error: Error | null;
}

export default function useProfessionals(salonId: string | undefined): UseProfessionalsResult {
  const [data, setData] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si pas de salonId, retourner vide avec warning
    if (!salonId) {
      console.warn("missing salonId");
      setData([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Vérifier le feature flag
    const featureRealPros = import.meta.env.VITE_FEATURE_REAL_PROS === 'true';
    
    if (!featureRealPros) {
      // Mode démo : retourner les mock data
      setData(mockProfessionals);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Mode réel : fetch depuis l'API
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/salons/${salonId}/professionals`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const apiProfessionals: APIProfessional[] = await response.json();
        const mappedProfessionals = apiProfessionals.map(mapAPIToUIFormat);
        
        setData(mappedProfessionals);
      } catch (err) {
        const apiError = err instanceof Error ? err : new Error('Unknown error');
        setError(apiError);
        
        // Fallback vers les données mock en cas d'erreur
        console.warn("pros_fallback_mock", { salonId, error: apiError.message });
        setData(mockProfessionals);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, [salonId]);

  return {
    data,
    isLoading,
    error
  };
}