import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Euro, Bot, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: stats, refetch } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { lastMessage } = useWebSocket();

  // Refetch stats when appointments are updated
  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      refetch();
    }
  }, [lastMessage, refetch]);

  return (
    <div className="p-4 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CalendarCheck className="text-primary w-5 h-5" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Aujourd'hui
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.todayAppointments || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rendez-vous
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Euro className="text-secondary w-5 h-5" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Semaine
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.weekRevenue ? `${stats.weekRevenue}€` : '0€'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Chiffre d'affaires
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistant IA</h3>
              <p className="text-sm opacity-90">Optimisation intelligente</p>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-3">
            3 créneaux libres détectés cet après-midi. Voulez-vous envoyer des
            notifications aux clients en liste d'attente ?
          </p>
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Envoyer les notifications
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            Activité récente
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau RDV confirmé</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sophie Martin - Coupe & couleur
                </p>
              </div>
              <span className="text-xs text-gray-400">Il y a 5min</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Euro className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Paiement reçu</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Emma Leroy - 85€
                </p>
              </div>
              <span className="text-xs text-gray-400">Il y a 15min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
