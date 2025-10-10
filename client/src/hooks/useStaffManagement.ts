import { useState, useEffect } from 'react';

export interface Professional {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  selectedServices?: string[]; // Nouveaux services sélectionnés
  jobTitle?: string; // Intitulé exact du métier
  nextAvailable: string;
  availableToday?: boolean;
  role?: string;
  email?: string;
  phone?: string;
  bio?: string;
  experience?: string;
}

// Données initiales vides - les données réelles viennent de l'API
const initialProfessionals: Professional[] = [];

// Clé pour le localStorage
const STAFF_STORAGE_KEY = 'salon_staff_data';

// Système d'événements pour la synchronisation
class StaffEventManager {
  private listeners: ((professionals: Professional[]) => void)[] = [];

  subscribe(callback: (professionals: Professional[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notify(professionals: Professional[]) {
    this.listeners.forEach(callback => callback(professionals));
  }
}

const staffEventManager = new StaffEventManager();

// Hook pour la gestion du staff avec synchronisation
export function useStaffManagement() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchroniser avec localStorage et notifier les autres composants
  const updateProfessionals = (newProfessionals: Professional[]) => {
    setProfessionals(newProfessionals);
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(newProfessionals));
    staffEventManager.notify(newProfessionals);
  };

  // Charger les données depuis l'API
  useEffect(() => {
    const loadStaffData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer l'ID du salon depuis l'API /api/salon/my-salon
        const salonResponse = await fetch('/api/salon/my-salon', {
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (!salonResponse.ok) {
          throw new Error(`Erreur salon ${salonResponse.status}: ${salonResponse.statusText}`);
        }

        const salonData = await salonResponse.json();
        const salonId = salonData.salon?.id || salonData.id;
        
        if (!salonId) {
          console.warn('Aucun salon ID trouvé dans la réponse API');
          setProfessionals([]);
          return;
        }

        console.log('🔍 Salon ID récupéré:', salonId);

        // Maintenant récupérer les professionnels de ce salon
        const response = await fetch(`/api/salons/${salonId}/professionals`, {
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (!response.ok) {
          throw new Error(`Erreur professionals ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('👥 Professionnels récupérés:', data);
        
        setProfessionals(data || []);
        
        // Sauvegarder en localStorage pour la synchronisation
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(data || []));
        
      } catch (error) {
        console.error('Erreur lors du chargement du staff:', error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaffData();
  }, []);

  // Écouter les changements d'autres composants
  useEffect(() => {
    const unsubscribe = staffEventManager.subscribe((newProfessionals) => {
      setProfessionals(newProfessionals);
    });
    return unsubscribe;
  }, []);

  const addProfessional = (professional: Omit<Professional, 'id'>) => {
    const newProfessional: Professional = {
      ...professional,
      id: `professional_${Date.now()}`
    };
    updateProfessionals([...professionals, newProfessional]);
  };

  const updateProfessional = (id: string, updates: Partial<Professional>) => {
    const updated = professionals.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    updateProfessionals(updated);
  };

  const deleteProfessional = (id: string) => {
    const filtered = professionals.filter(p => p.id !== id);
    updateProfessionals(filtered);
  };

  return {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    setProfessionals: updateProfessionals
  };
}