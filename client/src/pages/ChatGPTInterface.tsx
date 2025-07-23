import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, ArrowLeft, Bot, User, Plus, Archive, Settings,
  MessageSquare, Edit3, Trash2, MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  active: boolean;
}

export default function ChatGPTInterface() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'Stratégies marketing salon', lastMessage: 'Il y a 2h', active: true },
    { id: '2', title: 'Optimisation planning équipe', lastMessage: 'Hier', active: false },
    { id: '3', title: 'Fidélisation clientèle', lastMessage: 'Il y a 3 jours', active: false },
    { id: '4', title: 'Analyse concurrentielle', lastMessage: 'Il y a 1 semaine', active: false }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { message });
      return response.text();
    },
    onSuccess: (aiResponse) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + "_assistant",
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Erreur envoi message:', error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Réessayez.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputMessage("");
    
    sendMessageMutation.mutate(userMessage.content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const newConversation = () => {
    setMessages([]);
    setConversations(prev => prev.map(conv => ({ ...conv, active: false })));
    setConversations(prev => [
      { id: Date.now().toString(), title: 'Nouvelle conversation', lastMessage: 'Maintenant', active: true },
      ...prev
    ]);
  };

  const selectConversation = (id: string) => {
    setConversations(prev => prev.map(conv => ({ ...conv, active: conv.id === id })));
    setMessages([]);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(conv => conv.id !== id));
  };

  const activeConversation = conversations.find(conv => conv.active);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar ChatGPT exact */}
      <div className="w-64 bg-gray-900 dark:bg-gray-950 flex flex-col border-r border-gray-700">
        {/* Header sidebar */}
        <div className="p-3">
          <Button
            onClick={newConversation}
            className="w-full justify-start gap-3 h-11 bg-transparent border border-gray-600 hover:bg-gray-800 text-white rounded-md"
          >
            <Plus className="h-4 w-4" />
            Nouvelle conversation
          </Button>
        </div>
        
        {/* Liste conversations */}
        <div className="flex-1 overflow-y-auto px-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`group relative p-3 rounded-md cursor-pointer mb-1 transition-colors ${
                conv.active 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                </div>
                {conv.active && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteConversation(conv.id, e)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer sidebar */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
            <Avatar className="h-7 w-7 bg-emerald-600">
              <AvatarFallback className="bg-emerald-600 text-white text-xs">U</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-300">Utilisateur</span>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="w-full justify-start gap-3 mt-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Button>
        </div>
      </div>
      
      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Page d'accueil ChatGPT style */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <Avatar className="h-16 w-16 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                    <Bot className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Que puis-je faire pour vous aujourd'hui ?
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div 
                  onClick={() => setInputMessage("Comment optimiser mon planning salon ?")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Planning optimal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conseils pour organiser efficacement vos rendez-vous</p>
                </div>
                
                <div 
                  onClick={() => setInputMessage("Stratégies pour fidéliser ma clientèle ?")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fidélisation client</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Techniques pour garder vos clients satisfaits</p>
                </div>
                
                <div 
                  onClick={() => setInputMessage("Comment augmenter mon chiffre d'affaires ?")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Croissance business</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stratégies pour développer votre activité</p>
                </div>
                
                <div 
                  onClick={() => setInputMessage("Tendances beauté actuelles à proposer ?")}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tendances beauté</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nouveautés et innovations du secteur</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Zone de messages */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-6 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`flex gap-4 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <Avatar className={`h-8 w-8 flex-shrink-0 ${
                      message.type === 'assistant' 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <AvatarFallback className={`${
                        message.type === 'assistant' 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      } text-white`}>
                        {message.type === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Message content */}
                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block max-w-full p-4 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white ml-auto' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Indicateur de frappe */}
              {isLoading && (
                <div className="mb-6">
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-emerald-400 to-emerald-600">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Rendly réfléchit...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
        
        {/* Zone de saisie ChatGPT style */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto p-4">
            <div className="relative flex items-end gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Posez votre question à Rendly AI..."
                className="flex-1 min-h-[20px] max-h-32 resize-none border-0 bg-transparent focus:ring-0 text-sm placeholder:text-gray-500"
                disabled={isLoading}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              Rendly AI peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}