import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Bell, Shield, Palette, Phone, Mail, MapPin, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientParametres() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    reminders: true,
    promotions: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareActivity: false,
    allowMentions: true,
    dataSharing: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'fr',
    fontSize: 'medium'
  });

  useEffect(() => {
    // Récupérer les données client depuis localStorage
    const storedClientData = localStorage.getItem('clientData');
    if (storedClientData) {
      const client = JSON.parse(storedClientData);
      setClientData(client);
      setFormData({
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || ''
      });
    }
  }, []);

  const handleSaveProfile = () => {
    // Sauvegarder les modifications du profil
    const updatedClient = { ...clientData, ...formData };
    localStorage.setItem('clientData', JSON.stringify(updatedClient));
    setClientData(updatedClient);
    setIsEditing(false);
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
  };

  const handleLogout = () => {
    // Déconnexion
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    setLocation('/client-login');
  };

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                <User className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Paramètres</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-lg mx-auto px-6 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-2xl p-1">
            <TabsTrigger value="profile" className="rounded-xl text-xs">Profil</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl text-xs">Notifs</TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-xl text-xs">Privé</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl text-xs">Thème</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Prénom</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Nom</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Adresse</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Votre adresse..."
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-violet-600 hover:bg-violet-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Shield className="w-4 h-4 mr-3" />
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-red-600 border-red-200">
                  Supprimer le compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">Notifications par email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-gray-600">Notifications par SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push</p>
                    <p className="text-sm text-gray-600">Notifications push</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels RDV</p>
                    <p className="text-sm text-gray-600">Rappels de rendez-vous</p>
                  </div>
                  <Switch
                    checked={notifications.reminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, reminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotions</p>
                    <p className="text-sm text-gray-600">Offres et promotions</p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Confidentialité */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profil visible</p>
                    <p className="text-sm text-gray-600">Votre profil est visible aux professionnels</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partager l'activité</p>
                    <p className="text-sm text-gray-600">Partager votre activité avec les salons</p>
                  </div>
                  <Switch
                    checked={privacy.shareActivity}
                    onCheckedChange={(checked) => setPrivacy({...privacy, shareActivity: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mentions autorisées</p>
                    <p className="text-sm text-gray-600">Autoriser les mentions dans les messages</p>
                  </div>
                  <Switch
                    checked={privacy.allowMentions}
                    onCheckedChange={(checked) => setPrivacy({...privacy, allowMentions: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partage de données</p>
                    <p className="text-sm text-gray-600">Partager les données à des fins analytiques</p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Thème</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={appearance.theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, theme: 'light'})}
                      className="justify-start"
                    >
                      ☀️ Clair
                    </Button>
                    <Button
                      variant={appearance.theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, theme: 'dark'})}
                      className="justify-start"
                    >
                      🌙 Sombre
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Langue</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={appearance.language === 'fr' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, language: 'fr'})}
                      className="justify-start"
                    >
                      🇫🇷 Français
                    </Button>
                    <Button
                      variant={appearance.language === 'en' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, language: 'en'})}
                      className="justify-start"
                    >
                      🇬🇧 English
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Taille de police</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={appearance.fontSize === 'small' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, fontSize: 'small'})}
                      className="text-sm"
                    >
                      Petit
                    </Button>
                    <Button
                      variant={appearance.fontSize === 'medium' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, fontSize: 'medium'})}
                    >
                      Moyen
                    </Button>
                    <Button
                      variant={appearance.fontSize === 'large' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, fontSize: 'large'})}
                      className="text-lg"
                    >
                      Grand
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button 
            onClick={() => setLocation('/support')}
            variant="outline" 
            className="w-full h-12 justify-start"
          >
            Centre d'aide
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full h-12 justify-start text-red-600 border-red-200"
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}