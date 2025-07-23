import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, ArrowLeft, Bot, User, RefreshCw, Plus, 
  MoreVertical, Edit, Trash2, Search, Archive, Share2, Pin, Menu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  messageIndex: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessageAt: string;
  messageCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

export default function ChatGPTWithHistory() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['/api/ai-chat/conversations'],
  });

  // Fetch messages for current conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/ai-chat/messages', currentConversationId],
    enabled: !!currentConversationId,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai-chat/conversations", {
        title: "Nouvelle conversation"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/conversations'] });
    }
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, conversationId }: { message: string; conversationId: string }) => {
      const response = await apiRequest("POST", "/api/ai-chat/messages", {
        conversationId,
        message
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/messages', currentConversationId] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/conversations'] });
      setIsLoading(false);
    },
    onError: () => {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de joindre l'assistant IA. Réessayez plus tard.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });

  // Delete conversation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await apiRequest("DELETE", `/api/ai-chat/conversations/${conversationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/conversations'] });
      if (currentConversationId === currentConversationId) {
        setCurrentConversationId(null);
      }
    }
  });



  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!currentConversationId) {
      // Create new conversation first
      createConversationMutation.mutate(undefined, {
        onSuccess: (data) => {
          sendMessageMutation.mutate({
            message: inputMessage,
            conversationId: data.id
          });
        }
      });
    } else {
      sendMessageMutation.mutate({
        message: inputMessage,
        conversationId: currentConversationId
      });
    }

    setInputMessage("");
    setIsLoading(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-gray-900 text-white flex flex-col">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-700">
            <Button
              onClick={() => createConversationMutation.mutate()}
              className="w-full bg-transparent border border-gray-600 text-white hover:bg-gray-800 h-11 rounded-lg text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau chat
            </Button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv: Conversation) => (
                <div
                  key={conv.id}
                  className={`px-3 py-2 mx-2 mb-1 rounded-lg cursor-pointer transition-colors group ${
                    currentConversationId === conv.id 
                      ? 'bg-gray-800' 
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setCurrentConversationId(conv.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {conv.isPinned && <Pin className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                        <p className="text-sm text-white truncate font-medium">{conv.title}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Edit className="w-4 h-4 mr-2" />
                          Renommer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Share2 className="w-4 h-4 mr-2" />
                          Partager
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Archive className="w-4 h-4 mr-2" />
                          Archiver
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteConversationMutation.mutate(conv.id)}
                          className="text-red-400 hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">
                Aucune conversation trouvée
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentConversationId ? 
                conversations.find((c: Conversation) => c.id === currentConversationId)?.title || "ChatGPT"
                : "ChatGPT"
              }
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
          {currentConversationId ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-green-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 px-2">
                      {new Date(message.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start space-x-4 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center py-20">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-4">Comment puis-je vous aider aujourd'hui ?</h1>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
                <div 
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left"
                  onClick={() => setInputMessage("Aide-moi à optimiser mon planning de salon")}
                >
                  <h3 className="font-medium text-gray-900 mb-2">Optimisation planning</h3>
                  <p className="text-sm text-gray-600">Aide-moi à optimiser mon planning de salon</p>
                </div>
                
                <div 
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left"
                  onClick={() => setInputMessage("Comment améliorer la fidélisation de mes clients ?")}
                >
                  <h3 className="font-medium text-gray-900 mb-2">Fidélisation clients</h3>
                  <p className="text-sm text-gray-600">Comment améliorer la fidélisation de mes clients ?</p>
                </div>
                
                <div 
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left"
                  onClick={() => setInputMessage("Quels services proposer pour augmenter mon chiffre d'affaires ?")}
                >
                  <h3 className="font-medium text-gray-900 mb-2">Nouveaux services</h3>
                  <p className="text-sm text-gray-600">Quels services proposer pour augmenter mon chiffre d'affaires ?</p>
                </div>
                
                <div 
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left"
                  onClick={() => setInputMessage("Aide-moi avec ma stratégie marketing digitale")}
                >
                  <h3 className="font-medium text-gray-900 mb-2">Marketing digital</h3>
                  <p className="text-sm text-gray-600">Aide-moi avec ma stratégie marketing digitale</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-4 py-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Envoyez un message..."
                className="w-full pr-12 h-12 rounded-xl border-gray-300 focus:border-gray-400 focus:ring-0 text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Rendly AI peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}