import { useAuthSession } from "@/hooks/useAuthSession";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  Star,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter
} from "lucide-react";

export default function AnalyticsDashboard() {
  const { user, isProfessional } = useAuthSession();

  // Données analytiques
  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/overview'],
    enabled: isProfessional,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['/api/analytics/revenue'],
    enabled: isProfessional,
  });

  const { data: clientData } = useQuery({
    queryKey: ['/api/analytics/clients'],
    enabled: isProfessional,
  });

  const { data: serviceData } = useQuery({
    queryKey: ['/api/analytics/services'],
    enabled: isProfessional,
  });

  if (!isProfessional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-medium mb-2">Analyses avancées</h3>
            <p className="text-gray-600">
              Connectez-vous avec un compte professionnel pour accéder aux analyses
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-600">
              Analyses & Performances
            </h1>
            <p className="text-gray-600 mt-2">
              Suivez les performances de votre salon
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CA ce mois</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {revenueData?.currentMonth || '€0'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-600" />
              </div>
              <div className="mt-4">
                <Badge className="bg-green-100 text-gray-600">
                  +{revenueData?.growth || 0}% vs mois dernier
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux clients</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {clientData?.newClients || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary">
                  {clientData?.totalClients || 0} clients total
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">RDV réalisés</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {analytics?.completedAppointments || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
              <div className="mt-4">
                <Badge className="bg-purple-100 text-gray-600">
                  {analytics?.appointmentRate || 95}% taux de réalisation
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {analytics?.averageRating || '4.8'}/5
                  </p>
                </div>
                <Star className="w-8 h-8 text-gray-600" />
              </div>
              <div className="mt-4">
                <Badge className="bg-yellow-100 text-gray-600">
                  {analytics?.totalReviews || 0} avis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analyses détaillées */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5" />
                    <span>Évolution du chiffre d'affaires</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-600">Graphique de revenus</p>
                      <p className="text-sm text-gray-600">Intégration en cours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition des revenus par service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-600 rounded"></div>
                        <span>Coupe & Brushing</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">2,450€</p>
                        <p className="text-sm text-gray-600">45%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span>Coloration</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">1,630€</p>
                        <p className="text-sm text-gray-600">30%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span>Soins visage</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">1,360€</p>
                        <p className="text-sm text-gray-600">25%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs mensuels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium text-gray-600">Objectif CA</p>
                    <p className="text-xl font-bold text-gray-600">8,000€</p>
                    <Badge className="mt-2 bg-green-100 text-gray-600">68% atteint</Badge>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium text-gray-600">Nouveaux clients</p>
                    <p className="text-xl font-bold text-gray-600">25</p>
                    <Badge className="mt-2 bg-blue-100 text-gray-600">80% atteint</Badge>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium text-gray-600">RDV réalisés</p>
                    <p className="text-xl font-bold text-gray-600">120</p>
                    <Badge className="mt-2 bg-purple-100 text-gray-600">92% atteint</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Acquisition de clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-600">Graphique d'acquisition</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fidélisation clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Clients réguliers (3+ RDV)</span>
                      <Badge className="bg-green-100 text-gray-600">75%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Clients occasionnels (1-2 RDV)</span>
                      <Badge className="bg-yellow-100 text-gray-600">20%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Nouveaux clients</span>
                      <Badge className="bg-blue-100 text-gray-600">5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top clients du mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Marie Dubois", visits: 4, spent: "320€", type: "VIP" },
                    { name: "Sophie Martin", visits: 3, spent: "275€", type: "Régulière" },
                    { name: "Julie Leroy", visits: 3, spent: "240€", type: "Régulière" },
                    { name: "Emma Moreau", visits: 2, spent: "180€", type: "Nouvelle" },
                  ].map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.visits} visites</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{client.spent}</p>
                        <Badge variant="outline" className="text-xs">{client.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services les plus demandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Coupe femme", bookings: 45, revenue: "2,250€", trend: "+12%" },
                      { name: "Coloration", bookings: 32, revenue: "1,920€", trend: "+8%" },
                      { name: "Brushing", bookings: 28, revenue: "840€", trend: "+15%" },
                      { name: "Soins visage", bookings: 18, revenue: "1,080€", trend: "+5%" },
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.bookings} réservations</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{service.revenue}</p>
                          <Badge className="bg-green-100 text-gray-600">{service.trend}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance par créneaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>9h-12h</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm">75%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>14h-17h</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <span className="text-sm">90%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>17h-19h</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                        </div>
                        <span className="text-sm">95%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Ponctualité</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-gray-600">92%</p>
                  <p className="text-sm text-gray-600 mt-2">RDV à l'heure</p>
                  <Badge className="mt-3 bg-green-100 text-gray-600">Excellent</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Taux d'annulation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-gray-600">8%</p>
                  <p className="text-sm text-gray-600 mt-2">RDV annulés</p>
                  <Badge className="mt-3 bg-orange-100 text-gray-600">Bon</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Satisfaction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-gray-600">4.8</p>
                  <p className="text-sm text-gray-600 mt-2">Note moyenne</p>
                  <Badge className="mt-3 bg-yellow-100 text-gray-600">Excellent</Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'amélioration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-gray-600">Optimiser les créneaux matinaux</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Vos créneaux 9h-12h sont moins remplis. Proposez des promotions matinales.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-gray-600">Fidéliser les nouveaux clients</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Créez un programme de fidélité pour convertir 20% de clients occasionnels.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-medium text-gray-600">Développer les soins premium</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Les soins visage ont un bon potentiel. Proposez des forfaits bien-être.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}