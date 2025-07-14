import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db } from "./db";
import { aiService } from "./aiService";
import { notificationService } from "./notificationService";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { appointmentHistory, cancellationPredictions, appointments, clients } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import {
  insertServiceSchema,
  insertClientSchema,
  insertStaffSchema,
  insertAppointmentSchema,
  insertForumPostSchema,
  insertForumReplySchema,
  insertReviewSchema,
  insertPromotionSchema,
  insertBusinessSettingsSchema,
  insertServiceCategorySchema,
  insertPaymentMethodSchema,
  insertTransactionSchema,
  insertBookingPageSchema,
  insertClientCommunicationSchema,
  insertStaffAvailabilitySchema,
  insertStaffTimeOffSchema,
  insertInventorySchema,
  insertMarketingCampaignSchema,
  insertClientPreferencesSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Service routes
  app.get('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const serviceData = insertServiceSchema.parse({ ...req.body, userId });
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  app.patch('/api/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Failed to update service" });
    }
  });

  app.delete('/api/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Staff routes
  app.get('/api/staff', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const staff = await storage.getStaff(userId);
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.get('/api/staff/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const staffMember = await storage.getStaffMember(id);
      if (!staffMember) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.json(staffMember);
    } catch (error) {
      console.error("Error fetching staff member:", error);
      res.status(500).json({ message: "Failed to fetch staff member" });
    }
  });

  app.post('/api/staff', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const staffData = insertStaffSchema.parse({ ...req.body, userId });
      const staffMember = await storage.createStaffMember(staffData);
      res.json(staffMember);
    } catch (error) {
      console.error("Error creating staff member:", error);
      res.status(400).json({ message: "Failed to create staff member" });
    }
  });

  app.patch('/api/staff/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const staffData = insertStaffSchema.partial().parse(req.body);
      const staffMember = await storage.updateStaffMember(id, staffData);
      res.json(staffMember);
    } catch (error) {
      console.error("Error updating staff member:", error);
      res.status(400).json({ message: "Failed to update staff member" });
    }
  });

  app.delete('/api/staff/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStaffMember(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting staff member:", error);
      res.status(500).json({ message: "Failed to delete staff member" });
    }
  });

  // Client routes
  app.get('/api/clients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { search } = req.query;
      
      let clients;
      if (search) {
        clients = await storage.searchClients(userId, search as string);
      } else {
        clients = await storage.getClients(userId);
      }
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get('/api/clients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post('/api/clients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clientData = insertClientSchema.parse({ ...req.body, userId });
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(400).json({ message: "Failed to create client" });
    }
  });

  app.patch('/api/clients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const clientData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, clientData);
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(400).json({ message: "Failed to update client" });
    }
  });

  app.delete('/api/clients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.query;
      const appointments = await storage.getAppointments(userId, date as string);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({ ...req.body, userId });
      const appointment = await storage.createAppointment(appointmentData);
      
      // Send push notification for new booking
      await notificationService.sendNewBookingNotification(appointment.id);
      
      // Detect gaps in schedule after new appointment
      await notificationService.detectAndNotifyGaps(userId, appointment.appointmentDate);
      
      // Broadcast to WebSocket clients
      broadcastToClients('appointment-created', appointment);
      
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.patch('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, appointmentData);
      
      // Broadcast to WebSocket clients
      broadcastToClients('appointment-updated', appointment);
      
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(400).json({ message: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get appointment data before deletion for notification
      const appointment = await storage.getAppointment(id);
      
      await storage.deleteAppointment(id);
      
      // Send cancellation notification
      if (appointment) {
        await notificationService.sendCancellationNotification(appointment);
        
        // Check for gaps after cancellation
        await notificationService.detectAndNotifyGaps(appointment.userId, appointment.appointmentDate);
      }
      
      // Broadcast to WebSocket clients
      broadcastToClients('appointment-deleted', { id });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Advanced dashboard analytics
  app.get('/api/dashboard/revenue-chart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const revenueData = await storage.getRevenueChart(userId);
      res.json(revenueData);
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ message: "Failed to fetch revenue chart" });
    }
  });

  app.get('/api/dashboard/upcoming-appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const upcomingAppointments = await storage.getUpcomingAppointments(userId);
      res.json(upcomingAppointments);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      res.status(500).json({ message: "Failed to fetch upcoming appointments" });
    }
  });

  app.get('/api/dashboard/top-services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const topServices = await storage.getTopServices(userId);
      res.json(topServices);
    } catch (error) {
      console.error("Error fetching top services:", error);
      res.status(500).json({ message: "Failed to fetch top services" });
    }
  });

  app.get('/api/dashboard/staff-performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const staffPerformance = await storage.getStaffPerformance(userId);
      res.json(staffPerformance);
    } catch (error) {
      console.error("Error fetching staff performance:", error);
      res.status(500).json({ message: "Failed to fetch staff performance" });
    }
  });

  // Reviews routes
  app.get('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviews = await storage.getReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/overview', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeRange = '30d' } = req.query;
      const overview = await storage.getAnalyticsOverview(userId, timeRange as string);
      res.json(overview);
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      res.status(500).json({ message: "Failed to fetch analytics overview" });
    }
  });

  app.get('/api/analytics/revenue-chart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeRange = '30d' } = req.query;
      const revenueChart = await storage.getAnalyticsRevenueChart(userId, timeRange as string);
      res.json(revenueChart);
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ message: "Failed to fetch revenue chart" });
    }
  });

  app.get('/api/analytics/client-segments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeRange = '30d' } = req.query;
      const segments = await storage.getClientSegments(userId, timeRange as string);
      res.json(segments);
    } catch (error) {
      console.error("Error fetching client segments:", error);
      res.status(500).json({ message: "Failed to fetch client segments" });
    }
  });

  app.get('/api/analytics/service-performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeRange = '30d' } = req.query;
      const performance = await storage.getServiceAnalytics(userId, timeRange as string);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching service performance:", error);
      res.status(500).json({ message: "Failed to fetch service performance" });
    }
  });

  app.get('/api/analytics/loyalty-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const loyaltyStats = await storage.getLoyaltyStats(userId);
      res.json(loyaltyStats);
    } catch (error) {
      console.error("Error fetching loyalty stats:", error);
      res.status(500).json({ message: "Failed to fetch loyalty stats" });
    }
  });

  app.get('/api/analytics/predictions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const predictions = await aiService.generateBusinessInsights({ userId });
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  app.get('/api/analytics/top-clients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeRange = '30d' } = req.query;
      const topClients = await storage.getTopClients(userId, timeRange as string);
      res.json(topClients);
    } catch (error) {
      console.error("Error fetching top clients:", error);
      res.status(500).json({ message: "Failed to fetch top clients" });
    }
  });

  // Waiting list routes
  app.get('/api/waiting-list', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const waitingList = await storage.getWaitingList(userId);
      res.json(waitingList);
    } catch (error) {
      console.error("Error fetching waiting list:", error);
      res.status(500).json({ message: "Failed to fetch waiting list" });
    }
  });

  // Forum routes
  app.get('/api/forum/categories', async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ message: "Failed to fetch forum categories" });
    }
  });

  app.get('/api/forum/posts', async (req, res) => {
    try {
      const { categoryId, limit } = req.query;
      const posts = await storage.getForumPosts(
        categoryId ? parseInt(categoryId as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  app.get('/api/forum/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getForumPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ message: "Failed to fetch forum post" });
    }
  });

  app.post('/api/forum/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertForumPostSchema.parse({ ...req.body, userId });
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(400).json({ message: "Failed to create forum post" });
    }
  });

  app.post('/api/forum/posts/:id/replies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const replyData = insertForumReplySchema.parse({ ...req.body, userId, postId });
      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error) {
      console.error("Error creating forum reply:", error);
      res.status(400).json({ message: "Failed to create forum reply" });
    }
  });

  app.post('/api/forum/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      await storage.likeForumPost(userId, postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking forum post:", error);
      res.status(500).json({ message: "Failed to like forum post" });
    }
  });

  app.delete('/api/forum/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      await storage.unlikeForumPost(userId, postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unliking forum post:", error);
      res.status(500).json({ message: "Failed to unlike forum post" });
    }
  });

  // Endpoints publics pour réservation client
  app.get("/api/public-services/:salonId", async (req, res) => {
    try {
      const { salonId } = req.params;
      const services = await storage.getServices(salonId);
      res.json(services);
    } catch (error: any) {
      console.error("Error fetching public services:", error);
      res.status(500).json({ error: "Erreur lors du chargement des services" });
    }
  });

  app.get("/api/public-staff/:salonId", async (req, res) => {
    try {
      const { salonId } = req.params;
      const staffMembers = await storage.getStaff(salonId);
      res.json(staffMembers);
    } catch (error: any) {
      console.error("Error fetching staff members:", error);
      res.status(500).json({ error: "Erreur lors du chargement de l'équipe" });
    }
  });

  app.get("/api/business-info/:salonId", async (req, res) => {
    try {
      const { salonId } = req.params;
      const user = await storage.getUser(salonId);
      
      if (!user) {
        return res.status(404).json({ error: "Salon non trouvé" });
      }

      // Retourner les infos business du salon
      res.json({
        name: user.businessName || `Salon ${user.firstName || 'Beauty'}`,
        address: user.address || "123 Rue de la Beauté, 75001 Paris",
        phone: user.phone || "01 23 45 67 89",
        email: user.email || "contact@salon.fr",
        description: "Votre salon de beauté professionnel"
      });
    } catch (error: any) {
      console.error("Error fetching business info:", error);
      res.status(500).json({ error: "Erreur lors du chargement des informations" });
    }
  });

  app.post("/api/public-booking", async (req, res) => {
    try {
      console.log("Received booking data:", JSON.stringify(req.body, null, 2));
      
      const { 
        salonId, 
        serviceId, 
        staffId,
        appointmentDate, 
        startTime, 
        endTime,
        clientInfo,
        depositAmount 
      } = req.body;

      // Extraction des informations client avec validation
      console.log("clientInfo:", JSON.stringify(clientInfo, null, 2));
      
      if (!clientInfo) {
        console.log("clientInfo is missing");
        return res.status(400).json({ 
          error: "Les informations client sont manquantes" 
        });
      }

      const clientFirstName = clientInfo.firstName;
      const clientLastName = clientInfo.lastName;
      const clientEmail = clientInfo.email;
      const clientPhone = clientInfo.phone;
      const notes = clientInfo.notes || "";

      console.log("Extracted client data:", { clientFirstName, clientLastName, clientEmail, clientPhone });

      // Validation des champs obligatoires
      if (!clientFirstName || !clientLastName || !clientEmail) {
        console.log("Validation failed - missing required fields:", { 
          firstName: !clientFirstName, 
          lastName: !clientLastName, 
          email: !clientEmail 
        });
        return res.status(400).json({ 
          error: "Les informations client (prénom, nom, email) sont obligatoires" 
        });
      }

      console.log("Validation passed - proceeding with booking");
      
      // Récupérer les données nécessaires
      const [service, businessUser] = await Promise.all([
        storage.getServices(salonId).then(services => services.find(s => s.id === parseInt(serviceId))),
        storage.getUser(salonId)
      ]);

      if (!service || !businessUser) {
        return res.status(404).json({ error: "Service ou salon non trouvé" });
      }

      // Créer ou récupérer le client
      let client = await storage.searchClients(salonId, clientEmail);
      if (client.length === 0) {
        client = [await storage.createClient({
          userId: salonId,
          firstName: clientFirstName,
          lastName: clientLastName,
          email: clientEmail,
          phone: clientPhone,
          notes: notes || ""
        })];
      }

      // Créer le rendez-vous
      const appointment = await storage.createAppointment({
        userId: salonId,
        clientId: client[0].id,
        serviceId: parseInt(serviceId),
        staffId: staffId ? parseInt(staffId) : null,
        appointmentDate,
        startTime,
        endTime,
        status: "confirmed",
        notes: "Réservation en ligne - Acompte payé"
      });

      // Préparer les données pour la confirmation
      const appointmentData = {
        id: appointment.id,
        appointmentDate,
        startTime,
        endTime,
        status: "confirmed",
        client: {
          firstName: clientFirstName,
          lastName: clientLastName,
          email: clientEmail,
          phone: clientPhone
        },
        service: {
          name: service.name,
          price: parseInt(service.price.toString()),
          duration: service.duration || 60
        },
        business: {
          name: businessUser.businessName || `Salon ${businessUser.firstName || 'Beauty'}`,
          address: businessUser.address || "123 Rue de la Beauté, 75001 Paris",
          phone: businessUser.phone || "01 23 45 67 89",
          email: businessUser.email || "contact@salon.fr"
        },
        payment: {
          depositPaid: depositAmount,
          totalAmount: parseInt(service.price.toString()),
          remainingBalance: parseInt(service.price.toString()) - depositAmount
        }
      };

      // Envoyer confirmation automatique
      try {
        const { confirmationService } = await import('./confirmationService');
        await confirmationService.sendBookingConfirmation(appointmentData);
      } catch (confirmationError) {
        console.error("Erreur envoi confirmation:", confirmationError);
        // Continue même si l'envoi échoue
      }

      res.json({ 
        success: true, 
        appointmentId: appointment.id,
        message: "Rendez-vous confirmé avec succès",
        downloadUrl: `/download-receipt/${appointment.id}`,
        manageUrl: `/manage-booking/${appointment.id}`
      });
    } catch (error: any) {
      console.error("Error creating public booking:", error);
      res.status(500).json({ error: "Erreur lors de la création du rendez-vous" });
    }
  });

  // Endpoints pour gestion des réservations
  app.get("/manage-booking/:appointmentId", async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appointment = await storage.getAppointment(parseInt(appointmentId));
      
      if (!appointment) {
        return res.status(404).send(`
          <html><body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>Réservation introuvable</h2>
            <p>Le rendez-vous demandé n'existe pas ou a été supprimé.</p>
          </body></html>
        `);
      }

      // Page de gestion simplifiée
      res.send(`
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gérer ma réservation</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; }
            .card { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 10px 0; }
            .btn { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; }
            .btn-primary { background: #007bff; color: white; }
            .btn-danger { background: #dc3545; color: white; }
            .btn-secondary { background: #6c757d; color: white; }
          </style>
        </head>
        <body>
          <h1>🎯 Gérer ma réservation</h1>
          
          <div class="card">
            <h3>📅 Détails du rendez-vous</h3>
            <p><strong>N° Réservation:</strong> #${appointmentId.padStart(6, '0')}</p>
            <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
            <p><strong>Heure:</strong> ${appointment.startTime}</p>
            <p><strong>Statut:</strong> ${appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}</p>
          </div>

          <div class="card">
            <h3>⚡ Actions disponibles</h3>
            <a href="/download-receipt/${appointmentId}" class="btn btn-primary">📄 Télécharger le reçu</a>
            <a href="/reschedule-booking/${appointmentId}" class="btn btn-secondary">📅 Reporter le RDV</a>
            <a href="/cancel-booking/${appointmentId}" class="btn btn-danger">❌ Annuler</a>
          </div>

          <div class="card">
            <h3>📱 Ajouter au calendrier</h3>
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Rendez-vous&dates=${appointment.appointmentDate.replace(/-/g, '')}T${appointment.startTime.replace(':', '')}00/${appointment.appointmentDate.replace(/-/g, '')}T${appointment.endTime.replace(':', '')}00" class="btn btn-secondary">Google Calendar</a>
          </div>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Error managing booking:", error);
      res.status(500).send("Erreur lors du chargement de la réservation");
    }
  });

  app.get("/download-receipt/:appointmentId", async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appointment = await storage.getAppointment(parseInt(appointmentId));
      
      if (!appointment) {
        return res.status(404).json({ error: "Réservation introuvable" });
      }

      // Récupérer les données complètes
      const [client, service, businessUser] = await Promise.all([
        storage.getClient(appointment.clientId!),
        storage.getServices(appointment.userId).then(services => services.find(s => s.id === appointment.serviceId)),
        storage.getUser(appointment.userId)
      ]);

      if (!client || !service || !businessUser) {
        return res.status(404).json({ error: "Données incomplètes" });
      }

      const receiptData = {
        appointmentId: appointment.id,
        businessInfo: {
          name: businessUser.businessName || `Salon ${businessUser.firstName || 'Beauty'}`,
          address: businessUser.address || "123 Rue de la Beauté, 75001 Paris",
          phone: businessUser.phone || "01 23 45 67 89",
          email: businessUser.email || "contact@salon.fr"
        },
        clientInfo: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email || "",
          phone: client.phone || ""
        },
        serviceInfo: {
          name: service.name,
          price: parseInt(service.price.toString()),
          duration: service.duration || 60
        },
        appointmentInfo: {
          date: appointment.appointmentDate,
          time: appointment.startTime,
          status: appointment.status
        },
        paymentInfo: {
          depositPaid: Math.round(parseInt(service.price.toString()) * 0.3),
          totalAmount: parseInt(service.price.toString()),
          remainingBalance: Math.round(parseInt(service.price.toString()) * 0.7),
          paymentMethod: "Carte bancaire"
        }
      };

      const { receiptService } = await import('./receiptService');
      const htmlContent = await receiptService.generateReceiptHTML(receiptData);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(htmlContent);

    } catch (error: any) {
      console.error("Error generating receipt:", error);
      res.status(500).json({ error: "Erreur lors de la génération du reçu" });
    }
  });

  app.get("/cancel-booking/:appointmentId", async (req, res) => {
    try {
      const { appointmentId } = req.params;
      
      // Page de confirmation d'annulation
      res.send(`
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Annuler ma réservation</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; }
            .card { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin: 10px 0; }
            .btn { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; }
            .btn-danger { background: #dc3545; color: white; }
            .btn-secondary { background: #6c757d; color: white; }
          </style>
        </head>
        <body>
          <h1>⚠️ Annuler ma réservation</h1>
          
          <div class="card">
            <h3>Conditions d'annulation</h3>
            <ul>
              <li>L'acompte versé est non-remboursable</li>
              <li>Annulation gratuite jusqu'à 24h avant le RDV</li>
              <li>Annulation tardive : frais de 10€</li>
            </ul>
          </div>

          <form method="POST" action="/api/cancel-booking/${appointmentId}">
            <textarea name="reason" placeholder="Motif d'annulation (optionnel)" style="width: 100%; height: 100px; margin: 10px 0; padding: 10px; border-radius: 5px; border: 1px solid #ddd;"></textarea>
            <br>
            <button type="submit" class="btn btn-danger">Confirmer l'annulation</button>
            <a href="/manage-booking/${appointmentId}" class="btn btn-secondary">Retour</a>
          </form>
        </body>
        </html>
      `);
    } catch (error: any) {
      res.status(500).send("Erreur lors du chargement de la page d'annulation");
    }
  });

  app.post("/api/cancel-booking/:appointmentId", async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { reason } = req.body;
      
      const appointment = await storage.updateAppointment(parseInt(appointmentId), {
        status: "cancelled",
        notes: `${appointment?.notes || ''} - Annulé: ${reason || 'Aucun motif'}`
      });

      res.send(`
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Annulation confirmée</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 10px; color: #155724; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✅ Annulation confirmée</h1>
            <p>Votre rendez-vous a été annulé avec succès.</p>
            <p>Vous recevrez un email de confirmation sous peu.</p>
          </div>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      res.status(500).send("Erreur lors de l'annulation");
    }
  });

  const httpServer = createServer(app);

  // Routes IA et automatisation
  app.get('/api/ai/insights', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      const topServices = await storage.getTopServices(userId);
      
      const analyticsData = {
        monthRevenue: stats.monthRevenue,
        totalClients: stats.totalClients,
        topServices,
        occupancyRate: 75,
        clientSegments: { new: 20, regular: 60, vip: 20 }
      };
      
      const insights = await aiService.generateBusinessInsights(analyticsData);
      res.json(insights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      const response = await aiService.generateChatResponse(message);
      res.json({ response });
    } catch (error) {
      console.error('Erreur chat IA:', error);
      res.json({ response: "Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?" });
    }
  });

  app.post('/api/ai/predict-cancellation', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { appointmentId } = req.body;
      
      // Récupérer les données du rendez-vous
      const appointment = await storage.getAppointment(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
      }
      
      // Récupérer les données du client
      const client = await storage.getClient(appointment.clientId);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      
      // Simuler l'historique des rendez-vous pour ce client
      const appointmentHistory = await db.select()
        .from(appointmentHistory)
        .where(eq(appointmentHistory.clientId, appointment.clientId))
        .orderBy(desc(appointmentHistory.actionDate));
      
      // Créer les données nécessaires pour la prédiction
      const appointmentData = {
        id: appointment.id,
        date: appointment.appointmentDate,
        time: appointment.startTime,
        duration: 60,
        clientName: `${client.firstName} ${client.lastName}`,
        serviceName: appointment.serviceId ? 'Service' : 'Service inconnu',
        price: parseFloat(appointment.totalPrice || '0'),
        status: appointment.status
      };
      
      const clientBehavior = {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        totalAppointments: appointmentHistory.length || 1,
        noShowCount: appointmentHistory.filter(h => h.actionType === 'no_show').length,
        cancelCount: appointmentHistory.filter(h => h.actionType === 'cancelled').length,
        avgDaysBetweenVisits: 30,
        lastVisit: new Date(appointment.appointmentDate),
        totalSpent: appointmentHistory.length * 50,
        preferredTimeSlots: ['09:00-12:00', '14:00-17:00']
      };
      
      // Effectuer la prédiction
      const prediction = await aiService.predictCancellationRisk(appointmentData, clientBehavior, appointmentHistory);
      
      // Sauvegarder la prédiction en base
      if (prediction.predictionScore > 0) {
        await db.insert(cancellationPredictions).values({
          appointmentId: appointment.id,
          clientId: appointment.clientId,
          predictionScore: prediction.predictionScore.toString(),
          riskFactors: prediction.riskFactors,
          confidence: prediction.confidence.toString(),
          recommendedAction: prediction.recommendedAction,
          createdAt: new Date()
        });
      }
      
      res.json(prediction);
    } catch (error) {
      console.error('Erreur prédiction annulation:', error);
      res.status(500).json({ message: "Erreur lors de la prédiction d'annulation" });
    }
  });

  app.get('/api/ai/cancellation-predictions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Récupérer toutes les prédictions d'annulation récentes
      const predictions = await db.select({
        id: cancellationPredictions.id,
        appointmentId: cancellationPredictions.appointmentId,
        clientId: cancellationPredictions.clientId,
        predictionScore: cancellationPredictions.predictionScore,
        riskFactors: cancellationPredictions.riskFactors,
        confidence: cancellationPredictions.confidence,
        recommendedAction: cancellationPredictions.recommendedAction,
        createdAt: cancellationPredictions.createdAt,
        clientName: clients.name,
        appointmentDate: appointments.date,
        appointmentTime: appointments.time
      })
      .from(cancellationPredictions)
      .innerJoin(appointments, eq(cancellationPredictions.appointmentId, appointments.id))
      .innerJoin(clients, eq(cancellationPredictions.clientId, clients.id))
      .where(eq(appointments.userId, userId))
      .orderBy(desc(cancellationPredictions.createdAt))
      .limit(20);
      
      res.json(predictions);
    } catch (error) {
      console.error('Erreur récupération prédictions:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des prédictions" });
    }
  });

  app.post('/api/ai/optimize-planning', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.body;
      
      const appointments = await storage.getAppointments(userId, date);
      const appointmentData = appointments.map(apt => ({
        id: apt.id,
        date: apt.appointmentDate || new Date().toISOString().split('T')[0],
        time: apt.appointmentTime || '10:00',
        duration: 60,
        clientName: apt.clientName || 'Client',
        serviceName: apt.serviceName || 'Service',
        price: parseFloat(apt.servicePrice || '0'),
        status: apt.status || 'confirmed'
      }));
      
      const optimization = await aiService.optimizeDailySchedule(appointmentData, date);
      res.json(optimization);
    } catch (error) {
      console.error("Error optimizing planning:", error);
      res.status(500).json({ message: "Failed to optimize planning" });
    }
  });

  app.get('/api/ai/promotions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      const topServices = await storage.getTopServices(userId);
      
      const analyticsData = {
        monthRevenue: stats.monthRevenue,
        totalClients: stats.totalClients,
        topServices,
        occupancyRate: 75,
        clientSegments: { new: 20, regular: 60, vip: 20 }
      };
      
      const insights = await aiService.generateBusinessInsights(analyticsData);
      res.json(insights.promotions || []);
    } catch (error) {
      console.error("Error fetching AI promotions:", error);
      res.status(500).json({ message: "Failed to fetch AI promotions" });
    }
  });

  // Business Settings routes (like Planity's business configuration)
  app.get('/api/business-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getBusinessSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching business settings:", error);
      res.status(500).json({ message: "Failed to fetch business settings" });
    }
  });

  app.post('/api/business-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = insertBusinessSettingsSchema.parse({ ...req.body, userId });
      const settings = await storage.createBusinessSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error creating business settings:", error);
      res.status(400).json({ message: "Failed to create business settings" });
    }
  });

  app.patch('/api/business-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = insertBusinessSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateBusinessSettings(userId, settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating business settings:", error);
      res.status(400).json({ message: "Failed to update business settings" });
    }
  });

  // Service Categories routes (like Treatwell's service organization)
  app.get('/api/service-categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const categories = await storage.getServiceCategories(userId);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  app.post('/api/service-categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const categoryData = insertServiceCategorySchema.parse({ ...req.body, userId });
      const category = await storage.createServiceCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating service category:", error);
      res.status(400).json({ message: "Failed to create service category" });
    }
  });

  app.patch('/api/service-categories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertServiceCategorySchema.partial().parse(req.body);
      const category = await storage.updateServiceCategory(id, categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error updating service category:", error);
      res.status(400).json({ message: "Failed to update service category" });
    }
  });

  app.delete('/api/service-categories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteServiceCategory(id);
      res.json({ message: "Service category deleted" });
    } catch (error) {
      console.error("Error deleting service category:", error);
      res.status(500).json({ message: "Failed to delete service category" });
    }
  });

  // Payment Methods routes (POS functionality like Planity)
  app.get('/api/payment-methods', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const methods = await storage.getPaymentMethods(userId);
      res.json(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  app.post('/api/payment-methods', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const methodData = insertPaymentMethodSchema.parse({ ...req.body, userId });
      const method = await storage.createPaymentMethod(methodData);
      res.json(method);
    } catch (error) {
      console.error("Error creating payment method:", error);
      res.status(400).json({ message: "Failed to create payment method" });
    }
  });

  // Transactions routes (financial tracking like Planity)
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchema.parse({ ...req.body, userId });
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });

  // Booking Pages routes (custom booking pages like Treatwell)
  app.get('/api/booking-pages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pages = await storage.getBookingPages(userId);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching booking pages:", error);
      res.status(500).json({ message: "Failed to fetch booking pages" });
    }
  });

  app.post('/api/booking-pages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pageData = insertBookingPageSchema.parse({ ...req.body, userId });
      const page = await storage.createBookingPage(pageData);
      res.json(page);
    } catch (error) {
      console.error("Error creating booking page:", error);
      res.status(400).json({ message: "Failed to create booking page" });
    }
  });

  // Public booking page access
  app.get('/booking/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getBookingPageBySlug(slug);
      
      if (!page) {
        return res.status(404).send("Page de réservation non trouvée");
      }

      // Get salon profile for public booking
      const salonProfile = await storage.getSalonProfile(page.userId);
      
      // Render booking page with salon info
      res.send(`
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réserver chez ${salonProfile.user.businessName}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .salon-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
            .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .service-card { background: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef; }
            .btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 6px; text-decoration: none; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="salon-header">
            <h1>${salonProfile.user.businessName || 'Salon de Beauté'}</h1>
            <p>${salonProfile.user.address || ''}</p>
            <p>📞 ${salonProfile.user.phone || ''}</p>
          </div>
          
          <h2>🌟 Nos Services</h2>
          <div class="services-grid">
            ${salonProfile.services.map(service => `
              <div class="service-card">
                <h3>${service.name}</h3>
                <p><strong>Prix:</strong> ${service.price}€</p>
                <p><strong>Durée:</strong> ${service.duration} min</p>
                <p>${service.description || ''}</p>
                <a href="/book-service/${service.id}?page=${slug}" class="btn">Réserver maintenant</a>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Powered by Beauty Pro - Votre plateforme de réservation</p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error("Error loading booking page:", error);
      res.status(500).send("Erreur lors du chargement de la page");
    }
  });

  // Staff Availability routes (advanced scheduling like Planity)
  app.get('/api/staff/:staffId/availability', isAuthenticated, async (req: any, res) => {
    try {
      const staffId = parseInt(req.params.staffId);
      const availability = await storage.getStaffAvailability(staffId);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching staff availability:", error);
      res.status(500).json({ message: "Failed to fetch staff availability" });
    }
  });

  app.post('/api/staff/:staffId/availability', isAuthenticated, async (req: any, res) => {
    try {
      const staffId = parseInt(req.params.staffId);
      const availabilityData = insertStaffAvailabilitySchema.parse({ ...req.body, staffId });
      const availability = await storage.createStaffAvailability(availabilityData);
      res.json(availability);
    } catch (error) {
      console.error("Error creating staff availability:", error);
      res.status(400).json({ message: "Failed to create staff availability" });
    }
  });

  // Inventory Management routes (for beauty products)
  app.get('/api/inventory', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const inventory = await storage.getInventory(userId);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post('/api/inventory', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = insertInventorySchema.parse({ ...req.body, userId });
      const item = await storage.createInventoryItem(itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(400).json({ message: "Failed to create inventory item" });
    }
  });

  app.get('/api/inventory/low-stock', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lowStockItems = await storage.getLowStockItems(userId);
      res.json(lowStockItems);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  // Marketing Campaigns routes (like Treatwell's marketing tools)
  app.get('/api/marketing-campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaigns = await storage.getMarketingCampaigns(userId);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching marketing campaigns:", error);
      res.status(500).json({ message: "Failed to fetch marketing campaigns" });
    }
  });

  app.post('/api/marketing-campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaignData = insertMarketingCampaignSchema.parse({ ...req.body, userId });
      const campaign = await storage.createMarketingCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      console.error("Error creating marketing campaign:", error);
      res.status(400).json({ message: "Failed to create marketing campaign" });
    }
  });

  // Available time slots route (smart scheduling)
  app.get('/api/services/:serviceId/available-slots', async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      const { userId, staffId, date } = req.query;
      
      const slots = await storage.getAvailableTimeSlots(
        userId as string, 
        serviceId, 
        staffId ? parseInt(staffId as string) : null, 
        date as string
      );
      res.json(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  // Salon search and marketplace (like Treatwell)
  app.get('/api/search/salons', async (req, res) => {
    try {
      const { query, location, service } = req.query;
      const salons = await storage.searchSalons(
        query as string, 
        location as string, 
        service as string
      );
      res.json(salons);
    } catch (error) {
      console.error("Error searching salons:", error);
      res.status(500).json({ message: "Failed to search salons" });
    }
  });

  app.get('/api/salon/:userId/profile', async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getSalonProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching salon profile:", error);
      res.status(500).json({ message: "Failed to fetch salon profile" });
    }
  });

  // Revenue and financial reporting routes
  app.get('/api/reports/revenue', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      const revenue = await storage.getRevenueByPeriod(userId, startDate as string, endDate as string);
      res.json(revenue);
    } catch (error) {
      console.error("Error fetching revenue report:", error);
      res.status(500).json({ message: "Failed to fetch revenue report" });
    }
  });

  app.get('/api/reports/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      const summary = await storage.getPaymentSummary(userId, startDate as string, endDate as string);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching payment summary:", error);
      res.status(500).json({ message: "Failed to fetch payment summary" });
    }
  });

  // Client Preferences routes
  app.get('/api/clients/:clientId/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const preferences = await storage.getClientPreferences(clientId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching client preferences:", error);
      res.status(500).json({ message: "Failed to fetch client preferences" });
    }
  });

  app.post('/api/clients/:clientId/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const preferencesData = insertClientPreferencesSchema.parse({ ...req.body, clientId });
      const preferences = await storage.createClientPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error creating client preferences:", error);
      res.status(400).json({ message: "Failed to create client preferences" });
    }
  });

  // Client Communication History routes
  app.get('/api/clients/:clientId/communications', isAuthenticated, async (req: any, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const communications = await storage.getClientCommunications(clientId);
      res.json(communications);
    } catch (error) {
      console.error("Error fetching client communications:", error);
      res.status(500).json({ message: "Failed to fetch client communications" });
    }
  });

  app.post('/api/clients/:clientId/communications', isAuthenticated, async (req: any, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const communicationData = insertClientCommunicationSchema.parse({ ...req.body, clientId });
      const communication = await storage.createClientCommunication(communicationData);
      res.json(communication);
    } catch (error) {
      console.error("Error creating client communication:", error);
      res.status(400).json({ message: "Failed to create client communication" });
    }
  });

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Push Notifications Management
  app.post('/api/notifications/register-token', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { token, deviceType } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      // Import pushTokens from schema
      const { pushTokens } = await import('../shared/schema');
      const { db } = await import('./db');
      const { eq } = await import('drizzle-orm');

      // Deactivate existing tokens for this user
      await db
        .update(pushTokens)
        .set({ isActive: false })
        .where(eq(pushTokens.userId, userId));

      // Insert new token
      await db.insert(pushTokens).values({
        userId,
        token,
        deviceType: deviceType || 'unknown',
        isActive: true
      });

      res.json({ success: true, message: "Token registered successfully" });
    } catch (error) {
      console.error("Error registering push token:", error);
      res.status(500).json({ message: "Failed to register push token" });
    }
  });

  // Test notification endpoint
  app.post('/api/notifications/test', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type, appointmentId } = req.body;

      switch (type) {
        case 'new_booking':
          if (appointmentId) {
            await notificationService.sendNewBookingNotification(appointmentId);
          }
          break;
        case 'gap_detected':
          const today = new Date().toISOString().split('T')[0];
          await notificationService.detectAndNotifyGaps(userId, today);
          break;
        case 'reminder':
          if (appointmentId) {
            await notificationService.sendReminderNotification(appointmentId);
          }
          break;
        default:
          return res.status(400).json({ message: "Invalid notification type" });
      }

      res.json({ success: true, message: "Test notification sent" });
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });

  // Route de téléchargement du code complet
  app.get('/download-code', (req, res) => {
    const filePath = './salon-beaute-code-complet.zip';
    
    if (require('fs').existsSync(filePath)) {
      res.download(filePath, 'salon-beaute-code-complet.zip', (err) => {
        if (err) {
          console.error('Erreur de téléchargement:', err);
          res.status(500).send('Erreur lors du téléchargement');
        }
      });
    } else {
      res.status(404).send('Fichier non trouvé');
    }
  });

  function broadcastToClients(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  return httpServer;
}
