import { useQuery } from '@tanstack/react-query';

interface BaseService {
  id: number;
  name: string;
  duration: number; // en minutes
  price: number; // en euros
  description?: string;
  category?: string;
}

interface SalonServiceOverride {
  id: number;
  salonId: string;
  serviceId: number;
  price?: number; // override du prix
  duration?: number; // override de la durée
  enabled: boolean;
}

interface ServiceWithOverride extends BaseService {
  effectivePrice: number;
  effectiveDuration: number;
  override?: SalonServiceOverride;
}

export interface UseSalonServicesResult {
  services: ServiceWithOverride[];
  isLoading: boolean;
  error: Error | null;
  getServiceById: (serviceId: number) => ServiceWithOverride | undefined;
}

/**
 * Hook pour récupérer les services d'un salon avec les prix/durées personnalisés
 */
export default function useSalonServices(salonId: string): UseSalonServicesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/salons/salon/${salonId}/services`],
    queryFn: async () => {
      const response = await fetch(`/api/salons/salon/${salonId}/services`);
      if (!response.ok) {
        throw new Error('Failed to fetch salon services');
      }
      return response.json();
    },
    enabled: !!salonId,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Traitement des données : calcul des valeurs effectives
  const services: ServiceWithOverride[] = (data as any)?.services?.map((serviceData: any) => {
    const baseService: BaseService = {
      id: serviceData.id,
      name: serviceData.name,
      duration: serviceData.duration || 30, // défaut 30 min
      price: serviceData.price || 0,
      description: serviceData.description,
      category: serviceData.category
    };

    // Override depuis salon_services si présent
    const override = serviceData.salonServiceOverride;
    
    return {
      ...baseService,
      effectivePrice: override?.price ?? baseService.price,
      effectiveDuration: override?.duration ?? baseService.duration,
      override
    };
  }) || [];

  const getServiceById = (serviceId: number): ServiceWithOverride | undefined => {
    return services.find(service => service.id === serviceId);
  };

  return {
    services,
    isLoading,
    error,
    getServiceById
  };
}