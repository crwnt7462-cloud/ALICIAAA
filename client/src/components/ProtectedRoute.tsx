import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/api/login",
  requireAuth = true 
}: ProtectedRouteProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      toast({
        title: "Accès non autorisé",
        description: "Vous devez vous connecter pour accéder à cette page.",
        variant: "destructive",
      });
      
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1500);
    }
  }, [isAuthenticated, isLoading, requireAuth, toast, redirectTo]);

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
            Accès Protégé
          </h1>
          <p className="text-gray-600 mb-6">
            Cette page nécessite une authentification. Vous allez être redirigé vers la page de connexion...
          </p>
          <div className="animate-pulse h-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Si tout va bien, afficher le contenu
  return <>{children}</>;
}