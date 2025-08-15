import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  salonId: string;
  salonData: any;
  timestamp: number;
}

interface UseWebSocketOptions {
  onSalonUpdate?: (salonId: string, salonData: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({ onSalonUpdate, onConnect, onDisconnect }: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('🔌 Connexion WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connecté');
        setIsConnected(true);
        onConnect?.();
        
        // Effacer le timeout de reconnexion s'il existe
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 Message WebSocket reçu:', message.type, message.salonId);
          
          if (message.type === 'salon-updated' && onSalonUpdate) {
            onSalonUpdate(message.salonId, message.salonData);
          }
        } catch (error) {
          console.error('❌ Erreur parsing message WebSocket:', error);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket déconnecté');
        setIsConnected(false);
        onDisconnect?.();
        
        // Tentative de reconnexion après 3 secondes
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Tentative de reconnexion WebSocket...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('❌ Erreur création WebSocket:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket non connecté, impossible d\'envoyer le message');
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect
  };
}