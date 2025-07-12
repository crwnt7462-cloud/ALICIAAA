import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Brain, 
  Camera, 
  Smartphone, 
  QrCode, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Gift,
  MapPin,
  Clock,
  Bell,
  Palette,
  Sparkles,
  Crown,
  Heart,
  Target,
  Megaphone
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SmartFeatures = () => {
  const [features, setFeatures] = useState({
    virtualConsultation: true,
    smartBooking: true,
    loyaltyProgram: true,
    socialIntegration: false,
    aiSkinAnalysis: false,
    weatherIntegration: false,
    voiceBooking: false,
    augmentedReality: false,
    blockchainLoyalty: false,
    metaverseShowroom: false
  });

  const revolutionaryFeatures = [
    {
      id: "virtualConsultation",
      title: "Consultation Virtuelle 3D",
      description: "Consultations avec avatar 3D et simulation de coiffures en temps réel",
      icon: Camera,
      category: "Innovation",
      impact: "Révolutionnaire",
      color: "from-blue-500 to-cyan-500",
      benefits: [
        "Consultations à distance avec simulation 3D",
        "Essayage virtuel de coupes et couleurs",
        "Analyses morphologiques automatiques",
        "Recommandations personnalisées IA"
      ]
    },
    {
      id: "smartBooking",
      title: "Réservation Intelligente",
      description: "IA prédictive pour optimisation automatique des créneaux",
      icon: Brain,
      category: "IA",
      impact: "Transformateur",
      color: "from-purple-500 to-pink-500",
      benefits: [
        "Prédiction des annulations",
        "Optimisation automatique du planning",
        "Suggestions de créneaux alternatifs",
        "Gestion intelligente des listes d'attente"
      ]
    },
    {
      id: "loyaltyProgram",
      title: "Programme Fidélité Gamifié",
      description: "Système de récompenses avec NFTs et expérience immersive",
      icon: Crown,
      category: "Engagement",
      impact: "Innovant",
      color: "from-yellow-500 to-orange-500",
      benefits: [
        "Points et badges numériques",
        "Défis mensuels personnalisés",
        "Récompenses exclusives et expériences VIP",
        "Parrainage avec bonus multiplicateurs"
      ]
    },
    {
      id: "socialIntegration",
      title: "Intégration Réseaux Sociaux",
      description: "Partage automatique, influenceurs et marketing viral",
      icon: Megaphone,
      category: "Marketing",
      impact: "Commercial",
      color: "from-green-500 to-teal-500",
      benefits: [
        "Publication automatique des transformations",
        "Programme d'ambassadeurs clients",
        "Concours et challenges viraux",
        "Analytics des tendances beauté"
      ]
    },
    {
      id: "aiSkinAnalysis",
      title: "Analyse Cutanée IA",
      description: "Diagnostic de peau par intelligence artificielle avancée",
      icon: Sparkles,
      category: "Diagnostic",
      impact: "Scientifique",
      color: "from-rose-500 to-pink-500",
      benefits: [
        "Analyse complète type de peau",
        "Détection problèmes cutanés",
        "Recommandations soins personnalisés",
        "Suivi évolution dans le temps"
      ]
    },
    {
      id: "weatherIntegration",
      title: "Adaptation Météo Intelligente",
      description: "Conseils beauté adaptatifs selon conditions météorologiques",
      icon: MapPin,
      category: "Personnalisation",
      impact: "Pratique",
      color: "from-indigo-500 to-blue-500",
      benefits: [
        "Recommandations coiffures selon météo",
        "Adaptation produits à l'humidité",
        "Conseils protection solaire",
        "Alertes pollution air"
      ]
    },
    {
      id: "voiceBooking",
      title: "Réservation Vocale",
      description: "Assistant vocal pour prise de rendez-vous mains libres",
      icon: MessageSquare,
      category: "Accessibilité",
      impact: "Pratique",
      color: "from-violet-500 to-purple-500",
      benefits: [
        "Commandes vocales naturelles",
        "Support multilingue",
        "Intégration Alexa/Google",
        "Accessibilité renforcée"
      ]
    },
    {
      id: "augmentedReality",
      title: "Réalité Augmentée",
      description: "Essayage virtuel en temps réel avec AR mobile",
      icon: Smartphone,
      category: "Technologie",
      impact: "Futuriste",
      color: "from-cyan-500 to-blue-500",
      benefits: [
        "Essayage coiffures en temps réel",
        "Simulation maquillage AR",
        "Partage instantané réseaux sociaux",
        "Catalogue virtuel interactif"
      ]
    },
    {
      id: "blockchainLoyalty",
      title: "Fidélité Blockchain",
      description: "Tokens de fidélité transférables et marketplace beauté",
      icon: Gift,
      category: "Crypto",
      impact: "Révolutionnaire",
      color: "from-emerald-500 to-green-500",
      benefits: [
        "Tokens fidélité échangeables",
        "NFTs transformations uniques",
        "Marketplace beauté décentralisé",
        "Récompenses cross-salons"
      ]
    },
    {
      id: "metaverseShowroom",
      title: "Salon Métaverse",
      description: "Showroom virtuel immersif et consultations VR",
      icon: Zap,
      category: "Métaverse",
      impact: "Futuriste",
      color: "from-pink-500 to-rose-500",
      benefits: [
        "Salon virtuel 3D immersif",
        "Consultations en réalité virtuelle",
        "Événements beauté virtuels",
        "Communauté mondiale clients"
      ]
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Révolutionnaire": return "bg-red-100 text-red-800";
      case "Transformateur": return "bg-purple-100 text-purple-800";
      case "Futuriste": return "bg-pink-100 text-pink-800";
      case "Innovant": return "bg-blue-100 text-blue-800";
      case "Commercial": return "bg-green-100 text-green-800";
      case "Scientifique": return "bg-indigo-100 text-indigo-800";
      case "Pratique": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId as keyof typeof prev]
    }));
  };

  const activeFeatures = revolutionaryFeatures.filter(f => features[f.id as keyof typeof features]);
  const potentialRevenue = activeFeatures.reduce((sum, f) => {
    const impact = f.impact;
    const multiplier = impact === "Révolutionnaire" ? 3000 : 
                     impact === "Transformateur" ? 2000 :
                     impact === "Futuriste" ? 2500 :
                     impact === "Innovant" ? 1500 :
                     impact === "Commercial" ? 1800 :
                     impact === "Scientifique" ? 1200 : 800;
    return sum + multiplier;
  }, 0);

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-violet-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fonctionnalités Révolutionnaires</h1>
          <p className="text-gray-600 text-sm mt-1">
            Transformez votre salon avec les technologies les plus avancées
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Potentiel de revenus mensuel</p>
          <p className="text-2xl font-bold text-green-600">+{potentialRevenue.toLocaleString()}€</p>
        </div>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="impact">Impact Business</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* Active Features Summary */}
          {activeFeatures.length > 0 && (
            <Card className="border-0 shadow-md bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Fonctionnalités Activées ({activeFeatures.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {activeFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
                      <feature.icon className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {revolutionaryFeatures.map((feature) => {
              const Icon = feature.icon;
              const isActive = features[feature.id as keyof typeof features];
              
              return (
                <Card 
                  key={feature.id} 
                  className={`border-0 shadow-md rounded-xl transition-all duration-300 ${
                    isActive ? 'ring-2 ring-violet-500 shadow-lg' : 'hover:shadow-lg'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {feature.category}
                            </Badge>
                            <Badge className={`text-xs ${getImpactColor(feature.impact)}`}>
                              {feature.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleFeature(feature.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Avantages clés:</h4>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <span className="w-1 h-1 bg-violet-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <div className="space-y-6">
            {["Phase 1: Fondations", "Phase 2: Intelligence", "Phase 3: Immersion"].map((phase, phaseIndex) => (
              <Card key={phase} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">{phase}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revolutionaryFeatures
                      .filter((_, index) => Math.floor(index / 3) === phaseIndex)
                      .map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <feature.icon className="w-5 h-5 text-gray-600" />
                            <div>
                              <h4 className="font-medium">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                          <Badge className={getImpactColor(feature.impact)}>
                            {feature.impact}
                          </Badge>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">Impact Financier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Revenus additionnels/mois</span>
                    <span className="font-bold text-green-600">+{potentialRevenue.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Nouveaux clients/mois</span>
                    <span className="font-bold text-blue-600">+{Math.round(activeFeatures.length * 15)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Rétention clientèle</span>
                    <span className="font-bold text-purple-600">+{Math.round(activeFeatures.length * 8)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Efficacité opérationnelle</span>
                    <span className="font-bold text-orange-600">+{Math.round(activeFeatures.length * 12)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">Avantage Concurrentiel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg">
                    <h4 className="font-semibold text-violet-900 mb-2">Différenciation Market</h4>
                    <p className="text-sm text-violet-700">
                      Premier salon avec technologies immersives complètes
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Innovation Continue</h4>
                    <p className="text-sm text-blue-700">
                      Positionnement leader technologique régional
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Écosystème Intégré</h4>
                    <p className="text-sm text-emerald-700">
                      Expérience client 360° unique sur le marché
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartFeatures;