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

  // Pas d'écran de chargement - redirection immédiate
  // L'authentification se vérifie en arrière-plan

  // Si pas authentifié, pas d'affichage (redirection immédiate via useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Si tout va bien, afficher le contenu
  return <>{children}</>;
}