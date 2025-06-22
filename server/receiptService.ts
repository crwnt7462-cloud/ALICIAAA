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
    try {
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.default.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      
      const page = await browser.newPage();
      
      // Générer le QR code
      const manageUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/manage-booking/${receiptData.appointmentId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(manageUrl, { width: 200 });
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 30px;
              line-height: 1.6;
              color: #333;
              background: #fff;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #8b5cf6; 
              padding-bottom: 25px; 
              margin-bottom: 35px;
            }
            .business-name { 
              font-size: 32px; 
              font-weight: bold; 
              color: #1a1a1a;
              margin-bottom: 12px;
              letter-spacing: 0.5px;
            }
            .business-info { 
              font-size: 14px; 
              color: #666;
              line-height: 1.4;
            }
            .receipt-title { 
              font-size: 28px; 
              font-weight: bold; 
              text-align: center; 
              margin: 35px 0;
              color: #8b5cf6;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
              font-size: 14px;
            }
            .section { 
              margin: 30px 0; 
              padding: 20px;
              background: #fafbfc;
              border-radius: 10px;
              border-left: 5px solid #8b5cf6;
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 15px;
              color: #1a1a1a;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .info-item:last-child {
              border-bottom: none;
            }
            .label { 
              font-weight: 600; 
              color: #4a5568;
              font-size: 14px;
              display: block;
              margin-bottom: 4px;
            }
            .value { 
              color: #1a1a1a;
              font-size: 16px;
              font-weight: 500;
            }
            .financial-section {
              background: linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%);
              border-left-color: #28a745;
            }
            .financial-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 12px;
            }
            .financial-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 15px;
              background: white;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .financial-item.total {
              background: #28a745;
              color: white;
              font-weight: bold;
              font-size: 18px;
            }
            .qr-section {
              text-align: center;
              margin: 40px 0;
              padding: 25px;
              background: white;
              border: 2px dashed #8b5cf6;
              border-radius: 15px;
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
              margin-top: 35px;
              padding: 20px;
              background: #f1f5f9;
              border-radius: 8px;
              border-left: 4px solid #fbbf24;
            }
            .conditions-title {
              font-weight: bold;
              margin-bottom: 12px;
              color: #1a1a1a;
              font-size: 14px;
            }
            .condition-item {
              margin: 8px 0;
              padding-left: 15px;
              position: relative;
            }
            .condition-item:before {
              content: "•";
              color: #fbbf24;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              font-size: 16px;
              color: #8b5cf6;
              font-weight: bold;
              padding: 20px;
              background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="business-name">${receiptData.businessInfo.name}</div>
              <div class="business-info">
                ${receiptData.businessInfo.address}<br>
                Tél: ${receiptData.businessInfo.phone} • Email: ${receiptData.businessInfo.email}
              </div>
            </div>

            <div class="receipt-title">Reçu de Réservation</div>

            <div class="meta-info">
              <div>
                <strong>N° Réservation:</strong><br>
                #${receiptData.appointmentId.toString().padStart(6, '0')}
              </div>
              <div style="text-align: right;">
                <strong>Date d'émission:</strong><br>
                ${new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Informations Client</div>
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
                <span class="label">Email</span>
                <span class="value">${receiptData.clientInfo.email}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Détails du Rendez-vous</div>
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
              <div class="section-title">Détails Financiers</div>
              <div class="financial-grid">
                <div class="financial-item">
                  <span>Prix du service</span>
                  <span>${receiptData.paymentInfo.totalAmount}€</span>
                </div>
                <div class="financial-item">
                  <span>Acompte payé</span>
                  <span>${receiptData.paymentInfo.depositPaid}€</span>
                </div>
                <div class="financial-item">
                  <span>Reste à payer</span>
                  <span>${receiptData.paymentInfo.remainingBalance}€</span>
                </div>
                <div class="financial-item total">
                  <span>Mode de paiement</span>
                  <span>${receiptData.paymentInfo.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div class="qr-section">
              <div class="qr-title">Gérez votre réservation</div>
              <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 120px; height: 120px;" />
              <div class="qr-subtitle">
                Scannez ce code pour modifier ou annuler votre réservation
              </div>
            </div>

            <div class="conditions">
              <div class="conditions-title">Conditions d'Annulation</div>
              <div class="condition-item">Annulation gratuite jusqu'à 24h avant le rendez-vous</div>
              <div class="condition-item">Annulation tardive: frais de 10€</div>
              <div class="condition-item">L'acompte versé est non-remboursable</div>
            </div>

            <div class="footer">
              Merci de votre confiance !
            </div>
          </div>
        </body>
        </html>
      `;

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '15mm',
          bottom: '15mm',
          left: '15mm'
        }
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
      
    } catch (error) {
      console.error('Error in generateReceiptPDF:', error);
      throw new Error('Erreur lors de la génération du PDF');
    }
  }

  async generateInvoicePDF(receiptData: ReceiptData): Promise<Buffer> {
    try {
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.default.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      
      const page = await browser.newPage();
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 40px;
            }
            .business-info { 
              flex: 1;
            }
            .invoice-info { 
              text-align: right;
            }
            .invoice-title { 
              font-size: 32px; 
              font-weight: bold; 
              text-align: center; 
              margin: 30px 0;
              color: #2c3e50;
            }
            .client-section { 
              margin: 30px 0; 
              padding: 20px;
              background: #f8f9fa;
              border-left: 4px solid #007bff;
            }
            .services-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
            }
            .services-table th,
            .services-table td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left;
            }
            .services-table th { 
              background: #f1f1f1; 
              font-weight: bold;
            }
            .total-row { 
              font-weight: bold; 
              background: #e8f5e8;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="business-info">
              <h2>${receiptData.businessInfo.name}</h2>
              <p>${receiptData.businessInfo.address}<br>
              Tél: ${receiptData.businessInfo.phone}<br>
              Email: ${receiptData.businessInfo.email}</p>
            </div>
            <div class="invoice-info">
              <p><strong>Facture N°:</strong> F-${receiptData.appointmentId.toString().padStart(6, '0')}<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div class="invoice-title">FACTURE</div>

          <div class="client-section">
            <h3>FACTURÉ À:</h3>
            <p>${receiptData.clientInfo.firstName} ${receiptData.clientInfo.lastName}<br>
            ${receiptData.clientInfo.email}<br>
            ${receiptData.clientInfo.phone}</p>
          </div>

          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Durée</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${receiptData.serviceInfo.name}</td>
                <td>${receiptData.appointmentInfo.date}</td>
                <td>${receiptData.serviceInfo.duration} min</td>
                <td>${receiptData.paymentInfo.totalAmount}€</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;"><strong>TOTAL:</strong></td>
                <td><strong>${receiptData.paymentInfo.totalAmount}€</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
      
    } catch (error) {
      console.error('Error in generateInvoicePDF:', error);
      throw new Error('Erreur lors de la génération de la facture PDF');
    }
  }
}

export const receiptService = new ReceiptService();