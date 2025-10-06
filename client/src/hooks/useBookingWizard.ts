import { useState, useCallback, useEffect } from 'react';

interface BookingState {
  selectedServiceId?: number;
  selectedProId?: string;
  selectedDate?: string;
  selectedTime?: string;
  salonId?: string;
}

interface UseBookingWizardResult {
  bookingState: BookingState;
  isWizardReady: boolean;
  setSelectedService: (serviceId: number, serviceData?: any) => void;
  setSelectedPro: (proId: string, proData?: any) => void;
  setSelectedDateTime: (date: string, time: string) => void;
  setSalonId: (salonId: string) => void;
  clearSelectedPro: () => void;
  shouldRequirePro: (service?: any) => boolean;
  canSkipProfessionalStep: () => boolean;
}

/**
 * Hook pour gérer l'état du wizard de réservation
 * Centralise la logique de navigation et de persistance entre les étapes
 */
export default function useBookingWizard(): UseBookingWizardResult {
  // État pour tracker si le wizard est prêt (hydraté)
  const [isWizardReady, setIsWizardReady] = useState(false);
  
  // Initialisation lazy du state depuis localStorage
  const [bookingState, setBookingState] = useState<BookingState>(() => {
    const savedService = localStorage.getItem('selectedService');
    const savedPro = localStorage.getItem('selectedProfessional');
    
    const initialState: BookingState = {};
    
    if (savedService) {
      try {
        const serviceData = JSON.parse(savedService);
        initialState.selectedServiceId = serviceData.id;
      } catch (e) {
        console.warn('Invalid selectedService in localStorage');
      }
    }
    
    if (savedPro) {
      try {
        const proData = JSON.parse(savedPro);
        initialState.selectedProId = proData.id;
      } catch (e) {
        console.warn('Invalid selectedProfessional in localStorage');
      }
    }
    
    return initialState;
  });

  // Marquer le wizard comme prêt après l'hydratation
  useEffect(() => {
    // Ne pas purger automatiquement localStorage.selectedService ici :
    // cela peut effacer la sélection faite par l'utilisateur entre les étapes.
    setIsWizardReady(true);
  }, []);

  const setSelectedService = (serviceId: number, serviceData?: any) => {
    setBookingState(prev => {
      // Ne réinitialiser le pro que si le service change vraiment
      const shouldResetPro = prev.selectedServiceId !== serviceId;
      
      if (shouldResetPro && prev.selectedProId) {
        console.log('booking_pro_reset_on_service_change', { 
          oldServiceId: prev.selectedServiceId,
          newServiceId: serviceId 
        });
      }
      
      return {
        ...prev, 
        selectedServiceId: serviceId,
        selectedProId: shouldResetPro ? undefined : prev.selectedProId
      };
    });
    
    // Ne plus stocker de données factices dans localStorage
    // Les vraies données viendront de useEffectiveService
    // If caller provided full service data, persist it so other pages can read (booking recap)
    if (serviceData) {
      try {
        localStorage.setItem('selectedService', JSON.stringify(serviceData));
        try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: serviceData })); } catch (e) { /* ignore */ }
      } catch (e) {
        /* ignore storage errors */
      }
    } else {
      // ensure at least the id is stored for downstream pages
      try {
        localStorage.setItem('selectedService', JSON.stringify({ id: serviceId }));
        try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: { id: serviceId } })); } catch (e) { /* ignore */ }
      } catch (e) { /* ignore */ }
    }
    
    // Ne supprimer selectedProfessional que si le service change
    const currentServiceId = bookingState.selectedServiceId;
    if (currentServiceId !== serviceId) {
      localStorage.removeItem('selectedProfessional');
    }
    
    console.log('booking_service_selected', { serviceId });
  };

  const setSelectedPro = (proId: string, proData?: any) => {
    setBookingState(prev => ({ ...prev, selectedProId: proId }));
    if (proData) {
      localStorage.setItem('selectedProfessional', JSON.stringify(proData));
      try { window.dispatchEvent(new CustomEvent('selectedProfessionalChanged', { detail: proData })); } catch (e) { /* ignore */ }
    }
    console.log('booking_professional_selected', { proId });
  };

  const setSelectedDateTime = (date: string, time: string) => {
    setBookingState(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
  };

  const setSalonId = (salonId: string) => {
    setBookingState(prev => ({ ...prev, salonId }));
  };

  const clearSelectedPro = () => {
    setBookingState(prev => ({ ...prev, selectedProId: undefined }));
    localStorage.removeItem('selectedProfessional');
  };

  /**
   * Détermine si un service requiert la sélection d'un professionnel
   * @param service - Données du service (optionnel, utilise localStorage si non fourni)
   */
  const shouldRequirePro = useCallback((service?: any): boolean => {
    // Vérifier la variable d'environnement d'abord
    if (import.meta.env.VITE_BOOKING_REQUIRE_PRO === 'false') {
      return false;
    }
    
    // Par défaut true si le service n'a pas de champ requiresPro défini
    const requiresPro = service?.requiresPro ?? true;
    return requiresPro;
  }, []);

  /**
   * Détermine si on peut skipper l'étape de sélection du professionnel
   */
  const canSkipProfessionalStep = (): boolean => {
    return !shouldRequirePro();
  };

  return {
    bookingState,
    isWizardReady,
    setSelectedService,
    setSelectedPro,
    setSelectedDateTime,
    setSalonId,
    clearSelectedPro,
    shouldRequirePro,
    canSkipProfessionalStep
  };
}