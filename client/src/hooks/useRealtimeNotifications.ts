import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RealtimeNotification {
  id: string;
  type: 'booking' | 'cancellation' | 'reminder' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simuler des notifications temps réel
    const simulateNotifications = () => {
      const notificationTypes = [
        {
          type: 'booking' as const,
          title: 'Nouvelle réservation',
          message: 'Sophie Martin a réservé une coupe à 14h30'
        },
        {
          type: 'cancellation' as const,
          title: 'Annulation',
          message: 'Le RDV de 16h a été annulé'
        },
        {
          type: 'reminder' as const,
          title: 'Rappel',
          message: 'RDV dans 1h avec Marie Dupont'
        },
        {
          type: 'payment' as const,
          title: 'Paiement reçu',
          message: 'Paiement de 45€ confirmé'
        }
      ];

      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      const newNotification: RealtimeNotification = {
        id: Date.now().toString(),
        ...randomNotification,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);

      // Afficher le toast
      toast({
        title: newNotification.title,
        description: newNotification.message,
        duration: 4000,
      });
    };

    // Première notification après 5 secondes
    const initialTimeout = setTimeout(simulateNotifications, 5000);
    
    // Puis toutes les 30 secondes
    const interval = setInterval(simulateNotifications, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}