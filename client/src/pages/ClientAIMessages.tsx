import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MessageSquare, User, AlertTriangle, TrendingUp, 
  Trash2, RefreshCw, Calendar, Target, BarChart3, Copy,
  CheckCircle, XCircle, Crown
} from "lucide-react";

interface AIMessage {
  id: string;
  clientName: string;
  riskLevel: string;
  message: string;
  analysis: string;
  actions: string[];
  metrics: {
    cancellationRate: number;
    riskScore: number;
    conversionProbability: number;
  };
  timestamp: string;
}

export default function ClientAIMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupération des messages IA
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['/api/clients/ai-messages'],
    refetchInterval: 5000, // Actualisation automatique toutes les 5 secondes
  });

  const messages: AIMessage[] = messagesData?.messages || [];

  // Mutation pour supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await apiRequest("DELETE", `/api/clients/ai-messages/${messageId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message supprimé",
        description: "Le message IA a été supprimé avec succès"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients/ai-messages'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive"
      });
    }
  });

  // Mutation pour vider tous les messages
  const clearAllMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/clients/ai-messages", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Messages supprimés",
        description: "Tous les messages IA ont été supprimés"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients/ai-messages'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les messages",
        variant: "destructive"
      });
    }
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critique": return "bg-red-100 text-red-800 border-red-300";
      case "élevé": return "bg-orange-100 text-orange-800 border-orange-300";
      case "moyen": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "critique": return <AlertTriangle className="w-4 h-4" />;
      case "élevé": return <TrendingUp className="w-4 h-4" />;
      case "moyen": return <BarChart3 className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copié",
      description: "Message copié dans le presse-papiers"
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-violet-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="text-violet-600 hover:bg-violet-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages IA Clients</h1>
              <p className="text-sm text-gray-600">Messages personnalisés générés automatiquement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-violet-300 text-violet-700">
              <MessageSquare className="w-4 h-4 mr-1" />
              {messages.length} messages
            </Badge>
            
            {messages.length > 0 && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => clearAllMessagesMutation.mutate()}
                disabled={clearAllMessagesMutation.isPending}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Tout supprimer
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-violet-600" />
            <span className="ml-3 text-lg text-gray-600">Chargement des messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun message généré</h3>
              <p className="text-gray-500 mb-4">
                Les messages IA apparaîtront ici après l'analyse des clients à risque
              </p>
              <Button 
                onClick={() => window.location.href = '/client-analytics'}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Analyser les clients
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <Card key={message.id} className="border-2 border-violet-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {message.clientName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{message.clientName}</h3>
                        <p className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getRiskColor(message.riskLevel)} border`}>
                        {getRiskIcon(message.riskLevel)}
                        <span className="ml-1 capitalize">{message.riskLevel}</span>
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMessageMutation.mutate(message.id)}
                        disabled={deleteMessageMutation.isPending}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Métriques */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-xl font-bold text-red-600">
                        {message.metrics.cancellationRate}%
                      </div>
                      <div className="text-xs text-red-700">Annulations</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xl font-bold text-blue-600">
                        {Math.round(message.metrics.riskScore * 100)}
                      </div>
                      <div className="text-xs text-blue-700">Score Risque</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xl font-bold text-green-600">
                        {Math.round(message.metrics.conversionProbability * 100)}%
                      </div>
                      <div className="text-xs text-green-700">Récupération</div>
                    </div>
                  </div>

                  {/* Message personnalisé */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center text-emerald-700">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message à envoyer
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.message)}
                        className="text-emerald-600 hover:bg-emerald-50"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copier
                      </Button>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-emerald-900 italic">"{message.message}"</p>
                    </div>
                  </div>

                  {/* Analyse détaillée */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-purple-700">
                      <Target className="w-4 h-4 mr-2" />
                      Analyse & Stratégie
                    </h4>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-purple-900 text-sm whitespace-pre-line">{message.analysis}</p>
                    </div>
                  </div>

                  {/* Actions recommandées */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Actions Recommandées
                    </h4>
                    <div className="space-y-2">
                      {message.actions.map((action, index) => (
                        <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-blue-900 text-sm">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}