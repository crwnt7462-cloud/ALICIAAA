import { useAuthSession } from "@/hooks/useAuthSession";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfessional?: boolean;
  requireClient?: boolean;
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireProfessional = false, 
  requireClient = false 
}: AuthGuardProps) {
  const { isAuthenticated, isProfessional, isClient, isLoading } = useAuthSession();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      setLocation('/pro-login');
      return;
    }

    if (requireProfessional && !isProfessional) {
      setLocation('/pro-login');
      return;
    }

    if (requireClient && !isClient) {
      setLocation('/client-dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, isProfessional, isClient, requireAuth, requireProfessional, requireClient, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return null;
  if (requireProfessional && !isProfessional) return null;
  if (requireClient && !isClient) return null;

  return <>{children}</>;
}