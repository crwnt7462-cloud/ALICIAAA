import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, AlertTriangle, CheckCircle, Info, Clock,
  User, TrendingUp, TrendingDown, Users, Calendar,
  DollarSign, ShoppingBag, Heart, Zap, Bell
} from "lucide-react";

interface Alert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  clientName?: string;
  value?: string;
  icon?: any;
  action?: string;
}

export default function AIAlerts() {
  const [, setLocation] = useLocation();
  
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Client à Risque Détecté',
      message: 'Marie Dupont n\'a pas pris de rendez-vous depuis 3 mois. Risque de perte élevé.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      clientName: 'Marie Dupont',
      icon: AlertTriangle,
      action: 'Contacter maintenant'
    },
    {
      id: '2',
      type: 'success',
      title: 'Objectif CA Atteint',
      message: 'Félicitations ! Vous avez dépassé votre objectif mensuel de 15%.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      value: '+15%',
      icon: TrendingUp,
      action: 'Voir détails'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Stock Faible',
      message: 'Attention : 3 produits en rupture de stock imminente.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      value: '3 produits',
      icon: ShoppingBag,
      action: 'Gérer stock'
    },
    {
      id: '4',
      type: 'info',
      title: 'Optimisation Planning',
      message: 'Décaler les RDV de 15min améliorerait le taux d\'occupation de 12%.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      value: '+12%',
      icon: Calendar,
      action: 'Appliquer'
    },
    {
      id: '5',
      type: 'success',
      title: 'Nouveau Client VIP',
      message: 'Sophie Martin vient d\'atteindre le statut VIP avec 8 rendez-vous.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      clientName: 'Sophie Martin',
      icon: Heart,
      action: 'Voir profil'
    },
    {
      id: '6',
      type: 'warning',
      title: 'Tendance Négative',
      message: 'Baisse de 8% des réservations cette semaine vs semaine précédente.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      value: '-8%',
      icon: TrendingDown,
      action: 'Analyser'
    }
  ]);

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          badge: 'bg-red-600 text-white',
          title: 'text-red-900',
          message: 'text-red-700',
          button: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          icon: 'text-amber-600',
          badge: 'bg-amber-600 text-white',
          title: 'text-amber-900',
          message: 'text-amber-700',
          button: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          icon: 'text-emerald-600',
          badge: 'bg-emerald-600 text-white',
          title: 'text-emerald-900',
          message: 'text-emerald-700',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          badge: 'bg-blue-600 text-white',
          title: 'text-blue-900',
          message: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes}min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `il y a ${days}j`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/ai-assistant-new')}
              className="w-10 h-10 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Alertes IA</h1>
              <p className="text-sm text-gray-600">Intelligence artificielle • Notifications personnalisées</p>
            </div>
          </div>
          <Badge className="bg-violet-600 text-white">
            <Bell className="w-3 h-3 mr-1" />
            {alerts.length} alertes
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Notifications Intelligentes</h2>
          <p className="text-gray-600 text-sm">Alertes générées par votre assistant IA</p>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            const IconComponent = alert.icon;
            
            return (
              <Card key={alert.id} className={`${style.bg} border-0 shadow-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                      <IconComponent className={`w-5 h-5 ${style.icon}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold text-sm ${style.title}`}>
                          {alert.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {alert.value && (
                            <Badge className={`${style.badge} text-xs px-2 py-1`}>
                              {alert.value}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${style.message} mb-3`}>
                        {alert.message}
                      </p>
                      
                      {alert.clientName && (
                        <div className="flex items-center mb-3">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs font-medium text-gray-600">
                            Client: {alert.clientName}
                          </span>
                        </div>
                      )}
                      
                      {alert.action && (
                        <Button
                          size="sm"
                          className={`${style.button} text-xs h-8 px-3`}
                        >
                          {alert.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 mt-6">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-violet-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">IA Toujours Active</h3>
            <p className="text-gray-600 text-sm mb-3">
              Votre assistant surveille continuellement vos données pour vous alerter des opportunités et risques.
            </p>
            <Badge className="bg-violet-600 text-white text-xs">
              Analyse en temps réel • GPT-4o • Prédictions avancées
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}