import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/business/me"],
    queryFn: async () => {
      const res = await fetch("/api/business/me", {
        credentials: "include",
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error("Non authentifié");
      return (await res.json()).user;
    },
    retry: 3,
    staleTime: 60 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
  });

  // Fonction pour rafraîchir l'état d'authentification
  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/business/me"] });
    refetch();
  };

  return {
    user,
    isLoading, // Plus d'arrêt du loading sur 401 - maintenir l'état utilisateur
    isAuthenticated: !!user,
    refreshAuth, // Exposer la fonction de rafraîchissement
  };
}