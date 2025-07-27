import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIProModern() {
  const [, setLocation] = useLocation();
  
  // Récupérer les infos du compte connecté
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA.\nComment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Historique des chats simulé (à remplacer par des vraies données)
  const chatHistory = [
    { id: 1, title: "Optimisation planning", lastMessage: "Comment optimiser mon planning ?", date: "Aujourd'hui" },
    { id: 2, title: "Gestion des stocks", lastMessage: "Alerte stock produits", date: "Hier" },
    { id: 3, title: "Analyse performances", lastMessage: "Rapport mensuel", date: "2 jours" },
    { id: 4, title: "Conseils marketing", lastMessage: "Campagne fidélisation", date: "3 jours" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fermer le menu historique quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showChatHistory && !(event.target as Element).closest('.chat-history-menu')) {
        setShowChatHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showChatHistory]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        conversationHistory: messages.slice(-10)
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || "Je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    sendMessageMutation.mutate(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-white max-w-md mx-auto relative overflow-hidden">
      {/* Header violet */}
      <div className="px-6 py-4 flex items-center justify-between relative">
        <div 
          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setShowChatHistory(!showChatHistory)}
        >
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft 
              className="w-4 h-4 text-white cursor-pointer" 
              onClick={() => setLocation('/dashboard')}
            />
          </div>
        </div>

        {/* Menu historique des chats dépliable */}
        {showChatHistory && (
          <div className="absolute top-16 left-6 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 z-50 overflow-hidden chat-history-menu">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-600">
              <h3 className="text-white font-semibold text-lg">Historique des conversations</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {chatHistory.map((chat) => (
                <div 
                  key={chat.id}
                  className="p-4 border-b border-gray-100 hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={() => {
                    // Charger la conversation
                    setShowChatHistory(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{chat.title}</h4>
                      <p className="text-xs text-gray-500 truncate mt-1">{chat.lastMessage}</p>
                      <p className="text-xs text-purple-500 mt-1">{chat.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button 
                className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
                onClick={() => {
                  // Nouveau chat
                  setMessages([{
                    id: '1',
                    role: 'assistant',
                    content: 'Bonjour ! Je suis votre assistant IA.\nComment puis-je vous aider aujourd\'hui ?',
                    timestamp: new Date()
                  }]);
                  setShowChatHistory(false);
                }}
              >
                + Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message de salutation centré */}
      <div className="flex-1 flex items-center justify-center">
        {messages.length === 1 ? (
          <div className="text-center px-8">
            <h1 className="text-4xl font-light text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text mb-4">
              Bonjour, {(user as any)?.firstName || (user as any)?.name || 'Agash'}
            </h1>
            <p className="text-gray-600 text-sm">
              Votre assistant IA est prêt à vous aider
            </p>
          </div>
        ) : (
          <div className="w-full px-4 py-4 space-y-4 overflow-y-auto">
            {messages.slice(1).map((message) => (
              <div key={message.id} className="flex flex-col">
                {message.role === 'assistant' ? (
                  <div className="self-start max-w-[85%]">
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 shadow-sm">
                      <p className="text-purple-900 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                ) : (
                  <div className="self-end max-w-[85%]">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl px-4 py-3 shadow-lg">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="self-start max-w-[85%]">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input violet sur fond blanc */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Rendly"
              className="w-full bg-purple-50 rounded-full px-6 py-4 text-purple-900 placeholder-purple-400 border border-purple-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
          
          <Button
            size="sm"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}