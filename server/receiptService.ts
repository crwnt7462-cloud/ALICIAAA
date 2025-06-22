import jsPDF from 'jspdf';
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
    doc.setFont(undefined, 'bold');
    doc.text(receiptData.businessInfo.name, pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(receiptData.businessInfo.address, pageWidth / 2, 40, { align: 'center' });
    doc.text(`Tél: ${receiptData.businessInfo.phone} | Email: ${receiptData.businessInfo.email}`, pageWidth / 2, 47, { align: 'center' });
    
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55);
    
    // Titre du reçu
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('REÇU DE RÉSERVATION', pageWidth / 2, 70, { align: 'center' });
    
    // Numéro de réservation et date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`N° Réservation: #${receiptData.appointmentId.toString().padStart(6, '0')}`, 20, 85);
    doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, 85, { align: 'right' });
    
    // Informations client
    let yPos = 105;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('INFORMATIONS CLIENT', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Nom: ${receiptData.clientInfo.firstName} ${receiptData.clientInfo.lastName}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${receiptData.clientInfo.email}`, 20, yPos);
    yPos += 7;
    doc.text(`Téléphone: ${receiptData.clientInfo.phone}`, 20, yPos);
    
    // Détails du rendez-vous
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DÉTAILS DU RENDEZ-VOUS', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Service: ${receiptData.serviceInfo.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Date: ${new Date(receiptData.appointmentInfo.date).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, yPos);
    yPos += 7;
    doc.text(`Heure: ${receiptData.appointmentInfo.time}`, 20, yPos);
    yPos += 7;
    doc.text(`Durée: ${receiptData.serviceInfo.duration} minutes`, 20, yPos);
    yPos += 7;
    doc.text(`Statut: ${receiptData.appointmentInfo.status === 'confirmed' ? 'Confirmé' : receiptData.appointmentInfo.status}`, 20, yPos);
    
    // Détails financiers
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DÉTAILS FINANCIERS', 20, yPos);
    
    yPos += 15;
    // Tableau des montants
    const tableData = [
      ['Service', receiptData.serviceInfo.name, `${receiptData.paymentInfo.totalAmount}€`],
      ['Acompte payé', `30% (${receiptData.paymentInfo.paymentMethod})`, `${receiptData.paymentInfo.depositPaid}€`],
      ['Solde à régler', 'Sur place', `${receiptData.paymentInfo.remainingBalance}€`]
    ];
    
    const colWidths = [60, 80, 40];
    const startX = 20;
    
    // En-tête du tableau
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Description', startX, yPos);
    doc.text('Détail', startX + colWidths[0], yPos);
    doc.text('Montant', startX + colWidths[0] + colWidths[1], yPos);
    
    yPos += 5;
    doc.line(startX, yPos, startX + colWidths[0] + colWidths[1] + colWidths[2], yPos);
    
    // Lignes du tableau
    doc.setFont(undefined, 'normal');
    tableData.forEach((row, index) => {
      yPos += 10;
      doc.text(row[0], startX, yPos);
      doc.text(row[1], startX + colWidths[0], yPos);
      doc.text(row[2], startX + colWidths[0] + colWidths[1], yPos, { align: 'right' });
      
      if (index === tableData.length - 1) {
        // Ligne de total
        yPos += 5;
        doc.setLineWidth(1);
        doc.line(startX + colWidths[0] + colWidths[1], yPos, startX + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      }
    });
    
    // QR Code pour annulation/modification
    yPos += 30;
    try {
      const qrCodeUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/manage-booking/${receiptData.appointmentId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 80 });
      doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 50, yPos, 30, 30);
      
      doc.setFontSize(8);
      doc.text('Scanner pour gérer', pageWidth - 50, yPos + 35, { align: 'left' });
      doc.text('votre réservation', pageWidth - 50, yPos + 40, { align: 'left' });
    } catch (error) {
      console.error('Erreur génération QR code:', error);
    }
    
    // Notes importantes
    yPos += 20;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('NOTES IMPORTANTES:', 20, yPos);
    
    yPos += 8;
    doc.setFont(undefined, 'normal');
    doc.text('• L\'acompte versé est non-remboursable en cas d\'annulation tardive', 20, yPos);
    yPos += 6;
    doc.text('• Merci d\'arriver 5 minutes avant l\'heure du rendez-vous', 20, yPos);
    yPos += 6;
    doc.text('• Toute modification doit être effectuée au moins 24h à l\'avance', 20, yPos);
    
    // Pied de page
    yPos = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Merci de votre confiance !', pageWidth / 2, yPos, { align: 'center' });
    doc.text(`Document généré le ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, yPos + 8, { align: 'center' });
    
    return Buffer.from(doc.output('arraybuffer'));
  }
  
  async generateInvoicePDF(receiptData: ReceiptData): Promise<Buffer> {
    // Version facture complète (après paiement total)
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête similaire mais titre différent
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(receiptData.businessInfo.name, pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(receiptData.businessInfo.address, pageWidth / 2, 40, { align: 'center' });
    doc.text(`Tél: ${receiptData.businessInfo.phone} | Email: ${receiptData.businessInfo.email}`, pageWidth / 2, 47, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55);
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('FACTURE', pageWidth / 2, 70, { align: 'center' });
    
    // Numéro de facture
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`N° Facture: F${receiptData.appointmentId.toString().padStart(6, '0')}`, 20, 85);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, 85, { align: 'right' });
    
    // Reste du contenu similaire mais avec statut "PAYÉ"
    return this.generateReceiptPDF({
      ...receiptData,
      paymentInfo: {
        ...receiptData.paymentInfo,
        depositPaid: receiptData.paymentInfo.totalAmount,
        remainingBalance: 0
      }
    });
  }
}

export const receiptService = new ReceiptService();