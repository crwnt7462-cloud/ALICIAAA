import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useSalonSync() {
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSalonUpdate = (event: CustomEvent) => {
      const { salonId, data, timestamp } = event.detail;
      
      console.log('🔄 Synchronisation salon detectée:', salonId);
      
      // Mettre à jour le cache des requêtes
      queryClient.setQueryData(['/api/salons', salonId], data);
      queryClient.invalidateQueries({ queryKey: ['/api/salons'] });
      
      // Mettre à jour la liste de recherche si elle existe
      queryClient.setQueryData(['/api/salons/search'], (oldData: any) => {
        if (!oldData) return oldData;
        
        return oldData.map((salon: any) => 
          salon.id === salonId ? { ...salon, ...data } : salon
        );
      });

      setLastUpdate(timestamp);
    };

    // Écouter les événements de mise à jour des salons
    window.addEventListener('salon-updated', handleSalonUpdate as EventListener);

    return () => {
      window.removeEventListener('salon-updated', handleSalonUpdate as EventListener);
    };
  }, [queryClient]);

  return {
    lastUpdate
  };
}