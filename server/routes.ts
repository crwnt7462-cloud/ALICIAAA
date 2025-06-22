import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiService } from "./aiService";
import { notificationService } from "./notificationService";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertServiceSchema,
  insertClientSchema,
  insertAppointmentSchema,
  insertForumPostSchema,
  insertForumReplySchema,
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

  app.put('/api/services/:id', isAuthenticated, async (req: any, res) => {
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

  app.put('/api/clients/:id', isAuthenticated, async (req: any, res) => {
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

  app.put('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
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
        appointmentDate, 
        startTime, 
        endTime,
        clientInfo,
        depositAmount 
      } = req.body;

      // Extraction des informations client avec validation
      console.log("clientInfo:", JSON.stringify(clientInfo, null, 2));
      
      if (!clientInfo) {
        console.log("❌ clientInfo is missing");
        return res.status(400).json({ 
          error: "Les informations client sont manquantes" 
        });
      }

      const clientFirstName = clientInfo.firstName;
      const clientLastName = clientInfo.lastName;
      const clientEmail = clientInfo.email;
      const clientPhone = clientInfo.phone;
      const notes = clientInfo.notes || "";

      console.log("✅ Extracted:", { clientFirstName, clientLastName, clientEmail, clientPhone });

      // Validation des champs obligatoires
      if (!clientFirstName || !clientLastName || !clientEmail) {
        console.log("❌ Validation failed - missing:", { 
          firstName: !clientFirstName, 
          lastName: !clientLastName, 
          email: !clientEmail 
        });
        return res.status(400).json({ 
          error: "Les informations client (prénom, nom, email) sont obligatoires" 
        });
      }

      console.log("✅ Validation passed");
      
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
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration || 60,
        clientName: client.name,
        serviceName: appointment.serviceId ? 'Service' : 'Service inconnu',
        price: appointment.price || 0,
        status: appointment.status
      };
      
      const clientBehavior = {
        id: client.id,
        name: client.name,
        totalAppointments: appointmentHistory.length || 1,
        noShowCount: appointmentHistory.filter(h => h.actionType === 'no_show').length,
        cancelCount: appointmentHistory.filter(h => h.actionType === 'cancelled').length,
        avgDaysBetweenVisits: 30,
        lastVisit: new Date(appointment.date),
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
