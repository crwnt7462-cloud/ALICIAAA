import {
  users,
  clientAccounts,
  services,
  clients,
  staffMembers,
  appointments,
  subscriptions,
  clientNotes,
  customTags,
  salonPhotos,
  type User,
  type UpsertUser,
  type InsertUser,
  type RegisterRequest,
  type ClientRegisterRequest,
  type Service,
  type InsertService,
  type Client,
  type InsertClient,
  type StaffMember,
  type InsertStaffMember,
  type Appointment,
  type InsertAppointment,
  type ClientNote,
  type InsertClientNote,
  type CustomTag,
  type InsertCustomTag,
  type SalonPhoto,
  type InsertSalonPhoto,
  salonRegistrations,
  type SalonRegistration,
  type InsertSalonRegistration,
  businessRegistrations,
  type BusinessRegistration,
  type InsertBusinessRegistration,
} from "@shared/schema";

// Import types separately to avoid circular dependency
import type { ClientAccount, InsertClientAccount } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

// Type temporaire pour la connexion
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  address: string;
  city: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
}

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Professional Authentication
  createUser(userData: RegisterRequest): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  
  // Client Authentication
  createClientAccount(clientData: ClientRegisterRequest): Promise<ClientAccount>;
  authenticateClient(email: string, password: string): Promise<ClientAccount | null>;
  getClientAccount(id: number): Promise<ClientAccount | undefined>;
  getClientAccountByEmail(email: string): Promise<ClientAccount | undefined>;

  // Salon Data Management
  getSalonData(salonId: string): Promise<any | undefined>;
  saveSalonData(salonId: string, salonData: any): Promise<void>;

  // Services
  getServices(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Clients
  getClients(userId: string): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Staff
  getStaff(userId: string): Promise<StaffMember[]>;
  createStaff(staff: InsertStaffMember): Promise<StaffMember>;
  updateStaff(id: number, staff: Partial<InsertStaffMember>): Promise<StaffMember>;
  deleteStaff(id: number): Promise<void>;

  // Appointments
  getAppointments(userId: string, date?: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  
  // Dashboard Stats
  getDashboardStats(userId: string): Promise<any>;
  getRevenueChart(userId: string): Promise<any[]>;
  getUpcomingAppointments(userId: string): Promise<any[]>;
  getTopServices(userId: string): Promise<any[]>;
  getStaffPerformance(userId: string): Promise<any[]>;
  getClientRetentionRate(userId: string): Promise<any>;

  // Booking Pages Management
  getCurrentBookingPage(userId: string): Promise<any>;
  updateCurrentBookingPage(userId: string, data: any): Promise<any>;
  updateBookingPage(salonId: string, data: any): Promise<any>;
  updateUserProfile(userId: string, data: any): Promise<User>;

  // Salon Registration
  createSalonRegistration(salon: InsertSalonRegistration): Promise<SalonRegistration>;
  getSalonRegistration(id: number): Promise<SalonRegistration | undefined>;
  updateSalonPaymentStatus(id: number, status: string): Promise<SalonRegistration>;
  
  // Business Registration
  createBusinessRegistration(registration: InsertBusinessRegistration): Promise<BusinessRegistration>;
  getBusinessRegistration(id: number): Promise<BusinessRegistration | undefined>;
  updateBusinessRegistrationStatus(id: number, status: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<BusinessRegistration | undefined>;
  
  // Public Services
  getServicesByUserId(userId: string): Promise<Service[]>;

  // Salon Management (in-memory storage)
  createSalon(salonData: any): Promise<any>;
  getSalon(salonId: string): Promise<any>;
  updateSalon(salonId: string, updateData: any): Promise<any>;

  // Additional required methods
  createSubscription(subscriptionData: any): Promise<any>;
  getSubscriptionsByUserId(userId: string): Promise<any[]>;
  getClientsByProfessional(professionalId: string): Promise<any[]>;
  
  // Inventory Management
  getInventory(userId: string): Promise<any[]>;
  getLowStockItems(userId: string): Promise<any[]>;
  createInventoryItem(userId: string, item: any): Promise<any>;
  updateInventoryItem(id: number, item: any): Promise<any>;
  deleteInventoryItem(id: number): Promise<void>;
  
  // Notifications
  getNotifications(userId: string): Promise<any[]>;
  createNotification(userId: string, notification: any): Promise<any>;
  
  // IA Conversations
  saveConversation(userId: string, conversationId: string, conversation: any): Promise<any>;
  getConversations(userId: string): Promise<any[]>;
  deleteConversation(userId: string, conversationId: string): Promise<void>;
  clearConversations(userId: string): Promise<void>;
  
  // Client AI Messages
  getClientAIMessages(userId: string): Promise<any[]>;
  deleteClientAIMessage(userId: string, messageId: string): Promise<void>;
  clearClientAIMessages(userId: string): Promise<void>;
  
  // Business operations
  getBusinessByEmail(email: string): Promise<any>;
  createBusiness(businessData: any): Promise<any>;
  
  // Service by ID
  getServiceById(serviceId: number): Promise<any>;
  
  // Salon operations
  salons: Map<string, any>;
  createOrUpdateClientNote(noteData: any): Promise<any>;
  getCustomTagsByProfessional(professionalId: string): Promise<any[]>;
  createCustomTag(tagData: any): Promise<any>;
  deleteCustomTag(tagId: string): Promise<void>;

  // Salon Photos Management
  getSalonPhotos(userId: string): Promise<SalonPhoto[]>;
  addSalonPhoto(photo: InsertSalonPhoto): Promise<SalonPhoto>;
  updateSalonPhoto(id: number, photo: Partial<InsertSalonPhoto>): Promise<SalonPhoto>;
  deleteSalonPhoto(id: number): Promise<void>;

  // Messages IA automatiques pour analyse clients
  saveClientAIMessage(userId: string, messageData: any): Promise<void>;
  getClientAIMessages(userId: string): Promise<any[]>;
  deleteClientAIMessage(userId: string, messageId: string): Promise<void>;
  clearClientAIMessages(userId: string): Promise<void>;

  // Conversations IA en temps réel
  saveConversation(userId: string, conversationId: string, conversationData: any): Promise<void>;
  getConversations(userId: string): Promise<any[]>;
  deleteConversation(userId: string, conversationId: string): Promise<void>;
  clearConversations(userId: string): Promise<void>;

  // Client Appointments linked to accounts (removed - using getAppointments instead)
}

export class DatabaseStorage implements IStorage {
  // Stockage en mémoire pour les salons (développement)
  public salons: Map<string, any> = new Map();
  // Stockage en mémoire pour les messages IA clients
  private clientAIMessages: Map<string, any[]> = new Map();
  // Stockage en mémoire pour les conversations IA en temps réel
  private conversations: Map<string, Map<string, any>> = new Map();

  // Implémentation des nouvelles fonctionnalités pour les photos de salon
  async getSalonPhotos(userId: string): Promise<SalonPhoto[]> {
    return await db.select().from(salonPhotos).where(eq(salonPhotos.userId, userId));
  }

  async addSalonPhoto(photo: InsertSalonPhoto): Promise<SalonPhoto> {
    const [newPhoto] = await db.insert(salonPhotos).values(photo).returning();
    return newPhoto;
  }

  async updateSalonPhoto(id: number, photo: Partial<InsertSalonPhoto>): Promise<SalonPhoto> {
    const [updated] = await db.update(salonPhotos)
      .set({ ...photo, updatedAt: new Date() })
      .where(eq(salonPhotos.id, id))
      .returning();
    return updated;
  }

  async deleteSalonPhoto(id: number): Promise<void> {
    await db.delete(salonPhotos).where(eq(salonPhotos.id, id));
  }
  async getUser(id: string): Promise<User | undefined> {
    // Return demo user for testing
    if (id === "demo") {
      return {
        id: "demo",
        email: "demo@salon.com",
        password: null,
        firstName: "Marie",
        lastName: "Dubois",
        profileImageUrl: null,
        businessName: "Salon Beautiful",
        phone: "01 42 34 56 78",
        address: "123 Avenue de la Beauté, 75001 Paris",
        city: "Paris",
        isProfessional: true,
        isVerified: true,
        subscriptionPlan: "basic-pro",
        subscriptionStatus: "active",
        trialEndDate: null,
        mentionHandle: "@demo",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? await this.getUser(userData.id) : null;
    
    if (existingUser) {
      const [updated] = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, userData.id!))
        .returning();
      return updated;
    } else {
      const userId = userData.id || nanoid();
      const [created] = await db.insert(users).values({
        ...userData,
        id: userId,
      }).returning();
      return created;
    }
  }

  async createUser(userData: RegisterRequest): Promise<User> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const userId = nanoid();

    const newUser = {
      id: userId,
      email: userData.email,
      password: hashedPassword,
      businessName: userData.businessName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      isProfessional: true,
      isVerified: false,
      subscriptionPlan: userData.subscriptionPlan || "basic-pro",
      subscriptionStatus: userData.subscriptionStatus || "trial",
      trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }

  // Client Authentication Methods

  async getClientAccount(id: number): Promise<ClientAccount | undefined> {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.id, id));
    return client;
  }

  async getClientAccountByEmail(email: string): Promise<ClientAccount | undefined> {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, email));
    return client;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }

  async authenticateClientAccount(email: string, password: string): Promise<ClientAccount | null> {
    const client = await this.getClientAccountByEmail(email);
    if (!client || !client.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, client.password);
    if (!isValid) {
      return null;
    }

    return client;
  }

  async createClientAccount(userData: ClientRegisterRequest): Promise<ClientAccount> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Générer un handle sécurisé
    const firstName = userData.firstName || 'user';
    const lastName = userData.lastName || 'client';
    const randomNum = Math.floor(Math.random() * 1000);
    const mentionHandle = `@${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNum}`;

    const newClient = {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      dateOfBirth: userData.dateOfBirth || null,
      isVerified: false,
      loyaltyPoints: 0,
      clientStatus: 'regular' as const,
      mentionHandle,
    };

    const [client] = await db.insert(clientAccounts).values(newClient).returning();
    return client;
  }

  async authenticateClient(email: string, password: string): Promise<ClientAccount | null> {
    const client = await this.getClientAccountByEmail(email);
    if (!client || !client.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, client.password);
    if (!isValid) {
      return null;
    }

    return client;
  }

  // Services
  async getServices(userId: string): Promise<Service[]> {
    // Return demo services for testing
    if (userId === "demo") {
      return [
        {
          id: 1,
          userId: "demo",
          categoryId: 1,
          name: "Coupe + Brushing",
          description: "Coupe personnalisée avec brushing professionnel",
          price: "45",
          duration: 60,
          isActive: true,
          isOnlineBookable: true,
          requiresDeposit: true,
          depositAmount: "13.50",
          maxAdvanceBooking: 30,
          color: "#8B5CF6",
          createdAt: new Date()
        },
        {
          id: 2,
          userId: "demo",
          categoryId: 1,
          name: "Coloration complète",
          description: "Coloration avec soins capillaires inclus",
          price: "85",
          duration: 120,
          isActive: true,
          isOnlineBookable: true,
          requiresDeposit: true,
          depositAmount: "25.50",
          maxAdvanceBooking: 30,
          color: "#8B5CF6",
          createdAt: new Date()
        },
        {
          id: 3,
          userId: "demo",
          categoryId: 2,
          name: "Soin visage relaxant",
          description: "Nettoyage de peau avec masque hydratant",
          price: "65",
          duration: 75,
          isActive: true,
          isOnlineBookable: true,
          requiresDeposit: true,
          depositAmount: "19.50",
          maxAdvanceBooking: 30,
          color: "#F59E0B",
          createdAt: new Date()
        }
      ];
    }

    return await db
      .select()
      .from(services)
      .where(eq(services.userId, userId))
      .orderBy(services.name);
  }

  async getActiveServices(userId: string): Promise<any[]> {
    try {
      const activeServices = await db
        .select()
        .from(services)
        .where(eq(services.userId, userId));
      
      return activeServices.filter(service => service.isActive);
    } catch (error) {
      console.error('Erreur récupération services actifs:', error);
      return [];
    }
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Clients
  async getClients(userId: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(clients.lastName, clients.firstName);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const [updated] = await db
      .update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return updated;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Staff
  async getStaff(userId: string): Promise<StaffMember[]> {
    return await db
      .select()
      .from(staffMembers)
      .where(eq(staffMembers.userId, userId))
      .orderBy(staffMembers.lastName, staffMembers.firstName);
  }

  async createStaff(staffMember: InsertStaffMember): Promise<StaffMember> {
    const [newStaff] = await db.insert(staffMembers).values(staffMember).returning();
    return newStaff;
  }

  async updateStaff(id: number, staffMember: Partial<InsertStaffMember>): Promise<StaffMember> {
    const [updated] = await db
      .update(staffMembers)
      .set(staffMember)
      .where(eq(staffMembers.id, id))
      .returning();
    return updated;
  }

  async deleteStaff(id: number): Promise<void> {
    await db.delete(staffMembers).where(eq(staffMembers.id, id));
  }

  // Appointments
  async getAppointments(userId: string, date?: string): Promise<Appointment[]> {
    let query = db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId));

    if (date) {
      query = db
        .select()
        .from(appointments)
        .where(and(eq(appointments.userId, userId), eq(appointments.appointmentDate, date)));
    }

    return await query.orderBy(appointments.appointmentDate, appointments.startTime);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    try {
      const [newAppointment] = await db.insert(appointments).values(appointment).returning();
      return newAppointment;
    } catch (error) {
      console.error('Erreur création appointment:', error);
      throw error;
    }
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updated] = await db
      .update(appointments)
      .set(appointment)
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  // Dashboard Stats
  async getDashboardStats(userId: string): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    
    // Count today's appointments
    const todayAppointments = await db
      .select({ count: sql`count(*)` })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        eq(appointments.appointmentDate, today)
      ));

    // Calculate week revenue (mock data for now)
    const weekRevenue = 2450.0;
    const monthRevenue = 12750.0;
    const totalClients = await db
      .select({ count: sql`count(*)` })
      .from(clients)
      .where(eq(clients.userId, userId));

    return {
      todayAppointments: Number(todayAppointments[0]?.count || 0),
      weekRevenue,
      monthRevenue,
      totalClients: Number(totalClients[0]?.count || 0),
      growthRate: 12.5,
      pendingAppointments: 3,
      completedToday: 8,
      avgRating: 4.8,
    };
  }

  async getRevenueChart(userId: string): Promise<any[]> {
    // Mock revenue data - in production, this would aggregate actual transaction data
    return [
      { date: "2025-06-21", revenue: 320 },
      { date: "2025-06-22", revenue: 450 },
      { date: "2025-06-23", revenue: 280 },
      { date: "2025-06-24", revenue: 520 },
      { date: "2025-06-25", revenue: 380 },
      { date: "2025-06-26", revenue: 610 },
      { date: "2025-06-27", revenue: 490 },
    ];
  }

  async getUpcomingAppointments(userId: string): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    
    return await db
      .select({
        id: appointments.id,
        date: appointments.appointmentDate,
        time: appointments.startTime,
        clientName: appointments.clientName,
        serviceName: services.name,
        status: appointments.status,
        totalPrice: appointments.totalPrice,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, today)
      ))
      .orderBy(appointments.appointmentDate, appointments.startTime)
      .limit(10);
  }

  async getTopServices(userId: string): Promise<any[]> {
    // Mock data - in production would aggregate from appointments
    return [
      { serviceName: "Coupe + Brushing", bookings: 45, revenue: 1350 },
      { serviceName: "Coloration", bookings: 28, revenue: 1680 },
      { serviceName: "Soin capillaire", bookings: 32, revenue: 960 },
      { serviceName: "Coupe homme", bookings: 38, revenue: 950 },
    ];
  }

  async getStaffPerformance(userId: string): Promise<any[]> {
    // Mock data - in production would aggregate from appointments with staff assignments
    return [
      { staffName: "Marie Dubois", appointments: 24, revenue: 1440, rating: 4.9 },
      { staffName: "Sophie Martin", appointments: 31, revenue: 1860, rating: 4.7 },
      { staffName: "Laura Petit", appointments: 19, revenue: 1140, rating: 4.8 },
    ];
  }

  async getClientRetentionRate(userId: string): Promise<any> {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    try {
      // Clients ayant eu au moins un RDV dans les 6 derniers mois
      const clientsWithAppointments = await db
        .select({
          clientEmail: appointments.clientEmail,
          appointmentDate: appointments.appointmentDate,
        })
        .from(appointments)
        .where(and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, sixMonthsAgo.toISOString().split('T')[0])
        ))
        .orderBy(appointments.clientEmail, desc(appointments.appointmentDate));

      // Grouper par client et calculer les statistiques
      const clientStats = new Map();
      
      clientsWithAppointments.forEach(appointment => {
        const email = appointment.clientEmail;
        const date = new Date(appointment.appointmentDate);
        
        if (!clientStats.has(email)) {
          clientStats.set(email, {
            lastVisit: date,
            visitCount: 0,
            visits: []
          });
        }
        
        const client = clientStats.get(email);
        client.visitCount++;
        client.visits.push(date);
        
        if (date > client.lastVisit) {
          client.lastVisit = date;
        }
      });

      // Calculer les taux de récurrence
      let returningClients30Days = 0;
      let returningClients90Days = 0;
      let loyalClients = 0; // 3+ visites
      let vipClients = 0; // 5+ visites
      const totalClients = clientStats.size;

      clientStats.forEach(client => {
        // Client récurrent si dernière visite dans les 30 jours
        if (client.lastVisit >= oneMonthAgo) {
          returningClients30Days++;
        }
        
        // Client récurrent si dernière visite dans les 90 jours
        if (client.lastVisit >= threeMonthsAgo) {
          returningClients90Days++;
        }
        
        // Client fidèle si 3+ visites
        if (client.visitCount >= 3) {
          loyalClients++;
        }
        
        // Client VIP si 5+ visites
        if (client.visitCount >= 5) {
          vipClients++;
        }
      });

      const retentionRate30Days = totalClients > 0 ? Math.round((returningClients30Days / totalClients) * 100) : 0;
      const retentionRate90Days = totalClients > 0 ? Math.round((returningClients90Days / totalClients) * 100) : 0;
      const loyaltyRate = totalClients > 0 ? Math.round((loyalClients / totalClients) * 100) : 0;
      const vipRate = totalClients > 0 ? Math.round((vipClients / totalClients) * 100) : 0;

      return {
        totalClients,
        retentionRate30Days,
        retentionRate90Days,
        loyaltyRate,
        vipRate,
        returningClients30Days,
        returningClients90Days,
        loyalClients,
        vipClients,
        averageVisitsPerClient: totalClients > 0 ? Math.round(
          Array.from(clientStats.values()).reduce((sum, client) => sum + client.visitCount, 0) / totalClients * 10
        ) / 10 : 0
      };
    } catch (error) {
      console.error("Error calculating client retention:", error);
      // Données par défaut en cas d'erreur
      return {
        totalClients: 0,
        retentionRate30Days: 0,
        retentionRate90Days: 0,
        loyaltyRate: 0,
        vipRate: 0,
        returningClients30Days: 0,
        returningClients90Days: 0,
        loyalClients: 0,
        vipClients: 0,
        averageVisitsPerClient: 0
      };
    }
  }
  // Booking Pages Management
  async getCurrentBookingPage(userId: string): Promise<any> {
    try {
      // Import bookingPages here to avoid circular imports
      const { bookingPages } = await import("@shared/schema");
      const [bookingPage] = await db
        .select()
        .from(bookingPages)
        .where(eq(bookingPages.userId, userId))
        .limit(1);

      if (bookingPage) {
        return bookingPage;
      }

      // If no booking page exists, create a default one
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const defaultPageUrl = `salon-${userId}-${Date.now()}`;
      const [newPage] = await db
        .insert(bookingPages)
        .values({
          userId,
          pageUrl: defaultPageUrl,
          salonName: user.businessName || `Salon ${user.firstName || 'Beauty'}`,
          salonDescription: `Salon de beauté professionnel - Prenez rendez-vous en ligne`,
          salonAddress: user.address || '',
          salonPhone: user.phone || '',
          salonEmail: user.email,
          selectedServices: [],
          template: 'moderne',
          primaryColor: '#8B5CF6',
          secondaryColor: '#F59E0B',
          showPrices: true,
          enableOnlineBooking: true,
          requireDeposit: true,
          depositPercentage: 30,
          businessHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '19:00', closed: false },
            friday: { open: '09:00', close: '19:00', closed: false },
            saturday: { open: '08:00', close: '17:00', closed: false },
            sunday: { open: '10:00', close: '16:00', closed: false }
          },
          isPublished: false
        })
        .returning();

      return newPage;
    } catch (error) {
      console.error("Error getting current booking page:", error);
      throw error;
    }
  }

  async updateCurrentBookingPage(userId: string, data: any): Promise<any> {
    try {
      const { bookingPages } = await import("@shared/schema");
      const [updatedPage] = await db
        .update(bookingPages)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(bookingPages.userId, userId))
        .returning();

      return updatedPage;
    } catch (error) {
      console.error("Error updating booking page:", error);
      throw error;
    }
  }

  async updateBookingPage(salonId: string, data: any): Promise<any> {
    try {
      console.log('💾 Mise à jour page de réservation:', salonId, Object.keys(data));
      
      // Mettre à jour dans la Map des salons
      if (this.salons.has(salonId)) {
        const existingSalon = this.salons.get(salonId);
        const updatedSalon = { ...existingSalon, ...data };
        this.salons.set(salonId, updatedSalon);
        console.log('✅ Page de réservation mise à jour dans le cache:', salonId);
        return updatedSalon;
      } else {
        // Créer un nouveau salon si n'existe pas
        const newSalon = { id: salonId, ...data };
        this.salons.set(salonId, newSalon);
        console.log('✅ Nouvelle page de réservation créée:', salonId);
        return newSalon;
      }
    } catch (error) {
      console.error("Error updating booking page:", error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, data: any): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
  
  async verifyPassword(password: string, hashedPassword: string | null): Promise<boolean> {
    if (!hashedPassword) return false;
    return await bcrypt.compare(password, hashedPassword);
  }

  // Recherche de professionnels par handle
  async searchProfessionalsByHandle(searchTerm: string): Promise<any[]> {
    const cleanTerm = searchTerm.replace('@', '').toLowerCase();
    try {
      const results = await db.select({
        id: users.id,
        businessName: users.businessName,
        firstName: users.firstName,
        lastName: users.lastName,
        mentionHandle: users.mentionHandle,
        address: users.address,
        phone: users.phone
      }).from(users)
      .limit(10);
      
      return results.filter(user => 
        user.mentionHandle?.toLowerCase().includes(cleanTerm)
      );
    } catch (error) {
      console.error("Error searching professionals:", error);
      return [];
    }
  }

  // Suppression du système de messagerie selon les spécifications

  async getClientMessages(clientId: string): Promise<any[]> {
    // For now, return empty array - will be implemented with real messaging
    return [];
  }

  // Password reset methods
  async savePasswordResetToken(email: string, token: string): Promise<void> {
    // In a real system, this would save to a password_reset_tokens table
    console.log(`Password reset token for ${email}: ${token}`);
  }

  // Payment methods for professionals
  async getPaymentMethods(userId: string): Promise<any[]> {
    // For now, return some default methods
    return [
      { id: 1, name: "Carte bancaire", type: "card", isActive: true, fees: 0 },
      { id: 2, name: "Espèces", type: "cash", isActive: true, fees: 0 },
      { id: 3, name: "Chèques", type: "check", isActive: false, fees: 0 }
    ];
  }

  async addPaymentMethod(methodData: any): Promise<any> {
    // In a real system, this would insert to payment_methods table
    const newMethod = {
      id: Date.now(),
      ...methodData
    };
    console.log('Adding payment method:', newMethod);
    return newMethod;
  }

  // Implement missing methods
  async createSubscription(subscriptionData: any): Promise<any> {
    try {
      const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getSubscriptionsByUserId(userId: string): Promise<any[]> {
    try {
      return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }



  async getCustomTagsByProfessional(professionalId: string): Promise<any[]> {
    try {
      return await db.select().from(customTags).where(eq(customTags.professionalId, professionalId));
    } catch (error) {
      console.error('Error fetching custom tags:', error);
      return [];
    }
  }

  async createCustomTag(tagData: any): Promise<any> {
    try {
      const [tag] = await db.insert(customTags).values(tagData).returning();
      return tag;
    } catch (error) {
      console.error('Error creating custom tag:', error);
      throw error;
    }
  }

  async deleteCustomTag(tagId: string): Promise<void> {
    try {
      await db.delete(customTags).where(eq(customTags.id, tagId));
    } catch (error) {
      console.error('Error deleting custom tag:', error);
      throw error;
    }
  }

  async updatePaymentMethod(id: number, data: any): Promise<void> {
    console.log(`Updating payment method ${id}:`, data);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    console.log(`Deleting payment method ${id}`);
  }

  // Salon Registration methods
  async createSalonRegistration(salon: InsertSalonRegistration): Promise<SalonRegistration> {
    const [registration] = await db
      .insert(salonRegistrations)
      .values(salon)
      .returning();
    return registration;
  }

  async getSalonRegistration(id: number): Promise<SalonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(salonRegistrations)
      .where(eq(salonRegistrations.id, id));
    return registration;
  }

  async updateSalonPaymentStatus(id: number, status: string): Promise<SalonRegistration> {
    const [updated] = await db
      .update(salonRegistrations)
      .set({ paymentStatus: status, updatedAt: new Date() })
      .where(eq(salonRegistrations.id, id))
      .returning();
    return updated;
  }

  // Business registration methods
  async createBusinessRegistration(data: InsertBusinessRegistration): Promise<BusinessRegistration> {
    const [registration] = await db
      .insert(businessRegistrations)
      .values(data)
      .returning();
    return registration;
  }

  async getBusinessRegistration(id: number): Promise<BusinessRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.id, id));
    return registration;
  }

  async updateBusinessRegistrationStatus(
    id: number, 
    status: string, 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string
  ): Promise<BusinessRegistration | undefined> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (stripeCustomerId) {
      updateData.stripeCustomerId = stripeCustomerId;
    }
    if (stripeSubscriptionId) {
      updateData.stripeSubscriptionId = stripeSubscriptionId;
    }

    const [updated] = await db
      .update(businessRegistrations)
      .set(updateData)
      .where(eq(businessRegistrations.id, id))
      .returning();
    return updated;
  }

  // Public Services method for API routes
  async getServicesByUserId(userId: string): Promise<Service[]> {
    return await this.getServices(userId);
  }

  // Salon Management methods (in-memory storage)
  async createSalon(salonData: any): Promise<any> {
    const salon = {
      id: salonData.id || Date.now().toString(),
      name: salonData.name,
      description: salonData.description || "Un salon de beauté moderne et professionnel",
      address: salonData.address,
      phone: salonData.phone || "",
      email: salonData.email || "",
      website: salonData.website || "",
      subscriptionPlan: salonData.subscriptionPlan,
      services: salonData.services || [
        { id: 1, name: "Coupe & Brushing", price: 45, duration: 60, description: "Coupe personnalisée et brushing professionnel" },
        { id: 2, name: "Coloration", price: 80, duration: 120, description: "Coloration complète avec soins" },
        { id: 3, name: "Soin du visage", price: 65, duration: 75, description: "Soin hydratant et purifiant" }
      ],
      photos: salonData.photos || ["/salon-photo1.jpg", "/salon-photo2.jpg"],
      tags: salonData.tags || ["moderne", "professionnel", "accessible"],
      openingHours: salonData.openingHours || {
        lundi: "9h00-19h00",
        mardi: "9h00-19h00", 
        mercredi: "9h00-19h00",
        jeudi: "9h00-19h00",
        vendredi: "9h00-19h00",
        samedi: "9h00-18h00",
        dimanche: "Fermé"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.salons.set(salon.id, salon);
    return salon;
  }

  async getSalon(salonId: string): Promise<any> {
    return this.salons.get(salonId) || null;
  }

  async updateSalon(salonId: string, updateData: any): Promise<any> {
    const existingSalon = this.salons.get(salonId);
    if (!existingSalon) {
      return null;
    }

    const updatedSalon = {
      ...existingSalon,
      ...updateData,
      updatedAt: new Date()
    };

    this.salons.set(salonId, updatedSalon);
    return updatedSalon;
  }

  // Client Notes Management for Professionals
  async getClientNote(clientId: string, professionalId: string): Promise<ClientNote | undefined> {
    const [note] = await db
      .select()
      .from(clientNotes)
      .where(
        and(
          eq(clientNotes.clientId, clientId),
          eq(clientNotes.professionalId, professionalId)
        )
      );
    return note;
  }

  async createOrUpdateClientNote(noteData: InsertClientNote): Promise<ClientNote> {
    const existingNote = await this.getClientNote(noteData.clientId, noteData.professionalId);
    
    if (existingNote) {
      const [updatedNote] = await db
        .update(clientNotes)
        .set({
          ...noteData,
          updatedAt: new Date()
        })
        .where(eq(clientNotes.id, existingNote.id))
        .returning();
      return updatedNote;
    } else {
      const [newNote] = await db
        .insert(clientNotes)
        .values(noteData)
        .returning();
      return newNote;
    }
  }

  async getClientsByProfessional(professionalId: string): Promise<(Client & { note?: ClientNote })[]> {
    const clientsData = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, professionalId));

    const clientsWithNotes = await Promise.all(
      clientsData.map(async (client) => {
        const note = await this.getClientNote(client.id.toString(), professionalId);
        return { ...client, note };
      })
    );

    return clientsWithNotes;
  }

  // Salon Data Management for Editor
  async getSalonData(salonId: string): Promise<any | undefined> {
    // ✅ CORRECTION MAPPING ID POUR COHÉRENCE
    let actualId = salonId;
    if (salonId === 'current' || salonId === 'auto-generated' || salonId === 'undefined' || !salonId) {
      actualId = 'salon-demo';
    }
    
    // Récupérer depuis le stockage en mémoire avec l'ID corrigé
    const salon = this.salons.get(actualId);
    if (salon) {
      console.log('📖 Salon trouvé en mémoire avec ID corrigé:', actualId, 'pour requête:', salonId);
      return salon;
    }
    
    console.log('ℹ️ Salon non trouvé même avec mapping, retour données par défaut:', actualId, 'pour requête:', salonId);
    return undefined;
  }

  async saveSalonData(salonId: string, salonData: any): Promise<void> {
    // ✅ CORRECTION MAPPING ID POUR COHÉRENCE
    let actualId = salonId;
    if (salonId === 'current' || salonId === 'auto-generated' || salonId === 'undefined' || !salonId) {
      actualId = 'salon-demo';
    }
    
    console.log('💾 Sauvegarde salon avec ID corrigé:', actualId, 'pour requête:', salonId);
    
    // Merger avec les données existantes si elles existent
    const existingSalon = this.salons.get(actualId);
    const updatedSalon = {
      ...existingSalon,
      ...salonData,
      id: actualId, // ✅ Utiliser l'ID corrigé
      updatedAt: new Date().toISOString()
    };
    
    // Sauvegarder en mémoire avec l'ID corrigé
    this.salons.set(actualId, updatedSalon);
    
    console.log('✅ Salon sauvegardé avec succès avec ID corrigé:', actualId);
  }

  // Messages IA automatiques pour analyse clients
  async saveClientAIMessage(userId: string, messageData: any): Promise<void> {
    const userMessages = this.clientAIMessages.get(userId) || [];
    const message = {
      id: messageData.id || `ai-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientName: messageData.clientName,
      riskLevel: messageData.riskLevel,
      message: messageData.message,
      analysis: messageData.analysis,
      actions: messageData.actions,
      timestamp: new Date().toISOString(),
      ...messageData
    };
    
    userMessages.unshift(message); // Ajouter au début pour avoir les plus récents en premier
    this.clientAIMessages.set(userId, userMessages);
    
    console.log('💬 Message IA sauvegardé pour', messageData.clientName);
  }

  async getClientAIMessages(userId: string): Promise<any[]> {
    return this.clientAIMessages.get(userId) || [];
  }

  async deleteClientAIMessage(userId: string, messageId: string): Promise<void> {
    const userMessages = this.clientAIMessages.get(userId) || [];
    const filteredMessages = userMessages.filter(msg => msg.id !== messageId);
    this.clientAIMessages.set(userId, filteredMessages);
  }

  async clearClientAIMessages(userId: string): Promise<void> {
    this.clientAIMessages.set(userId, []);
  }

  // Conversations IA en temps réel
  async saveConversation(userId: string, conversationId: string, conversationData: any): Promise<void> {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, new Map());
    }
    
    const userConversations = this.conversations.get(userId)!;
    userConversations.set(conversationId, {
      ...conversationData,
      savedAt: new Date().toISOString()
    });
    
    console.log('💾 Conversation sauvegardée:', conversationId);
  }

  async getConversations(userId: string): Promise<any[]> {
    const userConversations = this.conversations.get(userId);
    if (!userConversations) {
      return [];
    }
    
    // Retourner toutes les conversations triées par timestamp (plus récentes en premier)
    const conversations = Array.from(userConversations.values());
    return conversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    const userConversations = this.conversations.get(userId);
    if (userConversations) {
      userConversations.delete(conversationId);
      console.log('🗑️ Conversation supprimée:', conversationId);
    }
  }

  async clearConversations(userId: string): Promise<void> {
    this.conversations.set(userId, new Map());
    console.log('🧹 Toutes les conversations supprimées pour:', userId);
  }

  // ===== MÉTHODES INVENTORY (VRAIES DONNÉES) =====
  async getInventory(userId: string): Promise<any[]> {
    try {
      const { inventory } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      return await db
        .select()
        .from(inventory)
        .where(eq(inventory.userId, userId))
        .orderBy(inventory.name);
    } catch (error) {
      console.error('Erreur récupération inventory:', error);
      // Données initiales si pas d'inventory en base
      return [
        {
          id: 1,
          userId,
          name: "Shampoing Professionnel",
          category: "hair_care",
          brand: "L'Oréal",
          currentStock: 15,
          minStock: 10,
          unitCost: 12.50,
          sellingPrice: 25.00,
          isActive: true
        },
        {
          id: 2,
          userId,
          name: "Crème Hydratante",
          category: "skin_care", 
          brand: "Vichy",
          currentStock: 5,
          minStock: 8,
          unitCost: 15.00,
          sellingPrice: 32.00,
          isActive: true
        }
      ];
    }
  }

  async getLowStockItems(userId: string): Promise<any[]> {
    try {
      const { inventory } = await import("@shared/schema");
      const { eq, and, sql } = await import("drizzle-orm");
      
      return await db
        .select()
        .from(inventory)
        .where(
          and(
            eq(inventory.userId, userId),
            sql`${inventory.currentStock} <= ${inventory.minStock}`,
            eq(inventory.isActive, true)
          )
        )
        .orderBy(inventory.name);
    } catch (error) {
      console.error('Erreur récupération articles en rupture:', error);
      return [];
    }
  }

  async createInventoryItem(itemData: any): Promise<any> {
    try {
      const { inventory } = await import("@shared/schema");
      
      const [newItem] = await db
        .insert(inventory)
        .values(itemData)
        .returning();
      
      return newItem;
    } catch (error) {
      console.error('Erreur création article inventory:', error);
      throw error;
    }
  }

  async updateInventoryItem(id: number, itemData: any): Promise<any> {
    try {
      const { inventory } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const [updatedItem] = await db
        .update(inventory)
        .set({ ...itemData, updatedAt: new Date() })
        .where(eq(inventory.id, id))
        .returning();
      
      return updatedItem;
    } catch (error) {
      console.error('Erreur mise à jour article inventory:', error);
      throw error;
    }
  }

  async deleteInventoryItem(id: number): Promise<void> {
    try {
      const { inventory } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      await db
        .delete(inventory)
        .where(eq(inventory.id, id));
    } catch (error) {
      console.error('Erreur suppression article inventory:', error);
      throw error;
    }
  }







  // Business Methods
  async getBusinessByEmail(email: string): Promise<any> {
    // For demo purposes, return null (no existing business)
    return null;
  }

  async createBusiness(businessData: any): Promise<any> {
    // For demo purposes, just return the business data with an ID
    return { id: Date.now(), ...businessData };
  }

  // Service by ID Method
  async getServiceById(serviceId: number): Promise<any> {
    try {
      const [service] = await db.select().from(services).where(eq(services.id, serviceId));
      return service;
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();