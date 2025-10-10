import { useState } from "react";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  Shield, 
  CreditCard,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Save
} from "lucide-react";

export default function SettingsClient() {
  const { clientData } = useClientAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  // États pour les paramètres
  const [profileData, setProfileData] = useState({
    firstName: clientData?.firstName || "",
    lastName: clientData?.lastName || "",
    email: clientData?.email || "",
  phone: clientData?.phone ?? "",
    dateOfBirth: "",
    address: "",
    preferences: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    promotionOffers: false,
    newsletterSubscription: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "friends",
    showActivity: true,
    allowTagging: true,
    dataSharing: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    language: "fr",
    fontSize: "medium"
  });

  const saveSettings = (section: string) => {
    toast({
      title: "Paramètres sauvegardés",
      description: `Les paramètres ${section} ont été mis à jour`
    });
  };

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Connexion requise</h2>
          <p className="text-gray-600 mt-2">Vous devez être connecté pour accéder aux paramètres</p>
          <Button onClick={() => setLocation('/client/login')} className="mt-4">
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex flex-col items-center gap-1 p-2">
              <User className="w-4 h-4" />
              <span className="text-xs">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 p-2">
              <Bell className="w-4 h-4" />
              <span className="text-xs">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 p-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Privé</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 p-2">
              <Palette className="w-4 h-4" />
              <span className="text-xs">Thème</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom</Label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Nom</Label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <Label>Date de naissance</Label>
                  <Input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Adresse</Label>
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 rue de la Beauté, Paris"
                  />
                </div>
                <Button onClick={() => saveSettings('profil')} className="w-full gradient-bg">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder le profil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full">
                  Authentification à deux facteurs
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Notifications email</p>
                      <p className="text-sm text-gray-500">Recevoir des emails de confirmation</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Notifications SMS</p>
                      <p className="text-sm text-gray-500">Recevoir des SMS de rappel</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Notifications push</p>
                      <p className="text-sm text-gray-500">Notifications sur l'appareil</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Rappels de RDV</p>
                      <p className="text-sm text-gray-500">24h avant le rendez-vous</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, appointmentReminders: checked }))
                    }
                  />
                </div>

                <Button onClick={() => saveSettings('notifications')} className="w-full gradient-bg">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Confidentialité */}
          <TabsContent value="privacy" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Confidentialité et sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Visibilité du profil</Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => 
                      setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Amis uniquement</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Afficher mon activité</p>
                    <p className="text-sm text-gray-500">Autres utilisateurs peuvent voir mes RDV récents</p>
                  </div>
                  <Switch
                    checked={privacySettings.showActivity}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showActivity: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permettre les mentions</p>
                    <p className="text-sm text-gray-500">Autres utilisateurs peuvent me mentionner</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowTagging}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, allowTagging: checked }))
                    }
                  />
                </div>

                <Button onClick={() => saveSettings('confidentialité')} className="w-full gradient-bg">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder la confidentialité
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Apparence et accessibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Thème</Label>
                  <Select 
                    value={appearanceSettings.theme} 
                    onValueChange={(value) => 
                      setAppearanceSettings(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Langue</Label>
                  <Select 
                    value={appearanceSettings.language} 
                    onValueChange={(value) => 
                      setAppearanceSettings(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Taille de police</Label>
                  <Select 
                    value={appearanceSettings.fontSize} 
                    onValueChange={(value) => 
                      setAppearanceSettings(prev => ({ ...prev, fontSize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => saveSettings('apparence')} className="w-full gradient-bg">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder l'apparence
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}