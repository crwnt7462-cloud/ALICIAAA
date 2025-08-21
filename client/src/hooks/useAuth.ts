import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache 5 minutes pour éviter les déconnexions
    gcTime: 10 * 60 * 1000, // Garder en cache 10 minutes
  });

  // Si erreur 401, on est sûr que pas authentifié
  const isNotAuthenticated = error && error.message.includes('401');

  // Fonction pour rafraîchir l'état d'authentification
  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    refetch();
  };

  return {
    user,
    isLoading: isLoading && !isNotAuthenticated, // Arrêter le loading si 401
    isAuthenticated: !!user,
    refreshAuth, // Exposer la fonction de rafraîchissement
  };
}