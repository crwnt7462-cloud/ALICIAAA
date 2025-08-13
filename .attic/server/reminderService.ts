import { notificationService } from './notificationService';
import { storage } from './storage';

interface ReminderSchedule {
  appointmentId: string;
  clientEmail: string;
  clientPhone?: string;
  appointmentDate: Date;
  serviceName: string;
  salonName: string;
  reminderTimes: Date[];
}

class ReminderService {
  private scheduledReminders = new Map<string, NodeJS.Timeout[]>();

  constructor() {
    console.log('⏰ Service de rappels initialisé');
    this.startReminderSystem();
  }

  private startReminderSystem(): void {
    // Vérifier les rappels à envoyer toutes les minutes
    setInterval(async () => {
      await this.checkPendingReminders();
    }, 60000); // 1 minute

    console.log('⏰ Système de rappels automatiques démarré');
  }

  async scheduleReminders(schedule: ReminderSchedule): Promise<void> {
    try {
      const now = new Date();
      const timeouts: NodeJS.Timeout[] = [];

      for (const reminderTime of schedule.reminderTimes) {
        const delay = reminderTime.getTime() - now.getTime();

        if (delay > 0) {
          const timeout = setTimeout(async () => {
            await this.sendReminder(schedule);
          }, delay);

          timeouts.push(timeout);
        }
      }

      if (timeouts.length > 0) {
        this.scheduledReminders.set(schedule.appointmentId, timeouts);
        console.log(`⏰ ${timeouts.length} rappels programmés pour RDV ${schedule.appointmentId}`);
      }
    } catch (error) {
      console.error('❌ Erreur programmation rappels:', error);
    }
  }

  async cancelReminders(appointmentId: string): Promise<void> {
    const timeouts = this.scheduledReminders.get(appointmentId);
    if (timeouts) {
      timeouts.forEach(timeout => clearTimeout(timeout));
      this.scheduledReminders.delete(appointmentId);
      console.log(`❌ Rappels annulés pour RDV ${appointmentId}`);
    }
  }

  private async sendReminder(schedule: ReminderSchedule): Promise<void> {
    try {
      const appointmentDetails = {
        serviceName: schedule.serviceName,
        date: schedule.appointmentDate.toLocaleDateString('fr-FR'),
        time: schedule.appointmentDate.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        salonName: schedule.salonName
      };

      await notificationService.sendNotification({
        userId: schedule.appointmentId,
        email: schedule.clientEmail,
        phone: schedule.clientPhone,
        type: 'appointment_reminder',
        data: appointmentDetails
      });

      console.log(`📧 Rappel envoyé pour RDV ${schedule.appointmentId}`);
    } catch (error) {
      console.error('❌ Erreur envoi rappel:', error);
    }
  }

  private async checkPendingReminders(): Promise<void> {
    try {
      // Cette méthode pourrait interroger la base de données pour des rappels
      // qui n'ont pas été programmés en mémoire (par exemple, après un redémarrage)
      
      // Implémentation future: récupérer les RDV des prochaines 24h
      // et vérifier s'ils ont des rappels programmés
      
      console.log('🔍 Vérification rappels en attente...');
    } catch (error) {
      console.error('❌ Erreur vérification rappels:', error);
    }
  }

  getDefaultReminderTimes(appointmentDate: Date): Date[] {
    const reminders: Date[] = [];
    
    // Rappel 24h avant
    const reminder24h = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > new Date()) {
      reminders.push(reminder24h);
    }
    
    // Rappel 2h avant
    const reminder2h = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);
    if (reminder2h > new Date()) {
      reminders.push(reminder2h);
    }
    
    return reminders;
  }

  async scheduleDefaultReminders(appointmentId: string, clientEmail: string, clientPhone: string, appointmentDate: Date, serviceName: string, salonName: string): Promise<void> {
    const reminderTimes = this.getDefaultReminderTimes(appointmentDate);
    
    if (reminderTimes.length > 0) {
      await this.scheduleReminders({
        appointmentId,
        clientEmail,
        clientPhone,
        appointmentDate,
        serviceName,
        salonName,
        reminderTimes
      });
    }
  }
}

export const reminderService = new ReminderService();