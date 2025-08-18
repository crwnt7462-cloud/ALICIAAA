import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function AuthTest() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-pink-500/10 to-amber-500/20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
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
            {user && (
              <div className="mt-4">
                <p className="text-white mb-1"><strong>ID:</strong> {user.id}</p>
                <p className="text-white mb-1"><strong>Email:</strong> {user.email}</p>
                <p className="text-white mb-1"><strong>Nom:</strong> {user.firstName} {user.lastName}</p>
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full glass-button-purple"
            >
              Se connecter avec Replit
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full glass-button-purple"
              >
                Accéder au Dashboard Pro
              </Button>
              <Button 
                onClick={() => window.location.href = '/avyento-account'}
                className="w-full glass-button-purple"
              >
                Accéder au Compte Client
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/logout'}
                variant="outline"
                className="w-full"
              >
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}