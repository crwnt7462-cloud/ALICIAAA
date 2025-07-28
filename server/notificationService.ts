import { websocketService } from './websocketService';
import { reminderService } from './reminderService';
import { storage } from './storage';

interface NotificationData {
  type: 'appointment' | 'payment' | 'reminder' | 'cancellation' | 'system';
  title: string;
  message: string;
  userId?: string;
  clientId?: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class NotificationService {
  private notifications: Map<string, NotificationData[]> = new Map();

  // Envoyer une notification à un professionnel
  async notifyProfessional(userId: string, notification: NotificationData) {
    try {
      // Stocker la notification
      const userNotifications = this.notifications.get(userId) || [];
      userNotifications.unshift({ ...notification, userId });
      this.notifications.set(userId, userNotifications.slice(0, 50)); // Garder max 50 notifications

      // Envoyer via WebSocket temps réel
      websocketService.notifyProfessional(userId, notification);

      console.log(`🔔 Notification PRO envoyée à ${userId}: ${notification.title}`);
    } catch (error) {
      console.error('Erreur envoi notification PRO:', error);
    }
  }

  // Envoyer une notification à un client
  async notifyClient(clientId: string, notification: NotificationData) {
    try {
      // Stocker la notification
      const clientNotifications = this.notifications.get(`client_${clientId}`) || [];
      clientNotifications.unshift({ ...notification, clientId });
      this.notifications.set(`client_${clientId}`, clientNotifications.slice(0, 50));

      // Envoyer via WebSocket temps réel
      websocketService.notifyClient(clientId, notification);

      console.log(`🔔 Notification CLIENT envoyée à ${clientId}: ${notification.title}`);
    } catch (error) {
      console.error('Erreur envoi notification CLIENT:', error);
    }
  }

  // Notification de nouvelle réservation
  async notifyNewAppointment(appointmentData: any) {
    const professionalId = appointmentData.userId;
    
    // Notifier le professionnel
    await this.notifyProfessional(professionalId, {
      type: 'appointment',
      title: 'Nouvelle réservation',
      message: `${appointmentData.clientName} a réservé ${appointmentData.serviceName}`,
      priority: 'high',
      data: appointmentData
    });

    // Programmer les rappels automatiques
    reminderService.scheduleReminders(appointmentData);

    // Notifier le client de confirmation
    if (appointmentData.clientAccountId) {
      await this.notifyClient(appointmentData.clientAccountId, {
        type: 'appointment',
        title: 'Réservation confirmée',
        message: `Votre rendez-vous ${appointmentData.serviceName} est confirmé`,
        priority: 'medium',
        data: appointmentData
      });
    }
  }

  // Notification d'annulation
  async notifyAppointmentCancellation(appointmentData: any, cancelledBy: 'professional' | 'client') {
    const professionalId = appointmentData.userId;
    const clientId = appointmentData.clientAccountId;

    // Annuler les rappels programmés
    reminderService.cancelReminders(appointmentData.id);

    if (cancelledBy === 'client') {
      // Notifier le professionnel
      await this.notifyProfessional(professionalId, {
        type: 'cancellation',
        title: 'Annulation de rendez-vous',
        message: `${appointmentData.clientName} a annulé son rendez-vous`,
        priority: 'medium',
        data: appointmentData
      });
    } else {
      // Notifier le client
      if (clientId) {
        await this.notifyClient(clientId, {
          type: 'cancellation',
          title: 'Rendez-vous annulé',
          message: 'Votre rendez-vous a été annulé par le salon',
          priority: 'high',
          data: appointmentData
        });
      }
    }
  }

  // Notification de modification
  async notifyAppointmentUpdate(appointmentData: any, changes: string[]) {
    const professionalId = appointmentData.userId;
    const clientId = appointmentData.clientAccountId;

    // Reprogrammer les rappels si la date/heure a changé
    if (changes.includes('date') || changes.includes('time')) {
      reminderService.rescheduleReminders(appointmentData.id, appointmentData);
    }

    // Notifier le client des modifications
    if (clientId) {
      await this.notifyClient(clientId, {
        type: 'appointment',
        title: 'Rendez-vous modifié',
        message: `Votre rendez-vous a été mis à jour: ${changes.join(', ')}`,
        priority: 'medium',
        data: appointmentData
      });
    }
  }

  // Notification de paiement confirmé
  async notifyPaymentConfirmed(paymentData: any) {
    const { appointmentData, amount, clientId } = paymentData;

    if (clientId) {
      await this.notifyClient(clientId, {
        type: 'payment',
        title: 'Paiement confirmé',
        message: `Votre paiement de ${amount}€ a été accepté`,
        priority: 'low',
        data: paymentData
      });
    }

    // Notifier le professionnel
    if (appointmentData?.userId) {
      await this.notifyProfessional(appointmentData.userId, {
        type: 'payment',
        title: 'Paiement reçu',
        message: `Paiement de ${amount}€ confirmé pour ${appointmentData.clientName}`,
        priority: 'low',
        data: paymentData
      });
    }
  }

  // Récupérer les notifications d'un utilisateur
  getUserNotifications(userId: string): NotificationData[] {
    return this.notifications.get(userId) || [];
  }

  // Récupérer les notifications d'un client
  getClientNotifications(clientId: string): NotificationData[] {
    return this.notifications.get(`client_${clientId}`) || [];
  }

  // Marquer les notifications comme lues
  markNotificationsAsRead(userId: string, notificationIds?: string[]) {
    // Pour l'instant, on supprime simplement les notifications
    // Dans un vrai système, on ajouterait un flag 'read'
    if (notificationIds) {
      // Marquer spécifiquement certaines notifications
      console.log(`Notifications ${notificationIds.join(', ')} marquées comme lues pour ${userId}`);
    } else {
      // Marquer toutes les notifications comme lues
      this.notifications.delete(userId);
      console.log(`Toutes les notifications marquées comme lues pour ${userId}`);
    }
  }

  // Notification système (maintenance, nouveautés, etc.)
  async broadcastSystemNotification(notification: Omit<NotificationData, 'userId' | 'clientId'>) {
    try {
      // Diffuser à tous les clients connectés
      if (websocketService.clients) {
        Array.from(websocketService.clients.values()).forEach((client) => {
        if (client.userType === 'professional' && client.userId) {
          this.notifyProfessional(client.userId, {
            ...notification,
            type: 'system'
          });
        } else if (client.userType === 'client' && client.clientId) {
          this.notifyClient(client.clientId, {
            ...notification,
            type: 'system'
          });
        }
        });
      }

      console.log(`📢 Notification système diffusée: ${notification.title}`);
    } catch (error) {
      console.error('Erreur diffusion notification système:', error);
    }
  }

  // Obtenir les statistiques de notifications
  getNotificationStats() {
    let totalNotifications = 0;
    let professionalNotifications = 0;
    let clientNotifications = 0;

    this.notifications.forEach((notifications, key) => {
      totalNotifications += notifications.length;
      if (key.startsWith('client_')) {
        clientNotifications += notifications.length;
      } else {
        professionalNotifications += notifications.length;
      }
    });

    return {
      total: totalNotifications,
      professionals: professionalNotifications,
      clients: clientNotifications,
      users: this.notifications.size
    };
  }

  // Nettoyer les anciennes notifications
  cleanupOldNotifications(maxAgeHours: number = 168) { // 7 jours par défaut
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    let cleaned = 0;

    this.notifications.forEach((notifications, key) => {
      const filtered = notifications.filter(n => {
        // Si pas de timestamp, garder la notification
        if (!n.data?.timestamp) return true;
        return new Date(n.data.timestamp) > cutoff;
      });
      
      if (filtered.length !== notifications.length) {
        cleaned += notifications.length - filtered.length;
        this.notifications.set(key, filtered);
      }
    });

    console.log(`🧹 Nettoyage des notifications: ${cleaned} notifications expirées supprimées`);
  }
}

export const notificationService = new NotificationService();