import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Bell, Calendar, CheckCircle, X, Settings, Trash2, MoreVertical } from 'lucide-react';

export default function NotificationTest() {
  const [loading, setLoading] = useState(false);
  const [pushToken, setPushToken] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Simulation de notifications réelles
  const notifications = [
    {
      id: 1,
      type: 'new_booking',
      title: 'Nouvelle réservation confirmée',
      message: 'Marie L. - Coupe + Brushing - Demain 14h30',
      time: 'Il y a 5 min',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'cancellation',
      title: 'Annulation reçue',
      message: 'Sophie M. - Coloration - Mer. 10h00',
      time: 'Il y a 15 min',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'gap_detected',
      title: 'Créneau libre détecté',
      message: '1h30 libre entre deux clientes - Demain 16h',
      time: 'Il y a 1h',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Acompte reçu',
      message: 'Emma R. - 30€ pour RDV de vendredi',
      time: 'Il y a 2h',
      read: true,
      priority: 'medium'
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Rappel client',
      message: 'RDV de demain - Julie B. 09h30',
      time: 'Il y a 3h',
      read: true,
      priority: 'low'
    }
  ];

  const registerPushToken = async () => {
    if (!pushToken.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un token push valide",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await apiRequest({
        url: '/api/notifications/register-token',
        method: 'POST',
        body: {
          token: pushToken,
          deviceType: 'test'
        }
      });

      toast({
        title: "Token enregistré",
        description: "Le token push a été enregistré avec succès"
      });
      setPushToken('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le token push",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    if (!notificationType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de notification",
        variant: "destructive"
      });
      return;
    }

    if ((notificationType === 'new_booking' || notificationType === 'reminder') && !appointmentId) {
      toast({
        title: "Erreur",
        description: "ID de rendez-vous requis pour ce type de notification",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await apiRequest({
        url: '/api/notifications/test',
        method: 'POST',
        body: {
          type: notificationType,
          appointmentId: appointmentId ? parseInt(appointmentId) : undefined
        }
      });

      toast({
        title: "Notification envoyée",
        description: "La notification de test a été envoyée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification de test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking': return '📅';
      case 'cancellation': return '❌';
      case 'gap_detected': return '⏱️';
      case 'payment': return '💳';
      case 'reminder': return '🔔';
      default: return '📝';
    }
  };

  const getNotificationBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return notif.type === filter;
  });

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">{notifications.filter(n => !n.read).length} non lues</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'unread', label: 'Non lues' },
          { key: 'new_booking', label: 'Réservations' },
          { key: 'payment', label: 'Paiements' }
        ].map(filterOption => (
          <Button
            key={filterOption.key}
            variant={filter === filterOption.key ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setFilter(filterOption.key)}
          >
            {filterOption.label}
          </Button>
        ))}
      </div>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucune notification {filter !== 'all' ? `de ce type` : ''}</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border rounded-lg transition-all ${
                !notif.read 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-xl">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notif.title}
                      </h3>
                      <Badge variant={getNotificationBadge(notif.priority) as any} className="text-xs">
                        {notif.priority === 'high' ? 'Urgent' : notif.priority === 'medium' ? 'Normal' : 'Info'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    
                    {/* Actions rapides selon le type */}
                    {(notif.type === 'new_booking' || notif.type === 'cancellation') && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7"
                          onClick={() => {
                            setLocation("/planning");
                            toast({ title: "Planning ouvert", description: "Consulter les rendez-vous" });
                          }}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Voir planning
                        </Button>
                        {notif.type === 'cancellation' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-7"
                            onClick={() => {
                              setLocation("/clients");
                              toast({ title: "Liste d'attente", description: "Contacter un autre client" });
                            }}
                          >
                            Liste d'attente
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {notif.type === 'gap_detected' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7"
                          onClick={() => {
                            toast({ title: "Promo lancée", description: "Offre envoyée aux clients" });
                          }}
                        >
                          Lancer promo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notif.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        toast({ title: "Notification marquée comme lue" });
                      }}
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      toast({ title: "Notification supprimée" });
                    }}
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions en bas */}
      <div className="flex gap-2 mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            toast({ title: "Toutes les notifications marquées comme lues" });
          }}
        >
          Tout marquer comme lu
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            toast({ title: "Paramètres de notifications", description: "Configuration ouverte" });
          }}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}