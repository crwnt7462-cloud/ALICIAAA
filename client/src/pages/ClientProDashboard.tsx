import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings,
  Clock,
  MapPin,
  Star,
  Gift,
  CreditCard,
  Bell,
  Heart,
  Search,
  Filter
} from 'lucide-react';

export default function ClientProDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();

  const upcomingAppointments = [
    {
      id: 1,
      salon: "Excellence Beauty Paris",
      service: "Coupe & Brushing",
      date: "25 Jan 2025",
      time: "14:30",
      specialist: "Sophie L.",
      price: "45€",
      status: "confirmé"
    },
    {
      id: 2,
      salon: "Spa Wellness Center",
      service: "Soin du visage",
      date: "28 Jan 2025", 
      time: "16:00",
      specialist: "Marie D.",
      price: "80€",
      status: "confirmé"
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      salon: "Beauty Studio",
      service: "Manucure",
      date: "20 Jan 2025",
      specialist: "Emma M.",
      price: "35€",
      status: "terminé",
      canReview: true
    }
  ];

  const favoriteServices = [
    { name: "Coupe & Brushing", salon: "Excellence Beauty", price: "45€" },
    { name: "Soin du visage", salon: "Spa Wellness", price: "80€" },
    { name: "Manucure", salon: "Beauty Studio", price: "35€" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Mon Espace</h1>
          <Button
            variant="ghost"
            onClick={() => setLocation('/settings')}
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">Marie Dubois</h2>
                <p className="text-sm text-gray-600">Cliente VIP</p>
              </div>
              <Badge className="bg-violet-100 text-violet-700">Premium</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="appointments" className="flex flex-col items-center gap-1 py-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">RDV</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex flex-col items-center gap-1 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex flex-col items-center gap-1 py-3">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Favoris</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-3">
              <User className="h-4 w-4" />
              <span className="text-xs">Profil</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Mes rendez-vous</h3>
              <Button 
                size="sm" 
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => setLocation('/search')}
              >
                + Nouveau RDV
              </Button>
            </div>

            {/* Upcoming Appointments */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">À venir</h4>
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{appointment.salon}</h5>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">avec {appointment.specialist}</span>
                      <span className="font-semibold text-violet-600">{appointment.price}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        Déplacer
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Past Appointments */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Historique</h4>
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{appointment.salon}</h5>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{appointment.date}</span>
                      <span className="font-semibold text-gray-700">{appointment.price}</span>
                    </div>
                    {appointment.canReview && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => toast({ title: "Merci pour votre avis !" })}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Laisser un avis
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Messages</h3>
              <Button variant="outline" size="sm">
                <Search className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { salon: "Excellence Beauty Paris", message: "Votre RDV est confirmé pour demain", time: "14:30", unread: true },
                { salon: "Spa Wellness Center", message: "Promotion -20% sur tous les soins", time: "10:15", unread: false },
                { salon: "Beauty Studio", message: "Merci pour votre visite !", time: "Hier", unread: false }
              ].map((message, index) => (
                <Card 
                  key={index} 
                  className={`border cursor-pointer hover:bg-gray-50 ${message.unread ? 'border-violet-200 bg-violet-50' : 'border-gray-200'}`}
                  onClick={() => setLocation('/client/messages')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-medium text-gray-900">{message.salon}</h5>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.message}</p>
                    {message.unread && (
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Services favoris</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-3">
              {favoriteServices.map((service, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{service.name}</h5>
                        <p className="text-sm text-gray-600">{service.salon}</p>
                      </div>
                      <span className="font-semibold text-violet-600">{service.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                        onClick={() => toast({ title: "Réservation en cours..." })}
                      >
                        Réserver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <h3 className="font-semibold text-gray-900">Mon profil</h3>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Nom complet</Label>
                  <Input value="Marie Dubois" readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Email</Label>
                  <Input value="marie.dubois@email.com" readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Téléphone</Label>
                  <Input value="+33 6 12 34 56 78" readOnly className="mt-1" />
                </div>
                <Button className="w-full bg-violet-600 hover:bg-violet-700">
                  Modifier mes informations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">RDV cette année</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Salons visités</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Points fidélité</span>
                  <span className="font-semibold text-violet-600">450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Économies réalisées</span>
                  <span className="font-semibold text-green-600">85€</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}