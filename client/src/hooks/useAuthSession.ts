import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SessionData {
  authenticated: boolean;
  userType?: 'professional' | 'client';
  userId?: string;
  clientId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
}

// Hook pour gérer les sessions persistantes
export function useAuthSession() {
  const queryClient = useQueryClient();

  // Vérifier la session actuelle
  const { data: session, isLoading } = useQuery<SessionData>({
    queryKey: ['/api/auth/check-session'],
    retry: 3, // Retry 3 fois pour éviter déconnexion sur échecs réseau temporaires
    staleTime: 60 * 60 * 1000, // Cache 1 heure - sessions persistantes
    gcTime: 4 * 60 * 60 * 1000, // Garder 4 heures en mémoire
  });

  // Mutation pour se connecter (professionnel)
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
  const response = await apiRequest('POST', '/api/login', credentials);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/check-session'] });
    }
  });

  // Mutation pour se connecter (client)
  const clientLoginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/client/login', credentials);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/check-session'] });
    }
  });

  // Mutation pour s'inscrire (professionnel)
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
  const response = await apiRequest('POST', '/api/register', userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/check-session'] });
    }
  });

  // Mutation pour s'inscrire (client)
  const clientRegisterMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/auth/client/register', userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/check-session'] });
    }
  });

  // Mutation pour se déconnecter
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear(); // Vider tout le cache
      // Ne pas rediriger automatiquement
    }
  });

  return {
    // État de la session
    session,
    isLoading,
    isAuthenticated: session?.authenticated || false,
    isProfessional: session?.userType === 'professional',
    isClient: session?.userType === 'client',
    
    // Données utilisateur
    user: session?.authenticated ? {
      id: session.userId || session.clientId,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      businessName: session.businessName,
      userType: session.userType
    } : null,

    // Mutations
    login: loginMutation.mutate,
    clientLogin: clientLoginMutation.mutate,
    register: registerMutation.mutate,
    clientRegister: clientRegisterMutation.mutate,
    logout: logoutMutation.mutate,
    
    // Objets mutations complets
    loginMutation,
    registerMutation,
    clientLoginMutation,
    clientRegisterMutation,
    logoutMutation,

    // États des mutations
    isLoggingIn: loginMutation.isPending || clientLoginMutation.isPending,
    isRegistering: registerMutation.isPending || clientRegisterMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Erreurs
    loginError: loginMutation.error || clientLoginMutation.error,
    registerError: registerMutation.error || clientRegisterMutation.error,
    logoutError: logoutMutation.error,
  };
}