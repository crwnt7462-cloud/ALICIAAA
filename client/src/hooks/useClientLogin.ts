import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// Types sécurisés
interface LoginFormData {
  email: string;
  password: string;
}

interface ClientData {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Fonctions utilitaires sécurisées
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useClientLogin = (redirectTo: string = '/client-dashboard') => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (formData: LoginFormData) => {
    const { email, password } = formData;
    
    // Validation des champs
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return false;
    }

    // Validation de l'email
    if (!validateEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir un email valide",
        variant: "destructive"
      });
      return false;
    }

    // Sanitization des données
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: sanitizedEmail, 
          password: sanitizedPassword 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Login response:', data);
      
      if (data.success && data.client) {
        // Stockage sécurisé des données
        localStorage.setItem('clientToken', data.client.token);
        localStorage.setItem('clientData', JSON.stringify(data.client));
        localStorage.setItem('clientEmail', data.client.email);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.client.firstName} !`,
        });
        
        // Redirection sécurisée
        setTimeout(() => {
          setLocation(redirectTo);
        }, 1000);
        
        return true;
      } else {
        throw new Error(data.error || "Identifiants incorrects");
      }
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, setLocation, redirectTo]);

  return {
    handleSubmit,
    isLoading,
    validateEmail,
    sanitizeInput
  };
};
