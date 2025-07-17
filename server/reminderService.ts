import { storage } from "./storage";
import { smsService } from "./smsService";

export class ReminderService {
  private isRunning = false;

  constructor() {
    // Start the reminder check service
    this.startReminderService();
  }

  private async startReminderService(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("🔔 Reminder service started");
    
    // Check every 30 minutes
    setInterval(async () => {
      await this.checkAndSendReminders();
    }, 30 * 60 * 1000);
    
    // Also check immediately on startup
    setTimeout(() => {
      this.checkAndSendReminders();
    }, 5000);
  }

  async checkAndSendReminders(): Promise<void> {
    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      console.log(`🔍 Checking for appointments to remind between ${tomorrow.toISOString()} and ${dayAfterTomorrow.toISOString()}`);

      // Get appointments for tomorrow that haven't been reminded yet
      const appointmentsToRemind = await storage.getAppointmentsByDateRange(
        "user-placeholder", // This will need to be adjusted for multi-user support
        tomorrow.toISOString().split('T')[0],
        dayAfterTomorrow.toISOString().split('T')[0]
      );

      console.log(`📅 Found ${appointmentsToRemind.length} appointments for tomorrow`);

      for (const appointment of appointmentsToRemind) {
        await this.sendReminderForAppointment(appointment);
      }
    } catch (error) {
      console.error("Error in reminder service:", error);
    }
  }

  private async sendReminderForAppointment(appointment: any): Promise<void> {
    try {
      // Check if we already sent a reminder for this appointment
      const existingReminders = await storage.getSmsNotificationsByAppointment(appointment.id);
      const hasReminderSent = existingReminders.some(
        sms => sms.notificationType === 'reminder' && sms.status === 'sent'
      );

      if (hasReminderSent) {
        console.log(`⏭️ Reminder already sent for appointment ${appointment.id}`);
        return;
      }

      // Get client and user info
      const client = await storage.getClient(appointment.clientId);
      const user = await storage.getUser(appointment.userId);

      if (!client || !client.phone || !user) {
        console.log(`❌ Cannot send reminder for appointment ${appointment.id} - missing client/user info`);
        return;
      }

      // Check user's notification preferences
      const preferences = await storage.getNotificationPreferences(user.id);
      if (preferences && !preferences.appointmentReminders) {
        console.log(`🔕 Reminders disabled for user ${user.id}`);
        return;
      }

      // Send the reminder
      await smsService.sendAppointmentReminder(
        appointment,
        client,
        user.businessName || 'Votre salon'
      );

      console.log(`✅ Reminder sent for appointment ${appointment.id} to ${client.firstName}`);
    } catch (error) {
      console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
    }
  }

  // Manual trigger for testing
  async sendTestReminder(appointmentId: number): Promise<boolean> {
    try {
      const appointment = await storage.getAppointment(appointmentId);
      if (!appointment) {
        console.log(`❌ Appointment ${appointmentId} not found`);
        return false;
      }

      await this.sendReminderForAppointment(appointment);
      return true;
    } catch (error) {
      console.error("Error sending test reminder:", error);
      return false;
    }
  }

  // Send immediate reminder (for same day appointments)
  async sendImmediateReminder(appointmentId: number): Promise<boolean> {
    try {
      const appointment = await storage.getAppointment(appointmentId);
      if (!appointment) return false;

      const client = await storage.getClient(appointment.clientId);
      const user = await storage.getUser(appointment.userId);

      if (!client || !client.phone || !user) return false;

      await smsService.sendAppointmentReminder(
        appointment,
        client,
        user.businessName || 'Votre salon'
      );

      return true;
    } catch (error) {
      console.error("Error sending immediate reminder:", error);
      return false;
    }
  }

  // Get reminder statistics
  async getReminderStats(userId: string): Promise<any> {
    try {
      const notifications = await storage.getAllSmsNotifications(userId, 1000);
      const reminders = notifications.filter(n => n.notificationType === 'reminder');
      
      const stats = {
        total: reminders.length,
        sent: reminders.filter(n => n.status === 'sent').length,
        failed: reminders.filter(n => n.status === 'failed').length,
        pending: reminders.filter(n => n.status === 'pending').length,
        lastWeek: reminders.filter(n => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return n.createdAt && new Date(n.createdAt) > weekAgo;
        }).length
      };

      return stats;
    } catch (error) {
      console.error("Error getting reminder stats:", error);
      return {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
        lastWeek: 0
      };
    }
  }
}

export const reminderService = new ReminderService();