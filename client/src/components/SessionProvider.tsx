import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';

interface SessionContextType {
  isInitialized: boolean;
}

const SessionContext = createContext<SessionContextType>({
  isInitialized: false,
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { checkSession } = useAuthSession();

  useEffect(() => {
    // Vérifier la session au démarrage
    const initializeSession = async () => {
      try {
        await checkSession();
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeSession();
  }, [checkSession]);

  return (
    <SessionContext.Provider value={{ isInitialized }}>
      {children}
    </SessionContext.Provider>
  );
}