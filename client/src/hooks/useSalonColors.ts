import { useQuery } from "@tanstack/react-query";

interface SalonColors {
  primaryColor: string;
}

export function useSalonColors(salonId: string) {
  const { data: colors, isLoading } = useQuery<{ colors: SalonColors }>({
    queryKey: ['/api/salon', salonId, 'colors'],
    queryFn: async () => {
      const response = await fetch(`/api/salon/${salonId}/colors`);
      if (!response.ok) {
        throw new Error('Erreur récupération couleurs salon');
      }
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    primaryColor: colors?.colors?.primaryColor || '#8b5cf6', // Violet par défaut
    isLoading,
  };
}