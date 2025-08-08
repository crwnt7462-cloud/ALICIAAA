import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, UserCheck, Users, AlertTriangle, TrendingUp, Activity,
  CheckCircle, Zap, Clock, RefreshCw, Trash2, Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AIAlert {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'warning' | 'success' | 'info' | 'critical';
  client_name?: string;
  risk_level?: string;
  auto_generated: boolean;
  metrics?: {
    cancellationRate?: number;
    riskScore?: number;
    conversionProbability?: number;
  };
}

export default function AIAlertsDrops() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const alertsEndRef = useRef<HTMLDivElement>(null);
  const alertsContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    alertsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    alertsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (alertsContainerRef.current) {
      const { scrollTop } = alertsContainerRef.current;
      setShowScrollTop(scrollTop > 200);
    }
  };

  // Récupération des conversations avec les analyses IA
  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['/api/ai/conversations'],
    refetchInterval: 5000, // Actualisation automatique
  });

  // Transformation des conversations en alertes
  const aiAlerts: AIAlert[] = (conversationsData as any)?.conversations
    ?.filter((conv: any) => conv.metadata?.type === 'client_analysis')
    ?.map((conv: any) => ({
      id: conv.id,
      title: conv.title || `Analyse Client: ${conv.metadata?.client_name}`,
      content: conv.messages?.[1]?.content || 'Analyse en cours...',
      timestamp: new Date(conv.timestamp),
      type: conv.metadata?.risk_level === 'critique' ? 'critical' 
           : conv.metadata?.risk_level === 'élevé' ? 'warning'
           : conv.metadata?.risk_level === 'moyen' ? 'info' 
           : 'success',
      client_name: conv.metadata?.client_name,
      risk_level: conv.metadata?.risk_level,
      auto_generated: conv.metadata?.auto_generated || false
    })) || [];

  // Mutation pour supprimer une alerte
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest("DELETE", `/api/ai/conversations/${alertId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Alerte supprimée",
        description: "L'analyse a été supprimée avec succès"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/conversations'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'alerte",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    const container = alertsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const getDropColor = (type: string) => {
    switch (type) {
      case 'critical': return 'from-red-500 via-red-400 to-pink-400';
      case 'warning': return 'from-amber-500 via-orange-400 to-yellow-400';
      case 'info': return 'from-blue-500 via-indigo-400 to-purple-400';
      case 'success': return 'from-emerald-500 via-green-400 to-teal-400';
      default: return 'from-gray-500 via-gray-400 to-slate-400';
    }
  };

  const getDropIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      case 'info': return <Users className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-lg shrink-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/ai-assistant-new')}
              className="mr-2 hover:bg-violet-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full m-0.5 animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Centre d'Alertes IA</h1>
                <p className="text-xs text-violet-600 font-medium">Messages & Analyses Automatiques</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200">
              <Zap className="w-3 h-3 mr-1" />
              {aiAlerts.length} Alertes
            </Badge>
          </div>
        </div>
      </div>

      {/* Zone d'alertes avec style gouttes d'eau */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={alertsContainerRef}
          className="h-full overflow-y-auto p-4 space-y-6" 
        >
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des alertes IA...</p>
            </div>
          ) : aiAlerts.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune alerte IA</h3>
              <p className="text-gray-500 mb-6">Les analyses automatiques apparaîtront ici en forme de gouttes d'eau stylisées</p>
              <Button 
                onClick={() => setLocation('/client-analytics')}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                Lancer une analyse
              </Button>
            </div>
          ) : (
            aiAlerts.map((alert) => (
              <div key={alert.id} className="flex justify-center">
                <div className="relative max-w-md w-full">
                  {/* Goutte d'eau principale */}
                  <div 
                    className={`relative bg-gradient-to-br ${getDropColor(alert.type)} 
                    rounded-full shadow-2xl border-4 border-white/20 backdrop-blur-sm
                    transform hover:scale-105 transition-all duration-300 cursor-pointer
                    p-6 min-h-[200px] flex flex-col justify-center`}
                    style={{
                      clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 85% 70%, 50% 100%, 15% 70%, 0% 35%, 20% 10%)',
                      filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))'
                    }}
                  >
                    {/* Contenu de la goutte */}
                    <div className="text-center text-white">
                      <div className="mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          {getDropIcon(alert.type)}
                        </div>
                        <h3 className="font-bold text-sm mb-1">{alert.client_name}</h3>
                        <Badge className="bg-white/20 text-white text-xs border-white/30">
                          {alert.risk_level}
                        </Badge>
                      </div>
                      
                      <div className="text-xs opacity-90 leading-relaxed max-h-20 overflow-hidden">
                        {alert.content.split('\n')[0].substring(0, 80)}...
                      </div>
                      
                      <div className="mt-3 text-xs opacity-75">
                        {alert.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>

                    {/* Bouton de suppression */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAlertMutation.mutate(alert.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 p-0 bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Petites bulles autour */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg opacity-80"></div>
                  <div className="absolute -bottom-1 -right-3 w-3 h-3 bg-gradient-to-r from-violet-300 to-purple-300 rounded-full shadow-md opacity-70"></div>
                  <div className="absolute top-4 -right-2 w-2 h-2 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full shadow-sm opacity-60"></div>
                </div>
              </div>
            ))
          )}
          
          <div ref={alertsEndRef} />
        </div>

        {/* Bouton Remonter en haut */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="sm"
            className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
            variant="outline"
          >
            <ArrowLeft className="w-5 h-5 -rotate-90" />
          </Button>
        )}
      </div>
    </div>
  );
}