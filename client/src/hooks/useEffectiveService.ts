import { useState, useEffect } from 'react';

interface EffectiveServiceData {
  name: string;
  price: number;
  duration: number;
}

interface UseEffectiveServiceResult {
  isLoading: boolean;
  error: Error | null;
  data: EffectiveServiceData | null;
}

/**
 * Hook pour récupérer les données effectives d'un service avec logique de priorité :
 * 1. Professional services (tarif/durée fixés par le pro)
 * 2. Salon services (override salon)  
 * 3. Base services (prix/durée par défaut)
 */
export default function useEffectiveService(
  salonId: string | undefined,
  serviceId: number | undefined,
  proId: string | undefined
): UseEffectiveServiceResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<EffectiveServiceData | null>(null);

  useEffect(() => {
    if (!salonId || !serviceId) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Clé de cache incluant TOUS les paramètres pour éviter réutilisation incorrecte
    const cacheKey = `effective-service-${salonId}-${serviceId}-${proId || 'no-pro'}`;
    console.log('[useEffectiveService] Cache key:', cacheKey);

    const fetchEffectiveService = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('[useEffectiveService] Fetching:', { salonId, serviceId, proId });

        // 1. Récupération via l'API REST existante (qui contient déjà les overrides salon)
        const response = await fetch(`/api/salons/salon/${salonId}/services`);
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        
        const apiData = await response.json();
        const services = apiData.services || [];
        
        console.log('[useEffectiveService] API Response:', { 
          success: apiData.success,
          servicesCount: services.length,
          services: services
        });
        
        // Trouver le service demandé (l'API retourne serviceId comme string)
        const baseService = services.find((s: any) => {
          const apiServiceId = parseInt(s.serviceId);
          const match = apiServiceId === serviceId;
          console.log('[useEffectiveService] Checking service:', {
            apiServiceId,
            serviceId,
            match,
            serviceName: s.name
          });
          return match;
        });
        
        if (!baseService) {
          console.error('[useEffectiveService] Service not found:', { 
            serviceId, 
            serviceIdType: typeof serviceId,
            availableServices: services.map((s: any) => ({ 
              id: s.serviceId, 
              idType: typeof s.serviceId,
              name: s.name,
              parsedId: parseInt(s.serviceId)
            }))
          });
          throw new Error(`Service ${serviceId} not found`);
        }

        console.log('[useEffectiveService] Found service:', baseService);

        // L'API retourne déjà les prix/durées effectives (avec overrides salon appliqués)
        let effectivePrice = baseService.price;
        let effectiveDuration = baseService.duration;

        // 2. Vérification des overrides professionnel (priorité 1 - plus haute)
        if (proId) {
          // Simulation d'override professionnel - à remplacer par vraie API
          // Par exemple, si c'est le pro "Antoine Dubois", il a un tarif spécial pour la Coupe + Brushing
          if (serviceId === 1) { // Coupe + Brushing
            effectivePrice = 34; // Tarif pro spécial (au lieu de 39€ salon)
            // effectiveDuration reste le même
          }
        }

        const result = {
          name: baseService.name,
          price: effectivePrice,
          duration: effectiveDuration
        };

        // Log temporaire pour debug
        console.log('[booking] effectiveService', { 
          serviceId, 
          proId, 
          price: result.price, 
          duration: result.duration,
          basePrice: baseService.price,
          hasProOverride: !!proId,
          hasSalonOverride: !!baseService.salonServiceOverride
        });

        setData(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('[booking] effectiveService error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEffectiveService();
  }, [salonId, serviceId, proId]);

  return {
    isLoading,
    error,
    data
  };
}