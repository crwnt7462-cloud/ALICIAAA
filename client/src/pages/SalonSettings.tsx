import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useSalonSync } from '@/hooks/useSalonSync';
import { 
  ArrowLeft, 
  Settings, 
  Store, 
  Clock, 
  Users, 
  Bell,
  MapPin,
  Phone,
  Mail,
  Camera,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function SalonSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [salonData, setSalonData] = useState({
    id: 'salon-pro-1', // ID du salon du professionnel connecté
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: {
      monday: { open: '', close: '', closed: true },
      tuesday: { open: '', close: '', closed: true },
      wednesday: { open: '', close: '', closed: true },
      thursday: { open: '', close: '', closed: true },
      friday: { open: '', close: '', closed: true },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    notifications: {
      newBookings: false,
      cancellations: false,
      reminders: false,
      reviews: false
    },
    bookingSettings: {
      advanceBooking: 0,
      cancellationDelay: 0,
      autoConfirm: false
    }
  });

  // Hook de sauvegarde automatique
  const { forceSave, isSaving } = useAutoSave({
    data: salonData,
    endpoint: `/api/salons/${salonData.id}`,
    delay: 3000, // Sauvegarde automatique après 3 secondes d'inactivité
    onSave: (data) => {
      console.log('✅ Salon sauvegardé automatiquement:', data.name);
    },
    onError: (error) => {
      console.error('❌ Erreur sauvegarde:', error);
    }
  });

  // Hook de synchronisation
  useSalonSync();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Les modifications ont été enregistrées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setSalonData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day as keyof typeof prev.openingHours],
          [field]: value
        }
      }
    }));
  };

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            <div className="text-center">
              <h1 className="text-base font-medium text-gray-900">Paramètres du salon</h1>
              {isSaving && (
                <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Sauvegarde automatique...
                </div>
              )}
            </div>
            <Button 
              size="sm"
              onClick={forceSave}
              disabled={isLoading || isSaving}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Save className="w-3 h-3 mr-1" />
              {isLoading || isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        
        {/* Informations du salon */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="w-4 h-4" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">Nom du salon</Label>
              <Input
                id="name"
                value={salonData.name}
                onChange={(e) => setSalonData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="text-sm">Adresse</Label>
              <Input
                id="address"
                value={salonData.address}
                onChange={(e) => setSalonData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone" className="text-sm">Téléphone</Label>
                <Input
                  id="phone"
                  value={salonData.phone}
                  onChange={(e) => setSalonData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={salonData.email}
                  onChange={(e) => setSalonData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horaires d'ouverture */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Horaires d'ouverture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {days.map((day) => {
              const hours = salonData.openingHours[day.key as keyof typeof salonData.openingHours];
              return (
                <div key={day.key} className="flex items-center gap-3">
                  <div className="w-20 text-sm">{day.label}</div>
                  
                  <Switch
                    checked={!hours.closed}
                    onCheckedChange={(checked) => updateOpeningHours(day.key, 'closed', !checked)}
                    className="scale-75"
                  />
                  
                  {!hours.closed && (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateOpeningHours(day.key, 'open', e.target.value)}
                        className="text-sm"
                      />
                      <span className="text-gray-500 text-sm">-</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateOpeningHours(day.key, 'close', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}
                  
                  {hours.closed && (
                    <div className="flex-1 text-sm text-gray-500">Fermé</div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Paramètres de réservation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Réservations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="advance" className="text-sm">Réservation à l'avance (jours)</Label>
              <Input
                id="advance"
                type="number"
                value={salonData.bookingSettings.advanceBooking}
                onChange={(e) => setSalonData(prev => ({
                  ...prev,
                  bookingSettings: {
                    ...prev.bookingSettings,
                    advanceBooking: parseInt(e.target.value)
                  }
                }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cancellation" className="text-sm">Délai d'annulation (heures)</Label>
              <Input
                id="cancellation"
                type="number"
                value={salonData.bookingSettings.cancellationDelay}
                onChange={(e) => setSalonData(prev => ({
                  ...prev,
                  bookingSettings: {
                    ...prev.bookingSettings,
                    cancellationDelay: parseInt(e.target.value)
                  }
                }))}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Confirmation automatique</p>
                <p className="text-xs text-gray-600">Confirmer automatiquement les nouvelles réservations</p>
              </div>
              <Switch
                checked={salonData.bookingSettings.autoConfirm}
                onCheckedChange={(checked) => setSalonData(prev => ({
                  ...prev,
                  bookingSettings: {
                    ...prev.bookingSettings,
                    autoConfirm: checked
                  }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Nouvelles réservations</p>
                <p className="text-xs text-gray-600">Être notifié des nouvelles réservations</p>
              </div>
              <Switch
                checked={salonData.notifications.newBookings}
                onCheckedChange={(checked) => setSalonData(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    newBookings: checked
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Annulations</p>
                <p className="text-xs text-gray-600">Être notifié des annulations</p>
              </div>
              <Switch
                checked={salonData.notifications.cancellations}
                onCheckedChange={(checked) => setSalonData(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    cancellations: checked
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Rappels</p>
                <p className="text-xs text-gray-600">Envoyer des rappels automatiques</p>
              </div>
              <Switch
                checked={salonData.notifications.reminders}
                onCheckedChange={(checked) => setSalonData(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    reminders: checked
                  }
                }))}
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}