import {
  users,
  clientAccounts,
  services,
  clients,
  staff,
  appointments,
  subscriptions,
  clientMessages,
  type User,
  type UpsertUser,
  type InsertUser,
  type RegisterRequest,
  type ClientAccount,
  type InsertClientAccount,
  type ClientRegisterRequest,
  type Service,
  type InsertService,
  type Client,
  type InsertClient,
  type Staff,
  type InsertStaff,
  type Appointment,
  type InsertAppointment,
  type ClientMessage,
  type InsertClientMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Professional Authentication
  createUser(userData: RegisterRequest): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  
  // Client Authentication
  getClientByEmail(email: string): Promise<ClientAccount | undefined>;
  createClientAccount(userData: ClientRegisterRequest): Promise<ClientAccount>;
  authenticateClient(email: string, password: string): Promise<ClientAccount | null>;

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
  getStaff(userId: string): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staff: Partial<InsertStaff>): Promise<Staff>;
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
  updateUserProfile(userId: string, data: any): Promise<User>;
}

export class DatabaseStorage implements IStorage {
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
        country: "France",
        isProfessional: true,
        isVerified: true,
        subscriptionStatus: "active",
        subscriptionPlan: "pro",
        trialEndDate: null,
        reminderOptIn: true,
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
      subscriptionStatus: "trial",
      trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
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

  async getClientByEmail(email: string): Promise<ClientAccount | undefined> {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, email));
    return client;
  }

  async createClientAccount(userData: ClientRegisterRequest): Promise<ClientAccount> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const clientId = nanoid();

    const newClient = {
      id: clientId,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      dateOfBirth: userData.dateOfBirth || null,
      isVerified: false,
    };

    const [client] = await db.insert(clientAccounts).values(newClient).returning();
    return client;
  }

  async authenticateClient(email: string, password: string): Promise<ClientAccount | null> {
    const client = await this.getClientByEmail(email);
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
          name: "Coupe + Brushing",
          description: "Coupe personnalisée avec brushing professionnel",
          price: 45,
          duration: 60,
          category: "coiffure",
          isActive: true,
          requiresDeposit: true,
          depositPercentage: 30,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          userId: "demo",
          name: "Coloration complète",
          description: "Coloration avec soins capillaires inclus",
          price: 85,
          duration: 120,
          category: "coiffure",
          isActive: true,
          requiresDeposit: true,
          depositPercentage: 30,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          userId: "demo",
          name: "Soin visage relaxant",
          description: "Nettoyage de peau avec masque hydratant",
          price: 65,
          duration: 75,
          category: "esthetique",
          isActive: true,
          requiresDeposit: true,
          depositPercentage: 30,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }

    return await db
      .select()
      .from(services)
      .where(eq(services.userId, userId))
      .orderBy(services.name);
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
  async getStaff(userId: string): Promise<Staff[]> {
    return await db
      .select()
      .from(staff)
      .where(eq(staff.userId, userId))
      .orderBy(staff.lastName, staff.firstName);
  }

  async createStaff(staffMember: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffMember).returning();
    return newStaff;
  }

  async updateStaff(id: number, staffMember: Partial<InsertStaff>): Promise<Staff> {
    const [updated] = await db
      .update(staff)
      .set(staffMember)
      .where(eq(staff.id, id))
      .returning();
    return updated;
  }

  async deleteStaff(id: number): Promise<void> {
    await db.delete(staff).where(eq(staff.id, id));
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
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
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

  // Envoyer un message à un professionnel
  async sendMessageToProfessional(messageData: {
    fromClientId: string;
    toProfessionalId: string;
    message: string;
    timestamp: Date;
  }): Promise<ClientMessage> {
    const [newMessage] = await db.insert(clientMessages).values({
      fromClientId: messageData.fromClientId,
      toProfessionalId: messageData.toProfessionalId,
      message: messageData.message,
      isRead: false,
      createdAt: messageData.timestamp,
      updatedAt: messageData.timestamp
    }).returning();
    
    return newMessage;
  }

  // Récupérer les messages d'un professionnel
  async getProfessionalMessages(professionalId: string): Promise<any[]> {
    const professionalMessages = await db
      .select({
        id: clientMessages.id,
        fromClientId: clientMessages.fromClientId,
        message: clientMessages.message,
        isRead: clientMessages.isRead,
        createdAt: clientMessages.createdAt,
        clientName: sql<string>`COALESCE(${clientAccounts.firstName} || ' ' || ${clientAccounts.lastName}, 'Client inconnu')`
      })
      .from(clientMessages)
      .leftJoin(clientAccounts, eq(clientMessages.fromClientId, clientAccounts.id))
      .where(eq(clientMessages.toProfessionalId, professionalId))
      .orderBy(desc(clientMessages.createdAt));

    return professionalMessages;
  }

  // Marquer un message comme lu
  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(clientMessages)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(clientMessages.id, messageId));
  }
  // Client authentication methods
  async authenticateClient(email: string, password: string): Promise<any | null> {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, email));
    if (!client) return null;
    
    const bcrypt = require('bcrypt');
    const isValid = await bcrypt.compare(password, client.passwordHash);
    if (!isValid) return null;
    
    return client;
  }

  async getClientById(id: string): Promise<any | undefined> {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.id, id));
    return client;
  }

  async getClientAppointments(clientId: string): Promise<any[]> {
    const appointmentsList = await db
      .select({
        id: appointments.id,
        serviceName: appointments.serviceName,
        salonName: appointments.salonName,
        date: appointments.date,
        time: appointments.time,
        status: appointments.status,
        price: appointments.price,
        address: appointments.address
      })
      .from(appointments)
      .where(eq(appointments.clientId, clientId))
      .orderBy(desc(appointments.date));
    
    return appointmentsList;
  }

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

  async updatePaymentMethod(id: number, data: any): Promise<void> {
    console.log(`Updating payment method ${id}:`, data);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    console.log(`Deleting payment method ${id}`);
  }
}

export const storage = new DatabaseStorage();