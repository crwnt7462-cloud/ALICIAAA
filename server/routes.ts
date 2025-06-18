import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiService } from "./aiService";
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
      await storage.deleteAppointment(id);
      
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
