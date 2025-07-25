import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface ProData {
  id: string;
  email: string;
  handle: string;
  role: string;
  salon: string;
}

export function useProAuth() {
  const [, setLocation] = useLocation();
  const [proData, setProData] = useState<ProData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('proToken');
      const storedData = localStorage.getItem('proData');
      
      if (token && storedData) {
        const parsedData = JSON.parse(storedData);
        setProData(parsedData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setProData(null);
      }
    } catch (error) {
      console.error('Erreur vérification auth pro:', error);
      setIsAuthenticated(false);
      setProData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('proToken');
    localStorage.removeItem('proData');
    setProData(null);
    setIsAuthenticated(false);
    setLocation('/pro-login');
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/pro-login');
      return false;
    }
    return true;
  };

  return {
    proData,
    isLoading,
    isAuthenticated,
    logout,
    requireAuth,
    checkAuthStatus
  };
}