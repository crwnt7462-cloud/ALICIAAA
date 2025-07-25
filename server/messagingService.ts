import { db } from "./db";
import { messages, users, appointments } from "@shared/schema";
import { eq, and, desc, or, sql } from "drizzle-orm";
import { aiService } from "./aiService";

export interface MessageData {
  fromUserId: string;
  toUserId: string;
  content: string;
  type: 'text' | 'appointment' | 'system' | 'ai_response';
  appointmentId?: number;
  metadata?: Record<string, any>;
}

export interface ConversationSummary {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  userType: 'professional' | 'client';
}

export class MessagingService {
  // Envoyer un message
  async sendMessage(messageData: MessageData): Promise<any> {
    try {
      // Vérifier que les utilisateurs existent
      const [fromUser, toUser] = await Promise.all([
        db.select().from(users).where(eq(users.id, messageData.fromUserId)).limit(1),
        db.select().from(users).where(eq(users.id, messageData.toUserId)).limit(1)
      ]);

      if (!fromUser[0] || !toUser[0]) {
        throw new Error("Utilisateur non trouvé");
      }

      // Créer le message
      const [message] = await db
        .insert(messages)
        .values({
          fromUserId: messageData.fromUserId,
          toUserId: messageData.toUserId,
          content: messageData.content,
          type: messageData.type,
          appointmentId: messageData.appointmentId,
          isRead: false,
          sentAt: new Date(),
          metadata: messageData.metadata ? JSON.stringify(messageData.metadata) : null
        })
        .returning();

      // TODO: Envoyer notification push (service sera ajouté plus tard)

      // Si c'est un message client, générer une suggestion de réponse IA
      let aiSuggestion = null;
      if (toUser[0].isProfessional && messageData.type === 'text') {
        aiSuggestion = await this.generateResponseSuggestion(messageData.content, toUser[0].id);
      }

      console.log(`📨 Message envoyé de ${fromUser[0].businessName || fromUser[0].firstName} vers ${toUser[0].businessName || toUser[0].firstName}`);

      return {
        message,
        aiSuggestion,
        notificationSent: true
      };

    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  // Obtenir les conversations d'un utilisateur
  async getConversations(userId: string): Promise<ConversationSummary[]> {
    try {
      // Récupérer toutes les conversations (derniers messages)
      const conversations = await db
        .select({
          messageId: messages.id,
          fromUserId: messages.fromUserId,
          toUserId: messages.toUserId,
          content: messages.content,
          sentAt: messages.sentAt,
          isRead: messages.isRead,
          fromUserName: users.businessName,
          fromUserFirstName: users.firstName,
          fromUserAccountType: users.accountType,
          toUserName: users.businessName,
          toUserFirstName: users.firstName,
          toUserAccountType: users.accountType
        })
        .from(messages)
        .leftJoin(users, eq(messages.fromUserId, users.id))
        .where(
          or(
            eq(messages.fromUserId, userId),
            eq(messages.toUserId, userId)
          )
        )
        .orderBy(desc(messages.sentAt));

      // Grouper par conversation et garder le dernier message
      const conversationMap = new Map<string, any>();
      
      for (const msg of conversations) {
        const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
        const isFromOther = msg.fromUserId !== userId;
        
        if (!conversationMap.has(otherUserId)) {
          // Récupérer les infos de l'autre utilisateur
          const [otherUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, otherUserId))
            .limit(1);

          if (otherUser) {
            conversationMap.set(otherUserId, {
              otherUserId,
              otherUserName: otherUser.businessName || `${otherUser.firstName} ${otherUser.lastName}`,
              lastMessage: msg.content,
              lastMessageTime: msg.sentAt,
              unreadCount: 0,
              userType: otherUser.isProfessional ? 'professional' : 'client'
            });
          }
        }

        // Compter les messages non lus de l'autre utilisateur
        if (isFromOther && !msg.isRead) {
          const conv = conversationMap.get(otherUserId);
          if (conv) {
            conv.unreadCount++;
          }
        }
      }

      return Array.from(conversationMap.values()).sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
      return [];
    }
  }

  // Obtenir l'historique d'une conversation
  async getConversationHistory(userId: string, otherUserId: string, limit: number = 50): Promise<any[]> {
    try {
      const messagesHistory = await db
        .select({
          id: messages.id,
          fromUserId: messages.fromUserId,
          toUserId: messages.toUserId,
          content: messages.content,
          type: messages.type,
          sentAt: messages.sentAt,
          isRead: messages.isRead,
          appointmentId: messages.appointmentId,
          metadata: messages.metadata,
          senderName: users.businessName,
          senderFirstName: users.firstName
        })
        .from(messages)
        .leftJoin(users, eq(messages.fromUserId, users.id))
        .where(
          or(
            and(eq(messages.fromUserId, userId), eq(messages.toUserId, otherUserId)),
            and(eq(messages.fromUserId, otherUserId), eq(messages.toUserId, userId))
          )
        )
        .orderBy(desc(messages.sentAt))
        .limit(limit);

      // Marquer les messages reçus comme lus
      await db
        .update(messages)
        .set({ isRead: true, readAt: new Date() })
        .where(
          and(
            eq(messages.fromUserId, otherUserId),
            eq(messages.toUserId, userId),
            eq(messages.isRead, false)
          )
        );

      return messagesHistory.reverse(); // Plus ancien en premier

    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      return [];
    }
  }

  // Générer une suggestion de réponse avec IA
  async generateResponseSuggestion(clientMessage: string, professionalId: string): Promise<string[]> {
    try {
      // Récupérer le contexte du professionnel
      const [professional] = await db
        .select()
        .from(users)
        .where(eq(users.id, professionalId))
        .limit(1);

      if (!professional) {
        return [];
      }

      const businessType = "salon de beauté"; // TODO: Ajouter businessType au schéma si nécessaire
      const businessName = professional.businessName || "notre salon";

      const prompt = `Tu es assistant d'un ${businessType} nommé "${businessName}". 
      
Un client a écrit: "${clientMessage}"

Génère 3 réponses professionnelles courtes (max 40 mots chacune) qui:
- Sont chaleureuses et professionnelles
- Répondent directement à la demande
- Encouragent la réservation si approprié
- Utilisent un ton bienveillant

Format: une réponse par ligne, sans numérotation.`;

      const suggestions = await aiService.generateChatResponse(prompt);
      
      return suggestions
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3);

    } catch (error) {
      console.error("Erreur lors de la génération de suggestions:", error);
      return [
        "Merci pour votre message ! Je reviens vers vous très rapidement.",
        "Avec plaisir ! Quel créneau vous conviendrait le mieux ?",
        "Parfait ! Je peux vous proposer plusieurs options qui vous plairont."
      ];
    }
  }

