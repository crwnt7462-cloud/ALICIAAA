import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, TrendingUp, Users, Clock, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: stats, refetch } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      refetch();
    }
  }, [lastMessage, refetch]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-500 mt-1">Mercredi 18 juin 2025</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats?.todayAppointments || 0}
                </p>
                <p className="text-sm text-gray-500">Rendez-vous</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">CA Semaine</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats?.weekRevenue ? `${stats.weekRevenue}€` : '0€'}
                </p>
                <p className="text-sm text-green-600">+12% vs sem. prec.</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats?.totalClients || 0}
                </p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de remplissage</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">82%</p>
                <p className="text-sm text-gray-500">Cette semaine</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <p className="font-medium">Nouveau client</p>
                <p className="text-sm text-gray-500">Ajouter une fiche</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <p className="font-medium">Gérer planning</p>
                <p className="text-sm text-gray-500">Voir créneaux libres</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Activité récente</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Nouveau rendez-vous confirmé</p>
                <p className="text-sm text-gray-500">Sophie Martin - Coupe & couleur</p>
                <p className="text-xs text-gray-400 mt-1">Il y a 5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Paiement reçu</p>
                <p className="text-sm text-gray-500">Emma Leroy - 85€</p>
                <p className="text-xs text-gray-400 mt-1">Il y a 15 minutes</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Rappel automatique envoyé</p>
                <p className="text-sm text-gray-500">Marie Dubois - RDV demain 14h</p>
                <p className="text-xs text-gray-400 mt-1">Il y a 1 heure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
