import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ProHeader } from '@/components/ProHeader';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Crown, 
  Database, 
  Brain, 
  Star, 
  Zap, 
  RefreshCw,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface ClientProfile {
  nom: string;
  rdv_total: number;
  rdv_annules: number;
  dernier_comportement: string;
  profil: string;
  taux_annulation: number;
}

interface AnalysisResult {
  client: ClientProfile;
  niveau_risque: string;
  strategie_retention: string;
  actions_recommandees: string[];
}

export default function IAClientAnalytics() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("real-data");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [realDataAnalysis, setRealDataAnalysis] = useState<any>(null);
  const [clientData, setClientData] = useState<ClientProfile>({
    nom: '',
    rdv_total: 0,
    rdv_annules: 0,
    dernier_comportement: '',
    profil: '',
    taux_annulation: 0
  });

  const handleAnalyzeRealClients = async () => {
    setIsAnalyzing(true);
    // Simulation d'analyse
    setTimeout(() => {
      setRealDataAnalysis({
        report: {
          resume: {
            total_clients: 156,
            clients_a_risque: 23
          }
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleAnalyzeClient = async () => {
    setIsLoading(true);
    // Simulation d'analyse
    setTimeout(() => {
      setAnalysisResult({
        client: clientData,
        niveau_risque: clientData.taux_annulation > 50 ? "critique" : clientData.taux_annulation > 30 ? "élevé" : "faible",
        strategie_retention: "Stratégie personnalisée basée sur l'analyse IA",
        actions_recommandees: [
          "Contacter le client sous 24h",
          "Proposer une offre de fidélisation",
          "Programmer un suivi personnalisé"
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "critique": return "bg-red-100 text-red-800 border-red-200";
      case "élevé": return "bg-orange-100 text-orange-800 border-orange-200";
      case "faible": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch(risk) {
      case "critique": return <XCircle className="w-3 h-3" />;
      case "élevé": return <Clock className="w-3 h-3" />;
      case "faible": return <CheckCircle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

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
      <ProHeader currentPage="analytics" />
      <MobileBottomNav userType="pro" />

      <div className="pt-20 md:pt-24 pb-20 md:pb-8">
        <div className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header avec badge Premium */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 shadow-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Pro
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">IA Client Analytics</h1>
              <p className="text-gray-600">Intelligence artificielle pour analyser et fidéliser vos clients</p>
            </div>

            {/* Contenu principal avec tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/50 backdrop-blur-lg border border-white/20">
                <TabsTrigger value="real-data" className="data-[state=active]:bg-white/80">
                  <Database className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Données Réelles</span>
                  <span className="sm:hidden">Données</span>
                </TabsTrigger>
                <TabsTrigger value="single-analysis" className="data-[state=active]:bg-white/80">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Analyse Individuelle</span>
                  <span className="sm:hidden">Analyse</span>
                </TabsTrigger>
                <TabsTrigger value="examples" className="data-[state=active]:bg-white/80">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Cas d'Exemples</span>
                  <span className="sm:hidden">Exemples</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="real-data" className="space-y-6">
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
                  <CardContent className="p-8 text-center">
                    <Button
                      onClick={handleAnalyzeRealClients}
                      disabled={isAnalyzing}
                      size="lg"
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-3" />
                          Lancer l'Analyse IA
                        </>
                      )}
                    </Button>
                    <p className="text-purple-700 mt-4">
                      Analyse complète de votre base client avec recommandations personnalisées
                    </p>
                  </CardContent>
                </Card>

                {realDataAnalysis && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-violet-900">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Résumé Global
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">{realDataAnalysis.report.resume.total_clients}</div>
                            <div className="text-sm text-blue-800">Clients analysés</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-xl">
                            <div className="text-2xl font-bold text-red-600">{realDataAnalysis.report.resume.clients_a_risque}</div>
                            <div className="text-sm text-red-800">Clients à risque</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="single-analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyser un client spécifique</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Nom du client"
                      value={clientData.nom}
                      onChange={(e) => setClientData(prev => ({ ...prev, nom: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="RDV total"
                        value={clientData.rdv_total || ''}
                        onChange={(e) => setClientData(prev => ({ ...prev, rdv_total: parseInt(e.target.value) || 0 }))}
                      />
                      <Input
                        type="number"
                        placeholder="RDV annulés"
                        value={clientData.rdv_annules || ''}
                        onChange={(e) => setClientData(prev => ({ ...prev, rdv_annules: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <Button 
                      onClick={handleAnalyzeClient}
                      disabled={isLoading}
                      className="w-full bg-violet-600 hover:bg-violet-700"
                    >
                      {isLoading ? 'Analyse...' : 'Analyser ce client'}
                    </Button>

                    {analysisResult && (
                      <Card className="mt-6 border-l-4 border-l-violet-500">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">{analysisResult.client.nom}</h3>
                            <Badge className={getRiskColor(analysisResult.niveau_risque)}>
                              {getRiskIcon(analysisResult.niveau_risque)}
                              <span className="ml-1">{analysisResult.niveau_risque}</span>
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <p><strong>Stratégie de rétention:</strong> {analysisResult.strategie_retention}</p>
                            <div>
                              <strong>Actions recommandées:</strong>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {analysisResult.actions_recommandees.map((action, index) => (
                                  <li key={index} className="text-sm">{action}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples" className="space-y-6">
                <div className="grid gap-4">
                  {exampleCases.map((example, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => loadExampleCase(example)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{example.nom}</h3>
                            <p className="text-sm text-gray-600">{example.rdv_total} RDV • {example.taux_annulation}% annulation</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getRiskColor(example.taux_annulation > 50 ? "critique" : example.taux_annulation > 30 ? "élevé" : "faible")}>
                              {example.taux_annulation > 50 ? "Critique" : example.taux_annulation > 30 ? "Élevé" : "Faible"}
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
      </div>
    </div>
  );
}