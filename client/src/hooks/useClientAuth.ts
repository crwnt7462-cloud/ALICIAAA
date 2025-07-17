import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface ClientSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useClientAuth() {
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiRequest('GET', '/api/auth/client/session');
        if (response.ok) {
          const sessionData = await response.json();
          setClientSession(sessionData.user);
        } else {
          setClientSession(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setClientSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/client/logout');
      setClientSession(null);
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
      setClientSession(null);
      setLocation('/');
    }
  };

  const requireAuth = () => {
    if (!isLoading && !clientSession) {
      setLocation('/client-login');
    }
  };

  return {
    clientSession,
    isLoading,
    isAuthenticated: !!clientSession,
    logout,
    requireAuth
  };
}