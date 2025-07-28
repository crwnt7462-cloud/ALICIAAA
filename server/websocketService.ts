import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

interface WebSocketClient {
  id: string;
  userId?: string;
  clientId?: string;
  ws: WebSocket;
  userType: 'professional' | 'client';
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws' 
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      
      const client: WebSocketClient = {
        id: clientId,
        ws,
        userType: 'client' // Default, will be updated on authentication
      };

      this.clients.set(clientId, client);
      console.log(`WebSocket client connected: ${clientId}`);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log(`WebSocket client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection_established',
        clientId,
        message: 'Connexion WebSocket établie'
      });
    });
  }

  private generateClientId(): string {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'authenticate':
        this.authenticateClient(clientId, message.data);
        break;
      
      case 'join_room':
        // Pour les notifications de salon spécifiques
        client.userId = message.salonId;
        break;
      
      case 'ping':
        this.sendToClient(clientId, { type: 'pong' });
        break;
      
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private authenticateClient(clientId: string, authData: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (authData.userType === 'professional') {
      client.userType = 'professional';
      client.userId = authData.userId;
    } else if (authData.userType === 'client') {
      client.userType = 'client';
      client.clientId = authData.clientId;
    }

    this.sendToClient(clientId, {
      type: 'authenticated',
      userType: client.userType,
      message: 'Authentification WebSocket réussie'
    });
  }

  // Envoyer une notification à un client spécifique
  sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // Envoyer une notification à tous les professionnels d'un salon
  notifyProfessional(userId: string, notification: any) {
    this.clients.forEach((client) => {
      if (client.userType === 'professional' && client.userId === userId) {
        this.sendToClient(client.id, {
          type: 'notification',
          ...notification
        });
      }
    });
  }

  // Envoyer une notification à un client spécifique
  notifyClient(clientId: string, notification: any) {
    this.clients.forEach((client) => {
      if (client.userType === 'client' && client.clientId === clientId) {
        this.sendToClient(client.id, {
          type: 'notification',
          ...notification
        });
      }
    });
  }

  // Diffuser une notification à tous les clients connectés d'un salon
  broadcastToSalon(salonId: string, notification: any) {
    this.clients.forEach((client) => {
      if (client.userId === salonId) {
        this.sendToClient(client.id, {
          type: 'broadcast',
          ...notification
        });
      }
    });
  }

  // Notification de nouvelle réservation
  notifyNewAppointment(professionalId: string, appointmentData: any) {
    this.notifyProfessional(professionalId, {
      title: 'Nouvelle réservation',
      message: `Nouveau rendez-vous avec ${appointmentData.clientName}`,
      data: appointmentData,
      timestamp: new Date().toISOString()
    });
  }

  // Notification d'annulation
  notifyCancellation(professionalId: string, clientId: string, appointmentData: any) {
    // Notifier le professionnel
    this.notifyProfessional(professionalId, {
      title: 'Annulation de rendez-vous',
      message: `Rendez-vous annulé par ${appointmentData.clientName}`,
      data: appointmentData,
      timestamp: new Date().toISOString()
    });

    // Notifier le client de la confirmation d'annulation
    this.notifyClient(clientId, {
      title: 'Annulation confirmée',
      message: 'Votre rendez-vous a été annulé avec succès',
      data: appointmentData,
      timestamp: new Date().toISOString()
    });
  }

  // Notification de rappel de rendez-vous
  notifyAppointmentReminder(clientId: string, appointmentData: any) {
    this.notifyClient(clientId, {
      title: 'Rappel de rendez-vous',
      message: `Votre rendez-vous est prévu ${appointmentData.timeRemaining}`,
      data: appointmentData,
      timestamp: new Date().toISOString()
    });
  }

  // Obtenir le nombre de clients connectés
  getConnectedCount(): number {
    return this.clients.size;
  }

  // Obtenir les statistiques de connexion
  getConnectionStats() {
    const professionals = Array.from(this.clients.values()).filter(c => c.userType === 'professional');
    const clients = Array.from(this.clients.values()).filter(c => c.userType === 'client');

    return {
      total: this.clients.size,
      professionals: professionals.length,
      clients: clients.length,
      connectedSalons: Array.from(new Set(professionals.map(p => p.userId))).length
    };
  }
}

export const websocketService = new WebSocketService();