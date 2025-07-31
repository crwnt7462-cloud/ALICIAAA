import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bell, MessageCircle, Calendar, CheckCircle2 } from 'lucide-react';

export default function NotificationCenter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const notifications = [
    {
      id: 1,
      title: 'Nouveau rendez-vous',
      message: 'Marie L. a réservé demain 14h30',
      time: '5 min',
      read: false
    },
    {
      id: 2,
      title: 'Message client',
      message: '2 nouveaux messages en attente',
      time: '10 min',
      read: false
    },
    {
      id: 3,
      title: 'Confirmation requise',
      message: '3 réservations à confirmer',
      time: '15 min',
      read: true
    }
  ];

  const markAllAsRead = () => {
    toast({
      title: "Notifications lues",
      description: "Toutes les notifications ont été marquées comme lues"
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header simple */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-base font-medium text-gray-900">Notifications</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-sm"
            >
              Tout lire
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`border ${!notification.read ? 'border-violet-200 bg-violet-50' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-violet-600' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        Il y a {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="flex items-center gap-2 justify-center py-3"
              onClick={() => setLocation('/planning')}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Planning</span>
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 justify-center py-3"
              onClick={() => setLocation('/pro-messaging-search')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Messages</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}