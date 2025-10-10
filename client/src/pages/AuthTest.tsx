import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

// Types sécurisés pour l'utilisateur
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  salonName?: string;
  role?: string;
}

// Composant LoadingSpinner réutilisable
const LoadingSpinner = ({ size = "w-4 h-4", text = "Chargement..." }: { size?: string; text?: string }) => (
  <div className="flex items-center justify-center">
    <div className={`animate-spin border-2 border-white border-t-transparent rounded-full mr-2 ${size}`} />
    {text}
  </div>
);

// Composant UserInfo pour afficher les informations utilisateur
const UserInfo = ({ user }: { user: User }) => (
  <div className="mt-4">
    <p className="text-white mb-1"><strong>ID:</strong> {user.id}</p>
    <p className="text-white mb-1"><strong>Email:</strong> {user.email}</p>
    <p className="text-white mb-1"><strong>Nom:</strong> {user.firstName} {user.lastName}</p>
    {user.salonName && (
      <p className="text-white mb-1"><strong>Salon:</strong> {user.salonName}</p>
    )}
    {user.role && (
      <p className="text-white mb-1"><strong>Rôle:</strong> {user.role}</p>
    )}
  </div>
);

// Composant ActionButton pour les boutons d'action
const ActionButton = ({ 
  onClick, 
  disabled, 
  children, 
  variant = "default",
  className = "w-full glass-button-purple"
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) => (
  <Button 
    onClick={onClick}
    disabled={disabled}
    variant={variant}
    className={className}
  >
    {disabled ? (
      <LoadingSpinner text="Redirection..." />
    ) : (
      children
    )}
  </Button>
);

export default function AuthTest() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction de redirection sécurisée avec useCallback pour optimiser les performances
  const handleRedirect = useCallback(async (url: string) => {
    try {
      setIsRedirecting(true);
      setError(null);
      window.location.href = url;
    } catch (error) {
      console.error('Erreur de redirection:', error);
      setError('Erreur lors de la redirection. Veuillez réessayer.');
    } finally {
      // Reset après un délai pour permettre la redirection
      setTimeout(() => setIsRedirecting(false), 2000);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-pink-500/10 to-amber-500/20">
        <LoadingSpinner size="w-8 h-8" text="" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-pink-500/10 to-amber-500/20 p-4">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Test d'authentification</h1>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/10">
            <p className="text-white mb-2">
              <strong>Statut:</strong> {isAuthenticated ? '✅ Connecté' : '❌ Non connecté'}
            </p>
            <p className="text-white mb-2">
              <strong>Chargement:</strong> {isLoading ? 'Oui' : 'Non'}
            </p>
            {user && typeof user === 'object' && (
              <UserInfo user={user as User} />
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {!isAuthenticated ? (
            <ActionButton 
              onClick={() => handleRedirect('/api/login')}
              disabled={isRedirecting}
            >
              Se connecter avec Replit
            </ActionButton>
          ) : (
            <div className="space-y-3">
              <ActionButton 
                onClick={() => handleRedirect('/dashboard')}
                disabled={isRedirecting}
              >
                Accéder au Dashboard Pro
              </ActionButton>
              <ActionButton 
                onClick={() => handleRedirect('/avyento-account')}
                disabled={isRedirecting}
              >
                Accéder au Compte Client
              </ActionButton>
              <ActionButton 
                onClick={() => handleRedirect('/api/logout')}
                disabled={isRedirecting}
                variant="outline"
                className="w-full"
              >
                Se déconnecter
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}