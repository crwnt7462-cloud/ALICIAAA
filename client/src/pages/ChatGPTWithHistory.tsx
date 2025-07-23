import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, ArrowLeft, Bot, User, RefreshCw, Plus, Folder, 
  MoreVertical, Edit, Trash2, FolderPlus, ChevronDown,
  ChevronRight, Search, Archive, Share2, Pin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
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
  folderId?: number;
  lastMessageAt: string;
  messageCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

interface Folder {
  id: number;
  name: string;
  color: string;
  isExpanded: boolean;
  sortOrder: number;
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
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch folders
  const { data: folders = [] } = useQuery({
    queryKey: ['/api/ai-chat/folders'],
  });

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
    mutationFn: async (folderId?: number) => {
      const response = await apiRequest("POST", "/api/ai-chat/conversations", {
        title: "Nouvelle conversation",
        folderId
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/conversations'] });
    }
  });

  // Create new folder
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/ai-chat/folders", { name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/folders'] });
      setNewFolderName("");
      setShowNewFolderInput(false);
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

  // Toggle folder expansion
  const toggleFolderMutation = useMutation({
    mutationFn: async (folderId: number) => {
      await apiRequest("PATCH", `/api/ai-chat/folders/${folderId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/folders'] });
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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolderMutation.mutate(newFolderName.trim());
    }
  };

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedConversations = folders.reduce((acc: any, folder: Folder) => {
    acc[folder.id] = filteredConversations.filter((conv: Conversation) => conv.folderId === folder.id);
    return acc;
  }, {});

  const ungroupedConversations = filteredConversations.filter((conv: Conversation) => !conv.folderId);

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Conversations IA</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => createConversationMutation.mutate()}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Folders and Conversations */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* Create New Folder */}
            <div className="mb-4">
              {showNewFolderInput ? (
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    placeholder="Nom du dossier"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    className="h-8"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                    ✓
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowNewFolderInput(false)}>
                    ✕
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewFolderInput(true)}
                  className="w-full justify-start h-8 text-gray-600"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Nouveau dossier
                </Button>
              )}
            </div>

            {/* Folders */}
            {folders.map((folder: Folder) => (
              <div key={folder.id} className="mb-2">
                <div className="flex items-center space-x-1 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFolderMutation.mutate(folder.id)}
                    className="w-6 h-6 p-0"
                  >
                    {folder.isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                  <Folder className="w-4 h-4" style={{ color: folder.color }} />
                  <span className="text-sm font-medium text-gray-700 flex-1">{folder.name}</span>
                  <span className="text-xs text-gray-500">
                    {groupedConversations[folder.id]?.length || 0}
                  </span>
                </div>
                
                {folder.isExpanded && groupedConversations[folder.id]?.map((conv: Conversation) => (
                  <div
                    key={conv.id}
                    className={`ml-6 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      currentConversationId === conv.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => setCurrentConversationId(conv.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          {conv.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
                          <p className="text-sm font-medium text-gray-900 truncate">{conv.title}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {conv.messageCount} messages • {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Partager
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteConversationMutation.mutate(conv.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Ungrouped Conversations */}
            {ungroupedConversations.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-500 mb-2 px-2">CONVERSATIONS</h3>
                {ungroupedConversations.map((conv: Conversation) => (
                  <div
                    key={conv.id}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      currentConversationId === conv.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => setCurrentConversationId(conv.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          {conv.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
                          <p className="text-sm font-medium text-gray-900 truncate">{conv.title}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {conv.messageCount} messages • {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Partager
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteConversationMutation.mutate(conv.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Folder className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentConversationId ? 
                conversations.find((c: Conversation) => c.id === currentConversationId)?.title || "Conversation"
                : "Rendly AI"
              }
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {currentConversationId ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`${
                      message.role === 'assistant' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {message.role === 'assistant' ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block max-w-full p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-4 rounded-lg">
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur Rendly AI</h2>
              <p className="text-gray-600 mb-6">
                Commencez une nouvelle conversation ou sélectionnez une conversation existante
              </p>
              <Button
                onClick={() => createConversationMutation.mutate()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}