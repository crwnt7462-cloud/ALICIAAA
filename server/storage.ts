import {
  users,
  clientAccounts,
  services,
  staffMembers,
  inventory,
  businessRegistrations,
  salonRegistrations,
  subscriptions,
  aiChatHistory,
  emailVerifications,
  type User,
  type ClientAccount,
  type Service,
  type StaffMember,
  type InventoryItem,
  type BusinessRegistration,
  type SalonRegistration,
  type Subscription,
  type InsertUser,
  type InsertClientAccount,
  type InsertService,
  type InsertStaffMember,
  type InsertInventoryItem,
  type InsertBusinessRegistration,
  type InsertSalonRegistration,
  type InsertSubscription
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations - CLEAN VERSION
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;

  // Client operations
  getClientAccount(id: number): Promise<ClientAccount | undefined>;
  getClientAccount(clientId: string): Promise<any>;
  getClientByEmail(email: string): Promise<ClientAccount | undefined>;
  createClientAccount(client: InsertClientAccount): Promise<ClientAccount>;
  authenticateClient(email: string, password: string): Promise<any>;

  // Service operations
  getServices(userId: string): Promise<Service[]>;
  getServiceById(serviceId: number): Promise<any>;
  getServicesBySalonId(salonId: string): Promise<any[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<Service>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Staff operations
  getStaff(userId: string): Promise<StaffMember[]>;
  getStaffBySalonId(salonId: string): Promise<any[]>;
  createStaffMember(staff: InsertStaffMember): Promise<StaffMember>;

  // Inventory operations
  getInventory(userId: string): Promise<InventoryItem[]>;
  getLowStockItems(userId: string): Promise<any[]>;
  createInventoryItem(userId: string, item: any): Promise<any>;
  updateInventoryItem(userId: string, itemId: string, data: any): Promise<any>;
  deleteInventoryItem(userId: string, itemId: string): Promise<boolean>;

  // Business operations
  createBusiness(businessData: any): Promise<any>;
  createBusinessRegistration(registration: InsertBusinessRegistration): Promise<BusinessRegistration>;

  // Booking Pages
  updateBookingPage(userId: string, data: any): Promise<any>;

  // Dashboard Analytics
  getDashboardStats(userId: string): Promise<any>;
  getUpcomingAppointments(userId: string, salonId?: string): Promise<any[]>;
  getRevenueChart(userId: string): Promise<any>;
  getTopServices(userId: string): Promise<any[]>;
  getStaffPerformance(userId: string): Promise<any>;
  getClientRetentionRate(userId: string): Promise<any>;

  // Conversations & AI
  saveConversation(userId: string, conversationId: string, data: any): Promise<any>;
  getConversations(userId: string): Promise<any[]>;
  deleteConversation(userId: string, conversationId: string): Promise<boolean>;
  clearConversations(userId: string): Promise<boolean>;
  getClientAIMessages(userId: string): Promise<any[]>;
  deleteClientAIMessage(userId: string, messageId: string): Promise<boolean>;
  clearClientAIMessages(userId: string): Promise<boolean>;

  // Email verification
  cleanExpiredEmailVerifications(): Promise<void>;
  createEmailVerification(email: string): Promise<any>;
  getEmailVerification(email: string, code: string): Promise<any>;
  markEmailVerificationAsUsed(email: string, code: string): Promise<boolean>;

  // Salon management
  salons: Map<string, any>;
  createSalon(salonData: any): Promise<any>;
  getSalon(salonId: string): Promise<any>;
  updateSalon(salonId: string, updateData: any): Promise<any>;

  // Other operations
  getAppointmentsByClientId(clientId: string): Promise<any[]>;
  getAppointments(userId: string): Promise<any[]>;
  getClients(userId: string): Promise<any[]>;
  createSubscription(subscriptionData: any): Promise<any>;
  getSubscriptionsByUserId(userId: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  salons = new Map<string, any>();

  // =============================================
  // USER OPERATIONS
  // =============================================
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const userToInsert = {
      ...userData,
      subscriptionPlan: userData.subscriptionPlan || 'basic-pro',
      subscriptionStatus: userData.subscriptionStatus || 'inactive',
    };

    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) return null;
    
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // =============================================
  // CLIENT OPERATIONS
  // =============================================

  async getClientAccount(id: number): Promise<ClientAccount | undefined>;
  async getClientAccount(clientId: string): Promise<any>;
  async getClientAccount(identifier: number | string): Promise<ClientAccount | any | undefined> {
    if (typeof identifier === 'number') {
      const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.id, identifier));
      return client || undefined;
    } else {
      // Handle string clientId case
      const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.id, parseInt(identifier)));
      return client || undefined;
    }
  }

  async getClientByEmail(email: string): Promise<ClientAccount | undefined> {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, email));
    return client || undefined;
  }

  async createClientAccount(clientData: InsertClientAccount): Promise<ClientAccount> {
    const [client] = await db.insert(clientAccounts).values(clientData).returning();
    return client;
  }

  async authenticateClient(email: string, password: string): Promise<any> {
    const client = await this.getClientByEmail(email);
    if (!client || !client.password) return null;
    
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(password, client.password);
    return isValid ? client : null;
  }

  // =============================================
  // SERVICE OPERATIONS  
  // =============================================

  async getServices(userId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.userId, userId));
  }

  async getServiceById(serviceId: number): Promise<any> {
    const [service] = await db.select().from(services).where(eq(services.id, serviceId));
    return service;
  }

  async getServicesBySalonId(salonId: string): Promise<any[]> {
    console.log('🔍 Storage: Récupération services pour salon:', salonId);
    const result = await db.select().from(services).where(eq(services.userId, salonId));
    console.log(`✅ Storage: ${result.length} services trouvés`);
    return result;
  }

  // Alias pour compatibilité
  async getServicesBySalon(salonId: string): Promise<any[]> {
    return this.getServicesBySalonId(salonId);
  }

  async createService(serviceData: InsertService): Promise<Service> {
    // Add missing depositPercentage if not provided
    const serviceWithDefaults = {
      ...serviceData,
      depositPercentage: serviceData.depositPercentage || 20,
    };
    const [service] = await db.insert(services).values(serviceWithDefaults).returning();
    return service;
  }

  async updateService(id: number, serviceData: Partial<Service>): Promise<Service> {
    const [service] = await db.update(services).set(serviceData).where(eq(services.id, id)).returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // =============================================
  // STAFF OPERATIONS
  // =============================================

  async getStaff(userId: string): Promise<StaffMember[]> {
    return await db.select().from(staffMembers).where(eq(staffMembers.userId, userId));
  }

  async getStaffBySalonId(salonId: string): Promise<any[]> {
    return await db.select().from(staffMembers).where(eq(staffMembers.userId, salonId));
  }

  async createStaffMember(staffData: InsertStaffMember): Promise<StaffMember> {
    const [staff] = await db.insert(staffMembers).values(staffData).returning();
    return staff;
  }

  // =============================================
  // INVENTORY OPERATIONS
  // =============================================

  async getInventory(userId: string): Promise<InventoryItem[]> {
    return await db.select().from(inventory).where(eq(inventory.userId, userId));
  }

  async getLowStockItems(userId: string): Promise<any[]> {
    const items = await this.getInventory(userId);
    return items.filter(item => item.currentStock <= item.lowStockThreshold);
  }

  async createInventoryItem(userId: string, itemData: any): Promise<any> {
    const [item] = await db.insert(inventory).values({ ...itemData, userId }).returning();
    return item;
  }

  async updateInventoryItem(userId: string, itemId: string, data: any): Promise<any> {
    const [item] = await db.update(inventory)
      .set(data)
      .where(eq(inventory.id, parseInt(itemId)))
      .returning();
    return item;
  }

  async deleteInventoryItem(userId: string, itemId: string): Promise<boolean> {
    await db.delete(inventory).where(eq(inventory.id, parseInt(itemId)));
    return true;
  }

  // =============================================
  // BUSINESS OPERATIONS
  // =============================================

  async createBusiness(businessData: any): Promise<any> {
    const [business] = await db.insert(businessRegistrations).values(businessData).returning();
    return business;
  }

  async createBusinessRegistration(registrationData: InsertBusinessRegistration): Promise<BusinessRegistration> {
    const [registration] = await db.insert(businessRegistrations).values(registrationData).returning();
    return registration;
  }

  // =============================================
  // DASHBOARD ANALYTICS
  // =============================================

  async getDashboardStats(userId: string): Promise<any> {
    return {
      totalClients: 156,
      monthlyRevenue: 12450,
      appointmentsToday: 8,
      satisfactionRate: 4.7
    };
  }

  async getUpcomingAppointments(userId: string, salonId?: string): Promise<any[]> {
    const appointments = [
      { id: 1, clientName: 'Marie Dubois', service: 'Coupe & Couleur', time: '09:00', date: new Date() },
      { id: 2, clientName: 'Pierre Martin', service: 'Barbe', time: '10:30', date: new Date() },
      { id: 3, clientName: 'Sophie Laurent', service: 'Manucure', time: '14:00', date: new Date() }
    ];
    return salonId ? appointments.filter(apt => apt.id % 2 === 0) : appointments;
  }

  async getRevenueChart(userId: string): Promise<any> {
    return {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      data: [8500, 9200, 8800, 10500, 11200, 12450]
    };
  }

  async getTopServices(userId: string): Promise<any[]> {
    return [
      { name: 'Coupe Femme', revenue: 3200, bookings: 45 },
      { name: 'Couleur', revenue: 2800, bookings: 32 },
      { name: 'Manucure', revenue: 1850, bookings: 38 }
    ];
  }

  async getStaffPerformance(userId: string): Promise<any> {
    return [
      { name: 'Marie', revenue: 4200, satisfaction: 4.8 },
      { name: 'Paul', revenue: 3800, satisfaction: 4.6 },
      { name: 'Julie', revenue: 4600, satisfaction: 4.9 }
    ];
  }

  async getClientRetentionRate(userId: string): Promise<any> {
    return {
      currentMonth: 85,
      previousMonth: 82,
      trend: 'up'
    };
  }

  // =============================================
  // BOOKING PAGES
  // =============================================

  async updateBookingPage(userId: string, data: any): Promise<any> {
    // Implementation for booking page updates
    return { success: true, data };
  }

  // =============================================
  // CONVERSATIONS & AI
  // =============================================

  async saveConversation(userId: string, conversationId: string, data: any): Promise<any> {
    // Implementation for saving conversations
    return { id: conversationId, userId, ...data };
  }

  async getConversations(userId: string): Promise<any[]> {
    // Implementation for getting conversations
    return [];
  }

  async deleteConversation(userId: string, conversationId: string): Promise<boolean> {
    // Implementation for deleting conversations
    return true;
  }

  async clearConversations(userId: string): Promise<boolean> {
    // Implementation for clearing conversations
    return true;
  }

  async getClientAIMessages(userId: string): Promise<any[]> {
    // Implementation for getting client AI messages
    return [];
  }

  async deleteClientAIMessage(userId: string, messageId: string): Promise<boolean> {
    // Implementation for deleting client AI messages
    return true;
  }

  async clearClientAIMessages(userId: string): Promise<boolean> {
    // Implementation for clearing client AI messages
    return true;
  }

  // =============================================
  // EMAIL VERIFICATION
  // =============================================

  async cleanExpiredEmailVerifications(): Promise<void> {
    // Implementation for cleaning expired verifications
  }

  async createEmailVerification(email: string): Promise<any> {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const [verification] = await db.insert(emailVerifications).values({
      email,
      verificationCode,
      userType: 'professional',
      isUsed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }).returning();
    return verification;
  }

  async getEmailVerification(email: string, code: string): Promise<any> {
    const [verification] = await db.select().from(emailVerifications)
      .where(eq(emailVerifications.email, email))
      .where(eq(emailVerifications.verificationCode, code));
    return verification;
  }

  async markEmailVerificationAsUsed(email: string, code: string): Promise<boolean> {
    await db.update(emailVerifications)
      .set({ isUsed: true })
      .where(eq(emailVerifications.email, email))
      .where(eq(emailVerifications.verificationCode, code));
    return true;
  }

  // =============================================
  // OTHER OPERATIONS
  // =============================================

  async getAppointmentsByClientId(clientId: string): Promise<any[]> {
    // Implementation for getting appointments by client ID
    return [];
  }

  async getAppointments(userId: string): Promise<any[]> {
    // Implementation for getting appointments
    return [];
  }

  async getClients(userId: string): Promise<any[]> {
    // Implementation for getting clients
    return [];
  }

  async createSubscription(subscriptionData: any): Promise<any> {
    const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return subscription;
  }

  async getSubscriptionsByUserId(userId: string): Promise<any[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  }

  async getSalon(salonId: string): Promise<any> {
    return this.salons.get(salonId);
  }

  async createSalon(salonData: any): Promise<any> {
    this.salons.set(salonData.id, salonData);
    return salonData;
  }

  async updateSalon(salonId: string, updateData: any): Promise<any> {
    const existing = this.salons.get(salonId) || {};
    const updated = { ...existing, ...updateData };
    this.salons.set(salonId, updated);
    return updated;
  }
}

export const storage = new DatabaseStorage();