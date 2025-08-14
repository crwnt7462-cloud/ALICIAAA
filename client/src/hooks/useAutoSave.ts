import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';

interface AutoSaveOptions {
  data: any;
  endpoint: string;
  delay?: number;
  onSave?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useAutoSave({
  data,
  endpoint,
  delay = 2000, // Délai de 2 secondes par défaut
  onSave,
  onError,
  enabled = true
}: AutoSaveOptions) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef(data);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Comparer les données actuelles avec les précédentes
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return; // Pas de changement, ne pas sauvegarder
    }

    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Définir un nouveau timeout pour la sauvegarde
    timeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return; // Éviter les sauvegardes simultanées

      try {
        isSavingRef.current = true;
        
        // Simuler une sauvegarde API (remplacer par vraie API)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Sauvegarder en localStorage comme backup
        localStorage.setItem(`salon-${data.id}`, JSON.stringify(data));
        
        // TODO: Remplacer par un vrai appel API
        // await apiRequest(endpoint, {
        //   method: 'PUT',
        //   body: JSON.stringify(data),
        // });

        previousDataRef.current = data;
        
        // Toast de succès discret
        toast({
          title: "✓ Sauvegardé automatiquement",
          description: "Vos modifications sont synchronisées",
          duration: 2000,
        });

        if (onSave) {
          onSave(data);
        }

        // Déclencher l'événement de synchronisation pour les autres composants
        window.dispatchEvent(new CustomEvent('salon-updated', { 
          detail: { 
            salonId: data.id,
            data: data,
            timestamp: Date.now()
          } 
        }));

      } catch (error) {
        console.error('Erreur de sauvegarde automatique:', error);
        
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder automatiquement. Réessayez.",
          variant: "destructive",
          duration: 3000,
        });

        if (onError) {
          onError(error as Error);
        }
      } finally {
        isSavingRef.current = false;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, endpoint, delay, enabled, onSave, onError, toast]);

  // Fonction pour forcer une sauvegarde immédiate
  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      isSavingRef.current = true;
      
      // Simuler une sauvegarde API (remplacer par vraie API)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sauvegarder en localStorage comme backup
      localStorage.setItem(`salon-${data.id}`, JSON.stringify(data));
      
      // TODO: Remplacer par un vrai appel API
      // await apiRequest(endpoint, {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });

      previousDataRef.current = data;
      
      toast({
        title: "Sauvegardé",
        description: "Modifications enregistrées avec succès",
      });

      if (onSave) {
        onSave(data);
      }

      // Déclencher l'événement de synchronisation
      window.dispatchEvent(new CustomEvent('salon-updated', { 
        detail: { 
          salonId: data.id,
          data: data,
          timestamp: Date.now()
        } 
      }));

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive",
      });

      if (onError) {
        onError(error as Error);
      }
    } finally {
      isSavingRef.current = false;
    }
  };

  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    forceSave,
    isSaving: isSavingRef.current
  };
}