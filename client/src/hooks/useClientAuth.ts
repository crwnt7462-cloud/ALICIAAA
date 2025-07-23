import { useState, useEffect } from 'react';

interface ClientUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  mentionHandle?: string;
  profileImageUrl?: string;
}

export function useClientAuth() {
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si un token client existe
    const storedToken = localStorage.getItem('clientToken');
    const storedUser = localStorage.getItem('clientUser') || localStorage.getItem('clientData');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setClientUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Erreur lors du parsing des données client:', error);
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientUser');
        localStorage.removeItem('clientData');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: ClientUser, authToken: string) => {
    setClientUser(userData);
    setToken(authToken);
    localStorage.setItem('clientToken', authToken);
    localStorage.setItem('clientUser', JSON.stringify(userData));
  };

  const logout = () => {
    setClientUser(null);
    setToken(null);
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientUser');
    localStorage.removeItem('clientData');
  };

  const isAuthenticated = !!clientUser && !!token;

  return {
    clientUser,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}