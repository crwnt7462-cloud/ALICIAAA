import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: 3, // Retry 3 fois avant d'échouer - évite déconnexion au premier échec réseau
    staleTime: 60 * 60 * 1000, // Cache 1 heure - beaucoup plus long pour éviter déconnexions auto
    gcTime: 4 * 60 * 60 * 1000, // Garder en cache 4 heures
  });

  // Fonction pour rafraîchir l'état d'authentification
  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    refetch();
  };

  return {
    user,
    isLoading, // Plus d'arrêt du loading sur 401 - maintenir l'état utilisateur
    isAuthenticated: !!user,
    refreshAuth, // Exposer la fonction de rafraîchissement
  };
}