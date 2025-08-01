// Service de messagerie temps réel avec stockage en mémoire
export interface Message {
  id: string;
  fromUserId: string;
  fromUserType: 'client' | 'professional';
  fromUserName: string;
  toUserId: string;
  toUserType: 'client' | 'professional';
  toUserName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    clientId: string;
    clientName: string;
    professionalId: string;
    professionalName: string;
  };
  messages: Message[];
  lastMessageAt: Date;
}

class MessagingService {
  private conversations: Map<string, Conversation> = new Map();
  private messageIdCounter = 1;

  // Génère un ID de conversation unique basé sur les IDs des participants
  private getConversationId(clientId: string, professionalId: string): string {
    return `conv_${clientId}_${professionalId}`;
  }

  // Génère un nouvel ID de message
  private generateMessageId(): string {
    return `msg_${this.messageIdCounter++}_${Date.now()}`;
  }

  // Créer ou récupérer une conversation
  public getOrCreateConversation(
    clientId: string,
    clientName: string,
    professionalId: string,
    professionalName: string
  ): Conversation {
    const conversationId = this.getConversationId(clientId, professionalId);
    
    if (!this.conversations.has(conversationId)) {
      const newConversation: Conversation = {
        id: conversationId,
        participants: {
          clientId,
          clientName,
          professionalId,
          professionalName
        },
        messages: [],
        lastMessageAt: new Date()
      };
      this.conversations.set(conversationId, newConversation);
    }

    return this.conversations.get(conversationId)!;
  }

  // Envoyer un message
  public sendMessage(
    fromUserId: string,
    fromUserType: 'client' | 'professional',
    fromUserName: string,
    toUserId: string,
    toUserType: 'client' | 'professional',
    toUserName: string,
    content: string
  ): Message {
    const clientId = fromUserType === 'client' ? fromUserId : toUserId;
    const clientName = fromUserType === 'client' ? fromUserName : toUserName;
    const professionalId = fromUserType === 'professional' ? fromUserId : toUserId;
    const professionalName = fromUserType === 'professional' ? fromUserName : toUserName;

    const conversation = this.getOrCreateConversation(
      clientId,
      clientName,
      professionalId,
      professionalName
    );

    const message: Message = {
      id: this.generateMessageId(),
      fromUserId,
      fromUserType,
      fromUserName,
      toUserId,
      toUserType,
      toUserName,
      content: content.trim(),
      timestamp: new Date(),
      isRead: false
    };

    conversation.messages.push(message);
    conversation.lastMessageAt = new Date();

    return message;
  }

  // Récupérer les messages d'une conversation
  public getConversationMessages(clientId: string, professionalId: string): Message[] {
    const conversationId = this.getConversationId(clientId, professionalId);
    const conversation = this.conversations.get(conversationId);
    
    return conversation ? conversation.messages : [];
  }

  // Marquer les messages comme lus
  public markMessagesAsRead(userId: string, conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.forEach(msg => {
        if (msg.toUserId === userId) {
          msg.isRead = true;
        }
      });
    }
  }

  // Récupérer toutes les conversations d'un utilisateur
  public getUserConversations(userId: string, userType: 'client' | 'professional'): Conversation[] {
    const userConversations: Conversation[] = [];

    this.conversations.forEach(conversation => {
      const isParticipant = userType === 'client' 
        ? conversation.participants.clientId === userId
        : conversation.participants.professionalId === userId;

      if (isParticipant) {
        userConversations.push(conversation);
      }
    });

    // Trier par dernier message
    return userConversations.sort((a, b) => 
      b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    );
  }

  // Compter les messages non lus
  public getUnreadCount(userId: string): number {
    let unreadCount = 0;

    this.conversations.forEach(conversation => {
      conversation.messages.forEach(msg => {
        if (msg.toUserId === userId && !msg.isRead) {
          unreadCount++;
        }
      });
    });

    return unreadCount;
  }

  // Ajouter quelques messages de test
  public seedTestMessages(): void {
    // Message de client vers pro
    this.sendMessage(
      'client_1',
      'client',
      'Marie Dupont',
      'pro_1',
      'professional',
      'Salon Demo',
      'Bonjour, je souhaiterais prendre rendez-vous pour une coupe et couleur. Avez-vous des créneaux disponibles cette semaine ?'
    );

    // Réponse du pro
    this.sendMessage(
      'pro_1',
      'professional',
      'Salon Demo',
      'client_1',
      'client',
      'Marie Dupont',
      'Bonjour Marie ! Bien sûr, j\'ai des créneaux disponibles. Préférez-vous mardi à 14h ou jeudi à 10h ?'
    );

    // Autre message de client
    this.sendMessage(
      'client_1',
      'client',
      'Marie Dupont',
      'pro_1',
      'professional',
      'Salon Demo',
      'Parfait ! Je préfère mardi à 14h. Combien de temps faut-il prévoir pour la prestation complète ?'
    );

    console.log('✅ Messages de test ajoutés à la messagerie');
  }
}

export const messagingService = new MessagingService();

// Ajouter les messages de test au démarrage
messagingService.seedTestMessages();