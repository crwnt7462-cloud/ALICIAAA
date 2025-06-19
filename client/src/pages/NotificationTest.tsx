import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function NotificationTest() {
  const [loading, setLoading] = useState(false);
  const [pushToken, setPushToken] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const { toast } = useToast();

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Test des Notifications Push</h1>
        <p className="text-muted-foreground">
          Interface de test pour le système de notifications professionnelles
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer Token Push</CardTitle>
            <CardDescription>
              Enregistrez un token push pour recevoir les notifications de test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pushToken">Token Push Expo</Label>
              <Input
                id="pushToken"
                value={pushToken}
                onChange={(e) => setPushToken(e.target.value)}
                placeholder="ExponentPushToken[xxxxxx...]"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Format: ExponentPushToken[caractères_aléatoires]
              </p>
            </div>
            <Button 
              onClick={registerPushToken} 
              disabled={loading || !pushToken.trim()}
              className="w-full"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer Token'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tester Notification</CardTitle>
            <CardDescription>
              Envoyez une notification de test selon le type sélectionné
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notificationType">Type de notification</Label>
              <Select value={notificationType} onValueChange={setNotificationType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_booking">Nouvelle réservation</SelectItem>
                  <SelectItem value="gap_detected">Créneau libre détecté</SelectItem>
                  <SelectItem value="reminder">Rappel rendez-vous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(notificationType === 'new_booking' || notificationType === 'reminder') && (
              <div>
                <Label htmlFor="appointmentId">ID du rendez-vous</Label>
                <Input
                  id="appointmentId"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  placeholder="Ex: 1"
                  type="number"
                  className="mt-1"
                />
              </div>
            )}

            <Button 
              onClick={sendTestNotification} 
              disabled={loading || !notificationType}
              className="w-full"
            >
              {loading ? 'Envoi...' : 'Envoyer Test'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exemples de Notifications</CardTitle>
          <CardDescription>
            Aperçu des différents types de notifications envoyées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">📅 Nouvelle résa confirmée</h4>
              <p className="text-sm text-muted-foreground">
                Camille – Lissage – Lun. 11h<br/>
                💳 Acompte reçu
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">❌ Annulation reçue</h4>
              <p className="text-sm text-muted-foreground">
                Julie – Épilation – Mer. 15h30<br/>
                ➕ Placer quelqu'un de la liste d'attente ?
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">⏱ Créneau libre détecté</h4>
              <p className="text-sm text-muted-foreground">
                Mar. 14h – 1h dispo entre 2 clientes<br/>
                📢 Lancer une promo express ?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Automatique</CardTitle>
          <CardDescription>
            Le système se déclenche automatiquement lors de ces événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Nouvelle réservation créée → Notification immédiate</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">Rendez-vous annulé → Notification + suggestion liste d'attente</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Créneau libre (45min+) → Alert + suggestion promo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Paiement reçu → Confirmation acompte</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}