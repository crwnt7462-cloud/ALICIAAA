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
  async generateReceiptHTML(receiptData: ReceiptData): Promise<string> {
    try {
      // Générer le QR code
      const manageUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/manage-booking/${receiptData.appointmentId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(manageUrl, { width: 200 });
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Reçu de Réservation #${receiptData.appointmentId}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
              line-height: 1.6;
              color: #333;
              background: #f8f9fa;
              padding: 20px;
            }
            .receipt-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              color: white;
              text-align: center; 
              padding: 30px 20px;
            }
            .business-name { 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 8px;
              letter-spacing: 0.5px;
            }
            .business-info { 
              font-size: 14px; 
              opacity: 0.9;
              line-height: 1.4;
            }
            .receipt-title { 
              font-size: 24px; 
              font-weight: bold; 
              text-align: center; 
              margin: 30px 0;
              color: #1a1a1a;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content {
              padding: 0 30px 30px;
            }
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              font-size: 14px;
            }
            .section { 
              margin: 25px 0; 
              padding: 20px;
              background: #fafbfc;
              border-radius: 10px;
              border-left: 4px solid #8b5cf6;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 15px;
              color: #1a1a1a;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            .info-item {
              padding: 12px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .info-item:last-child {
              border-bottom: none;
            }
            .label { 
              font-weight: 600; 
              color: #4a5568;
              font-size: 13px;
              display: block;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            .value { 
              color: #1a1a1a;
              font-size: 15px;
              font-weight: 500;
            }
            .financial-section {
              background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
              border-left-color: #10b981;
            }
            .financial-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 10px;
            }
            .financial-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              font-size: 15px;
            }
            .financial-item.highlight {
              background: #10b981;
              color: white;
              font-weight: bold;
              font-size: 16px;
            }
            .qr-section {
              text-align: center;
              margin: 30px 0;
              padding: 25px;
              background: white;
              border: 2px dashed #8b5cf6;
              border-radius: 12px;
            }
            .qr-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 15px;
              color: #8b5cf6;
            }
            .qr-subtitle {
              font-size: 13px;
              color: #666;
              margin-top: 10px;
            }
            .conditions {
              font-size: 12px;
              color: #666;
              margin-top: 30px;
              padding: 20px;
              background: #fef3c7;
              border-radius: 8px;
              border-left: 4px solid #f59e0b;
            }
            .conditions-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #1a1a1a;
              font-size: 14px;
            }
            .condition-item {
              margin: 6px 0;
              padding-left: 15px;
              position: relative;
            }
            .condition-item:before {
              content: "•";
              color: #f59e0b;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 25px;
              background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
              border-radius: 10px;
              font-size: 16px;
              color: #8b5cf6;
              font-weight: bold;
            }
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #8b5cf6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
              transition: all 0.2s;
            }
            .print-button:hover {
              background: #7c3aed;
              transform: translateY(-2px);
            }
            @media print {
              body { background: white; padding: 0; }
              .receipt-container { box-shadow: none; }
              .print-button { display: none; }
            }
            @media (max-width: 600px) {
              .content { padding: 0 20px 20px; }
              .meta-info { flex-direction: column; gap: 10px; }
              .info-grid { grid-template-columns: 1fr; }
            }
          </style>
        </head>
        <body>
          <button class="print-button" onclick="window.print()">🖨️ Imprimer</button>
          
          <div class="receipt-container">
            <div class="header">
              <div class="business-name">${receiptData.businessInfo.name}</div>
              <div class="business-info">
                ${receiptData.businessInfo.address}<br>
                📞 ${receiptData.businessInfo.phone} • ✉️ ${receiptData.businessInfo.email}
              </div>
            </div>

            <div class="content">
              <div class="receipt-title">Reçu de Réservation</div>

              <div class="meta-info">
                <div>
                  <strong>N° Réservation</strong><br>
                  #${receiptData.appointmentId.toString().padStart(6, '0')}
                </div>
                <div style="text-align: right;">
                  <strong>Date d'émission</strong><br>
                  ${new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <div class="section">
                <div class="section-title">👤 Client</div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Nom complet</span>
                    <span class="value">${receiptData.clientInfo.firstName} ${receiptData.clientInfo.lastName}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Téléphone</span>
                    <span class="value">${receiptData.clientInfo.phone}</span>
                  </div>
                </div>
                <div class="info-item">
                  <span class="label">Adresse email</span>
                  <span class="value">${receiptData.clientInfo.email}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📅 Rendez-vous</div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Service</span>
                    <span class="value">${receiptData.serviceInfo.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Durée</span>
                    <span class="value">${receiptData.serviceInfo.duration} minutes</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Date</span>
                    <span class="value">${receiptData.appointmentInfo.date}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Heure</span>
                    <span class="value">${receiptData.appointmentInfo.time}</span>
                  </div>
                </div>
              </div>

              <div class="section financial-section">
                <div class="section-title">💰 Détails Financiers</div>
                <div class="financial-grid">
                  <div class="financial-item">
                    <span>Prix du service</span>
                    <span><strong>${receiptData.paymentInfo.totalAmount}€</strong></span>
                  </div>
                  <div class="financial-item">
                    <span>Acompte payé</span>
                    <span><strong>${receiptData.paymentInfo.depositPaid}€</strong></span>
                  </div>
                  <div class="financial-item">
                    <span>Reste à payer</span>
                    <span><strong>${receiptData.paymentInfo.remainingBalance}€</strong></span>
                  </div>
                  <div class="financial-item highlight">
                    <span>Mode de paiement</span>
                    <span>${receiptData.paymentInfo.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div class="qr-section">
                <div class="qr-title">📱 Gérez votre réservation</div>
                <img src="${qrCodeDataUrl}" alt="QR Code de gestion" style="width: 120px; height: 120px;" />
                <div class="qr-subtitle">
                  Scannez ce code ou visitez notre site pour modifier ou annuler votre réservation
                </div>
              </div>

              <div class="conditions">
                <div class="conditions-title">⚠️ Conditions d'Annulation</div>
                <div class="condition-item">Annulation gratuite jusqu'à 24h avant le rendez-vous</div>
                <div class="condition-item">Annulation tardive (moins de 24h) : frais de 10€</div>
                <div class="condition-item">L'acompte versé est non-remboursable en cas d'annulation</div>
                <div class="condition-item">Retard de plus de 15 minutes : le rendez-vous pourra être annulé</div>
              </div>

              <div class="footer">
                ✨ Merci de votre confiance ! ✨<br>
                <small style="opacity: 0.8;">Nous avons hâte de vous accueillir</small>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      return htmlContent;
      
    } catch (error) {
      console.error('Error in generateReceiptHTML:', error);
      throw new Error('Erreur lors de la génération du reçu');
    }
  }

  async generateReceiptPDF(receiptData: ReceiptData): Promise<Buffer> {
    const html = await this.generateReceiptHTML(receiptData);
    return Buffer.from(html, 'utf-8');
  }

  async generateInvoicePDF(receiptData: ReceiptData): Promise<Buffer> {
    const html = await this.generateReceiptHTML(receiptData);
    return Buffer.from(html, 'utf-8');
  }
}

export const receiptService = new ReceiptService();