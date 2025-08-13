import { MailService } from '@sendgrid/mail';

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private mailService: MailService | null = null;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!process.env.SENDGRID_API_KEY;
    if (this.isConfigured) {
      this.mailService = new MailService();
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY!);
    }
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('📧 SendGrid non configuré - email non envoyé:', params.subject);
      return false;
    }

    try {
      await this.mailService!.send({
        to: params.to,
        from: params.from,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      console.log('📧 Email envoyé avec succès:', params.subject);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Vérification de votre compte</h2>
        <p>Votre code de vérification est :</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #8B5CF6;">
          ${code}
        </div>
        <p>Ce code expire dans 10 minutes.</p>
        <p>Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      from: 'noreply@salon-beaute.com',
      subject: 'Code de vérification - Salon Beauté',
      html,
      text: `Votre code de vérification est : ${code}. Ce code expire dans 10 minutes.`
    });
  }

  async sendAppointmentConfirmation(email: string, appointmentDetails: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Confirmation de rendez-vous</h2>
        <p>Votre rendez-vous a été confirmé :</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>Service :</strong> ${appointmentDetails.serviceName}</p>
          <p><strong>Date :</strong> ${appointmentDetails.date}</p>
          <p><strong>Heure :</strong> ${appointmentDetails.time}</p>
          <p><strong>Salon :</strong> ${appointmentDetails.salonName}</p>
          <p><strong>Adresse :</strong> ${appointmentDetails.address}</p>
        </div>
        <p>Nous vous rappelons que l'acompte de ${appointmentDetails.depositAmount}€ a été prélevé.</p>
        <p>À bientôt !</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      from: 'rendez-vous@salon-beaute.com',
      subject: 'Confirmation de votre rendez-vous',
      html,
      text: `Votre rendez-vous a été confirmé pour le ${appointmentDetails.date} à ${appointmentDetails.time}.`
    });
  }

  async sendAppointmentReminder(email: string, appointmentDetails: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F59E0B;">Rappel de rendez-vous</h2>
        <p>Nous vous rappelons votre rendez-vous de demain :</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px;">
          <p><strong>Service :</strong> ${appointmentDetails.serviceName}</p>
          <p><strong>Date :</strong> ${appointmentDetails.date}</p>
          <p><strong>Heure :</strong> ${appointmentDetails.time}</p>
          <p><strong>Salon :</strong> ${appointmentDetails.salonName}</p>
        </div>
        <p>Merci de nous prévenir si vous ne pouvez pas venir.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      from: 'rappel@salon-beaute.com',
      subject: 'Rappel - Rendez-vous demain',
      html,
      text: `Rappel : votre rendez-vous est prévu demain ${appointmentDetails.date} à ${appointmentDetails.time}.`
    });
  }
}

export const emailService = new EmailService();