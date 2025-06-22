const jsPDF = require('jspdf');
import QRCode from 'qrcode';

interface ReceiptData {
  appointmentId: number;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  serviceInfo: {
    name: string;
    price: number;
    duration: number;
  };
  appointmentInfo: {
    date: string;
    time: string;
    status: string;
  };
  paymentInfo: {
    depositPaid: number;
    totalAmount: number;
    remainingBalance: number;
    paymentMethod: string;
  };
}

export class ReceiptService {
  async generateReceiptPDF(receiptData: ReceiptData): Promise<Buffer> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête avec logo/nom du salon
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(receiptData.businessInfo.name, pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(receiptData.businessInfo.address, pageWidth / 2, 40, { align: 'center' });
    doc.text(`Tél: ${receiptData.businessInfo.phone} | Email: ${receiptData.businessInfo.email}`, pageWidth / 2, 47, { align: 'center' });
    
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55);
    
    // Titre du reçu
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('REÇU DE RÉSERVATION', pageWidth / 2, 70, { align: 'center' });
    
    // Numéro de réservation et date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° Réservation: #${receiptData.appointmentId.toString().padStart(6, '0')}`, 20, 85);
    doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, 85, { align: 'right' });
    
    // Informations client
    let yPos = 105;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CLIENT', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom: ${receiptData.clientInfo.firstName} ${receiptData.clientInfo.lastName}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${receiptData.clientInfo.email}`, 20, yPos);
    yPos += 7;
    doc.text(`Téléphone: ${receiptData.clientInfo.phone}`, 20, yPos);
    
    // Détails du rendez-vous
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DU RENDEZ-VOUS', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Service: ${receiptData.serviceInfo.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Date: ${receiptData.appointmentInfo.date}`, 20, yPos);
    yPos += 7;
    doc.text(`Heure: ${receiptData.appointmentInfo.time}`, 20, yPos);
    yPos += 7;
    doc.text(`Durée: ${receiptData.serviceInfo.duration} minutes`, 20, yPos);
    yPos += 7;
    doc.text(`Statut: ${receiptData.appointmentInfo.status}`, 20, yPos);
    
    // Détails financiers
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS FINANCIERS', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Prix total du service: ${receiptData.paymentInfo.totalAmount}€`, 20, yPos);
    yPos += 7;
    doc.text(`Acompte payé: ${receiptData.paymentInfo.depositPaid}€`, 20, yPos);
    yPos += 7;
    doc.text(`Reste à payer: ${receiptData.paymentInfo.remainingBalance}€`, 20, yPos);
    yPos += 7;
    doc.text(`Mode de paiement: ${receiptData.paymentInfo.paymentMethod}`, 20, yPos);
    
    // QR Code pour gestion de la réservation
    yPos += 25;
    try {
      const manageUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/manage-booking/${receiptData.appointmentId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(manageUrl, { width: 80 });
      doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 50, yPos - 10, 30, 30);
      
      doc.setFontSize(8);
      doc.text('Scannez pour gérer votre réservation', pageWidth - 50, yPos + 25, { align: 'left' });
    } catch (error) {
      console.error('Erreur génération QR code:', error);
    }
    
    // Conditions d'annulation
    yPos += 40;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDITIONS D\'ANNULATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('• Annulation gratuite jusqu\'à 24h avant le rendez-vous', 20, yPos);
    yPos += 5;
    doc.text('• Annulation tardive: frais de 10€', 20, yPos);
    yPos += 5;
    doc.text('• L\'acompte versé est non-remboursable', 20, yPos);
    
    // Pied de page
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci de votre confiance !', pageWidth / 2, footerY, { align: 'center' });
    
    return Buffer.from(doc.output('arraybuffer'));
  }

  async generateInvoicePDF(receiptData: ReceiptData): Promise<Buffer> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête facture
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(receiptData.businessInfo.name, 20, 50);
    doc.text(receiptData.businessInfo.address, 20, 60);
    doc.text(`Tél: ${receiptData.businessInfo.phone}`, 20, 70);
    doc.text(`Email: ${receiptData.businessInfo.email}`, 20, 80);
    
    // Numéro de facture
    doc.text(`Facture N°: F-${receiptData.appointmentId.toString().padStart(6, '0')}`, pageWidth - 20, 50, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, 60, { align: 'right' });
    
    // Client facturé
    let yPos = 100;
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURÉ À:', 20, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`${receiptData.clientInfo.firstName} ${receiptData.clientInfo.lastName}`, 20, yPos);
    yPos += 8;
    doc.text(receiptData.clientInfo.email, 20, yPos);
    yPos += 8;
    doc.text(receiptData.clientInfo.phone, 20, yPos);
    
    // Tableau des services
    yPos += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL DES PRESTATIONS', 20, yPos);
    
    yPos += 15;
    // En-têtes du tableau
    doc.rect(20, yPos, pageWidth - 40, 10);
    doc.text('Service', 25, yPos + 7);
    doc.text('Date', 80, yPos + 7);
    doc.text('Durée', 120, yPos + 7);
    doc.text('Prix', pageWidth - 30, yPos + 7, { align: 'right' });
    
    // Ligne de service
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.rect(20, yPos, pageWidth - 40, 12);
    doc.text(receiptData.serviceInfo.name, 25, yPos + 8);
    doc.text(receiptData.appointmentInfo.date, 80, yPos + 8);
    doc.text(`${receiptData.serviceInfo.duration}min`, 120, yPos + 8);
    doc.text(`${receiptData.paymentInfo.totalAmount}€`, pageWidth - 30, yPos + 8, { align: 'right' });
    
    // Total
    yPos += 25;
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: ${receiptData.paymentInfo.totalAmount}€`, pageWidth - 30, yPos, { align: 'right' });
    
    return Buffer.from(doc.output('arraybuffer'));
  }
}

export const receiptService = new ReceiptService();