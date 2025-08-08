import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface ReceiptData {
  appointmentId: number;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  servicePrice: number;
  depositAmount: number;
  date: string;
  time: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  paymentMethod: string;
  transactionId?: string;
}

class ReceiptService {
  constructor() {
    console.log('🧾 Service de reçus initialisé');
  }

  async generateReceipt(data: ReceiptData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // En-tête du document
        doc.fontSize(20).text(data.businessName, 50, 50);
        doc.fontSize(12).text(data.businessAddress, 50, 80);
        doc.text(data.businessPhone, 50, 100);
        doc.text(data.businessEmail, 50, 120);

        // Ligne de séparation
        doc.moveTo(50, 150).lineTo(550, 150).stroke();

        // Titre
        doc.fontSize(16).text('REÇU DE PAIEMENT', 50, 170);
        doc.fontSize(12).text(`Reçu #${data.appointmentId}`, 400, 170);

        // Informations client
        doc.text('FACTURÉ À:', 50, 210);
        doc.text(data.clientName, 50, 230);
        doc.text(data.clientEmail, 50, 250);

        // Informations rendez-vous
        doc.text('DÉTAILS DU RENDEZ-VOUS:', 50, 290);
        doc.text(`Service: ${data.serviceName}`, 50, 310);
        doc.text(`Date: ${data.date}`, 50, 330);
        doc.text(`Heure: ${data.time}`, 50, 350);

        // Tableau des prix
        doc.text('DÉTAIL DU PAIEMENT:', 50, 390);
        doc.text(`Prix du service: ${data.servicePrice.toFixed(2)}€`, 50, 410);
        doc.text(`Acompte versé: ${data.depositAmount.toFixed(2)}€`, 50, 430);
        doc.text(`Restant dû: ${(data.servicePrice - data.depositAmount).toFixed(2)}€`, 50, 450);

        // Ligne de séparation
        doc.moveTo(50, 480).lineTo(300, 480).stroke();

        // Informations de paiement
        doc.text(`Mode de paiement: ${data.paymentMethod}`, 50, 500);
        if (data.transactionId) {
          doc.text(`ID Transaction: ${data.transactionId}`, 50, 520);
        }

        // Pied de page
        doc.fontSize(10).text('Merci pour votre confiance !', 50, 600);
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 50, 620);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateInvoice(data: ReceiptData): Promise<Buffer> {
    // Version facture plus complète
    return this.generateReceipt(data);
  }

  async saveReceiptToFile(data: ReceiptData, outputPath: string): Promise<string> {
    try {
      const pdfBuffer = await this.generateReceipt(data);
      const fileName = `receipt_${data.appointmentId}_${Date.now()}.pdf`;
      const fullPath = path.join(outputPath, fileName);
      
      // Créer le dossier s'il n'existe pas
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, pdfBuffer);
      console.log(`🧾 Reçu sauvegardé: ${fullPath}`);
      return fullPath;
    } catch (error) {
      console.error('❌ Erreur sauvegarde reçu:', error);
      throw error;
    }
  }
}

export const receiptService = new ReceiptService();