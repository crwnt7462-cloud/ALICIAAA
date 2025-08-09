import { useState } from 'react';
import { ProfessionalSettingsSync } from '@/components/ProfessionalSettingsSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Save, Settings, Palette, Clock, Bell, CreditCard, Database } from 'lucide-react';

export default function ProfessionalSettingsDemo() {
  const [settings, setSettings] = useState({
    salonName: 'Mon Salon de Beauté',
    salonDescription: 'Salon moderne spécialisé en coiffure et soins esthétiques',
    salonColors: {
      primary: '#8B5CF6',
      secondary: '#3B82F6',
      accent: '#10B981'
    },
    workingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    },
    bookingSettings: {
      depositPercentage: 30,
      maxAdvanceBooking: 30,
      cancellationPolicy: '24h'
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    paymentSettings: {
      acceptsCash: true,
      acceptsCard: true,
      acceptsOnline: true
    },
    salonPhotos: [],
    socialLinks: {
      instagram: '@mon_salon_beaute',
      facebook: 'Mon Salon Beauté'
    }
  });

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <ProfessionalSettingsSync 
      autoSave={true} 
      settings={settings}
      onSettingsChange={setSettings}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paramètres Professionnels
            </h1>
            <p className="text-gray-600">
              Toutes vos modifications sont automatiquement sauvegardées dans PostgreSQL
            </p>
            <Badge className="mt-2 bg-green-100 text-green-800">
              <Database className="w-4 h-4 mr-1" />
              Sauvegarde automatique activée
            </Badge>
          </div>

          {/* Informations générales */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-600" />
                Informations du salon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salonName">Nom du salon</Label>
                <Input
                  id="salonName"
                  value={settings.salonName}
                  onChange={(e) => handleInputChange('salonName', e.target.value)}
                  placeholder="Nom de votre salon"
                />
              </div>
              
              <div>
                <Label htmlFor="salonDescription">Description</Label>
                <Textarea
                  id="salonDescription"
                  value={settings.salonDescription}
                  onChange={(e) => handleInputChange('salonDescription', e.target.value)}
                  placeholder="Description de votre salon"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Couleurs du salon */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-600" />
                Couleurs de votre salon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Couleur principale</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.salonColors.primary}
                      onChange={(e) => handleNestedChange('salonColors', 'primary', e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <span className="text-sm text-gray-600">{settings.salonColors.primary}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Couleur secondaire</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.salonColors.secondary}
                      onChange={(e) => handleNestedChange('salonColors', 'secondary', e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <span className="text-sm text-gray-600">{settings.salonColors.secondary}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Couleur d'accent</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.salonColors.accent}
                      onChange={(e) => handleNestedChange('salonColors', 'accent', e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <span className="text-sm text-gray-600">{settings.salonColors.accent}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres de réservation */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Paramètres de réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Pourcentage d'acompte (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.bookingSettings.depositPercentage}
                  onChange={(e) => handleNestedChange('bookingSettings', 'depositPercentage', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label>Réservation maximum à l'avance (jours)</Label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.bookingSettings.maxAdvanceBooking}
                  onChange={(e) => handleNestedChange('bookingSettings', 'maxAdvanceBooking', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-purple-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notifications par email</Label>
                <Switch
                  checked={settings.notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNestedChange('notificationSettings', 'emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Notifications SMS</Label>
                <Switch
                  checked={settings.notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => handleNestedChange('notificationSettings', 'smsNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Notifications push</Label>
                <Switch
                  checked={settings.notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNestedChange('notificationSettings', 'pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Moyens de paiement */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                Moyens de paiement acceptés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Espèces</Label>
                <Switch
                  checked={settings.paymentSettings.acceptsCash}
                  onCheckedChange={(checked) => handleNestedChange('paymentSettings', 'acceptsCash', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Carte bancaire</Label>
                <Switch
                  checked={settings.paymentSettings.acceptsCard}
                  onCheckedChange={(checked) => handleNestedChange('paymentSettings', 'acceptsCard', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Paiement en ligne</Label>
                <Switch
                  checked={settings.paymentSettings.acceptsOnline}
                  onCheckedChange={(checked) => handleNestedChange('paymentSettings', 'acceptsOnline', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Réseaux sociaux */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Instagram</Label>
                <Input
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                  placeholder="@votre_compte"
                />
              </div>
              
              <div>
                <Label>Facebook</Label>
                <Input
                  value={settings.socialLinks.facebook}
                  onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                  placeholder="Nom de votre page"
                />
              </div>
            </CardContent>
          </Card>

          {/* Information sur la sauvegarde */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <Database className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sauvegarde automatique PostgreSQL
                </h3>
                <p className="text-gray-600 mb-4">
                  Tous vos paramètres sont automatiquement sauvegardés dans la base de données PostgreSQL. 
                  Vos modifications sont sécurisées et persistantes.
                </p>
                <Badge className="bg-green-100 text-green-800">
                  <Save className="w-4 h-4 mr-1" />
                  Dernière sauvegarde: il y a quelques secondes
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProfessionalSettingsSync>
  );
}