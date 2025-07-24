import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Globe, Settings, Save, Eye } from 'lucide-react';

export default function BookingCustomization() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [bookingSettings, setBookingSettings] = useState({
    customUrl: "excellence-paris",
    showPrices: true,
    allowOnlineBooking: true,
    requireAdvanceBooking: 2,
    maxAdvanceBooking: 30,
    showStaffPhotos: true,
    enableNotifications: true
  });

  const [availableServices] = useState([
    { id: 1, name: "Coupe & Brushing", enabled: true, price: "45€" },
    { id: 2, name: "Coloration", enabled: true, price: "80€" },
    { id: 3, name: "Soin du visage", enabled: true, price: "65€" },
    { id: 4, name: "Manucure", enabled: false, price: "35€" },
    { id: 5, name: "Massage", enabled: true, price: "70€" }
  ]);

  const handleSave = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Votre page de réservation a été mise à jour",
    });
  };

  const handlePreview = () => {
    window.open(`https://beauty-booking.app/salon/${bookingSettings.customUrl}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/pro-pages')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personnalisation de la Réservation</h1>
                <p className="text-gray-600">Configurez votre page de réservation en ligne</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview} className="rounded-full">
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* URL personnalisée */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URL personnalisée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customUrl">URL de votre page de réservation</Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">https://beauty-booking.app/salon/</span>
                <Input
                  id="customUrl"
                  value={bookingSettings.customUrl}
                  onChange={(e) => setBookingSettings({ ...bookingSettings, customUrl: e.target.value })}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Cette URL sera utilisée pour partager votre page de réservation</p>
            </div>
          </CardContent>
        </Card>

        {/* Services affichés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Services disponibles à la réservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch checked={service.enabled} />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de réservation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres de réservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Afficher les prix</Label>
                <p className="text-sm text-gray-500">Les prix des services seront visibles sur la page</p>
              </div>
              <Switch 
                checked={bookingSettings.showPrices}
                onCheckedChange={(checked) => setBookingSettings({ ...bookingSettings, showPrices: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Réservation en ligne activée</Label>
                <p className="text-sm text-gray-500">Les clients peuvent réserver directement en ligne</p>
              </div>
              <Switch 
                checked={bookingSettings.allowOnlineBooking}
                onCheckedChange={(checked) => setBookingSettings({ ...bookingSettings, allowOnlineBooking: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Photos du personnel</Label>
                <p className="text-sm text-gray-500">Afficher les photos des coiffeurs et esthéticiennes</p>
              </div>
              <Switch 
                checked={bookingSettings.showStaffPhotos}
                onCheckedChange={(checked) => setBookingSettings({ ...bookingSettings, showStaffPhotos: checked })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAdvance">Réservation minimum (heures à l'avance)</Label>
                <Input
                  id="minAdvance"
                  type="number"
                  value={bookingSettings.requireAdvanceBooking}
                  onChange={(e) => setBookingSettings({ ...bookingSettings, requireAdvanceBooking: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxAdvance">Réservation maximum (jours à l'avance)</Label>
                <Input
                  id="maxAdvance"
                  type="number"
                  value={bookingSettings.maxAdvanceBooking}
                  onChange={(e) => setBookingSettings({ ...bookingSettings, maxAdvanceBooking: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder la configuration
          </Button>
        </div>
      </div>
    </div>
  );
}