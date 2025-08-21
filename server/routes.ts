import { Express } from 'express';
import { WebSocketServer } from 'ws';
import { createServer, Server } from 'http';
import WebSocket from 'ws';

// Global WebSocket server instance
let wss: WebSocketServer;

// Fonction pour diffuser des mises à jour via WebSocket
export function broadcastSalonUpdate(salonId: string, salonData: any) {
  if (wss) {
    const message = JSON.stringify({
      type: 'salon-updated',
      salonId: salonId,
      salonData: salonData,
      timestamp: Date.now()
    });
    
    console.log('📢 Diffusion WebSocket salon-updated:', salonId);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // MODE DÉVELOPPEMENT - AUCUNE SÉCURITÉ
  console.log('⚠️ Mode développement - Toutes sécurités désactivées');

  // Pas de rate limiting
  // Pas de validation
  // Pas de détection d'attaque
  // Pas de CSRF
  // Pas de logs de sécurité

  // Démarrer le serveur HTTP
  const server = createServer(app);

  // WebSocket setup pour les mises à jour temps réel
  wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws) => {
    console.log('🔌 Nouvelle connexion WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 Message WebSocket reçu:', data.type);
        
        // Diffuser le message à tous les clients connectés
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      } catch (error) {
        console.error('❌ Erreur parsing message WebSocket:', error);
      }
    });

    ws.on('close', () => {
      console.log('🔌 Connexion WebSocket fermée');
    });
  });

  console.log('🔌 WebSocket configuré sur /ws');

  return server;
}