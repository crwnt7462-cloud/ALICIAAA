import { useState, useRef, useEffect } from "react";
import { Send, Phone, Mail, Clock, MessageCircle, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const supportCategories: SupportCategory[] = [
  {
    id: "booking",
    title: "Gestion des réservations",
    description: "Aide pour la prise de rendez-vous et la gestion du planning",
    icon: MessageCircle
  },
  {
    id: "clients",
    title: "Gestion de la clientèle", 
    description: "Questions sur les fiches clients et l'historique",
    icon: User
  },
  {
    id: "technical",
    title: "Support technique",
    description: "Problèmes techniques et fonctionnalités",
    icon: Bot
  }
];

const botResponses = {
  greeting: "Bonjour ! Je suis votre assistant Support Beauty Pro. Comment puis-je vous aider aujourd'hui ?",
  booking: "Pour la gestion des réservations, vous pouvez :\n• Créer un nouveau rendez-vous depuis l'onglet Réservations\n• Modifier un RDV depuis le Planning\n• Gérer la liste d'attente pour optimiser votre planning",
  clients: "Pour la gestion de vos clients :\n• Ajoutez de nouveaux clients avec leurs informations\n• Consultez l'historique des rendez-vous\n• Gérez les préférences et notes personnelles",
  technical: "Pour le support technique :\n• Vérifiez votre connexion internet\n• Actualisez la page si nécessaire\n• Contactez notre équipe technique via contact@beautypro.fr",
  default: "Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler ou choisir une catégorie d'aide ?"
};

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: botResponses.greeting,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simuler une réponse du bot
    setTimeout(() => {
      const botResponse = getBotResponse(newMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("réservation") || lowerMessage.includes("rendez-vous") || lowerMessage.includes("planning")) {
      return botResponses.booking;
    }
    if (lowerMessage.includes("client") || lowerMessage.includes("fiche") || lowerMessage.includes("historique")) {
      return botResponses.clients;
    }
    if (lowerMessage.includes("technique") || lowerMessage.includes("problème") || lowerMessage.includes("bug")) {
      return botResponses.technical;
    }
    
    return botResponses.default;
  };

  const handleCategoryClick = (categoryId: string) => {
    const response = botResponses[categoryId as keyof typeof botResponses] || botResponses.default;
    const botMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support & Aide</h1>
          <p className="text-gray-600">Notre équipe est là pour vous accompagner</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Catégories d'aide */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Catégories d'aide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">{category.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Contact direct */}
            <Card>
              <CardHeader>
                <CardTitle>Contact direct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <Phone className="h-4 w-4 text-pink-500" />
                  <div>
                    <p className="font-medium">01 23 45 67 89</p>
                    <p className="text-sm text-gray-600">Lun-Ven 9h-18h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <Mail className="h-4 w-4 text-pink-500" />
                  <div>
                    <p className="font-medium">support@beautypro.fr</p>
                    <p className="text-sm text-gray-600">Réponse sous 24h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <Clock className="h-4 w-4 text-pink-500" />
                  <div>
                    <p className="font-medium">Statut du service</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Opérationnel
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-pink-500" />
                  Assistant Support
                  <Badge variant="secondary" className="ml-auto">En ligne</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[480px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        {message.isBot && (
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-pink-600" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-pink-500 text-white'
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isBot ? 'text-gray-500' : 'text-pink-100'
                          }`}>
                            {message.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!message.isBot && (
                          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-pink-600" />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre question..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="bg-pink-500 hover:bg-pink-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}