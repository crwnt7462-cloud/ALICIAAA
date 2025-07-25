// Centre de notifications accessible depuis l'icône cloche
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, CheckCircle, MessageCircle, Calendar, TrendingUp } from 'lucide-react';

export default function NotificationCenter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const notifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Stock faible détecté',
      message: '3 produits en rupture de stock',
      time: '5 min',
      action: () => setLocation('/inventory'),
      actionText: 'Voir Stock'
    },
    {
      id: 2,
      type: 'message',
      title: 'Nouveau message client',
      message: '2 messages non lus en attente',
      time: '10 min',
      action: () => setLocation('/pro-messaging-search'),
      actionText: 'Voir Messages'
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Rendez-vous à confirmer',
      message: '5 réservations en attente de confirmation',
      time: '15 min',
      action: () => setLocation('/planning'),
      actionText: 'Gérer RDV'
    },
    {
      id: 4,
      type: 'success',
      title: 'Objectif atteint',
      message: 'Chiffre d\'affaires mensuel dépassé de 15%',
      time: '1h',
      action: () => setLocation('/analytics'),
      actionText: 'Voir Stats'
    },
    {
      id: 5,
      type: 'info',
      title: 'Nouveau client inscrit',
      message: 'Marie Dupont a créé un compte',
      time: '2h',
      action: () => setLocation('/clients'),
      actionText: 'Voir Profil'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-l-4 border-red-400';
      case 'message':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'appointment':
        return 'bg-orange-50 border-l-4 border-orange-400';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-400';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/business-features')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Centre de Notifications</h1>
              <p className="text-gray-600">Toutes vos notifications importantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-4">
          {/* En-tête des notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Notifications ({notifications.length})
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Notifications marquées comme lues",
                      description: "Toutes les notifications ont été marquées comme lues"
                    });
                  }}
                >
                  Tout marquer comme lu
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Liste des notifications */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`${getNotificationStyle(notification.type)} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          Il y a {notification.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Nouveau
                      </Badge>
                      <Button 
                        size="sm"
                        onClick={notification.action}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        {notification.actionText}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paramètres de notification */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-gray-600">Recevoir des notifications en temps réel</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes email</p>
                    <p className="text-sm text-gray-600">Recevoir des alertes par email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS urgents</p>
                    <p className="text-sm text-gray-600">SMS pour les urgences uniquement</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Désactivé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}