import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  Calendar, 
  MoreVertical,
  Image,
  Paperclip
} from "lucide-react";

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

export default function FullScreenMessage() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Bonjour ! J'aimerais prendre rendez-vous pour une coupe et un brushing. Avez-vous des créneaux disponibles cette semaine ?",
      timestamp: "14:32",
      isOwn: true,
      status: 'read'
    },
    {
      id: 2,
      content: "Bonjour ! Bien sûr, nous avons plusieurs créneaux disponibles. Préférez-vous plutôt en matinée ou en après-midi ?",
      timestamp: "14:35",
      isOwn: false
    },
    {
      id: 3,
      content: "En après-midi ce serait parfait. Mercredi ou jeudi si possible ?",
      timestamp: "14:36",
      isOwn: true,
      status: 'read'
    },
    {
      id: 4,
      content: "Parfait ! J'ai un créneau mercredi à 15h30 avec Sophie, notre experte en coupe. Cela vous convient-il ?",
      timestamp: "14:38",
      isOwn: false
    },
    {
      id: 5,
      content: "C'est parfait ! Je confirme pour mercredi 15h30. Faut-il que je vienne avec les cheveux propres ?",
      timestamp: "14:40",
      isOwn: true,
      status: 'delivered'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversation: Conversation = {
    id: "salon-excellence",
    name: "Salon Excellence Paris",
    avatar: "",
    status: 'online'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        content: message,
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: true,
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Simuler une réponse après 2 secondes
      setTimeout(() => {
        const response: Message = {
          id: messages.length + 2,
          content: "Merci pour votre message ! Vous pouvez venir avec les cheveux propres ou non, nous nous en occupons. À mercredi !",
          timestamp: new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isOwn: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header style iMessage */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setLocation('/client/messages')}
            className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 text-blue-500" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-medium">
                  {conversation.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {conversation.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h1 className="font-medium text-gray-900">{conversation.name}</h1>
              <p className="text-xs text-gray-500">
                {conversation.status === 'online' ? 'En ligne' : `Vu ${conversation.lastSeen}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-9 w-9 p-0 rounded-full text-blue-500 hover:bg-blue-50">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-9 w-9 p-0 rounded-full text-blue-500 hover:bg-blue-50">
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-9 w-9 p-0 rounded-full text-blue-500 hover:bg-blue-50"
            onClick={() => setLocation('/booking')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.isOwn 
                  ? 'bg-blue-500 text-white rounded-br-sm' 
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <div className={`flex items-center justify-between mt-1 ${
                  msg.isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span className="text-xs">{msg.timestamp}</span>
                  {msg.isOwn && msg.status && (
                    <span className="text-xs ml-2">
                      {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Zone de saisie style iMessage */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-end gap-2">
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-full text-gray-500 hover:bg-gray-100">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-full text-gray-500 hover:bg-gray-100">
              <Image className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="pr-12 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 resize-none min-h-[36px] max-h-32"
                style={{ paddingTop: '8px', paddingBottom: '8px' }}
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full ${
                  message.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}