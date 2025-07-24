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
  const [activeTab, setActiveTab] = useState("dashboard");
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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 py-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Accueil</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex flex-col items-center gap-1 py-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Planning</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex flex-col items-center gap-1 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex flex-col items-center gap-1 py-3">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Pro Tools</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex flex-col items-center gap-1 py-3">
              <Star className="h-4 w-4" />
              <span className="text-xs">IA Pro</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-violet-600">8</div>
                  <div className="text-sm text-gray-600">RDV aujourd'hui</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">340€</div>
                  <div className="text-sm text-gray-600">CA du jour</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Nouveaux clients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">4.9</div>
                  <div className="text-sm text-gray-600">Note moyenne</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{appointment.service}</div>
                      <div className="text-sm text-gray-600">{appointment.time} - {appointment.specialist}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-violet-600">{appointment.price}</div>
                      <div className="text-xs text-gray-500">{appointment.status}</div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab("appointments")}
                >
                  Voir tous les RDV
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

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

          {/* Pro Tools Tab */}
          <TabsContent value="tools" className="space-y-4">
            <h3 className="font-semibold text-gray-900">Outils Professionnels</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/page-creator')}>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Edit3 className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="font-medium text-gray-900">Pages</div>
                  <div className="text-xs text-gray-600">Créer/modifier</div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="font-medium text-gray-900">Paiements</div>
                  <div className="text-xs text-gray-600">Encaissements</div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="font-medium text-gray-900">Marketing</div>
                  <div className="text-xs text-gray-600">Campagnes</div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Gift className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="font-medium text-gray-900">Fidélité</div>
                  <div className="text-xs text-gray-600">Programmes</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres du salon
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Horaires d'ouverture
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Gestion équipe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-4">
            <h3 className="font-semibold text-gray-900">Intelligence Artificielle</h3>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Assistant IA Professionnel</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Optimisez votre planning, analysez vos performances et obtenez des conseils personnalisés
                </p>
                <Button 
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setLocation('/ai-pro')}
                >
                  Lancer l'assistant
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Optimisation Planning</div>
                      <div className="text-xs text-gray-600">Suggestions automatiques</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Analyse Clients</div>
                      <div className="text-xs text-gray-600">Comportements et tendances</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}