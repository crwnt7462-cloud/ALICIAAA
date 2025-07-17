import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, AtSign, User, Building } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface MentionableUser {
  id: string;
  name: string;
  handle: string;
  type: 'professional' | 'client';
}

interface MentionInputProps {
  onSendMessage: (content: string, mentions: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MentionInput({ onSendMessage, placeholder = "Tapez votre message...", disabled = false }: MentionInputProps) {
  const [message, setMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [suggestions, setSuggestions] = useState<MentionableUser[]>([]);
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mentionSearch.length > 0) {
      searchUsers(mentionSearch);
    } else {
      setSuggestions([]);
    }
  }, [mentionSearch]);

  const searchUsers = async (query: string) => {
    try {
      const response = await apiRequest('GET', `/api/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const users = await response.json();
        setSuggestions(users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    setMessage(value);

    // Détecter les mentions (@)
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      const spaceIndex = textAfterAt.indexOf(' ');
      
      if (spaceIndex === -1 || textAfterAt.length < spaceIndex) {
        setShowMentions(true);
        setMentionSearch(textAfterAt);
        setMentionPosition(lastAtIndex);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (user: MentionableUser) => {
    const beforeMention = message.slice(0, mentionPosition);
    const afterMention = message.slice(mentionPosition + mentionSearch.length + 1);
    
    // Utiliser le handle @ si disponible, sinon le nom
    const displayText = user.handle ? user.handle : user.name.replace(/\s/g, '');
    
    const newMessage = `${beforeMention}@${displayText} ${afterMention}`;
    setMessage(newMessage);
    setShowMentions(false);
    setSelectedMentions(prev => [...prev, user.id]);
    
    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), selectedMentions);
      setMessage('');
      setSelectedMentions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end space-x-2 p-4 border-t bg-white">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-12 min-h-[44px] resize-none"
          />
          
          {/* Mention suggestions */}
          {showMentions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
              {suggestions.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleMentionSelect(user)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={user.type === 'professional' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'}>
                      {user.type === 'professional' ? (
                        <Building className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.type === 'professional' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-violet-100 text-violet-600'
                      }`}>
                        {user.type === 'professional' ? 'Pro' : 'Client'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AtSign className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-500 truncate">
                        {user.handle || 'Pas de handle'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="bg-violet-600 hover:bg-violet-700 h-11 w-11"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Affichage des mentions sélectionnées */}
      {selectedMentions.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <AtSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {selectedMentions.length} mention{selectedMentions.length > 1 ? 's' : ''} dans ce message
            </span>
          </div>
        </div>
      )}
    </div>
  );
}