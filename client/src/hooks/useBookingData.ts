import { useQuery } from '@tanstack/react-query';

interface BookingData {
  services: Array<{
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }>;
  timeSlots: Array<{
    date: string;
    time: string;
    available: boolean;
  }>;
  salon: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    public_slug: string;
  } | null;
  professionals: Array<{
    id: string;
    name: string;
    role: string;
    specialties: string[];
    rating: number;
    experience: string;
  }>;
}

interface BookingCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Hook pour récupérer les données de réservation centralisées
export function useBookingData(salonSlug?: string, serviceId?: string, date?: string) {
  return useQuery<BookingData>({
    queryKey: ['booking-data', salonSlug, serviceId, date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (salonSlug) params.append('salon_slug', salonSlug);
      if (serviceId) params.append('service_id', serviceId);
      if (date) params.append('date', date);

      const response = await fetch(`/api/booking/data?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données de réservation');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erreur serveur');
      }
      
      return result.data;
    },
    enabled: !!salonSlug,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    retryOnMount: false,
    refetchOnWindowFocus: false
  });
}

// Hook pour récupérer les catégories de services
export function useBookingCategories() {
  return useQuery<BookingCategory[]>({
    queryKey: ['booking-categories'],
    queryFn: async () => {
      const response = await fetch('/api/booking/categories');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des catégories');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erreur serveur');
      }
      
      return result.categories;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}

// Hook pour récupérer les créneaux disponibles pour une date
export function useAvailableTimeSlots(salonSlug: string, date: string) {
  return useQuery({
    queryKey: ['time-slots', salonSlug, date],
    queryFn: async () => {
      const response = await fetch(`/api/booking/data?salon_slug=${salonSlug}&date=${date}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des créneaux');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erreur serveur');
      }
      
      return result.data.timeSlots;
    },
    enabled: !!salonSlug && !!date,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1
  });
}

// Hook pour récupérer les services d'un salon
export function useSalonServices(salonSlug: string) {
  return useQuery({
    queryKey: ['salon-services', salonSlug],
    queryFn: async () => {
      const response = await fetch(`/api/booking/data?salon_slug=${salonSlug}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des services');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erreur serveur');
      }
      
      return result.data.services;
    },
    enabled: !!salonSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}

// Hook pour récupérer les professionnels d'un salon
export function useSalonProfessionals(salonSlug: string) {
  return useQuery({
    queryKey: ['salon-professionals', salonSlug],
    queryFn: async () => {
      const response = await fetch(`/api/booking/data?salon_slug=${salonSlug}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des professionnels');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erreur serveur');
      }
      
      return result.data.professionals;
    },
    enabled: !!salonSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}
