import React, { createContext, useContext, useState } from 'react';

interface SessionContextType {
  isInitialized: boolean;
}

const SessionContext = createContext<SessionContextType>({
  isInitialized: true,
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [isInitialized] = useState(true);

  return (
    <SessionContext.Provider value={{ isInitialized }}>
      {children}
    </SessionContext.Provider>
  );
}