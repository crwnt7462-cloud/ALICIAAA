import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
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
      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Erreur envoi message:', error);
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
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectChatFromHistory = (chat: any) => {
    setShowChatHistory(false);
    // Charger le chat sélectionné (simulé)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Conversation reprise : ${chat.title}`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50/50 to-violet-50/50 flex flex-col relative overflow-hidden">
      {/* Background effet */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-violet-100/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-200/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Header avec menu historique */}
      <div className="relative z-10 p-4 bg-white/80 backdrop-blur-md border-b border-purple-100/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/80 shadow-sm border border-purple-100"
          >
            <ArrowLeft className="w-5 h-5 text-purple-700" />
          </Button>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">
              Assistant IA Pro
            </h1>
            <p className="text-xs text-purple-600">{user?.email || 'demo@beautyapp.com'}</p>
          </div>
        </div>
        
        {/* Menu historique */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/80 shadow-sm border border-purple-100"
          >
            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
          
          {showChatHistory && (
            <div className="chat-history-menu absolute right-0 top-12 w-72 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-100 p-4 z-50">
              <h3 className="font-semibold text-purple-900 mb-3">Historique des conversations</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => selectChatFromHistory(chat)}
                    className="w-full p-3 text-left rounded-xl hover:bg-purple-50 transition-all group"
                  >
                    <div className="font-medium text-purple-900 text-sm group-hover:text-purple-700">
                      {chat.title}
                    </div>
                    <div className="text-xs text-purple-600 mt-1 truncate">
                      {chat.lastMessage}
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                      {chat.date}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm text-purple-900 shadow-md border border-purple-100'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              <div
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-purple-100' : 'text-purple-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border border-purple-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message de salutation centré */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent mb-2">
            Assistant IA Pro
          </h2>
          <p className="text-purple-600 text-sm leading-relaxed">
            Votre conseiller intelligent pour optimiser votre salon de beauté
          </p>
        </div>
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
              placeholder="✨ Ask Rendly"
              className="w-full rounded-full px-6 py-4 text-purple-900 border outline-none transition-all font-medium bg-gradient-to-r from-purple-50 to-violet-50 border-purple-300 placeholder-purple-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm"
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
            onClick={() => setLocation('/ai-alerts')}
            size="sm"
            className="w-12 h-12 rounded-full border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500"
          >
            <User className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}