import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AppointmentUpdate {
  id: string;
  salon_id: string;
  staff_id: string;
  client_name: string;
  service_name: string;
  date: string;
  appointment_time: string;
  end_time: string;
  status: string;
  event_type: 'INSERT' | 'UPDATE' | 'DELETE';
}

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

  // Écouter les nouveaux rendez-vous pour un salon spécifique
  const subscribeToNewAppointments = (salonId: string, callback: (appointment: any) => void) => {
    if (!supabase) return null;
    
    return supabase
      .channel(`new_appointments_${salonId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'appointments',
          filter: `salon_id=eq.${salonId}`
        },
        (payload: any) => {
          console.log('🔔 Nouveau RDV temps réel pour salon', salonId, payload.new);
          callback(payload.new);
        }
      )
      .subscribe();
  };

  // Écouter toutes les mises à jour de planning pour un salon
  const subscribeToPlanningChanges = (salonId: string, callback: (change: AppointmentUpdate) => void) => {
    if (!supabase) return null;
    
    return supabase
      .channel(`planning_changes_${salonId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: `salon_id=eq.${salonId}`
        },
        (payload: any) => {
          console.log('📅 Mise à jour planning temps réel pour salon', salonId, payload);
          
          const appointmentUpdate: AppointmentUpdate = {
            ...payload.new || payload.old,
            event_type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          };
          
          callback(appointmentUpdate);
        }
      )
      .subscribe();
  };

  // Écouter les mises à jour pour un staff spécifique
  const subscribeToStaffPlanning = (salonId: string, staffId: string, callback: (change: AppointmentUpdate) => void) => {
    if (!supabase) return null;
    
    return supabase
      .channel(`staff_planning_${salonId}_${staffId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: `salon_id=eq.${salonId}&staff_id=eq.${staffId}`
        },
        (payload: any) => {
          console.log('👨‍💼 Mise à jour planning staff temps réel', staffId, payload);
          
          const appointmentUpdate: AppointmentUpdate = {
            ...payload.new || payload.old,
            event_type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          };
          
          callback(appointmentUpdate);
        }
      )
      .subscribe();
  };

  return {
    supabase,
    isConnected,
    subscribeToNewAppointments,
    subscribeToPlanningChanges,
    subscribeToStaffPlanning
  };
}

// Hook spécialisé pour les notifications des professionnels
export function useProNotifications(salonId: string) {
  const { subscribeToNewAppointments, isConnected } = useSupabaseRealtime();
  const [newAppointments, setNewAppointments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isConnected || !salonId) return;

    const subscription = subscribeToNewAppointments(salonId, (appointment) => {
      // Ajouter le nouveau RDV à la liste
      setNewAppointments(prev => [appointment, ...prev]);
      
      // Afficher une notification toast
      toast({
        title: "🔔 Nouveau rendez-vous !",
        description: `${appointment.client_name} - ${appointment.service_name} le ${new Date(appointment.date).toLocaleDateString('fr-FR')} à ${appointment.appointment_time}`,
        duration: 5000,
      });

      // Notification du navigateur si autorisée
      if (Notification.permission === 'granted') {
        new Notification('Nouveau rendez-vous !', {
          body: `${appointment.client_name} a réservé ${appointment.service_name}`,
          icon: '/icon-192x192.png',
          tag: `appointment-${appointment.id}`
        });
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isConnected, salonId, subscribeToNewAppointments, toast]);

  return { newAppointments, isConnected, clearNotifications: () => setNewAppointments([]) };
}

// Hook pour mettre à jour le planning en temps réel
export function usePlanningRealtime(salonId: string, staffId?: string, onUpdate?: () => void) {
  const { subscribeToPlanningChanges, subscribeToStaffPlanning, isConnected } = useSupabaseRealtime();
  const [appointmentUpdates, setAppointmentUpdates] = useState<AppointmentUpdate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isConnected || !salonId) return;

    // Si un staff spécifique est sélectionné, écouter seulement ses RDV
    const subscribeFunction = staffId && staffId !== 'all' 
      ? subscribeToStaffPlanning 
      : subscribeToPlanningChanges;

    const subscriptionArgs = staffId && staffId !== 'all'
      ? [salonId, staffId]
      : [salonId];

    const subscription = subscribeFunction(...subscriptionArgs, (update: AppointmentUpdate) => {
      setAppointmentUpdates(prev => {
        // Éviter les doublons
        const filtered = prev.filter(u => u.id !== update.id);
        return [update, ...filtered].slice(0, 50); // Garder seulement les 50 dernières mises à jour
      });

      // Appeler le callback de mise à jour pour recharger les données
      if (onUpdate) {
        onUpdate();
      }

      // Messages d'information selon le type d'événement
      if (update.event_type === 'INSERT') {
        toast({
          title: "✅ Nouveau rendez-vous",
          description: `${update.client_name} - ${update.service_name}`,
          duration: 3000,
        });
      } else if (update.event_type === 'UPDATE') {
        toast({
          title: "🔄 Rendez-vous modifié",
          description: `${update.client_name} - ${update.service_name}`,
          duration: 3000,
        });
      } else if (update.event_type === 'DELETE') {
        toast({
          title: "🗑️ Rendez-vous supprimé",
          description: `${update.client_name} - ${update.service_name}`,
          duration: 3000,
        });
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isConnected, salonId, staffId, subscribeToPlanningChanges, subscribeToStaffPlanning, toast, onUpdate]);

  return { appointmentUpdates, isConnected };
}

// Hook pour les clients
export function useClientNotifications() {
  const { subscribeToPlanningChanges } = useSupabaseRealtime();
  const [appointmentUpdates, setAppointmentUpdates] = useState<any[]>([]);

  useEffect(() => {
    // Les clients n'ont pas accès au salon_id directement
    // Cette fonction peut être étendue plus tard pour les notifications client spécifiques
    
    return () => {
      // Cleanup
    };
  }, [subscribeToPlanningChanges]);

  return { appointmentUpdates };
}