  // Envoyer un message automatique de confirmation de RDV
  async sendAppointmentMessage(appointmentId: number, type: 'confirmation' | 'reminder' | 'cancellation'): Promise<boolean> {
    try {
      // Récupérer les détails du RDV
      const [appointment] = await db
        .select({
          id: appointments.id,
          userId: appointments.userId,
          clientEmail: appointments.clientEmail,
          clientName: appointments.clientName,
          serviceName: appointments.serviceName,
          appointmentDate: appointments.appointmentDate,
          startTime: appointments.startTime,
          totalPrice: appointments.totalPrice
        })
        .from(appointments)
        .where(eq(appointments.id, appointmentId))
        .limit(1);

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Récupérer l'utilisateur professionnel
      const [professional] = await db
        .select()
        .from(users)
        .where(eq(users.id, appointment.userId))
        .limit(1);

      if (!professional) {
        throw new Error("Professionnel non trouvé");
      }

      // Trouver ou créer l'utilisateur client
      let [clientUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, appointment.clientEmail))
        .limit(1);

      if (!clientUser) {
        // Créer un compte client temporaire
        [clientUser] = await db
          .insert(users)
          .values({
            id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email: appointment.clientEmail,
            firstName: (appointment.clientName || '').split(' ')[0] || 'Client',
            lastName: (appointment.clientName || '').split(' ').slice(1).join(' ') || '',
            isProfessional: false,
            createdAt: new Date()
          })
          .returning();
      }

      // Générer le message selon le type
      let messageContent: string;
      switch (type) {
        case 'confirmation':
          messageContent = `✅ Votre rendez-vous "${appointment.serviceName}" est confirmé pour le ${appointment.appointmentDate} à ${appointment.startTime}. Prix: ${appointment.totalPrice}€. Merci de votre confiance !`;
          break;
        case 'reminder':
          messageContent = `⏰ Rappel: Vous avez rendez-vous demain "${appointment.serviceName}" à ${appointment.startTime}. Nous avons hâte de vous voir !`;
          break;
        case 'cancellation':
          messageContent = `❌ Votre rendez-vous "${appointment.serviceName}" du ${appointment.appointmentDate} à ${appointment.startTime} a été annulé. Nous vous recontacterons rapidement.`;
          break;
        default:
          messageContent = `Mise à jour concernant votre rendez-vous "${appointment.serviceName}" du ${appointment.appointmentDate}.`;
      }

      // Envoyer le message
      await this.sendMessage({
        fromUserId: professional.id,
        toUserId: clientUser.id,
        content: messageContent,
        type: 'appointment',
        appointmentId: appointmentId,
        metadata: { automaticMessage: true, messageType: type }
      });

      console.log(`📅 Message automatique envoyé: ${type} pour RDV ${appointmentId}`);
      return true;

    } catch (error) {
      console.error("Erreur lors de l'envoi du message automatique:", error);
      return false;
    }
  }

  // Rechercher dans les messages
  async searchMessages(userId: string, query: string, limit: number = 20): Promise<any[]> {
    try {
      const searchResults = await db
        .select({
          id: messages.id,
          fromUserId: messages.fromUserId,
          toUserId: messages.toUserId,
          content: messages.content,
          sentAt: messages.sentAt,
          type: messages.type,
          senderName: users.businessName,
          senderFirstName: users.firstName
        })
        .from(messages)
        .leftJoin(users, eq(messages.fromUserId, users.id))
        .where(
          and(
            or(
              eq(messages.fromUserId, userId),
              eq(messages.toUserId, userId)
            ),
            sql`LOWER(${messages.content}) LIKE LOWER(${'%' + query + '%'})`
          )
        )
        .orderBy(desc(messages.sentAt))
        .limit(limit);

      return searchResults;

    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
  }

  // Obtenir les statistiques de messagerie
  async getMessagingStats(userId: string): Promise<any> {
    try {
      const [
        totalMessages,
        unreadMessages,
        activeConversations,
        recentActivity
      ] = await Promise.all([
        // Total des messages envoyés et reçus
        db.select({ count: sql<number>`COUNT(*)` })
          .from(messages)
          .where(or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId))),
        
        // Messages non lus
        db.select({ count: sql<number>`COUNT(*)` })
          .from(messages)
          .where(and(eq(messages.toUserId, userId), eq(messages.isRead, false))),
        
        // Conversations actives (derniers 7 jours)
        db.select({ count: sql<number>`COUNT(DISTINCT CASE WHEN ${messages.fromUserId} = ${userId} THEN ${messages.toUserId} ELSE ${messages.fromUserId} END)` })
          .from(messages)
          .where(
            and(
              or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId)),
              sql`${messages.sentAt} >= NOW() - INTERVAL '7 days'`
            )
          ),
        
        // Activité des dernières 24h
        db.select({ count: sql<number>`COUNT(*)` })
          .from(messages)
          .where(
            and(
              or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId)),
              sql`${messages.sentAt} >= NOW() - INTERVAL '24 hours'`
            )
          )
      ]);

      return {
        totalMessages: Number(totalMessages[0]?.count || 0),
        unreadMessages: Number(unreadMessages[0]?.count || 0),
        activeConversations: Number(activeConversations[0]?.count || 0),
        recentActivity: Number(recentActivity[0]?.count || 0),
        averageResponseTime: "< 2h", // À calculer plus précisément
        responseRate: "98%" // À calculer plus précisément
      };

    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error);
      return {
        totalMessages: 0,
        unreadMessages: 0,
        activeConversations: 0,
        recentActivity: 0,
        averageResponseTime: "N/A",
        responseRate: "N/A"
      };
    }
  }

  // Assistant IA pour messagerie
  async getChatbotResponse(userMessage: string, userId: string): Promise<string> {
    try {
      // Récupérer le contexte de l'utilisateur
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return "Désolé, je ne peux pas vous identifier. Veuillez vous reconnecter.";
      }

      const isClient = !user.isProfessional;
      const isProfessional = user.isProfessional;

      let systemPrompt = "";
      if (isClient) {
        systemPrompt = `Tu es l'assistant IA d'une plateforme de réservation beauté. L'utilisateur est un CLIENT qui cherche des informations sur les services, réservations, ou a des questions générales. Réponds de manière utile, chaleureuse et professionnelle en français.`;
      } else if (isProfessional) {
        systemPrompt = `Tu es l'assistant IA pour professionnels de beauté. L'utilisateur gère son salon "${user.businessName || 'son salon'}". Aide-le avec la gestion, les conseils business, l'optimisation des rendez-vous. Sois expert et professionnel.`;
      }

      const fullPrompt = `${systemPrompt}

Question de l'utilisateur: "${userMessage}"

Réponds de manière concise (max 200 mots), utile et adaptée au contexte.`;

      const response = await aiService.generateChatResponse(fullPrompt);
      
      // Log de l'interaction IA
      console.log(`🤖 Réponse IA générée pour ${isProfessional ? 'professionnel' : 'client'}: ${userMessage.substring(0, 50)}...`);
      
      return response;

    } catch (error) {
      console.error("Erreur lors de la génération de réponse IA:", error);
      return "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.";
    }
  }
}

export const messagingService = new MessagingService();