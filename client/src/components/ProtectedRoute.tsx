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

  // Redirection déclenchée SEULEMENT quand l'auth est "prête" (isLoading === false)
  useEffect(() => {
    if (isLoading) return; // ⏳ on attend la résolution de l'auth
    if (requireAuth && !isAuthenticated) {
      // (facultatif) tu peux afficher un toast ici si tu veux, avant de rediriger
      window.location.href = getRedirectUrl();
    }
  }, [isAuthenticated, isLoading, requireAuth, pageType]);

  // Pas d'écran de chargement - redirection immédiate
  // L'authentification se vérifie en arrière-plan

  // ⏳ Pendant le chargement, on ne rend rien (et on ne redirige pas)
  if (isLoading) return null;
  // 🔐 Une fois prêt: si non auth et route protégée → on laisse l'effet rediriger, on ne rend rien
  if (requireAuth && !isAuthenticated) return null;

  // Si tout va bien, afficher le contenu
  return <>{children}</>;
}