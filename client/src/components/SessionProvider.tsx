import { createContext, useContext, useEffect } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useLocation } from "wouter";

const SessionContext = createContext<any>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthSession();
  const [location, setLocation] = useLocation();

  // Redirection automatique pour les pages protégées
  useEffect(() => {
    if (!session.isLoading && !session.isAuthenticated) {
      if (location.startsWith('/dashboard') || location.startsWith('/pro-tools') || location.startsWith('/messaging')) {
        setLocation('/pro-login');
      }
    }
  }, [session.isLoading, session.isAuthenticated, location, setLocation]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}