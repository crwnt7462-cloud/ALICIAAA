import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface EmailVerificationData {
  email: string;
  verificationCode: string;
  userType: 'professional' | 'client';
  businessName?: string;
}

export class EmailService {
  private fromEmail = 'support@rendly.app'; // Email vérifié SendGrid

  async sendVerificationCode(data: EmailVerificationData): Promise<boolean> {
    try {
      const { email, verificationCode, userType, businessName } = data;
      
      // MODE DÉVELOPPEMENT : Afficher le code dans les logs au lieu d'envoyer par email
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 MODE DÉVELOPPEMENT - Code de vérification pour ${email}:`);
        console.log(`🔑 CODE: ${verificationCode}`);
        console.log(`👤 Type: ${userType}`);
        console.log(`🏢 Business: ${businessName || 'N/A'}`);
        return true;
      }

      const msg = {
        to: email,
        from: this.fromEmail,
        subject: 'Code de vérification - Votre Salon',
        html: this.generateVerificationEmailHTML(verificationCode, userType, businessName),
        text: this.generateVerificationEmailText(verificationCode, userType, businessName),
      };

      await sgMail.send(msg);
      console.log(`✅ Email de vérification envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      // En cas d'erreur SendGrid, afficher le code en développement
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 FALLBACK - Code de vérification pour ${data.email}: ${data.verificationCode}`);
        return true;
      }
      return false;
    }
  }

  private generateVerificationEmailHTML(code: string, userType: string, businessName?: string): string {
    const title = userType === 'professional' 
      ? `Bienvenue ${businessName ? `chez ${businessName}` : 'professionnel'} !` 
      : 'Bienvenue sur notre plateforme !';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code de vérification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6, #F59E0B); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .code-box { background: #8B5CF6; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 20px 0; border-radius: 8px; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏪 ${title}</h1>
          </div>
          <div class="content">
            <h2>Confirmez votre adresse email</h2>
            <p>Merci de vous être inscrit sur notre plateforme de gestion de salon. Pour finaliser votre création de compte, veuillez utiliser le code de vérification ci-dessous :</p>
            
            <div class="code-box">
              ${code}
            </div>
            
            <p><strong>Important :</strong></p>
            <ul>
              <li>Ce code expire dans 10 minutes</li>
              <li>Il ne peut être utilisé qu'une seule fois</li>
              <li>Ne le partagez avec personne</li>
            </ul>
            
            <p>Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Votre Salon - Plateforme de gestion pour professionnels de la beauté</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateVerificationEmailText(code: string, userType: string, businessName?: string): string {
    const title = userType === 'professional' 
      ? `Bienvenue ${businessName ? `chez ${businessName}` : 'professionnel'} !` 
      : 'Bienvenue sur notre plateforme !';
    
    return `
${title}

Confirmez votre adresse email

Merci de vous être inscrit sur notre plateforme de gestion de salon. Pour finaliser votre création de compte, veuillez utiliser le code de vérification ci-dessous :

CODE DE VÉRIFICATION: ${code}

Important :
- Ce code expire dans 10 minutes
- Il ne peut être utilisé qu'une seule fois  
- Ne le partagez avec personne

Si vous n'avez pas demandé cette vérification, ignorez cet email.

© 2025 Votre Salon - Plateforme de gestion pour professionnels de la beauté
    `;
  }

  // Générer un code de vérification à 6 chiffres
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export const emailService = new EmailService();