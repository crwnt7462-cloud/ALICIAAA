import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIService {
  id: string;
  name: string;
  description: string;
  category: 'optimisation' | 'marketing' | 'description' | 'promotion';
  isActive: boolean;
}

export default function AIProComplete() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'services' | 'suggestions'>('chat');
  const { toast } = useToast();

  const aiServices: AIService[] = [
    {
      id: 'optimize-description',
      name: 'Optimiser la description du salon',
      description: 'Améliore automatiquement la description de votre salon pour attirer plus de clients',
      category: 'description',
      isActive: true
    },
    {
      id: 'generate-promotion',
      name: 'Générer des promotions',
      description: 'Crée des offres promotionnelles personnalisées selon vos services',
      category: 'promotion',
      isActive: true
    },
    {
      id: 'optimize-tags',
      name: 'Optimiser les tags',
      description: 'Suggère des mots-clés pertinents pour améliorer votre visibilité',
      category: 'optimisation',
      isActive: true
    },
    {
      id: 'marketing-messages',
      name: 'Messages marketing',
      description: 'Génère des messages personnalisés pour vos campagnes marketing',
      category: 'marketing',
      isActive: true
    }
  ];

  const suggestions = [
    {
      title: "Optimisation planning",
      description: "Analyser votre planning pour identifier les créneaux optimaux",
      action: "Analyser mon planning"
    },
    {
      title: "Description salon",
      description: "Améliorer la description de votre salon pour attirer plus de clients",
      action: "Optimiser ma description"
    },
    {
      title: "Promo personnalisée",
      description: "Créer une promotion ciblée selon votre clientèle",
      action: "Créer une promotion"
    },
    {
      title: "Messages clients",
      description: "Générer des messages de rappel et de fidélisation",
      action: "Générer des messages"
    }
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Simulation d'une réponse de l'IA basée sur le message
      const response = await generateAIResponse(userMessage.content);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulation de réponses intelligentes basées sur les mots-clés
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('description') || lowerInput.includes('présent')) {
      return `Voici une description optimisée pour votre salon :

"🌟 **Mon Salon de Beauté** - Votre oasis de beauté au cœur de Paris

Découvrez une expérience beauté unique dans notre salon premium. Nos experts certifiés vous offrent des prestations haut de gamme dans un cadre moderne et relaxant.

✨ **Nos spécialités :**
• Coiffure tendance et soins capillaires
• Soins visage personnalisés 
• Manucure & pédicure professionnelle
• Maquillage événementiel

🎯 **Pourquoi nous choisir :**
• Équipe d'experts qualifiés
• Produits professionnels premium
• Ambiance détendue et chaleureuse
• Résultats garantis satisfaction

📍 Situé dans le 1er arrondissement, facilement accessible
⏰ Ouvert 7j/7 sur rendez-vous

Prenez rendez-vous dès maintenant et offrez-vous le meilleur de la beauté !"

Cette description met en avant vos points forts et incite à l'action. Souhaitez-vous que je l'adapte davantage ?`;
    }
    
    if (lowerInput.includes('promotion') || lowerInput.includes('offre')) {
      return `🎁 **Voici 3 promotions personnalisées pour votre salon :**

**1. Offre Découverte Nouvelle Cliente**
• -30% sur la première prestation
• Valable pour toute nouvelle cliente
• Code : BIENVENUE30
• Durée : 1 mois

**2. Package Beauté Complète**
• Coiffure + Soin visage + Manucure : 120€ TTC au lieu de 150€ TTC
• Économie de 30€ TTC
• Parfait pour les occasions spéciales

**3. Abonnement Fidélité**
• 5 prestations achetées = 1 offerte
• Carte de fidélité digitale
• Réductions progressives selon le nombre de visites

Ces promotions sont conçues pour attirer de nouvelles clientes et fidéliser les existantes. Laquelle vous intéresse le plus ?`;
    }
    
    if (lowerInput.includes('planning') || lowerInput.includes('créneaux')) {
      return `📊 **Analyse de votre planning :**

**Observations :**
• Taux d'occupation optimal : 14h-17h (85%)
• Créneaux sous-exploités : 9h-11h (45%)
• Forte demande : vendredi-samedi (90%)

**Recommandations IA :**

1. **Optimiser les matinées** : Proposer des promotions "Matinale" (-15% avant 11h)

2. **Équilibrer la semaine** : Offres spéciales mardi-jeudi pour répartir l'affluence

3. **Services rapides** : Créer des créneaux express (30min) pour optimiser les temps morts

4. **Réservation intelligente** : Proposer automatiquement les créneaux libres proches

**Impact estimé :** +20% de CA mensuel avec une meilleure répartition

Souhaitez-vous que je génère des messages automatiques pour promouvoir ces créneaux ?`;
    }
    
    if (lowerInput.includes('tag') || lowerInput.includes('mot')) {
      return `🏷️ **Tags optimisés pour votre salon :**

**Tags SEO principaux :**
• salon-coiffure-paris
• institut-beaute-premium  
• coiffeur-expert-paris-1er
• soins-visage-professionnel
• manucure-gel-paris

**Tags clientèle :**
• #BeautéParisienne
• #CoiffureHauteCouture
• #SoinsPremium
• #ExpertBeauté
• #MonSalonBeaute

**Tags services :**
• balayage-professionnel
• lissage-bresilien
• soin-anti-age
• maquillage-mariage
• onglerie-gel

**Tags géolocalisés :**
• beauté-chatelet
• salon-louvre
• coiffeur-rivoli
• institut-tuileries

Ces tags amélioreront votre visibilité en ligne de 40%. Voulez-vous que j'en génère d'autres pour des services spécifiques ?`;
    }

    // Réponse générale
    return `Je comprends votre demande. En tant qu'IA spécialisée dans les salons de beauté, je peux vous aider avec :

• **Optimisation** : Planning, descriptions, tarifs
• **Marketing** : Promotions, campagnes, messages clients  
• **Gestion** : Analyse de performances, conseils stratégiques
• **Contenu** : Descriptions, tags, posts réseaux sociaux

Pouvez-vous me donner plus de détails sur ce que vous souhaitez améliorer ? Je pourrai ainsi vous fournir des conseils plus précis et personnalisés.`;
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
    handleSendMessage();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optimisation': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'description': return 'bg-purple-100 text-purple-800';
      case 'promotion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">IA Pro - Assistant Intelligent</h1>
        <p className="text-gray-600">
          Votre assistant IA pour optimiser votre salon et améliorer vos performances.
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          onClick={() => setActiveTab('chat')}
          className="rounded-xl"
        >
          Chat IA
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'outline'}
          onClick={() => setActiveTab('services')}
          className="rounded-xl"
        >
          Services IA
        </Button>
        <Button
          variant={activeTab === 'suggestions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('suggestions')}
          className="rounded-xl"
        >
          Suggestions
        </Button>
      </div>

      {/* Onglet Chat */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de chat */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 rounded-xl shadow-sm h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Assistant IA</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-xl ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Posez votre question à l'IA..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="rounded-xl"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                  >
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div>
            <Card className="border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 border border-gray-200 rounded-xl"
                    onClick={() => handleQuickAction(suggestion.action)}
                  >
                    <div>
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Onglet Services IA */}
      {activeTab === 'services' && (
        <div className="grid gap-6 md:grid-cols-2">
          {aiServices.map((service) => (
            <Card key={service.id} className="border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge className={getCategoryColor(service.category)}>
                    {service.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl"
                  onClick={() => {
                    setActiveTab('chat');
                    handleQuickAction(service.name);
                  }}
                >
                  Utiliser ce service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Onglet Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Recommandations IA Personnalisées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Optimisation du Planning</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Vos créneaux 9h-11h sont sous-exploités (45% d'occupation). 
                  Une promotion "Matinale" pourrait augmenter votre CA de 15%.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                  Créer la promotion
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📊 Performance des Services</h4>
                <p className="text-green-800 text-sm mb-3">
                  Vos soins visage génèrent le meilleur taux de satisfaction (4.8/5). 
                  Mettre ce service en avant pourrait attirer plus de clientes.
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl">
                  Optimiser la visibilité
                </Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">🏷️ Amélioration SEO</h4>
                <p className="text-purple-800 text-sm mb-3">
                  Ajouter 5 mots-clés ciblés pourrait améliorer votre visibilité en ligne de 30%.
                </p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                  Générer les tags
                </Button>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">💌 Fidélisation Client</h4>
                <p className="text-orange-800 text-sm mb-3">
                  47% de vos clientes n'ont pas pris de RDV depuis 3 mois. 
                  Une campagne de rappel personnalisée pourrait les reconquérir.
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 rounded-xl">
                  Créer la campagne
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}