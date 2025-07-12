import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Settings, 
  Star, 
  QrCode, 
  Brain, 
  MessageSquare, 
  Gift, 
  TrendingUp,
  Bell,
  Shield,
  Palette,
  Smartphone,
  Globe,
  Calendar,
  Camera,
  ChevronRight,
  Zap,
  Crown,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const More = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([
    { type: 'bot', message: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?' }
  ]);

  const mainFeatures = [
    {
      title: "Clients",
      description: "Gestion de la clientèle",
      icon: Users,
      path: "/clients",
      color: "from-blue-500 to-cyan-500",
      badge: null
    },
    {
      title: "Services",
      description: "Configuration des prestations",
      icon: Settings,
      path: "/services",
      color: "from-gray-500 to-slate-500",
      badge: null
    },
    {
      title: "Avis Clients",
      description: "Gestion des commentaires",
      icon: Star,
      path: "/reviews",
      color: "from-yellow-500 to-orange-500",
      badge: "Nouveau"
    },
    {
      title: "QR Booking",
      description: "Codes QR pour rendez-vous",
      icon: QrCode,
      path: "/qr-booking",
      color: "from-purple-500 to-pink-500",
      badge: "Pro"
    }
  ];

  const smartFeatures = [
    {
      title: "IA Automation",
      description: "Intelligence artificielle avancée",
      icon: Brain,
      path: "/ai",
      color: "from-indigo-500 to-purple-500",
      badge: "IA"
    },
    {
      title: "Assistant Chat",
      description: "Support intelligent 24/7",
      icon: MessageSquare,
      action: () => setIsChatOpen(true),
      color: "from-green-500 to-teal-500",
      badge: "Live"
    },
    {
      title: "Programme Fidélité",
      description: "Récompenses automatiques",
      icon: Gift,
      path: "/loyalty",
      color: "from-pink-500 to-rose-500",
      badge: "Beta"
    },
    {
      title: "Notifications",
      description: "Alertes et rappels",
      icon: Bell,
      path: "/notifications",
      color: "from-orange-500 to-red-500",
      badge: null
    }
  ];

  const advancedFeatures = [
    {
      title: "Thèmes & Design",
      description: "Personnalisation visuelle",
      icon: Palette,
      path: "/themes",
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "App Mobile",
      description: "Application dédiée",
      icon: Smartphone,
      path: "/mobile-app",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Site Web",
      description: "Présence en ligne",
      icon: Globe,
      path: "/website",
      color: "from-emerald-500 to-green-500"
    },
    {
      title: "Sécurité",
      description: "Protection des données",
      icon: Shield,
      path: "/security",
      color: "from-red-500 to-pink-500"
    }
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newHistory = [
        ...chatHistory,
        { type: 'user' as const, message: chatMessage }
      ];
      
      // Simulation de réponse IA
      setTimeout(() => {
        let botResponse = "Je comprends votre demande. ";
        
        if (chatMessage.toLowerCase().includes('planning')) {
          botResponse += "Pour optimiser votre planning, je recommande de regrouper les services similaires et de prévoir 15 minutes entre chaque rendez-vous.";
        } else if (chatMessage.toLowerCase().includes('client')) {
          botResponse += "Pour améliorer la satisfaction client, pensez à envoyer des rappels 24h avant et proposez un programme de fidélité.";
        } else if (chatMessage.toLowerCase().includes('revenus') || chatMessage.toLowerCase().includes('chiffre')) {
          botResponse += "Vos analytics montrent une croissance de 15% ce mois. Continuez avec les promotions ciblées !";
        } else {
          botResponse += "Puis-je vous aider avec votre planning, vos clients, ou vos analytics ?";
        }
        
        setChatHistory(prev => [...prev, { type: 'bot', message: botResponse }]);
      }, 1000);
      
      setChatHistory(newHistory);
      setChatMessage("");
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-violet-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Menu Principal</h1>
          <p className="text-gray-600 text-sm mt-1">
            Accédez à toutes vos fonctionnalités
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
            Pro
          </Badge>
        </div>
      </div>

      {/* Fonctionnalités principales */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Fonctionnalités principales</h2>
        <div className="grid grid-cols-2 gap-4">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleNavigation(feature.path)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center relative`}>
                      <Icon className="w-6 h-6 text-white" />
                      {feature.badge && (
                        <Badge className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1 py-0">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Fonctionnalités intelligentes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Intelligence & Automation</h2>
        <div className="space-y-3">
          {smartFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => feature.action ? feature.action() : handleNavigation(feature.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {feature.badge && (
                        <Badge className={`text-xs ${
                          feature.badge === 'IA' ? 'bg-purple-100 text-purple-800' :
                          feature.badge === 'Live' ? 'bg-green-100 text-green-800' :
                          feature.badge === 'Beta' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {feature.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Fonctionnalités avancées */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Fonctionnalités avancées</h2>
        <div className="grid grid-cols-2 gap-3">
          {advancedFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="border-0 shadow-sm bg-white/60 backdrop-blur-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  toast({
                    title: "Bientôt disponible",
                    description: `${feature.title} sera disponible prochainement`,
                  });
                }}
              >
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-xs">{feature.title}</h3>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chat Assistant IA */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span>Assistant IA</span>
              <Badge className="bg-green-100 text-green-800 text-xs">En ligne</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            <div className="flex-1 space-y-3 overflow-y-auto p-2 bg-gray-50 rounded-lg min-h-48">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.type === 'user' 
                        ? 'bg-violet-500 text-white' 
                        : 'bg-white text-gray-900 border'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Tapez votre message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                className="flex-1"
              />
              <Button 
                onClick={sendChatMessage}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-teal-500"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default More;