import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 0, // Forcer la vérification immédiate
    gcTime: 0, // Pas de cache
  });

  // Si erreur 401, on est sûr que pas authentifié
  const isNotAuthenticated = error && error.message.includes('401');

  return {
    user,
    isLoading: isLoading && !isNotAuthenticated, // Arrêter le loading si 401
    isAuthenticated: !!user,
  };
}