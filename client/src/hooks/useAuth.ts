import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/salon/my-salon"],
    queryFn: async () => {
      const res = await fetch("/api/salon/my-salon", {
        credentials: "include",
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error("Non authentifié");
      const salonData = await res.json();
      // Retourner un objet user compatible avec l'interface attendue
      return {
        id: salonData.owner_id || 'unknown',
        email: 'user@example.com', // Pas disponible dans salon data
        firstName: 'User',
        lastName: 'Name',
        salonName: salonData.name
      };
    },
    retry: 3,
    staleTime: 60 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
  });

  // Fonction pour rafraîchir l'état d'authentification
  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/salon/my-salon"] });
    refetch();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshAuth,
  };
}