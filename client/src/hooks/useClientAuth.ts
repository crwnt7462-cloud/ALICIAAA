import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface ClientData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  phone?: string; // <— nouveau champ optionnel
}

export function useClientAuth() {
  const [, setLocation] = useLocation();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('clientToken');
      const storedData = localStorage.getItem('clientData');
      
      if (token && storedData) {
        const parsedData = JSON.parse(storedData);
        setClientData(parsedData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setClientData(null);
      }
    } catch (error) {
      console.error('Erreur vérification auth client:', error);
      setIsAuthenticated(false);
      setClientData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    setClientData(null);
    setIsAuthenticated(false);
    setLocation('/client-login');
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/client-login');
      return false;
    }
    return true;
  };

  return {
    clientData,
    isLoading,
    isAuthenticated,
    logout,
    requireAuth,
    checkAuthStatus
  };
}