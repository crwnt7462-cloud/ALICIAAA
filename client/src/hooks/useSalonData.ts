import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';

interface SalonData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  notifications: {
    newBookings: boolean;
    cancellations: boolean;
    reminders: boolean;
    reviews: boolean;
  };
  bookingSettings: {
    advanceBooking: number;
    cancellationDelay: number;
    autoConfirm: boolean;
  };
}

export function useSalonData(salonId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [salonData, setSalonData] = useState<SalonData>({
    id: salonId,
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: {
      monday: { open: '', close: '', closed: true },
      tuesday: { open: '', close: '', closed: true },
      wednesday: { open: '', close: '', closed: true },
      thursday: { open: '', close: '', closed: true },
      friday: { open: '', close: '', closed: true },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    notifications: {
      newBookings: false,
      cancellations: false,
      reminders: false,
      reviews: false
    },
    bookingSettings: {
      advanceBooking: 0,
      cancellationDelay: 0,
      autoConfirm: false
    }
  });

  // Charger les données au montage du composant
  useEffect(() => {
    const loadSalonData = async () => {
      setIsLoading(true);
      try {
        // 1. D'abord essayer de charger depuis localStorage (plus rapide)
        const localData = localStorage.getItem(`salon-${salonId}`);
        if (localData) {
          const parsedData = JSON.parse(localData);
          setSalonData(parsedData);
          console.log('✅ Données chargées depuis localStorage');
        }

        // 2. Ensuite charger depuis la base de données (données à jour)
        // TODO: Remplacer par un vrai appel API
        // const response = await apiRequest(`/api/salons/${salonId}`);
        // setSalonData(response);
        // console.log('✅ Données synchronisées depuis la base de données');

        // Simulation des données de base pour la démo
        if (!localData) {
          const defaultData = {
            ...salonData,
            name: 'Mon Salon Pro',
            address: '123 Rue de la Beauté, Paris',
            phone: '01 42 34 56 78',
            email: 'contact@monsalonpro.fr',
            description: 'Votre salon de beauté moderne au cœur de Paris'
          };
          setSalonData(defaultData);
          localStorage.setItem(`salon-${salonId}`, JSON.stringify(defaultData));
        }

      } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du salon",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSalonData();
  }, [salonId, toast]);

  // Fonction pour mettre à jour les données
  const updateSalonData = (updates: Partial<SalonData>) => {
    setSalonData(prev => {
      const newData = { ...prev, ...updates };
      // Sauvegarder immédiatement en localStorage
      localStorage.setItem(`salon-${salonId}`, JSON.stringify(newData));
      return newData;
    });
  };

  return {
    salonData,
    setSalonData,
    updateSalonData,
    isLoading
  };
}