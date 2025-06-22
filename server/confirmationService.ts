import nodemailer from 'nodemailer';
import { receiptService } from './receiptService';

interface AppointmentData {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  service: {
    name: string;
    price: number;
    duration: number;
  };
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  payment: {
    depositPaid: number;
    totalAmount: number;
    remainingBalance: number;
  };
}

export class ConfirmationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration Nodemailer - utilise SendGrid si disponible
    if (process.env.SENDGRID_API_KEY) {
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    } else {
      // Configuration SMTP générique
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  async sendBookingConfirmation(appointmentData: AppointmentData): Promise<void> {
    try {
      // Générer le reçu PDF
      const receiptData = {
        appointmentId: appointmentData.id,
        businessInfo: appointmentData.business,
        clientInfo: appointmentData.client,
        serviceInfo: appointmentData.service,
        appointmentInfo: {
          date: appointmentData.appointmentDate,
          time: appointmentData.startTime,
          status: appointmentData.status
        },
        paymentInfo: {
          depositPaid: appointmentData.payment.depositPaid,
          totalAmount: appointmentData.payment.totalAmount,
          remainingBalance: appointmentData.payment.remainingBalance,
          paymentMethod: 'Carte bancaire'
        }
      };

      const pdfBuffer = await receiptService.generateReceiptPDF(receiptData);

      // Préparer les liens d'actions
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const appointmentId = appointmentData.id;
      
      const manageUrl = `${baseUrl}/manage-booking/${appointmentId}`;
      const cancelUrl = `${baseUrl}/cancel-booking/${appointmentId}`;
      const rescheduleUrl = `${baseUrl}/reschedule-booking/${appointmentId}`;
      
      // Créer les liens calendrier
      const calendarDate = new Date(`${appointmentData.appointmentDate}T${appointmentData.startTime}`);
      const endDate = new Date(`${appointmentData.appointmentDate}T${appointmentData.endTime}`);
      
      const googleCalendarUrl = this.generateGoogleCalendarUrl({
        title: `${appointmentData.service.name} - ${appointmentData.business.name}`,
        startDate: calendarDate,
        endDate: endDate,
        description: `Rendez-vous confirmé pour ${appointmentData.service.name}`,
        location: appointmentData.business.address
      });

      const outlookCalendarUrl = this.generateOutlookCalendarUrl({
        title: `${appointmentData.service.name} - ${appointmentData.business.name}`,
        startDate: calendarDate,
        endDate: endDate,
        description: `Rendez-vous confirmé pour ${appointmentData.service.name}`,
        location: appointmentData.business.address
      });

      // Email de confirmation
      const emailHtml = this.generateConfirmationEmailHtml({
        appointmentData,
        manageUrl,
        cancelUrl,
        rescheduleUrl,
        googleCalendarUrl,
        outlookCalendarUrl
      });

      await this.transporter.sendMail({
        from: `"${appointmentData.business.name}" <${appointmentData.business.email}>`,
        to: appointmentData.client.email,
        subject: `✅ Réservation confirmée - ${appointmentData.service.name}`,
        html: emailHtml,
        attachments: [
          {
            filename: `recu-reservation-${appointmentId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      console.log(`Email de confirmation envoyé à ${appointmentData.client.email}`);
      
      // Envoyer SMS si possible (nécessiterait Twilio)
      await this.sendSMSConfirmation(appointmentData, manageUrl);

    } catch (error) {
      console.error('Erreur envoi confirmation:', error);
      throw error;
    }
  }

  private async sendSMSConfirmation(appointmentData: AppointmentData, manageUrl: string): Promise<void> {
    // SMS de confirmation - nécessiterait Twilio
    const smsMessage = `
🎉 Réservation confirmée !

📅 ${new Date(appointmentData.appointmentDate).toLocaleDateString('fr-FR')} à ${appointmentData.startTime}
💇 ${appointmentData.service.name}
🏠 ${appointmentData.business.name}
💰 Acompte payé: ${appointmentData.payment.depositPaid}€

Gérer votre RDV: ${manageUrl}
    `.trim();

    console.log(`SMS à envoyer au ${appointmentData.client.phone}:`, smsMessage);
    
    // Ici on intégrerait Twilio pour l'envoi réel du SMS
    // Pour l'instant, on log juste le message
  }

  private generateConfirmationEmailHtml(data: {
    appointmentData: AppointmentData;
    manageUrl: string;
    cancelUrl: string;
    rescheduleUrl: string;
    googleCalendarUrl: string;
    outlookCalendarUrl: string;
  }): string {
    const { appointmentData, manageUrl, cancelUrl, rescheduleUrl, googleCalendarUrl, outlookCalendarUrl } = data;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réservation confirmée</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .appointment-card { background: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; }
        .payment-info { background: #ecfdf5; border: 1px solid #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .action-buttons { margin: 25px 0; }
        .btn { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; }
        .btn-primary { background: #6366f1; color: white; }
        .btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        .btn-danger { background: #ef4444; color: white; }
        .calendar-buttons { margin: 20px 0; }
        .calendar-btn { background: #10b981; color: white; margin: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Réservation confirmée !</h1>
            <p>Merci ${appointmentData.client.firstName}, votre rendez-vous est confirmé</p>
        </div>
        
        <div class="content">
            <div class="appointment-card">
                <h3>📅 Détails de votre rendez-vous</h3>
                <p><strong>Service :</strong> ${appointmentData.service.name}</p>
                <p><strong>Date :</strong> ${new Date(appointmentData.appointmentDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Heure :</strong> ${appointmentData.startTime}</p>
                <p><strong>Durée :</strong> ${appointmentData.service.duration} minutes</p>
                <p><strong>Salon :</strong> ${appointmentData.business.name}</p>
                <p><strong>Adresse :</strong> ${appointmentData.business.address}</p>
            </div>

            <div class="payment-info">
                <h3>💰 Informations de paiement</h3>
                <p><strong>Prix total :</strong> ${appointmentData.payment.totalAmount}€</p>
                <p><strong>Acompte payé :</strong> ${appointmentData.payment.depositPaid}€ ✅</p>
                <p><strong>Reste à payer sur place :</strong> ${appointmentData.payment.remainingBalance}€</p>
            </div>

            <div class="calendar-buttons">
                <h3>📱 Ajouter à votre calendrier</h3>
                <a href="${googleCalendarUrl}" class="btn calendar-btn">📅 Google Calendar</a>
                <a href="${outlookCalendarUrl}" class="btn calendar-btn">📅 Outlook</a>
            </div>

            <div class="action-buttons">
                <h3>⚡ Actions rapides</h3>
                <a href="${manageUrl}" class="btn btn-primary">Gérer ma réservation</a>
                <a href="${rescheduleUrl}" class="btn btn-secondary">Reporter le RDV</a>
                <a href="${cancelUrl}" class="btn btn-danger">Annuler</a>
            </div>

            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4>📋 Rappel important</h4>
                <ul>
                    <li>Merci d'arriver 5 minutes avant l'heure</li>
                    <li>L'acompte est non-remboursable en cas d'annulation tardive</li>
                    <li>Pour toute modification, contactez-nous au moins 24h à l'avance</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p><strong>${appointmentData.business.name}</strong></p>
            <p>📞 ${appointmentData.business.phone} | 📧 ${appointmentData.business.email}</p>
            <p style="font-size: 12px; color: #6b7280;">
                Reçu en pièce jointe • N° réservation: #${appointmentData.id.toString().padStart(6, '0')}
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  private generateGoogleCalendarUrl(event: {
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    location: string;
  }): string {
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
      details: event.description,
      location: event.location
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  private generateOutlookCalendarUrl(event: {
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    location: string;
  }): string {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: event.startDate.toISOString(),
      enddt: event.endDate.toISOString(),
      body: event.description,
      location: event.location
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  async sendPaymentReminder(appointmentData: AppointmentData): Promise<void> {
    // Email de rappel de solde à payer
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>💳 Rappel de paiement - ${appointmentData.business.name}</h2>
        <p>Bonjour ${appointmentData.client.firstName},</p>
        <p>Votre rendez-vous du ${new Date(appointmentData.appointmentDate).toLocaleDateString('fr-FR')} approche.</p>
        <p><strong>Solde restant à régler :</strong> ${appointmentData.payment.remainingBalance}€</p>
        <p>Merci de prévoir le paiement sur place.</p>
    </div>
    `;

    await this.transporter.sendMail({
      from: `"${appointmentData.business.name}" <${appointmentData.business.email}>`,
      to: appointmentData.client.email,
      subject: `💳 Rappel de paiement - ${appointmentData.service.name}`,
      html: emailHtml
    });
  }
}

export const confirmationService = new ConfirmationService();