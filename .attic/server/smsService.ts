// Service SMS avec Twilio - Configuration requis
class SMSService {
  private isConfigured: boolean;
  private twilioClient: any;

  constructor() {
    this.isConfigured = !!(
      process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_PHONE_NUMBER
    );

    if (this.isConfigured) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
      } catch (error) {
        console.warn('⚠️ Twilio non installé. Installez avec: npm install twilio');
        this.isConfigured = false;
      }
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('📱 Twilio non configuré - SMS non envoyé:', message.substring(0, 50) + '...');
      return false;
    }

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      console.log('📱 SMS envoyé avec succès à:', to);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi SMS:', error);
      return false;
    }
  }

  async sendVerificationSMS(phone: string, code: string): Promise<boolean> {
    const message = `Votre code de vérification Salon Beauté est : ${code}. Valide 10 minutes.`;
    return this.sendSMS(phone, message);
  }

  async sendAppointmentConfirmation(phone: string, appointmentDetails: any): Promise<boolean> {
    const message = `Rendez-vous confirmé chez ${appointmentDetails.salonName} le ${appointmentDetails.date} à ${appointmentDetails.time}. Acompte: ${appointmentDetails.depositAmount}€`;
    return this.sendSMS(phone, message);
  }

  async sendAppointmentReminder(phone: string, appointmentDetails: any): Promise<boolean> {
    const message = `Rappel: RDV demain ${appointmentDetails.date} à ${appointmentDetails.time} chez ${appointmentDetails.salonName}. Merci!`;
    return this.sendSMS(phone, message);
  }

  async sendCancellationNotification(phone: string, appointmentDetails: any): Promise<boolean> {
    const message = `Votre RDV du ${appointmentDetails.date} à ${appointmentDetails.time} a été annulé. Remboursement en cours.`;
    return this.sendSMS(phone, message);
  }
}

export const smsService = new SMSService();