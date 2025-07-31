import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Hook pour les notifications temps réel côté client
export function useSupabaseRealtime() {
  const [supabase, setSupabase] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Vérifier si Supabase est configuré
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
      setIsConnected(true);
      console.log('🚀 Supabase connecté côté client !');
    } else {
      console.log('📋 Supabase non configuré - utilisation WebSockets natifs');
    }
  }, []);

  // Écouter les nouveaux rendez-vous
  const subscribeToNewAppointments = (callback: (appointment: any) => void) => {
    if (!supabase) return null;
    
    return supabase
      .channel('new_appointments')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload: any) => {
          callback(payload.new);
        }
      )
      .subscribe();
  };

  // Écouter les mises à jour de planning
  const subscribeToPlanningChanges = (callback: (change: any) => void) => {
    if (!supabase) return null;
    
    return supabase
      .channel('planning_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload: any) => {
          callback(payload);
        }
      )
      .subscribe();
  };

  return {
    supabase,
    isConnected,
    subscribeToNewAppointments,
    subscribeToPlanningChanges
  };
}

// Hook spécialisé pour les notifications des professionnels
export function useProNotifications() {
  const { subscribeToNewAppointments } = useSupabaseRealtime();
  const [newAppointments, setNewAppointments] = useState<any[]>([]);

  useEffect(() => {
    const subscription = subscribeToNewAppointments((appointment) => {
      setNewAppointments(prev => [...prev, appointment]);
      
      // Notification visuelle
      if (Notification.permission === 'granted') {
        new Notification('Nouveau rendez-vous !', {
          body: `${appointment.clientName} - ${appointment.serviceName}`,
          icon: '/icon-192x192.png'
        });
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [subscribeToNewAppointments]);

  return { newAppointments, clearNotifications: () => setNewAppointments([]) };
}

// Hook pour les clients
export function useClientNotifications() {
  const { subscribeToPlanningChanges } = useSupabaseRealtime();
  const [appointmentUpdates, setAppointmentUpdates] = useState<any[]>([]);

  useEffect(() => {
    const subscription = subscribeToPlanningChanges((change) => {
      if (change.event === 'UPDATE') {
        setAppointmentUpdates(prev => [...prev, change.new]);
        
        // Notification de modification RDV
        if (Notification.permission === 'granted') {
          new Notification('Rendez-vous modifié', {
            body: 'Un de vos rendez-vous a été mis à jour',
            icon: '/icon-192x192.png'
          });
        }
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [subscribeToPlanningChanges]);

  return { appointmentUpdates };
}