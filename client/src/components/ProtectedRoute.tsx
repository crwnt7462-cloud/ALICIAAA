import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  pageType?: 'professional' | 'client';
}

export default function ProtectedRoute({ 
  children, 
  redirectTo,
  requireAuth = true,
  pageType = 'professional'
}: ProtectedRouteProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Déterminer la page de redirection selon le type
  const getRedirectUrl = () => {
    if (redirectTo) return redirectTo;
    
    return pageType === 'client' ? '/client-login-modern' : '/api/login';
  };

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      const message = pageType === 'client' 
        ? "Vous devez vous connecter à votre compte client pour accéder à cette page."
        : "Vous devez vous connecter à votre compte professionnel pour accéder à cette page.";
      
      toast({
        title: "Accès non autorisé",
        description: message,
        variant: "destructive",
      });
      
      // Rediriger vers la bonne page de connexion après un court délai
      setTimeout(() => {
        window.location.href = getRedirectUrl();
      }, 1500);
    }
  }, [isAuthenticated, isLoading, requireAuth, toast, pageType]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50">
        <div className="glass-card p-8 rounded-3xl text-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  // Si l'authentification est requise mais que l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 p-4">
        <div className="glass-card p-8 rounded-3xl text-center max-w-md w-full">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {pageType === 'client' ? 'Espace Client Protégé' : 'Espace Professionnel Protégé'}
          </h1>
          <p className="text-gray-600 mb-6">
            {pageType === 'client' 
              ? 'Cette page nécessite une connexion client. Vous allez être redirigé vers la page de connexion client...'
              : 'Cette page nécessite une connexion professionnelle. Vous allez être redirigé vers la page de connexion pro...'
            }
          </p>
          <div className="animate-pulse h-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Si tout va bien, afficher le contenu
  return <>{children}</>;
}