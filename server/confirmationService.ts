export interface BookingConfirmationData {
  appointmentId: number;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  totalPrice: number;
  depositPaid: number;
  businessName: string;
  businessAddress: string;
}

export interface CancellationNotificationData {
  appointmentId: number;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  reason: string;
}

export interface RescheduleNotificationData {
  appointmentId: number;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
}

export class ConfirmationService {
  // Envoyer confirmation de réservation par email/SMS
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    try {
      // Simulation de l'envoi d'email
      console.log(`📧 Email de confirmation envoyé à ${data.clientEmail}`);
      console.log(`📅 RDV: ${data.serviceName} le ${data.date} à ${data.time}`);
      console.log(`💰 Prix: ${data.totalPrice}€ (acompte: ${data.depositPaid}€)`);
      
      // Simulation SMS (si numéro fourni)
      console.log(`📱 SMS de confirmation envoyé`);
      
      // TODO: Intégrer SendGrid/Nodemailer pour emails
      // TODO: Intégrer Twilio pour SMS
      
      return true;
    } catch (error) {
      console.error("Erreur envoi confirmation:", error);
      return false;
    }
  }

  // Notification d'annulation
  async sendCancellationNotification(data: CancellationNotificationData): Promise<boolean> {
    try {
      console.log(`❌ Notification d'annulation envoyée à ${data.clientEmail}`);
      console.log(`📅 RDV annulé: ${data.serviceName} le ${data.date} à ${data.time}`);
      console.log(`ℹ️ Raison: ${data.reason}`);
      
      return true;
    } catch (error) {
      console.error("Erreur notification annulation:", error);
      return false;
    }
  }

  // Notification de report
  async sendRescheduleNotification(data: RescheduleNotificationData): Promise<boolean> {
    try {
      console.log(`🔄 Notification de report envoyée à ${data.clientEmail}`);
      console.log(`📅 Ancien RDV: ${data.oldDate} à ${data.oldTime}`);
      console.log(`📅 Nouveau RDV: ${data.newDate} à ${data.newTime}`);
      
      return true;
    } catch (error) {
      console.error("Erreur notification report:", error);
      return false;
    }
  }
}

export const confirmationService = new ConfirmationService();