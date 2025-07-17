import { storage } from "./storage";
import { nanoid } from "nanoid";
import { 
  InsertMessage, 
  InsertConversation, 
  Message, 
  Conversation,
  ClientAccount,
  User 
} from "@shared/schema";

export class MessagingService {
  
  async getOrCreateConversation(professionalUserId: string, clientAccountId: string): Promise<Conversation> {
    // Try to find existing conversation
    let conversation = await storage.getConversationByParticipants(professionalUserId, clientAccountId);
    
    if (!conversation) {
      // Get client name for caching
      const client = await storage.getClientByEmail(""); // We'll need to get by ID
      const clientName = client ? `${client.firstName} ${client.lastName}`.trim() : "Client";
      
      // Create new conversation
      const conversationData: InsertConversation = {
        id: nanoid(),
        professionalUserId,
        clientAccountId,
        clientName,
        lastMessageAt: new Date(),
        lastMessageContent: ""
      };
      
      conversation = await storage.createConversation(conversationData);
    }
    
    return conversation;
  }
  
  async sendMessage(
    fromUserId?: string, 
    fromClientId?: string, 
    toUserId?: string, 
    toClientId?: string,
    content: string, 
    messageType: string = "text",
    mentions: string[] = []
  ): Promise<Message> {
    
    // Determine conversation participants
    const professionalUserId = fromUserId || toUserId!;
    const clientAccountId = fromClientId || toClientId!;
    
    // Get or create conversation
    const conversation = await this.getOrCreateConversation(professionalUserId, clientAccountId);
    
    // Create message
    const messageData: InsertMessage = {
      conversationId: conversation.id,
      fromUserId,
      fromClientId, 
      toUserId,
      toClientId,
      content,
      messageType,
      isRead: false,
      mentions
    };
    
    const message = await storage.createMessage(messageData);
    
    // Update conversation with last message info
    await storage.updateConversation(conversation.id, {
      lastMessageAt: new Date(),
      lastMessageContent: content.substring(0, 100) // Truncate for preview
    });
    
    console.log(`💬 Message sent in conversation ${conversation.id}: ${content.substring(0, 50)}...`);
    
    return message;
  }
  
  async getConversationMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    return await storage.getMessagesByConversation(conversationId, limit);
  }
  
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await storage.getConversationsByUser(userId);
  }
  
  async getClientConversations(clientAccountId: string): Promise<Conversation[]> {
    return await storage.getConversationsByClient(clientAccountId);
  }
  
  async markMessagesAsRead(conversationId: string, userId?: string, clientId?: string): Promise<void> {
    await storage.markConversationMessagesAsRead(conversationId, userId, clientId);
    console.log(`✅ Messages marked as read in conversation ${conversationId}`);
  }
  
  async getUnreadMessageCount(userId?: string, clientId?: string): Promise<number> {
    return await storage.getUnreadMessageCount(userId, clientId);
  }
  
  async sendSystemMessage(
    conversationId: string, 
    content: string, 
    messageType: string = "system"
  ): Promise<Message> {
    
    const messageData: InsertMessage = {
      conversationId,
      content,
      messageType,
      isRead: false
    };
    
    const message = await storage.createMessage(messageData);
    
    // Update conversation
    await storage.updateConversation(conversationId, {
      lastMessageAt: new Date(),
      lastMessageContent: content.substring(0, 100)
    });
    
    return message;
  }
  
  async sendAppointmentMessage(
    professionalUserId: string,
    clientAccountId: string,
    appointmentDetails: any
  ): Promise<Message> {
    
    const conversation = await this.getOrCreateConversation(professionalUserId, clientAccountId);
    
    const content = `📅 Nouveau rendez-vous confirmé:
Date: ${appointmentDetails.date}
Heure: ${appointmentDetails.time}
Service: ${appointmentDetails.serviceName}
Durée: ${appointmentDetails.duration} min

Merci pour votre réservation !`;
    
    return await this.sendSystemMessage(conversation.id, content, "appointment");
  }
  
  async archiveConversation(conversationId: string): Promise<void> {
    await storage.updateConversation(conversationId, { isArchived: true });
    console.log(`🗄️ Conversation ${conversationId} archived`);
  }
  
  async unarchiveConversation(conversationId: string): Promise<void> {
    await storage.updateConversation(conversationId, { isArchived: false });
    console.log(`📂 Conversation ${conversationId} unarchived`);
  }
  
  async deleteMessage(messageId: number): Promise<void> {
    await storage.deleteMessage(messageId);
    console.log(`🗑️ Message ${messageId} deleted`);
  }
  
  async searchMessages(query: string, userId?: string, clientId?: string): Promise<Message[]> {
    return await storage.searchMessages(query, userId, clientId);
  }
}

export const messagingService = new MessagingService();