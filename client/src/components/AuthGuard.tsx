import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredAuth: 'client' | 'pro';
}

export default function AuthGuard({ children, requiredAuth }: AuthGuardProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (requiredAuth === 'client') {
      const clientToken = localStorage.getItem('clientToken');
      if (!clientToken) {
        setLocation('/client-login');
        return;
      }
    } else if (requiredAuth === 'pro') {
      const proToken = localStorage.getItem('proToken');
      if (!proToken) {
        setLocation('/pro-login');
        return;
      }
    }
  }, [requiredAuth, setLocation]);

  // Vérifier l'authentification
  const isAuthenticated = () => {
    if (requiredAuth === 'client') {
      return !!localStorage.getItem('clientToken');
    } else if (requiredAuth === 'pro') {
      return !!localStorage.getItem('proToken');
    }
    return false;
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}