import { storage } from "./storage";
import { InsertSmsNotification, InsertEmailNotification, Appointment, Client } from "@shared/schema";

interface SmsProvider {
  sendSms(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Twilio SMS Provider (you can add other providers later)
class TwilioSmsProvider implements SmsProvider {
  private accountSid: string;
  private authToken: string;
  private fromPhone: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromPhone = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendSms(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.accountSid || !this.authToken || !this.fromPhone) {
      return { success: false, error: "Twilio credentials not configured" };
    }

    try {
      // For demo purposes, we'll simulate the API call
      // In production, you would use the Twilio SDK:
      // const client = twilio(this.accountSid, this.authToken);
      // const message = await client.messages.create({ ... });

      console.log(`📱 SMS would be sent via Twilio:
To: ${phone}
From: ${this.fromPhone}
Message: ${message}`);

      // Simulate success with a fake message ID
      const fakeMessageId = `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      return { 
        success: true, 
        messageId: fakeMessageId 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Failed to send SMS" 
      };
    }
  }
}

// Mock SMS Provider for development
class MockSmsProvider implements SmsProvider {
  async sendSms(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`📱 MOCK SMS:
To: ${phone}
Message: ${message}
Status: ✅ Sent (simulated)`);

    return { 
      success: true, 
      messageId: `MOCK_${Date.now()}` 
    };
  }
}

export class SmsService {
  private provider: SmsProvider;

  constructor() {
    // Use mock provider in development, Twilio in production
    this.provider = process.env.NODE_ENV === 'production' 
      ? new TwilioSmsProvider() 
      : new MockSmsProvider();
  }

  async sendAppointmentConfirmation(appointment: Appointment, client: any, businessName: string): Promise<void> {
    if (!client.phone) {
      console.log(`❌ Cannot send SMS to client ${client.firstName} - no phone number`);
      return;
    }

    const appointmentDate = new Date(appointment.date);
    const dateStr = appointmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = appointment.time;

    const message = `✅ Rendez-vous confirmé !

📅 ${dateStr}
🕐 ${timeStr}
🏢 ${businessName}
💇‍♀️ ${appointment.serviceName || 'Service'}

Merci ${client.firstName} ! À très bientôt.

Pour annuler/modifier: répondez STOP`;

    const smsData: InsertSmsNotification = {
      recipientPhone: client.phone,
      recipientName: `${client.firstName} ${client.lastName || ''}`.trim(),
      message,
      notificationType: 'appointment_confirmation',
      appointmentId: appointment.id,
      status: 'pending'
    };

    try {
      // Log the SMS in database first
      const smsLog = await storage.createSmsNotification(smsData);

      // Send the SMS
      const result = await this.provider.sendSms(client.phone, message);

      // Update the log with result
      await storage.updateSmsNotification(smsLog.id, {
        status: result.success ? 'sent' : 'failed',
        externalId: result.messageId,
        sentAt: new Date(),
        failureReason: result.error
      });

      console.log(`📱 SMS confirmation ${result.success ? 'sent' : 'failed'} to ${client.firstName} (${client.phone})`);
    } catch (error: any) {
      console.error('Error sending appointment confirmation SMS:', error);
    }
  }

  async sendAppointmentReminder(appointment: Appointment, client: any, businessName: string): Promise<void> {
    if (!client.phone) {
      console.log(`❌ Cannot send reminder SMS to client ${client.firstName} - no phone number`);
      return;
    }

    const appointmentDate = new Date(appointment.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = appointmentDate.toDateString() === new Date().toDateString();
    const isTomorrow = appointmentDate.toDateString() === tomorrow.toDateString();
    
    let timeFrame = appointmentDate.toLocaleDateString('fr-FR');
    if (isToday) timeFrame = "aujourd'hui";
    else if (isTomorrow) timeFrame = "demain";

    const message = `⏰ Rappel de rendez-vous

Bonjour ${client.firstName},

📅 Votre rdv est prévu ${timeFrame} à ${appointment.time}
🏢 ${businessName}
💇‍♀️ ${appointment.serviceName || 'Service'}

À très bientôt !

Pour annuler: répondez STOP`;

    const smsData: InsertSmsNotification = {
      recipientPhone: client.phone,
      recipientName: `${client.firstName} ${client.lastName || ''}`.trim(),
      message,
      notificationType: 'reminder',
      appointmentId: appointment.id,
      status: 'pending'
    };

    try {
      const smsLog = await storage.createSmsNotification(smsData);
      const result = await this.provider.sendSms(client.phone, message);

      await storage.updateSmsNotification(smsLog.id, {
        status: result.success ? 'sent' : 'failed',
        externalId: result.messageId,
        sentAt: new Date(),
        failureReason: result.error
      });

      console.log(`📱 SMS reminder ${result.success ? 'sent' : 'failed'} to ${client.firstName}`);
    } catch (error: any) {
      console.error('Error sending appointment reminder SMS:', error);
    }
  }

  async sendAppointmentCancellation(appointment: Appointment, client: any, businessName: string, reason?: string): Promise<void> {
    if (!client.phone) return;

    const appointmentDate = new Date(appointment.date);
    const dateStr = appointmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const message = `❌ Rendez-vous annulé

Bonjour ${client.firstName},

Votre rendez-vous du ${dateStr} à ${appointment.time} chez ${businessName} a été annulé.

${reason ? `Motif: ${reason}` : ''}

N'hésitez pas à reprendre rendez-vous !

Merci de votre compréhension.`;

    const smsData: InsertSmsNotification = {
      recipientPhone: client.phone,
      recipientName: `${client.firstName} ${client.lastName || ''}`.trim(),
      message,
      notificationType: 'cancellation',
      appointmentId: appointment.id,
      status: 'pending'
    };

    try {
      const smsLog = await storage.createSmsNotification(smsData);
      const result = await this.provider.sendSms(client.phone, message);

      await storage.updateSmsNotification(smsLog.id, {
        status: result.success ? 'sent' : 'failed',
        externalId: result.messageId,
        sentAt: new Date(),
        failureReason: result.error
      });

      console.log(`📱 SMS cancellation ${result.success ? 'sent' : 'failed'} to ${client.firstName}`);
    } catch (error: any) {
      console.error('Error sending cancellation SMS:', error);
    }
  }

  async sendCustomMessage(phone: string, recipientName: string, message: string): Promise<boolean> {
    const smsData: InsertSmsNotification = {
      recipientPhone: phone,
      recipientName,
      message,
      notificationType: 'custom',
      status: 'pending'
    };

    try {
      const smsLog = await storage.createSmsNotification(smsData);
      const result = await this.provider.sendSms(phone, message);

      await storage.updateSmsNotification(smsLog.id, {
        status: result.success ? 'sent' : 'failed',
        externalId: result.messageId,
        sentAt: new Date(),
        failureReason: result.error
      });

      return result.success;
    } catch (error: any) {
      console.error('Error sending custom SMS:', error);
      return false;
    }
  }
}

export const smsService = new SmsService();