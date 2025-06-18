import { useState } from "react";
import { Brain, Calendar, AlertTriangle, TrendingUp, Settings, Zap, Target, Clock, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface AiInsight {
  id: string;
  type: "smart_planning" | "no_show_prediction" | "rebooking" | "promotion";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  action?: string;
  createdAt: Date;
}

interface SmartPlanningOptimization {
  date: string;
  originalSlots: number;
  optimizedSlots: number;
  gapsReduced: number;
  revenueIncrease: number;
}

const mockAiInsights: AiInsight[] = [
  {
    id: "1",
    type: "no_show_prediction",
    title: "Risque de no-show élevé détecté",
    description: "Client Marie Durand - RDV demain 14h - Probabilité no-show: 78%",
    confidence: 0.78,
    impact: "high",
    action: "Acompte de 20€ demandé automatiquement",
    createdAt: new Date()
  },
  {
    id: "2",
    type: "smart_planning",
    title: "Optimisation planning suggérée",
    description: "Réorganisation de 3 créneaux pourrait augmenter le CA de 85€",
    confidence: 0.92,
    impact: "medium",
    createdAt: new Date()
  },
  {
    id: "3",
    type: "rebooking",
    title: "Client prêt pour rebooking",
    description: "Sophie Martin - Dernière visite il y a 6 semaines - Score fidélité: 95%",
    confidence: 0.85,
    impact: "medium",
    action: "SMS de rebooking envoyé",
    createdAt: new Date()
  },
  {
    id: "4",
    type: "promotion",
    title: "Promo recommandée pour nouveaux clients",
    description: "Réduction 15% sur premier RDV - Taux conversion estimé: 34%",
    confidence: 0.67,
    impact: "high",
    createdAt: new Date()
  }
];

const mockOptimizations: SmartPlanningOptimization[] = [
  { date: "2025-06-18", originalSlots: 8, optimizedSlots: 10, gapsReduced: 2, revenueIncrease: 120 },
  { date: "2025-06-17", originalSlots: 6, optimizedSlots: 8, gapsReduced: 1, revenueIncrease: 85 },
  { date: "2025-06-16", originalSlots: 9, optimizedSlots: 11, gapsReduced: 3, revenueIncrease: 180 },
];

export default function AIAutomation() {
  const [aiSettings, setAiSettings] = useState({
    smartPlanningEnabled: true,
    noShowPredictionEnabled: true,
    autoRebookingEnabled: true,
    businessCopilotEnabled: true,
    noShowThreshold: 0.3,
    rebookingDaysAdvance: 7
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "smart_planning": return <Calendar className="h-4 w-4" />;
      case "no_show_prediction": return <AlertTriangle className="h-4 w-4" />;
      case "rebooking": return <Users className="h-4 w-4" />;
      case "promotion": return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="h-8 w-8 text-pink-500" />
              IA & Automatisation
            </h1>
            <p className="text-gray-600 mt-1">Intelligence artificielle au service de votre salon</p>
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Settings className="h-4 w-4 mr-2" />
            Configurer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Optimisations aujourd'hui</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">CA additionnel (7j)</p>
                  <p className="text-2xl font-bold">385€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">No-shows évités</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients recontactés</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">Insights IA</TabsTrigger>
            <TabsTrigger value="planning">Smart Planning</TabsTrigger>
            <TabsTrigger value="predictions">Prédictions</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Insights IA */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Recommandations IA en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAiInsights.map((insight) => (
                  <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          {getTypeIcon(insight.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact === "high" ? "Priorité haute" : 
                         insight.impact === "medium" ? "Priorité moyenne" : "Priorité basse"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Confiance:</span>
                          <Progress value={insight.confidence * 100} className="w-20" />
                          <span className="text-sm font-medium">{Math.round(insight.confidence * 100)}%</span>
                        </div>
                        {insight.action && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✓ {insight.action}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ignorer</Button>
                        <Button size="sm" className="bg-pink-500 hover:bg-pink-600">Appliquer</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Planning */}
          <TabsContent value="planning" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimisations récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOptimizations.map((opt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{opt.date}</p>
                          <p className="text-sm text-gray-600">
                            {opt.originalSlots} → {opt.optimizedSlots} créneaux
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600 font-medium">+{opt.revenueIncrease}€</p>
                          <p className="text-sm text-gray-600">{opt.gapsReduced} trous comblés</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Algorithme d'optimisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Comment ça fonctionne ?</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Analyse des patterns de réservation</li>
                      <li>• Détection des créneaux sous-optimisés</li>
                      <li>• Proposition de réorganisation intelligente</li>
                      <li>• Maximisation du taux d'occupation</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efficacité de l'algorithme</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Augmentation moyenne du CA</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                    <Progress value={75} className="bg-green-100" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Prédictions */}
          <TabsContent value="predictions" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Prédiction No-Show
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Facteurs de risque détectés</h4>
                    <div className="space-y-2 text-sm text-red-800">
                      <div className="flex justify-between">
                        <span>Historique no-show client</span>
                        <span className="font-medium">+45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Météo défavorable</span>
                        <span className="font-medium">+15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jour de la semaine</span>
                        <span className="font-medium">+8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Réservation de dernière minute</span>
                        <span className="font-medium">+12%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Actions automatiques</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>SMS de rappel 24h avant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Demande d'acompte si risque > 30%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Double confirmation si risque > 60%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Promotions suggérées</h4>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-purple-400 pl-3">
                        <p className="font-medium">Offre "Retour Client"</p>
                        <p className="text-purple-700">-20% pour clients inactifs depuis 2 mois</p>
                        <p className="text-xs text-purple-600">Taux conversion estimé: 28%</p>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-3">
                        <p className="font-medium">Package "Détente"</p>
                        <p className="text-blue-700">3 soins pour le prix de 2</p>
                        <p className="text-xs text-blue-600">Impact CA estimé: +15%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Insights comportementaux</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• 68% de vos clients préfèrent les créneaux 14h-17h</p>
                      <p>• Les mardis génèrent 23% plus de CA que la moyenne</p>
                      <p>• 5 clients à risque de départ détectés</p>
                      <p>• Potentiel de 12 nouveaux clients via recommandations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Paramètres */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l'IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Smart Planning</h3>
                      <p className="text-sm text-gray-600">Optimisation automatique des créneaux</p>
                    </div>
                    <Switch 
                      checked={aiSettings.smartPlanningEnabled}
                      onCheckedChange={(checked) => 
                        setAiSettings(prev => ({ ...prev, smartPlanningEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Prédiction No-Show</h3>
                      <p className="text-sm text-gray-600">Détection des risques d'absence</p>
                    </div>
                    <Switch 
                      checked={aiSettings.noShowPredictionEnabled}
                      onCheckedChange={(checked) => 
                        setAiSettings(prev => ({ ...prev, noShowPredictionEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Rebooking Automatique</h3>
                      <p className="text-sm text-gray-600">Relance intelligente des clients</p>
                    </div>
                    <Switch 
                      checked={aiSettings.autoRebookingEnabled}
                      onCheckedChange={(checked) => 
                        setAiSettings(prev => ({ ...prev, autoRebookingEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Business Copilot</h3>
                      <p className="text-sm text-gray-600">Suggestions de promotions et insights</p>
                    </div>
                    <Switch 
                      checked={aiSettings.businessCopilotEnabled}
                      onCheckedChange={(checked) => 
                        setAiSettings(prev => ({ ...prev, businessCopilotEnabled: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline">Réinitialiser</Button>
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    Sauvegarder les paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}