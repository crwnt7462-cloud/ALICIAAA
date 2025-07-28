import { useState, useEffect, useRef } from 'react';

interface WebSocketConfig {
  userType: 'professional' | 'client';
  userId?: string;
  clientId?: string;
  autoReconnect?: boolean;
}

interface NotificationData {
  type: 'appointment' | 'payment' | 'reminder' | 'cancellation' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
}

export function useWebSocket(config: WebSocketConfig) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      // En développement, on simule juste la connexion
      if (process.env.NODE_ENV === 'development') {
        setIsConnected(true);
        console.log('WebSocket simulé connecté');
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connecté');
        
        // S'identifier auprès du serveur
        ws.send(JSON.stringify({
          type: 'auth',
          userType: config.userType,
          userId: config.userId,
          clientId: config.clientId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            setNotifications(prev => [data.notification, ...prev.slice(0, 49)]);
            setUnreadCount(prev => prev + 1);
          }
        } catch (error) {
          console.error('Erreur parsing message WebSocket:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket déconnecté');
        
        // Reconnexion automatique si activée
        if (config.autoReconnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Erreur connexion WebSocket:', error);
      setIsConnected(false);
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

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = (count: number = 0) => {
    if (count === 0) {
      setUnreadCount(0);
    } else {
      setUnreadCount(prev => Math.max(0, prev - count));
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [config.userId, config.clientId]);

  return {
    isConnected,
    notifications,
    unreadCount,
    clearNotifications,
    markAsRead,
    reconnect: connect,
    disconnect
  };
}