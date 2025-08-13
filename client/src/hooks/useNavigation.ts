/**
 * Hook de navigation centralisé avec logging automatique
 * Remplace les appels directs à navigate/setLocation
 */

import { useLocation } from 'wouter';
import { logger } from '@/logger';
import { useCallback } from 'react';

interface NavigationMetadata {
  salonId?: string;
  salonSlug?: string;
  professionalId?: string;
  serviceId?: string;
  appointmentId?: string;
  userId?: string;
  professionalsCount?: number;
  servicesCount?: number;
  [key: string]: unknown;
}

export function useNavigation() {
  const [location, setLocation] = useLocation();

  const navigate = useCallback((
    to: string, 
    reason: string, 
    metadata?: NavigationMetadata
  ) => {
    // Validation des paramètres
    if (!to || typeof to !== 'string') {
      logger.error('Navigation failed: invalid destination', { to, reason });
      return;
    }

    if (!reason || typeof reason !== 'string') {
      logger.error('Navigation failed: reason is required', { to, reason });
      return;
    }

    // Log automatique de la navigation
    logger.nav(location, to, reason, {
      ...metadata,
      timestamp: new Date().toISOString(),
    });

    // Effectuer la navigation
    try {
      setLocation(to);
    } catch (error) {
      logger.error('Navigation error', {
        from: location,
        to,
        reason,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [location, setLocation]);

  // Méthodes de navigation prédéfinies avec raisons explicites
  const navigateToHome = useCallback((metadata?: NavigationMetadata) => {
    navigate('/', 'user-requested-home', metadata);
  }, [navigate]);

  const navigateToSearch = useCallback((reason: string, metadata?: NavigationMetadata) => {
    // Empêcher les navigations vers /search sans raison explicite
    if (!reason || reason.trim() === '') {
      logger.error('Navigation to /search blocked: explicit reason required');
      return;
    }
    navigate('/search', reason, metadata);
  }, [navigate]);

  const navigateToSalon = useCallback((
    salonSlug: string, 
    reason: string, 
    metadata?: NavigationMetadata
  ) => {
    if (!salonSlug) {
      logger.error('Navigation to salon failed: salonSlug is required');
      return;
    }
    navigate(`/salon/${salonSlug}`, reason, { ...metadata, salonSlug });
  }, [navigate]);

  const navigateToBooking = useCallback((
    salonSlug: string, 
    reason: string, 
    metadata?: NavigationMetadata
  ) => {
    if (!salonSlug) {
      logger.error('Navigation to booking failed: salonSlug is required');
      return;
    }
    navigate(`/salon-booking/${salonSlug}`, reason, { ...metadata, salonSlug });
  }, [navigate]);

  const navigateToPlanning = useCallback((
    reason: string,
    metadata?: NavigationMetadata
  ) => {
    navigate('/planning', reason, metadata);
  }, [navigate]);

  const navigateToClients = useCallback((
    reason: string,
    metadata?: NavigationMetadata
  ) => {
    navigate('/clients', reason, metadata);
  }, [navigate]);

  const navigateBack = useCallback((reason: string, metadata?: NavigationMetadata) => {
    logger.nav(location, 'BACK', reason, metadata);
    window.history.back();
  }, [location]);

  // Fonction utilitaire pour extraire les segments d'URL de manière sécurisée
  const getPathSegments = useCallback((): string[] => {
    return location.split('/').filter(Boolean);
  }, [location]);

  // Fonction pour obtenir le slug du salon depuis l'URL actuelle
  const getCurrentSalonSlug = useCallback((): string | null => {
    const segments = getPathSegments();
    
    // Pour /salon/:slug ou /salon-booking/:slug
    if (segments.length >= 2 && (segments[0] === 'salon' || segments[0] === 'salon-booking')) {
      return segments[1] || null;
    }
    
    return null;
  }, [getPathSegments]);

  return {
    // Navigation de base
    navigate,
    location,
    
    // Navigations prédéfinies
    navigateToHome,
    navigateToSearch,
    navigateToSalon,
    navigateToBooking,
    navigateToPlanning,
    navigateToClients,
    navigateBack,
    
    // Utilitaires
    getPathSegments,
    getCurrentSalonSlug,
  };
}

// Hook pour le salon slug (remplace l'extraction manuelle)
export function useSalonSlug(): string | null {
  const { getCurrentSalonSlug } = useNavigation();
  return getCurrentSalonSlug();
}

// Types pour l'export
export type { NavigationMetadata };