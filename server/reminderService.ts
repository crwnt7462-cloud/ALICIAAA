import { storage } from './storage';
import { websocketService } from './websocketService';

interface ReminderData {
  appointmentId: number;
  clientId: string;
  clientName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  salonName: string;
  type: '24h' | '1h';
}

class ReminderService {
  private reminders: Map<string, NodeJS.Timeout> = new Map();

  // Programmer un rappel 24h et 1h avant le rendez-vous
  scheduleReminders(appointmentData: any) {
    const appointmentDateTime = new Date(`${appointmentData.appointmentDate} ${appointmentData.startTime}`);
    const now = new Date();

    // Rappel 24h avant
    const reminder24h = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > now) {
      const timeout24h = setTimeout(() => {
        this.sendReminder({
          appointmentId: appointmentData.id,
          clientId: appointmentData.clientAccountId,
          clientName: appointmentData.clientName,
          serviceName: appointmentData.serviceName || 'Rendez-vous',
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.startTime,
          salonName: appointmentData.salonName || 'Votre salon',
          type: '24h'
        });
      }, reminder24h.getTime() - now.getTime());

      this.reminders.set(`${appointmentData.id}_24h`, timeout24h);
    }

    // Rappel 1h avant
    const reminder1h = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
    if (reminder1h > now) {
      const timeout1h = setTimeout(() => {
        this.sendReminder({
          appointmentId: appointmentData.id,
          clientId: appointmentData.clientAccountId,
          clientName: appointmentData.clientName,
          serviceName: appointmentData.serviceName || 'Rendez-vous',
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.startTime,
          salonName: appointmentData.salonName || 'Votre salon',
          type: '1h'
        });
      }, reminder1h.getTime() - now.getTime());

      this.reminders.set(`${appointmentData.id}_1h`, timeout1h);
    }

    console.log(`📅 Rappels programmés pour RDV ${appointmentData.id}`);
  }

  // Envoyer le rappel
  private async sendReminder(reminderData: ReminderData) {
    try {
      const timeMessage = reminderData.type === '24h' ? 'demain' : 'dans 1 heure';
      
      // Notification WebSocket temps réel
      websocketService.notifyAppointmentReminder(reminderData.clientId, {
        title: `Rappel de rendez-vous`,
        message: `Votre rendez-vous ${reminderData.serviceName} est prévu ${timeMessage} à ${reminderData.appointmentTime}`,
        timeRemaining: timeMessage,
        appointmentData: reminderData
      });

      // TODO: Envoyer email de rappel si service email configuré
      // TODO: Envoyer SMS de rappel si service SMS configuré

      console.log(`🔔 Rappel ${reminderData.type} envoyé pour RDV ${reminderData.appointmentId}`);
    } catch (error) {
      console.error('Erreur envoi rappel:', error);
    }
  }

  // Annuler les rappels pour un rendez-vous
  cancelReminders(appointmentId: number) {
    const reminder24h = this.reminders.get(`${appointmentId}_24h`);
    const reminder1h = this.reminders.get(`${appointmentId}_1h`);

    if (reminder24h) {
      clearTimeout(reminder24h);
      this.reminders.delete(`${appointmentId}_24h`);
    }

    if (reminder1h) {
      clearTimeout(reminder1h);
      this.reminders.delete(`${appointmentId}_1h`);
    }

    console.log(`❌ Rappels annulés pour RDV ${appointmentId}`);
  }

  // Reprogrammer les rappels pour un rendez-vous modifié
  rescheduleReminders(appointmentId: number, newAppointmentData: any) {
    this.cancelReminders(appointmentId);
    this.scheduleReminders(newAppointmentData);
    console.log(`🔄 Rappels reprogrammés pour RDV ${appointmentId}`);
  }

  // Obtenir le statut des rappels
  getReminderStatus(appointmentId: number) {
    return {
      has24hReminder: this.reminders.has(`${appointmentId}_24h`),
      has1hReminder: this.reminders.has(`${appointmentId}_1h`),
      totalReminders: this.reminders.size
    };
  }

  // Nettoyer les rappels expirés
  cleanupExpiredReminders() {
    let cleaned = 0;
    const now = new Date();

    this.reminders.forEach((timeout, key) => {
      // Si le timeout est déjà passé, le supprimer
      // Note: en pratique, les timeouts se suppriment automatiquement après exécution
      // Cette méthode est utile pour un nettoyage périodique si nécessaire
    });

    console.log(`🧹 Nettoyage des rappels: ${cleaned} rappels expirés supprimés`);
  }
}

export const reminderService = new ReminderService();