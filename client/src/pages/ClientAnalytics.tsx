import { useState, useEffect } from "react";
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
  PieChart, Activity, Lightbulb, Crown, Zap, Database, RefreshCw,
  History, Send, Settings, Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Header } from "@/components/Header";
import logoImage from "@assets/Logo avyento._1755363678253.png";

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

interface RealClientsAnalysis {
  insights: ClientInsight[];
  report: {
    resume: {
      total_clients: number;
      clients_a_risque: number;
      taux_annulation_moyen: number;
      probabilite_conversion_moyenne: number;
    };
    repartition_risques: {
      critique: number;
      élevé: number;
      moyen: number;
      faible: number;
    };
    actions_prioritaires: Array<{
      client: string;
      niveau: string;
      action_immediate: string;
    }>;
  };
}

export default function ClientAnalytics() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("real-data");
  
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
  const [realDataAnalysis, setRealDataAnalysis] = useState<RealClientsAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mutation pour analyser un client
  const analyzeClientMutation = useMutation({
    mutationFn: async (client: ClientProfile) => {
      const response = await apiRequest('POST', '/api/ai/analyze-client', { client });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analyse terminée",
        description: `Client ${clientData.nom} analysé avec succès`,
      });
    },
    onError: (error) => {
      console.error('Erreur analyse client:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser le client",
        variant: "destructive"
      });
    }
  });

  // Mutation pour analyser tous les vrais clients
  const analyzeRealClientsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/analyze-real-clients', {});
      return response.json();
    },
    onSuccess: (data) => {
      setRealDataAnalysis(data);
      toast({
        title: "Analyse complète terminée",
        description: `${data.insights.length} clients analysés`,
      });
    },
    onError: (error) => {
      console.error('Erreur analyse complète:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser les clients réels",
        variant: "destructive"
      });
    }
  });

  const isLoading = analyzeClientMutation.isPending;

  const handleAnalyzeClient = () => {
    if (!clientData.nom.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom de client",
        variant: "destructive"
      });
      return;
    }
    analyzeClientMutation.mutate(clientData);
  };

  const handleAnalyzeRealClients = () => {
    setIsAnalyzing(true);
    analyzeRealClientsMutation.mutate();
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  // Calcul automatique du taux d'annulation
  useEffect(() => {
    if (clientData.rdv_total > 0) {
      setClientData(prev => ({
        ...prev,
        taux_annulation: Math.round((prev.rdv_annules / prev.rdv_total) * 100)
      }));
    }
  }, [clientData.rdv_total, clientData.rdv_annules]);

  const getRiskColor = (niveau: string) => {
    switch (niveau) {
      case "critique": return "bg-red-100 text-red-800 border-red-200";
      case "élevé": return "bg-orange-100 text-orange-800 border-orange-200";
      case "moyen": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "faible": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskIcon = (niveau: string) => {
    switch (niveau) {
      case "critique": return <AlertTriangle className="w-3 h-3" />;
      case "élevé": return <XCircle className="w-3 h-3" />;
      case "moyen": return <Clock className="w-3 h-3" />;
      case "faible": return <CheckCircle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  // Cas d'exemples prédéfinis
  const exampleCases: ClientProfile[] = [
    { nom: "Marie L.", rdv_total: 8, rdv_annules: 5, dernier_comportement: "annulé", profil: "habitué", taux_annulation: 63 },
    { nom: "Pierre M.", rdv_total: 15, rdv_annules: 2, dernier_comportement: "venu", profil: "habitué", taux_annulation: 13 },
    { nom: "Sophie K.", rdv_total: 3, rdv_annules: 2, dernier_comportement: "pas venu", profil: "nouveau", taux_annulation: 67 },
    { nom: "Thomas B.", rdv_total: 12, rdv_annules: 4, dernier_comportement: "venu", profil: "habitué", taux_annulation: 33 }
  ];

  const loadExampleCase = (example: ClientProfile) => {
    setClientData(example);
    setActiveTab("single-analysis");
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header Mobile uniquement */}
      <div className="lg:hidden">
        <Header />
      </div>
      
      <div className="flex min-h-screen">
        {/* Sidebar Desktop uniquement */}
        <div className="hidden lg:block w-64 bg-slate-50/80 backdrop-blur-16 border-r border-slate-400/20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <img src={logoImage} alt="Avyento" className="h-8 w-auto" />
              <h2 className="text-xl font-bold text-gray-900">Avyento</h2>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setLocation('/dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-16 border border-slate-200 hover:bg-white transition-colors text-left"
              >
                <Home className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setLocation('/planning')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-16 border border-slate-200 hover:bg-white transition-colors text-left"
              >
                <Calendar className="w-5 h-5" />
                Planning
              </button>
              <button
                onClick={() => setLocation('/clients')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-16 border border-slate-200 hover:bg-white transition-colors text-left"
              >
                <Users className="w-5 h-5" />
                Clients
              </button>
              <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-100/80 backdrop-blur-16 border border-violet-200 text-left">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                <span className="text-violet-900 font-medium">Analytics</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          {/* Header Mobile */}
          <div className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-lg">
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
              <div className="flex items-center space-x-3">
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 shadow-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Pro
                </Badge>
              </div>
            </div>
          </div>

          {/* Header Desktop */}
          <div className="hidden lg:block p-6 border-b border-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Client IA</h1>
                <p className="text-gray-600">Intelligence artificielle pour analyser et fidéliser vos clients</p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 shadow-sm">
                <Crown className="w-4 h-4 mr-2" />
                Premium Pro
              </Badge>
            </div>
          </div>

          {/* Contenu principal avec tabs */}
          <div className="flex-1 p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-6 lg:mb-8 bg-white/50 backdrop-blur-lg border border-white/20">
                <TabsTrigger value="real-data" className="data-[state=active]:bg-white/80 text-xs sm:text-sm px-2 py-2">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Données Réelles</span>
                  <span className="sm:hidden">Données</span>
                </TabsTrigger>
                <TabsTrigger value="single-analysis" className="data-[state=active]:bg-white/80 text-xs sm:text-sm px-2 py-2">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Analyse Individuelle</span>
                  <span className="sm:hidden">Analyse</span>
                </TabsTrigger>
                <TabsTrigger value="examples" className="data-[state=active]:bg-white/80 text-xs sm:text-sm px-2 py-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Cas d'Exemples</span>
                  <span className="sm:hidden">Exemples</span>
                </TabsTrigger>
              </TabsList>

              {/* Onglet Données réelles */}
              <TabsContent value="real-data" className="space-y-4 lg:space-y-6">
                <div className="text-center mb-6 lg:mb-8">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Analyse de Votre Clientèle Réelle</h2>
                  <p className="text-sm lg:text-base text-gray-600 px-2">L'IA analyse automatiquement tous vos clients pour identifier les risques et optimiser la rétention</p>
                </div>

                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
                  <CardContent className="p-4 lg:p-8 text-center">
                    <Button
                      onClick={handleAnalyzeRealClients}
                      disabled={isAnalyzing}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 animate-spin" />
                          <span className="text-sm lg:text-base">Analyse en cours...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                          <span className="text-sm lg:text-base">Lancer l'Analyse IA</span>
                        </>
                      )}
                    </Button>
                    <p className="text-purple-700 mt-4 text-xs lg:text-sm px-2">
                      Analyse complète de votre base client avec recommandations personnalisées
                    </p>
                  </CardContent>
                </Card>

                {/* Résultats de l'analyse réelle */}
                {realDataAnalysis && (
                  <div className="space-y-6">
                    {/* Résumé global */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                          Résumé Global
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                          <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
                            <div className="text-lg lg:text-2xl font-bold text-blue-600">{realDataAnalysis.report.resume.total_clients}</div>
                            <div className="text-xs lg:text-sm text-blue-700">Total clients</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 bg-red-50 rounded-lg">
                            <div className="text-lg lg:text-2xl font-bold text-red-600">{realDataAnalysis.report.resume.clients_a_risque}</div>
                            <div className="text-xs lg:text-sm text-red-700">Clients à risque</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 bg-yellow-50 rounded-lg">
                            <div className="text-lg lg:text-2xl font-bold text-yellow-600">{realDataAnalysis.report.resume.taux_annulation_moyen}%</div>
                            <div className="text-xs lg:text-sm text-yellow-700">Taux annulation</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 bg-green-50 rounded-lg">
                            <div className="text-lg lg:text-2xl font-bold text-green-600">{realDataAnalysis.report.resume.probabilite_conversion_moyenne}%</div>
                            <div className="text-xs lg:text-sm text-green-700">Conversion</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions prioritaires */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="w-5 h-5 mr-2 text-red-600" />
                          Actions Prioritaires
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {realDataAnalysis.report.actions_prioritaires.map((action, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 border rounded-lg space-y-2 sm:space-y-0">
                              <div className="flex-1">
                                <div className="font-medium text-sm lg:text-base">{action.client}</div>
                                <div className="text-xs lg:text-sm text-gray-600 mt-1">{action.action_immediate}</div>
                              </div>
                              <Badge className={`${getRiskColor(action.niveau.toLowerCase())} text-xs whitespace-nowrap`}>
                                {action.niveau}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Insights détaillés */}
                    <div className="space-y-4">
                      <h3 className="text-lg lg:text-xl font-bold">Analyses Détaillées par Client</h3>
                      {realDataAnalysis.insights.map((insight, index) => (
                        <Card key={index} className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                              <h4 className="text-base lg:text-lg font-bold">{insight.client.nom}</h4>
                              <Badge className={`${getRiskColor(insight.niveau_risque)} text-xs w-fit`}>
                                {getRiskIcon(insight.niveau_risque)}
                                <span className="ml-1 capitalize">{insight.niveau_risque}</span>
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-lg lg:text-xl font-bold">{insight.client.rdv_total}</div>
                                <div className="text-xs text-gray-500">RDV total</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg lg:text-xl font-bold">{insight.client.rdv_annules}</div>
                                <div className="text-xs text-gray-500">RDV annulés</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg lg:text-xl font-bold">{insight.client.taux_annulation}%</div>
                                <div className="text-xs text-gray-500">Taux annulation</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg lg:text-xl font-bold">{insight.probabilite_conversion}%</div>
                                <div className="text-xs text-gray-500">Récupération</div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <h5 className="font-medium mb-2">Stratégie de Rétention</h5>
                              <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded">{insight.strategie_retention}</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Actions Recommandées</h5>
                              <div className="space-y-1">
                                {insight.actions_recommandees.map((action, idx) => (
                                  <div key={idx} className="text-sm bg-blue-50 p-2 rounded flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-2 text-blue-600" />
                                    {action}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Onglet Analyse individuelle */}
              <TabsContent value="single-analysis" className="space-y-4 lg:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-base lg:text-lg">
                      <UserCheck className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
                      Analyseur de Client Individuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom du client</Label>
                        <Input
                          id="nom"
                          placeholder="Ex: Marie Dupont"
                          value={clientData.nom}
                          onChange={(e) => setClientData(prev => ({ ...prev, nom: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profil">Profil client</Label>
                        <Select value={clientData.profil} onValueChange={(value: "nouveau" | "habitué") => setClientData(prev => ({ ...prev, profil: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nouveau">Nouveau client</SelectItem>
                            <SelectItem value="habitué">Client habitué</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rdv_total">Nombre total de RDV</Label>
                        <Input
                          id="rdv_total"
                          type="number"
                          min="0"
                          value={clientData.rdv_total}
                          onChange={(e) => setClientData(prev => ({ ...prev, rdv_total: parseInt(e.target.value) || 0 }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rdv_annules">RDV annulés</Label>
                        <Input
                          id="rdv_annules"
                          type="number"
                          min="0"
                          max={clientData.rdv_total}
                          value={clientData.rdv_annules}
                          onChange={(e) => setClientData(prev => ({ ...prev, rdv_annules: parseInt(e.target.value) || 0 }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dernier_comportement">Dernier comportement</Label>
                        <Select value={clientData.dernier_comportement} onValueChange={(value: "venu" | "annulé" | "pas venu") => setClientData(prev => ({ ...prev, dernier_comportement: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="venu">Client venu</SelectItem>
                            <SelectItem value="annulé">RDV annulé</SelectItem>
                            <SelectItem value="pas venu">Pas venu (no-show)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                      <span className="text-xs lg:text-sm text-gray-600">Taux d'annulation calculé:</span>
                      <Badge variant="outline" className="text-sm lg:text-lg font-bold w-fit">
                        {clientData.rdv_total > 0 ? Math.round((clientData.rdv_annules / clientData.rdv_total) * 100) : 0}%
                      </Badge>
                    </div>

                    <Button 
                      onClick={handleAnalyzeClient}
                      disabled={isLoading || !clientData.nom.trim()}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 py-3"
                    >
                      {isLoading ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-spin" />
                          <span className="text-sm lg:text-base">Analyse en cours...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          <span className="text-sm lg:text-base">Analyser avec l'IA</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Résultats d'analyse */}
                {analysisResult && (
                  <Card className="border-2 border-violet-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="flex items-center text-sm lg:text-base">
                          <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-violet-600" />
                          Analyse: {analysisResult.client.nom}
                        </span>
                        <Badge className={`${getRiskColor(analysisResult.niveau_risque)} border text-xs w-fit`}>
                          {getRiskIcon(analysisResult.niveau_risque)}
                          <span className="ml-1 capitalize">{analysisResult.niveau_risque}</span>
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      {/* Métriques clés */}
                      <div className="grid grid-cols-3 gap-3 lg:gap-4">
                        <Card className="p-3 lg:p-4">
                          <div className="text-center">
                            <div className="text-lg lg:text-2xl font-bold text-red-600">
                              {Math.round((analysisResult.client.probabilite_prochaine_annulation || 0) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Risque annulation</div>
                          </div>
                        </Card>
                        <Card className="p-3 lg:p-4">
                          <div className="text-center">
                            <div className="text-lg lg:text-2xl font-bold text-blue-600">
                              {Math.round((analysisResult.client.score_risque || 0) * 100)}
                            </div>
                            <div className="text-xs text-gray-500">Score risque</div>
                          </div>
                        </Card>
                        <Card className="p-3 lg:p-4">
                          <div className="text-center">
                            <div className="text-lg lg:text-2xl font-bold text-green-600">
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
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Cas d'Étude Clients</h2>
                  <p className="text-sm lg:text-base text-gray-600 px-2">Profils clients types pour tester l'analyse IA</p>
                </div>

                <div className="space-y-4">
                  {exampleCases.map((example, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => loadExampleCase(example)}>
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-3 lg:space-x-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                              {example.nom.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm lg:text-base">{example.nom}</h3>
                              <p className="text-xs lg:text-sm text-gray-600">
                                {example.rdv_total} RDV • {example.rdv_annules} annulés • {example.profil}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <Badge 
                              className={`${getRiskColor(
                                example.taux_annulation >= 60 ? "critique" 
                                : example.taux_annulation >= 40 ? "élevé"
                                : example.taux_annulation >= 20 ? "moyen" : "faible"
                              )} text-xs whitespace-nowrap`}
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

          {/* Footer exact de PublicLanding */}
          <footer className="bg-gray-900 text-white py-8 w-full mt-auto">
            <div className="mx-auto px-6 lg:px-12 xl:px-20">
              <div className="grid md:grid-cols-5 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={logoImage} alt="Avyento Logo" className="h-8 w-auto" />
                    <h3 className="text-xl font-bold">Avyento</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    La solution intelligente qui anticipe, planifie et maximise vos résultats.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Services</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/search')}
                    >
                      Coiffure
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/search')}
                    >
                      Esthétique
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/search')}
                    >
                      Manucure
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/search')}
                    >
                      Massage
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Partenaires</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/devenir-partenaire')}
                    >
                      Devenir partenaire
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/tarifs-pros')}
                    >
                      Tarifs professionnels
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/formation')}
                    >
                      Formation & Support
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/success-stories')}
                    >
                      Témoignages
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/centre-aide')}
                    >
                      Centre d'aide
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/contact')}
                    >
                      Contact
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/cgu')}
                    >
                      CGU
                    </div>
                    <div 
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() => setLocation('/confidentialite')}
                    >
                      Confidentialité
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2024 Avyento. Tous droits réservés.
                </p>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <a href="https://twitter.com/avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://instagram.com/useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.65-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.818.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.369-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://tiktok.com/@avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.197 10.157v4.841c0 2.13-1.72 3.85-3.85 3.85s-3.85-1.72-3.85-3.85 1.72-3.85 3.85-3.85c.212 0 .424.017.63.052v2.08c-.2-.035-.408-.052-.63-.052-1.02 0-1.85.83-1.85 1.85s.83 1.85 1.85 1.85 1.85-.83 1.85-1.85V2h2v2.9c0 1.61 1.31 2.92 2.92 2.92V9.9c-1.61 0-2.92-1.31-2.92-2.92v-.74zm4.18-3.22c-.78-.78-1.26-1.85-1.26-3.04V2h1.89c.13 1.19.61 2.26 1.39 3.04.78.78 1.85 1.26 3.04 1.26v1.89c-1.19-.13-2.26-.61-3.04-1.39z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Navigation mobile uniquement */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0">
        <MobileBottomNav />
      </div>
    </div>
  );
}