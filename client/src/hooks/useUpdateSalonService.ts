import { useState } from 'react';

interface UpdateServiceData {
  price?: number;
  duration?: number;
}

interface UpdateServiceResult {
  success: boolean;
  service?: {
    serviceId: string;
    name: string;
    price: number;
    duration: number;
    salon_id: string;
  };
  error?: string;
}

export default function useUpdateSalonService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateService = async (
    salonId: string,
    serviceId: number,
    updates: UpdateServiceData
  ): Promise<UpdateServiceResult> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useUpdateSalonService] Updating:', { salonId, serviceId, updates });

      const response = await fetch(`/api/salons/salon/${salonId}/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMsg = result.error || `HTTP ${response.status}`;
        setError(errorMsg);
        console.error('[useUpdateSalonService] Error:', errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('[useUpdateSalonService] Success:', result);
      return result;

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      console.error('[useUpdateSalonService] Exception:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateService,
    isLoading,
    error
  };
}