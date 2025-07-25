import type { Express } from "express";
import { createServer, type Server } from "http";
import { bookingService } from "./bookingService";
import { analyticsService } from "./analyticsService";
import { messagingService } from "./messagingService";
import { notificationService } from "./notificationService";
import { confirmationService } from "./confirmationService";
import { stripeService } from "./stripeService";
import { aiService } from "./aiService";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============= ROUTES DE RÉSERVATION =============
  
  // Créer une nouvelle réservation avec paiement d'acompte
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = req.body;
      
      // Validation basique
      if (!bookingData.userId || !bookingData.serviceId || !bookingData.clientEmail) {
        return res.status(400).json({ error: "Données manquantes" });
      }

      const result = await bookingService.createBooking(bookingData);
      res.json(result);

    } catch (error: any) {
      console.error("Erreur création réservation:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Obtenir les créneaux disponibles
  app.get("/api/bookings/available-slots", async (req, res) => {
    try {
      const { userId, date, serviceId, staffId } = req.query;
      
      if (!userId || !date || !serviceId) {
        return res.status(400).json({ error: "Paramètres manquants" });
      }

      const slots = await bookingService.getAvailableTimeSlots(
        userId as string,
        date as string,
        parseInt(serviceId as string),
        staffId ? parseInt(staffId as string) : undefined
      );

      res.json({ availableSlots: slots });

    } catch (error: any) {
      console.error("Erreur récupération créneaux:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Annuler une réservation
  app.post("/api/bookings/:id/cancel", async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { reason } = req.body;

      const success = await bookingService.cancelAppointment(appointmentId, reason);
      
      if (success) {
        res.json({ success: true, message: "Réservation annulée" });
      } else {
        res.status(400).json({ error: "Impossible d'annuler la réservation" });
      }

    } catch (error: any) {
      console.error("Erreur annulation:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Reporter une réservation
  app.post("/api/bookings/:id/reschedule", async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { newDate, newTime } = req.body;

      if (!newDate || !newTime) {
        return res.status(400).json({ error: "Nouvelle date et heure requises" });
      }

      const success = await bookingService.rescheduleAppointment(appointmentId, newDate, newTime);
      
      if (success) {
        res.json({ success: true, message: "Réservation reportée" });
      } else {
        res.status(400).json({ error: "Impossible de reporter la réservation" });
      }

    } catch (error: any) {
      console.error("Erreur report:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Obtenir les réservations d'un client
  app.get("/api/bookings/client/:email", async (req, res) => {
    try {
      const clientEmail = req.params.email;
      const appointments = await bookingService.getClientAppointments(clientEmail);
      res.json({ appointments });

    } catch (error: any) {
      console.error("Erreur récupération RDV client:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ROUTES D'ANALYTICS =============
  
  // Obtenir les analytics d'un salon
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const period = (req.query.period as 'week' | 'month' | 'year') || 'month';

      const analytics = await analyticsService.getBusinessAnalytics(userId, period);
      res.json(analytics);

    } catch (error: any) {
      console.error("Erreur analytics:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Prédictions de revenus
  app.get("/api/analytics/:userId/forecast", async (req, res) => {
    try {
      const userId = req.params.userId;
      const forecast = await analyticsService.generateRevenueForecast(userId);
      res.json(forecast);

    } catch (error: any) {
      console.error("Erreur prédiction:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ROUTES DE MESSAGERIE =============
  
  // Envoyer un message
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = req.body;
      
      if (!messageData.fromUserId || !messageData.toUserId || !messageData.content) {
        return res.status(400).json({ error: "Données de message manquantes" });
      }

      const result = await messagingService.sendMessage(messageData);
      res.json(result);

    } catch (error: any) {
      console.error("Erreur envoi message:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Obtenir les conversations d'un utilisateur
  app.get("/api/messages/conversations/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const conversations = await messagingService.getConversations(userId);
      res.json({ conversations });

    } catch (error: any) {
      console.error("Erreur récupération conversations:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Obtenir l'historique d'une conversation
  app.get("/api/messages/history/:userId/:otherUserId", async (req, res) => {
    try {
      const { userId, otherUserId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const history = await messagingService.getConversationHistory(userId, otherUserId, limit);
      res.json({ messages: history });

    } catch (error: any) {
      console.error("Erreur historique conversation:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Rechercher dans les messages
  app.get("/api/messages/search/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: "Terme de recherche manquant" });
      }

      const results = await messagingService.searchMessages(userId, query);
      res.json({ results });

    } catch (error: any) {
      console.error("Erreur recherche messages:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Statistiques de messagerie
  app.get("/api/messages/stats/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const stats = await messagingService.getMessagingStats(userId);
      res.json(stats);

    } catch (error: any) {
      console.error("Erreur stats messagerie:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ROUTES IA =============
  
  // Chat avec l'assistant IA
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ error: "Message et userId requis" });
      }

      const response = await messagingService.getChatbotResponse(message, userId);
      res.json({ response });

    } catch (error: any) {
      console.error("Erreur chat IA:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Générer des suggestions de réponse
  app.post("/api/ai/suggestions", async (req, res) => {
    try {
      const { clientMessage, professionalId } = req.body;
      
      if (!clientMessage || !professionalId) {
        return res.status(400).json({ error: "Message client et ID professionnel requis" });
      }

      const suggestions = await messagingService.generateResponseSuggestion(clientMessage, professionalId);
      res.json({ suggestions });

    } catch (error: any) {
      console.error("Erreur suggestions IA:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ROUTES DE NOTIFICATIONS =============
  
  // Obtenir les notifications d'un utilisateur
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const notifications = await notificationService.getUserNotifications(userId, limit);
      res.json({ notifications });

    } catch (error: any) {
      console.error("Erreur notifications:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Marquer une notification comme lue
  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await notificationService.markAsRead(notificationId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Impossible de marquer comme lu" });
      }

    } catch (error: any) {
      console.error("Erreur marquage notification:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Marquer toutes les notifications comme lues
  app.post("/api/notifications/:userId/read-all", async (req, res) => {
    try {
      const userId = req.params.userId;
      const success = await notificationService.markAllAsRead(userId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Impossible de marquer toutes comme lues" });
      }

    } catch (error: any) {
      console.error("Erreur marquage global notifications:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Compter les notifications non lues
  app.get("/api/notifications/:userId/unread-count", async (req, res) => {
    try {
      const userId = req.params.userId;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ unreadCount: count });

    } catch (error: any) {
      console.error("Erreur comptage notifications:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ROUTES STRIPE/PAIEMENT =============
  
  // Créer un payment intent pour acompte
  app.post("/api/payments/create-deposit-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Montant invalide" });
      }

      const result = await stripeService.createDepositPaymentIntent(amount);
      res.json(result);

    } catch (error: any) {
      console.error("Erreur création payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Confirmer un paiement
  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment Intent ID manquant" });
      }

      const success = await stripeService.confirmPayment(paymentIntentId);
      
      if (success) {
        res.json({ success: true, message: "Paiement confirmé" });
      } else {
        res.status(400).json({ error: "Échec de la confirmation" });
      }

    } catch (error: any) {
      console.error("Erreur confirmation paiement:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ROUTES UTILISATEURS =============
  
  // Obtenir les services publics d'un salon (pour réservation externe)
  app.get("/api/public-services/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const services = await storage.getServicesByUserId(userId);
      res.json({ services });

    } catch (error: any) {
      console.error("Erreur services publics:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Route de test pour vérifier le backend
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "Backend opérationnel", 
      timestamp: new Date().toISOString(),
      services: {
        booking: "✅ Actif",
        messaging: "✅ Actif", 
        analytics: "✅ Actif",
        notifications: "✅ Actif",
        payments: "✅ Actif (simulation)",
        ai: "✅ Actif"
      }
    });
  });

  console.log(`🚀 API Routes registrées avec succès:`);
  console.log(`📅 Réservations: /api/bookings/*`);
  console.log(`💬 Messagerie: /api/messages/*`);
  console.log(`📊 Analytics: /api/analytics/*`);
  console.log(`🔔 Notifications: /api/notifications/*`);
  console.log(`💳 Paiements: /api/payments/*`);
  console.log(`🤖 IA: /api/ai/*`);
  console.log(`🌐 Services publics: /api/public-services/*`);
  console.log(`❤️ Santé: /api/health`);

  const httpServer = createServer(app);
  return httpServer;
}