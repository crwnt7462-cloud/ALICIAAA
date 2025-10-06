/**
 * Service de notifications temps réel pour le planning
 * Gère les notifications Supabase Realtime + WebSocket natifs
 */

import { supabase } from './supabaseSetup';

export interface AppointmentNotification {
  id: string;
  salon_id: string;
  staff_id: string;
  client_name: string;
  service_name: string;
  date: string;
  appointment_time: string;
  end_time: string;
  status: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
}

export class PlanningRealtimeService {
  
  /**
   * Notifier tous les clients connectés au salon d'un nouveau RDV
   */
  async notifyNewAppointment(salonId: string, appointmentData: any) {
    console.log('🔔 Notification nouveau RDV pour salon', salonId, appointmentData);
    
    try {
      // Supabase Realtime se chargera automatiquement de la notification
      // grâce aux postgres_changes triggers sur la table appointments
      
      // Si besoin d'une notification custom supplémentaire :
      if (supabase) {
        await supabase
          .channel(`salon_${salonId}_notifications`)
          .send({
            type: 'broadcast',
            event: 'new_appointment',
            payload: {
              salon_id: salonId,
              appointment: appointmentData,
              timestamp: new Date().toISOString()
            }
          });
      }
      
      console.log('✅ Notification RDV envoyée pour salon', salonId);
      
    } catch (error) {
      console.error('❌ Erreur notification RDV:', error);
    }
  }

  /**
   * Notifier la modification d'un RDV existant
   */
  async notifyAppointmentUpdate(salonId: string, appointmentId: string, appointmentData: any) {
    console.log('🔄 Notification modification RDV pour salon', salonId, appointmentId);
    
    try {
      if (supabase) {
        await supabase
          .channel(`salon_${salonId}_notifications`)
          .send({
            type: 'broadcast',
            event: 'appointment_updated',
            payload: {
              salon_id: salonId,
              appointment_id: appointmentId,
              appointment: appointmentData,
              timestamp: new Date().toISOString()
            }
          });
      }
      
      console.log('✅ Notification modification RDV envoyée');
      
    } catch (error) {
      console.error('❌ Erreur notification modification:', error);
    }
  }

  /**
   * Notifier la suppression d'un RDV
   */
  async notifyAppointmentDeletion(salonId: string, appointmentId: string) {
    console.log('🗑️ Notification suppression RDV pour salon', salonId, appointmentId);
    
    try {
      if (supabase) {
        await supabase
          .channel(`salon_${salonId}_notifications`)
          .send({
            type: 'broadcast',
            event: 'appointment_deleted',
            payload: {
              salon_id: salonId,
              appointment_id: appointmentId,
              timestamp: new Date().toISOString()
            }
          });
      }
      
      console.log('✅ Notification suppression RDV envoyée');
      
    } catch (error) {
      console.error('❌ Erreur notification suppression:', error);
    }
  }

  /**
   * Envoyer une notification générale de mise à jour de planning
   */
  async notifyPlanningUpdate(salonId: string, staffId?: string, message?: string) {
    console.log('📅 Notification mise à jour planning pour salon', salonId);
    
    try {
      if (supabase) {
        await supabase
          .channel(`salon_${salonId}_planning`)
          .send({
            type: 'broadcast',
            event: 'planning_updated',
            payload: {
              salon_id: salonId,
              staff_id: staffId,
              message: message || 'Planning mis à jour',
              timestamp: new Date().toISOString()
            }
          });
      }
      
      console.log('✅ Notification planning envoyée');
      
    } catch (error) {
      console.error('❌ Erreur notification planning:', error);
    }
  }

  /**
   * Obtenir les statistiques de connexion pour un salon
   */
  getConnectionStats(salonId: string) {
    // À implémenter selon les besoins
    return {
      connectedClients: 0,
      notifications_sent: 0,
      last_update: new Date().toISOString()
    };
  }
}

// Instance globale du service
export const planningRealtimeService = new PlanningRealtimeService();

// Configuration pour demander l'autorisation des notifications
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Les notifications ne sont pas supportées par ce navigateur');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}
