import { emailService } from './emailService';
import { smsService } from './smsService';

interface NotificationData {
  userId: string;
  email?: string;
  phone?: string;
  type: 'appointment_reminder' | 'appointment_confirmation' | 'cancellation' | 'stock_alert' | 'payment_confirmation';
  data: any;
}

class NotificationService {
  private activeReminders = new Map<string, NodeJS.Timeout>();

  constructor() {
    console.log('🔔 Service de notifications initialisé');
  }

  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      let emailSent = true;
      let smsSent = true;

      if (notification.email) {
        switch (notification.type) {
          case 'appointment_confirmation':
            emailSent = await emailService.sendAppointmentConfirmation(notification.email, notification.data);
            break;
          case 'appointment_reminder':
            emailSent = await emailService.sendAppointmentReminder(notification.email, notification.data);
            break;
        }
      }

      if (notification.phone) {
        switch (notification.type) {
          case 'appointment_confirmation':
            smsSent = await smsService.sendAppointmentConfirmation(notification.phone, notification.data);
            break;
          case 'appointment_reminder':
            smsSent = await smsService.sendAppointmentReminder(notification.phone, notification.data);
            break;
          case 'cancellation':
            smsSent = await smsService.sendCancellationNotification(notification.phone, notification.data);
            break;
        }
      }

      return emailSent && smsSent;
    } catch (error) {
      console.error('❌ Erreur envoi notification:', error);
      return false;
    }
  }

  scheduleAppointmentReminder(appointmentId: string, email: string, phone: string, appointmentData: any, reminderTime: Date): void {
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
      const timeout = setTimeout(async () => {
        await this.sendNotification({
          userId: appointmentData.userId,
          email,
          phone,
          type: 'appointment_reminder',
          data: appointmentData
        });
        this.activeReminders.delete(appointmentId);
      }, delay);

      this.activeReminders.set(appointmentId, timeout);
      console.log(`⏰ Rappel programmé pour le RDV ${appointmentId} dans ${Math.round(delay / 1000 / 60)} minutes`);
    }
  }

  cancelScheduledReminder(appointmentId: string): void {
    const timeout = this.activeReminders.get(appointmentId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeReminders.delete(appointmentId);
      console.log(`❌ Rappel annulé pour le RDV ${appointmentId}`);
    }
  }

  async sendStockAlert(userId: string, email: string, lowStockItems: any[]): Promise<boolean> {
    if (lowStockItems.length === 0) return true;

    try {
      console.log(`📦 Alerte stock pour ${lowStockItems.length} articles`);
      
      // Implémentation basique - peut être étendue avec templates email
      const itemsList = lowStockItems.map(item => 
        `- ${item.name}: ${item.currentStock}/${item.minStock}`
      ).join('\n');

      const message = `Alerte stock salon:\n\n${itemsList}\n\nMerci de réapprovisionner.`;
      
      // Utiliser le service email pour les alertes stock
      return await emailService.sendEmail({
        to: email,
        from: 'alerts@salon-beaute.com',
        subject: 'Alerte - Stock faible',
        text: message
      });
    } catch (error) {
      console.error('❌ Erreur alerte stock:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();