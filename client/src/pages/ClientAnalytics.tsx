import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, Users, Target,
  Brain, BarChart3, MessageSquare, Phone, Gift, Calendar,
  CheckCircle, XCircle, Clock, Star, UserCheck, UserX,
  PieChart, Activity, Lightbulb, Crown, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ClientProfile {
  nom: string;
  rdv_total: number;
  rdv_annules: number;
  dernier_comportement: "venu" | "annulé" | "pas venu";
  profil: "nouveau" | "habitué";
  taux_annulation: number;
}

interface ClientInsight {
  client: ClientProfile & {
    score_risque?: number;
    probabilite_prochaine_annulation?: number;
  };
  niveau_risque: "faible" | "moyen" | "élevé" | "critique";
  actions_recommandees: string[];
  strategie_retention: string;
  probabilite_conversion: number;
  message_personnalise?: string;
}

export default function ClientAnalytics() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("analyze");
  
  // État pour l'analyse d'un client
  const [clientData, setClientData] = useState<ClientProfile>({
    nom: "",
    rdv_total: 0,
    rdv_annules: 0,
    dernier_comportement: "venu",
    profil: "nouveau",
    taux_annulation: 0
  });
  
  const [analysisResult, setAnalysisResult] = useState<ClientInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cas d'exemple pré-remplis
  const exampleCases = [
    {
      nom: "Sarah Dupont",
      rdv_total: 6,
      rdv_annules: 4,
      dernier_comportement: "annulé" as const,
      profil: "habituée" as const,
      taux_annulation: 66
    },
    {
      nom: "Marie Martin",
      rdv_total: 12,
      rdv_annules: 2,
      dernier_comportement: "venu" as const,
      profil: "habituée" as const,
      taux_annulation: 17
    },
    {
      nom: "Julie Nouveaux",
      rdv_total: 2,
      rdv_annules: 1,
      dernier_comportement: "pas venu" as const,
      profil: "nouveau" as const,
      taux_annulation: 50
    }
  ];

  const analyzeClientMutation = useMutation({
    mutationFn: async (client: ClientProfile) => {
      const prompt = `
Analyse ce profil client et donne-moi des insights détaillés:

Client: ${client.nom}
- Rendez-vous total: ${client.rdv_total}
- Rendez-vous annulés: ${client.rdv_annules}
- Taux d'annulation: ${client.taux_annulation}%
- Dernier comportement: ${client.dernier_comportement}
- Profil: ${client.profil}

Analyse:
1. Niveau de risque (faible/moyen/élevé/critique)
2. Probabilité d'annulation du prochain RDV
3. 3-5 actions concrètes recommandées
4. Stratégie de rétention personnalisée
5. Message personnalisé à envoyer

Réponds de manière structurée et professionnelle pour un salon de beauté.
      `;
      
      const response = await apiRequest("POST", "/api/ai/chat", { message: prompt });
      return response.json();
    },
    onSuccess: (data) => {
      // Simulation d'un résultat structuré basé sur la réponse IA
      const riskLevel = clientData.taux_annulation >= 60 ? "critique" 
        : clientData.taux_annulation >= 40 ? "élevé"
        : clientData.taux_annulation >= 20 ? "moyen" : "faible";
      
      const mockInsight: ClientInsight = {
        client: {
          ...clientData,
          score_risque: clientData.taux_annulation / 100,
          probabilite_prochaine_annulation: Math.min(0.9, clientData.taux_annulation / 100 + 0.2)
        },
        niveau_risque: riskLevel,
        actions_recommandees: riskLevel === "critique" 
          ? ["⚠️ Appel personnel dans les 24h", "🎁 Offre spéciale de récupération", "📅 Créneaux flexibles"]
          : riskLevel === "élevé"
          ? ["📞 Appel de confirmation 48h avant", "🎯 Offre de fidélité", "⏰ Rappel SMS 2h avant"]
          : ["📱 SMS de confirmation", "⭐ Services complémentaires", "🔄 Suivi post-RDV"],
        strategie_retention: data.response || "Stratégie personnalisée générée par IA",
        probabilite_conversion: Math.max(0.1, 1 - (clientData.taux_annulation / 100)),
        message_personnalise: `Bonjour ${clientData.nom}, nous pensons à vous !`
      };
      
      setAnalysisResult(mockInsight);
      setIsLoading(false);
      
      toast({
        title: "Analyse terminée",
        description: `Profil de ${clientData.nom} analysé avec succès`
      });
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le profil client",
        variant: "destructive"
      });
    }
  });

  const handleAnalyzeClient = () => {
    if (!clientData.nom.trim()) {
      toast({
        title: "Données manquantes",
        description: "Veuillez saisir au moins le nom du client",
        variant: "destructive"
      });
      return;
    }
    
    // Calcul automatique du taux d'annulation
    const taux = clientData.rdv_total > 0 
      ? Math.round((clientData.rdv_annules / clientData.rdv_total) * 100)
      : 0;
    
    const updatedClient = {
      ...clientData,
      taux_annulation: taux,
      profil: clientData.rdv_total >= 3 ? "habitué" as const : "nouveau" as const
    };
    
    setClientData(updatedClient);
    setIsLoading(true);
    analyzeClientMutation.mutate(updatedClient);
  };

  const loadExampleCase = (example: ClientProfile) => {
    setClientData(example);
    setAnalysisResult(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critique": return "text-red-600 bg-red-50 border-red-200";
      case "élevé": return "text-orange-600 bg-orange-50 border-orange-200";
      case "moyen": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "faible": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "critique": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "élevé": return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case "moyen": return <Activity className="w-5 h-5 text-yellow-600" />;
      case "faible": return <TrendingUp className="w-5 h-5 text-green-600" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-lg">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/')}
              className="mr-2 hover:bg-violet-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Analytics Client IA</h1>
                <p className="text-xs text-violet-600 font-medium">Analyse Prédictive & Rétention</p>
              </div>
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200">
            <Zap className="w-3 h-3 mr-1" />
            IA Avancée
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="analyze" className="data-[state=active]:bg-violet-100">
              <Brain className="w-4 h-4 mr-2" />
              Analyser Client
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-violet-100">
              <Crown className="w-4 h-4 mr-2" />
              Cas d'Étude
            </TabsTrigger>
          </TabsList>

          {/* Analyse Client */}
          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-violet-600" />
                  Profil Client à Analyser
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom du client</Label>
                    <Input
                      value={clientData.nom}
                      onChange={(e) => setClientData(prev => ({ ...prev, nom: e.target.value }))}
                      placeholder="Ex: Sarah Dupont"
                    />
                  </div>
                  <div>
                    <Label>Dernière action</Label>
                    <Select 
                      value={clientData.dernier_comportement} 
                      onValueChange={(value: any) => setClientData(prev => ({ ...prev, dernier_comportement: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venu">✅ Venu</SelectItem>
                        <SelectItem value="annulé">❌ Annulé</SelectItem>
                        <SelectItem value="pas venu">⚠️ Pas venu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>RDV Total</Label>
                    <Input
                      type="number"
                      value={clientData.rdv_total}
                      onChange={(e) => setClientData(prev => ({ ...prev, rdv_total: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>RDV Annulés</Label>
                    <Input
                      type="number"
                      value={clientData.rdv_annules}
                      onChange={(e) => setClientData(prev => ({ ...prev, rdv_annules: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Taux d'annulation calculé:</span>
                  <Badge variant="outline" className="text-lg font-bold">
                    {clientData.rdv_total > 0 ? Math.round((clientData.rdv_annules / clientData.rdv_total) * 100) : 0}%
                  </Badge>
                </div>

                <Button 
                  onClick={handleAnalyzeClient}
                  disabled={isLoading || !clientData.nom.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyser avec l'IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Résultats d'analyse */}
            {analysisResult && (
              <Card className="border-2 border-violet-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-violet-600" />
                      Analyse Complète: {analysisResult.client.nom}
                    </span>
                    <Badge className={`${getRiskColor(analysisResult.niveau_risque)} border`}>
                      {getRiskIcon(analysisResult.niveau_risque)}
                      <span className="ml-1 capitalize">{analysisResult.niveau_risque}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Métriques clés */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {Math.round((analysisResult.client.probabilite_prochaine_annulation || 0) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Risque annulation</div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round((analysisResult.client.score_risque || 0) * 100)}
                        </div>
                        <div className="text-xs text-gray-500">Score risque</div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(analysisResult.probabilite_conversion * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Récupération</div>
                      </div>
                    </Card>
                  </div>

                  {/* Actions recommandées */}
                  <div>
                    <h3 className="font-bold mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Actions Recommandées
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.actions_recommandees.map((action, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-sm font-medium text-blue-900">{action}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stratégie de rétention */}
                  <div>
                    <h3 className="font-bold mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-purple-600" />
                      Stratégie de Rétention IA
                    </h3>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-purple-900 text-sm leading-relaxed">
                        {analysisResult.strategie_retention}
                      </p>
                    </div>
                  </div>

                  {/* Message personnalisé */}
                  {analysisResult.message_personnalise && (
                    <div>
                      <h3 className="font-bold mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
                        Message Personnalisé
                      </h3>
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-emerald-900 text-sm italic">
                          "{analysisResult.message_personnalise}"
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cas d'exemples */}
          <TabsContent value="examples" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cas d'Étude Clients</h2>
              <p className="text-gray-600">Profils clients types pour tester l'analyse IA</p>
            </div>

            <div className="space-y-4">
              {exampleCases.map((example, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => loadExampleCase(example)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {example.nom.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{example.nom}</h3>
                          <p className="text-sm text-gray-600">
                            {example.rdv_total} RDV • {example.rdv_annules} annulés • {example.profil}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={getRiskColor(
                            example.taux_annulation >= 60 ? "critique" 
                            : example.taux_annulation >= 40 ? "élevé"
                            : example.taux_annulation >= 20 ? "moyen" : "faible"
                          )}
                        >
                          {example.taux_annulation}% annulation
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}