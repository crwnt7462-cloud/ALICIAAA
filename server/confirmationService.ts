import nodemailer from 'nodemailer';

class ConfirmationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration email - utilise les variables d'environnement
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // ou votre service email
      auth: {
        user: process.env.EMAIL_USER || 'noreply@salonbeaute.fr',
        pass: process.env.EMAIL_PASS || 'temppass123'
      }
    });
  }

  async sendBookingConfirmation(bookingData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    salonName: string;
    depositAmount: number;
    totalAmount: number;
  }) {
    try {
      const emailHtml = this.generateConfirmationEmail(bookingData);
      
      // Envoyer l'email de confirmation
      if (bookingData.clientEmail) {
        await this.transporter.sendMail({
          from: `"${bookingData.salonName}" <noreply@salonbeaute.fr>`,
          to: bookingData.clientEmail,
          subject: `Confirmation de votre rendez-vous - ${bookingData.salonName}`,
          html: emailHtml
        });
      }

      // Envoyer SMS si numéro fourni
      if (bookingData.clientPhone) {
        await this.sendSMSConfirmation(bookingData);
      }

      console.log('✅ Confirmation envoyée:', {
        email: bookingData.clientEmail,
        phone: bookingData.clientPhone,
        service: bookingData.serviceName
      });

    } catch (error) {
      console.error('❌ Erreur envoi confirmation:', error);
      // Ne pas faire planter le processus de réservation
    }
  }

  private generateConfirmationEmail(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de rendez-vous</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8B5CF6, #F59E0B); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .booking-details { background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .total { background: #8B5CF6; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Rendez-vous confirmé !</h1>
            <p>Votre réservation a été prise en compte</p>
          </div>
          
          <div class="content">
            <p>Bonjour <strong>${data.clientName}</strong>,</p>
            <p>Votre rendez-vous chez <strong>${data.salonName}</strong> a été confirmé avec succès.</p>
            
            <div class="booking-details">
              <h3>📅 Détails de votre réservation</h3>
              <div class="detail-row">
                <span class="label">Service :</span>
                <span class="value">${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date :</span>
                <span class="value">${data.appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Heure :</span>
                <span class="value">${data.appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">Téléphone :</span>
                <span class="value">${data.clientPhone}</span>
              </div>
            </div>

            <div class="total">
              <h3>💳 Paiement</h3>
              <p>Acompte payé : <strong>${data.depositAmount}€</strong></p>
              <p>Total du service : <strong>${data.totalAmount}€</strong></p>
              <p>Solde à régler sur place : <strong>${data.totalAmount - data.depositAmount}€</strong></p>
            </div>

            <h3>📋 Informations importantes</h3>
            <ul>
              <li>Présentez-vous <strong>5 minutes avant</strong> votre rendez-vous</li>
              <li>Annulation gratuite jusqu'à <strong>24h avant</strong></li>
              <li>En cas d'empêchement, contactez-nous rapidement</li>
              <li>Apportez une pièce d'identité si premier rendez-vous</li>
            </ul>

            <center>
              <a href="#" class="button">Ajouter au calendrier</a>
              <a href="#" class="button">Contacter le salon</a>
            </center>
          </div>

          <div class="footer">
            <p><strong>${data.salonName}</strong></p>
            <p>Merci de votre confiance ! Nous avons hâte de vous accueillir.</p>
            <p style="font-size: 12px; color: #999;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async sendSMSConfirmation(data: any) {
    try {
      // Simulation d'envoi SMS - en production, utiliser Twilio, etc.
      const smsText = `✅ RDV confirmé chez ${data.salonName}
📅 ${data.appointmentDate} à ${data.appointmentTime}
🎯 ${data.serviceName}
💰 Acompte payé: ${data.depositAmount}€
ℹ️ Présentez-vous 5min avant. Annulation gratuite 24h.`;

      console.log('📱 SMS envoyé:', {
        to: data.clientPhone,
        message: smsText
      });

      // En production :
      // await twilioClient.messages.create({
      //   body: smsText,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: data.clientPhone
      // });

    } catch (error) {
      console.error('Erreur envoi SMS:', error);
    }
  }

  async sendReminderNotification(appointmentData: any) {
    try {
      // Rappel 24h avant
      const reminderHtml = this.generateReminderEmail(appointmentData);
      
      await this.transporter.sendMail({
        from: `"Rappel RDV" <noreply@salonbeaute.fr>`,
        to: appointmentData.clientEmail,
        subject: `Rappel: RDV demain chez ${appointmentData.salonName}`,
        html: reminderHtml
      });

      console.log('📬 Rappel envoyé pour:', appointmentData.clientName);
      
    } catch (error) {
      console.error('Erreur envoi rappel:', error);
    }
  }

  private generateReminderEmail(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #F59E0B); color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h2>🔔 Rappel de rendez-vous</h2>
          <p>Votre RDV est prévu <strong>demain</strong> !</p>
        </div>
        
        <div style="padding: 20px; background: #f8f9ff; margin: 20px 0; border-radius: 8px;">
          <h3>📅 Votre rendez-vous</h3>
          <p><strong>Service :</strong> ${data.serviceName}</p>
          <p><strong>Date :</strong> ${data.appointmentDate}</p>
          <p><strong>Heure :</strong> ${data.appointmentTime}</p>
          <p><strong>Salon :</strong> ${data.salonName}</p>
        </div>
        
        <p>N'oubliez pas de vous présenter <strong>5 minutes avant</strong> votre rendez-vous.</p>
        <p>En cas d'empêchement, contactez-nous rapidement.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="#" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Modifier/Annuler</a>
        </div>
      </div>
    `;
  }
}

export const confirmationService = new ConfirmationService();