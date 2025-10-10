import { useState, useCallback, useMemo } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Save,
  Loader2
} from "lucide-react";

export default function SettingsClient() {
  const { clientData } = useClientAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  // Récupération des paramètres depuis l'API
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['client-settings'],
    queryFn: async () => {
      const res = await fetch('/api/client/settings', {
        credentials: 'include',
        cache: 'no-store',
        referrerPolicy: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des paramètres');
      return res.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // États dynamiques basés sur les données API
  const [profileData, setProfileData] = useState({
    firstName: clientData?.firstName || "",
    lastName: clientData?.lastName || "",
    email: clientData?.email || "",
    phone: clientData?.phone || "",
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

  // Mise à jour des états quand les données API arrivent
  useMemo(() => {
    if (settingsData) {
      if (settingsData.profile) {
        setProfileData(prev => ({ ...prev, ...settingsData.profile }));
      }
      if (settingsData.notifications) {
        setNotificationSettings(prev => ({ ...prev, ...settingsData.notifications }));
      }
      if (settingsData.privacy) {
        setPrivacySettings(prev => ({ ...prev, ...settingsData.privacy }));
      }
      if (settingsData.appearance) {
        setAppearanceSettings(prev => ({ ...prev, ...settingsData.appearance }));
      }
    }
  }, [settingsData]);

  // Mutation pour sauvegarder les paramètres
  const saveSettingsMutation = useMutation({
    mutationFn: async (section: string, data: any) => {
      const res = await fetch('/api/client/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-store'
        },
        credentials: 'include',
        referrerPolicy: 'same-origin',
        body: JSON.stringify({ section, data })
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      return res.json();
    },
    onSuccess: (_, section) => {
      queryClient.invalidateQueries({ queryKey: ['client-settings'] });
      toast({
        title: "Paramètres sauvegardés",
        description: `Les paramètres ${section} ont été mis à jour`
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    }
  });

  const saveSettings = useCallback((section: string) => {
    let data;
    switch (section) {
      case 'profil':
        data = profileData;
        break;
      case 'notifications':
        data = notificationSettings;
        break;
      case 'confidentialité':
        data = privacySettings;
        break;
      case 'apparence':
        data = appearanceSettings;
        break;
      default:
        return;
    }
    saveSettingsMutation.mutate({ section, data });
  }, [profileData, notificationSettings, privacySettings, appearanceSettings, saveSettingsMutation]);

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

  // Loading state
  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Header responsive */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="p-2 hover:bg-violet-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Paramètres
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <TabsTrigger 
              value="profile" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg transition-all duration-200"
            >
              <User className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Profil</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Notifs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Privé</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 rounded-lg transition-all duration-200"
            >
              <Palette className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Thème</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Prénom</Label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="glass-input"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Nom</Label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="glass-input"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="glass-input"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="glass-input"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date de naissance</Label>
                  <Input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="glass-input"
                    placeholder="Votre adresse complète"
                  />
                </div>
                <Button 
                  onClick={() => saveSettings('profil')} 
                  disabled={saveSettingsMutation.isPending}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {saveSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sauvegarder le profil
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <Lock className="w-5 h-5" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full glass-button hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
                >
                  Changer le mot de passe
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full glass-button hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
                >
                  Authentification à deux facteurs
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <Bell className="w-5 h-5" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium text-gray-900">Notifications email</p>
                      <p className="text-sm text-gray-600">Recevoir des emails de confirmation</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium text-gray-900">Notifications SMS</p>
                      <p className="text-sm text-gray-600">Recevoir des SMS de rappel</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium text-gray-900">Notifications push</p>
                      <p className="text-sm text-gray-600">Notifications sur l'appareil</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium text-gray-900">Rappels de RDV</p>
                      <p className="text-sm text-gray-600">24h avant le rendez-vous</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, appointmentReminders: checked }))
                    }
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                <Button 
                  onClick={() => saveSettings('notifications')} 
                  disabled={saveSettingsMutation.isPending}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {saveSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sauvegarder les notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Confidentialité */}
          <TabsContent value="privacy" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <Shield className="w-5 h-5" />
                  Confidentialité et sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Visibilité du profil</Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => 
                      setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))
                    }
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Amis uniquement</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                  <div>
                    <p className="font-medium text-gray-900">Afficher mon activité</p>
                    <p className="text-sm text-gray-600">Autres utilisateurs peuvent voir mes RDV récents</p>
                  </div>
                  <Switch
                    checked={privacySettings.showActivity}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showActivity: checked }))
                    }
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                  <div>
                    <p className="font-medium text-gray-900">Permettre les mentions</p>
                    <p className="text-sm text-gray-600">Autres utilisateurs peuvent me mentionner</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowTagging}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, allowTagging: checked }))
                    }
                    className="data-[state=checked]:bg-violet-600"
                  />
                </div>

                <Button 
                  onClick={() => saveSettings('confidentialité')} 
                  disabled={saveSettingsMutation.isPending}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {saveSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sauvegarder la confidentialité
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <Palette className="w-5 h-5" />
                  Apparence et accessibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Thème</Label>
                  <Select 
                    value={appearanceSettings.theme} 
                    onValueChange={(value) => 
                      setAppearanceSettings(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Langue</Label>
                  <Select 
                    value={appearanceSettings.language} 
                    onValueChange={(value) => 
                      setAppearanceSettings(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Taille de police</Label>
                  <Select 
                    value={appearanceSettings.fontSize} 
                    onValueChange={(value) => 
                      setAppearanceSettings(prev => ({ ...prev, fontSize: value }))
                    }
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => saveSettings('apparence')} 
                  disabled={saveSettingsMutation.isPending}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {saveSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
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