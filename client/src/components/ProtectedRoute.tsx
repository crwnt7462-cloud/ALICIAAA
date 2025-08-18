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

  // Rediriger vers l'accueil pour toutes les pages protégées
  const getRedirectUrl = () => {
    if (redirectTo) return redirectTo;
    
    return '/'; // Redirection vers l'accueil
  };

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      const message = pageType === 'client' 
        ? "Cette page est réservée aux clients connectés. Retour à l'accueil..."
        : "Cette page est réservée aux professionnels connectés. Retour à l'accueil...";
      
      // Redirection immédiate vers l'accueil sans affichage d'interface
      window.location.href = getRedirectUrl();
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

  // Si pas authentifié, pas d'affichage (redirection immédiate via useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Si tout va bien, afficher le contenu
  return <>{children}</>;
}