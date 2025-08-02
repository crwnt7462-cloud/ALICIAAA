import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Heart, 
  Settings, 
  Bell,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  LogOut
} from "lucide-react";

export default function PlanityStyleAccount() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  const upcomingAppointments = [
    {
      id: 1,
      salonName: "Salon Excellence Paris",
      service: "Coupe + Brushing",
      date: "Demain",
      time: "14:30",
      price: "45€",
      status: "confirmed"
    },
    {
      id: 2,
      salonName: "Studio Hair Design",
      service: "Coloration",
      date: "15 février",
      time: "10:00",
      price: "85€",
      status: "confirmed"
    }
  ];

  const appointmentHistory = [
    {
      id: 1,
      salonName: "Salon Excellence Paris",
      service: "Coupe Signature",
      date: "12 janvier 2025",
      price: "39€",
      rating: 5,
      review: "Service parfait, très satisfaite !"
    },
    {
      id: 2,
      salonName: "Coiffure Moderne",
      service: "Coupe + Coloration",
      date: "18 décembre 2024",
      price: "75€",
      rating: 4,
      review: "Très bon salon, je recommande"
    }
  ];

  const favoritesSalons = [
    {
      id: 1,
      name: "Salon Excellence Paris",
      address: "45 Avenue Victor Hugo, 75116 Paris",
      rating: 4.9,
      category: "Coiffure"
    },
    {
      id: 2,
      name: "Beauty & Spa Marais",
      address: "8 Rue du Marais, 75004 Paris", 
      rating: 4.7,
      category: "Esthétique"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientEmail');
    setLocation('/client-login');
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
                size="icon"
                onClick={() => window.history.back()}
                className="h-10 w-10 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Mon compte</h1>
            </div>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profil utilisateur */}
        <Card className="mb-6 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-amber-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-violet-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">Marie Dubois</h2>
                <p className="text-gray-600">marie.dubois@email.com</p>
                <p className="text-sm text-gray-500">Cliente depuis janvier 2024</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/profile-edit')}
                className="border-gray-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="appointments"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Favoris
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">marie.dubois@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">06 12 34 56 78</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium">15 rue des Lilas, 75011 Paris</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="font-medium">25 mars 1990</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            {/* Prochains rendez-vous */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Prochains rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{appointment.salonName}</h4>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.date} à {appointment.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{appointment.price}</p>
                        <Badge variant="secondary" className="text-xs">Confirmé</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Historique des rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentHistory.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{appointment.salonName}</h4>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <p className="text-sm text-gray-500">{appointment.date}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < appointment.rating ? 'fill-current text-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">"{appointment.review}"</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{appointment.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mes salons favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoritesSalons.map((salon) => (
                    <div 
                      key={salon.id} 
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
                      onClick={() => setLocation(`/salon-detail/${salon.id}`)}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-amber-100 rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{salon.name}</h4>
                        <p className="text-sm text-gray-600">{salon.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-amber-400" />
                            <span className="text-sm text-gray-600">{salon.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{salon.category}</Badge>
                        </div>
                      </div>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                        Réserver
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-gray-500">Gérer vos préférences de notification</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Moyens de paiement</p>
                      <p className="text-sm text-gray-500">Gérer vos cartes bancaires</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Gérer</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Confidentialité</p>
                      <p className="text-sm text-gray-500">Paramètres de confidentialité</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}