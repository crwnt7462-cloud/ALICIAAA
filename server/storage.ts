import {
  users,
  clientAccounts,
  messages,
  conversations,
  smsNotifications,
  emailNotifications,
  notificationPreferences,
  services,
  clients,
  staff,
  appointments,
  waitingList,
  forumCategories,
  forumPosts,
  forumReplies,
  forumLikes,
  reviews,
  loyaltyProgram,
  promotions,
  notifications,
  businessSettings,
  serviceCategories,
  paymentMethods,
  transactions,
  bookingPages,
  clientCommunications,
  staffAvailability,
  staffTimeOff,
  inventory,
  marketingCampaigns,
  clientPreferences,
  type User,
  type UpsertUser,
  type InsertUser,
  type RegisterRequest,
  type ClientAccount,
  type InsertClientAccount,
  type ClientRegisterRequest,
  type Message,
  type InsertMessage,
  type Conversation,
  type InsertConversation,
  type SmsNotification,
  type InsertSmsNotification,
  type EmailNotification,
  type InsertEmailNotification,
  type NotificationPreference,
  type InsertNotificationPreference,
  type Service,
  type InsertService,
  type Client,
  type InsertClient,
  type Staff,
  type InsertStaff,
  type Appointment,
  type InsertAppointment,
  type WaitingListItem,
  type InsertWaitingList,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type ForumCategory,
  type Review,
  type InsertReview,
  type LoyaltyProgram,
  type InsertLoyaltyProgram,
  type Promotion,
  type InsertPromotion,
  type Notification,
  type InsertNotification,
  type BusinessSettings,
  type InsertBusinessSettings,
  type ServiceCategory,
  type InsertServiceCategory,
  type PaymentMethod,
  type InsertPaymentMethod,
  type Transaction,
  type InsertTransaction,
  type BookingPage,
  type InsertBookingPage,
  type ClientCommunication,
  type InsertClientCommunication,
  type StaffAvailability,
  type InsertStaffAvailability,
  type StaffTimeOff,
  type InsertStaffTimeOff,
  type Inventory,
  type InsertInventory,
  type MarketingCampaign,
  type InsertMarketingCampaign,
  type ClientPreferences,
  type InsertClientPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count, or, isNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Professional Authentication
  createUser(userData: RegisterRequest): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Client Authentication
  getClientByEmail(email: string): Promise<ClientAccount | undefined>;
  createClientAccount(userData: ClientRegisterRequest): Promise<ClientAccount>;
  validateClientAccount(email: string, password: string): Promise<ClientAccount | null>;

  // Messaging Operations
  createMessage(messageData: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string, limit?: number): Promise<Message[]>;
  createConversation(conversationData: InsertConversation): Promise<Conversation>;
  getConversationByParticipants(professionalUserId: string, clientAccountId: string): Promise<Conversation | undefined>;
  updateConversation(conversationId: string, updates: Partial<InsertConversation>): Promise<void>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  getConversationsByClient(clientAccountId: string): Promise<Conversation[]>;
  markConversationMessagesAsRead(conversationId: string, userId?: string, clientId?: string): Promise<void>;
  getUnreadMessageCount(userId?: string, clientId?: string): Promise<number>;
  deleteMessage(messageId: number): Promise<void>;
  searchMessages(query: string, userId?: string, clientId?: string): Promise<Message[]>;

  // SMS Notification Operations
  createSmsNotification(smsData: InsertSmsNotification): Promise<SmsNotification>;
  updateSmsNotification(id: number, updates: Partial<InsertSmsNotification>): Promise<void>;
  getSmsNotificationsByAppointment(appointmentId: number): Promise<SmsNotification[]>;
  getAllSmsNotifications(userId: string, limit?: number): Promise<SmsNotification[]>;

  // Email Notification Operations  
  createEmailNotification(emailData: InsertEmailNotification): Promise<EmailNotification>;
  updateEmailNotification(id: number, updates: Partial<InsertEmailNotification>): Promise<void>;
  getEmailNotificationsByAppointment(appointmentId: number): Promise<EmailNotification[]>;

  // Notification Preferences
  getNotificationPreferences(userId?: string, clientAccountId?: string): Promise<NotificationPreference | undefined>;
  updateNotificationPreferences(userId: string, preferences: Partial<InsertNotificationPreference>): Promise<void>;

  // Service operations
  getServices(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Client operations
  getClients(userId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  searchClients(userId: string, query: string): Promise<Client[]>;

  // Staff operations
  getStaff(userId: string): Promise<Staff[]>;
  getStaffMember(id: number): Promise<Staff | undefined>;
  createStaffMember(staff: InsertStaff): Promise<Staff>;
  updateStaffMember(id: number, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaffMember(id: number): Promise<void>;

  // Appointment operations
  getAppointments(userId: string, date?: string): Promise<(Appointment & { client?: Client; service?: Service; staff?: Staff })[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  getAppointmentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Appointment[]>;

  // Waiting list operations
  getWaitingList(userId: string): Promise<(WaitingListItem & { client?: Client; service?: Service })[]>;
  addToWaitingList(item: InsertWaitingList): Promise<WaitingListItem>;
  removeFromWaitingList(id: number): Promise<void>;

  // Forum operations
  getForumCategories(): Promise<ForumCategory[]>;
  getForumPosts(categoryId?: number, limit?: number): Promise<(ForumPost & { user: User })[]>;
  getForumPost(id: number): Promise<(ForumPost & { user: User; replies: (ForumReply & { user: User })[] }) | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  likeForumPost(userId: string, postId: number): Promise<void>;
  unlikeForumPost(userId: string, postId: number): Promise<void>;

  // Analytics
  getDashboardStats(userId: string): Promise<{
    todayAppointments: number;
    weekRevenue: number;
    monthRevenue: number;
    totalClients: number;
  }>;
  
  // Advanced Analytics for Dashboard
  getRevenueChart(userId: string): Promise<Array<{ date: string; revenue: number }>>;
  getUpcomingAppointments(userId: string): Promise<Array<{ date: string; time: string; clientName: string; serviceName: string }>>;
  getTopServices(userId: string): Promise<Array<{ serviceName: string; count: number; revenue: number }>>;
  getStaffPerformance(userId: string): Promise<Array<{ staffName: string; revenue: number; appointmentCount: number }>>;

  // Reviews operations
  getReviews(userId: string): Promise<(Review & { client: Client; service: Service })[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Advanced Analytics operations
  getAnalyticsOverview(userId: string, timeRange: string): Promise<any>;
  getAnalyticsRevenueChart(userId: string, timeRange: string): Promise<any[]>;
  getClientSegments(userId: string, timeRange: string): Promise<any[]>;
  getServiceAnalytics(userId: string, timeRange: string): Promise<any[]>;
  getLoyaltyStats(userId: string): Promise<any>;
  getTopClients(userId: string, timeRange: string): Promise<any[]>;

  // Loyalty program operations
  getLoyaltyProgram(clientId: number): Promise<LoyaltyProgram | undefined>;
  createLoyaltyProgram(loyalty: InsertLoyaltyProgram): Promise<LoyaltyProgram>;
  updateLoyaltyPoints(clientId: number, points: number): Promise<void>;

  // Business Settings operations (like Planity's business configuration)
  getBusinessSettings(userId: string): Promise<BusinessSettings | undefined>;
  createBusinessSettings(settings: InsertBusinessSettings): Promise<BusinessSettings>;
  updateBusinessSettings(userId: string, settings: Partial<InsertBusinessSettings>): Promise<BusinessSettings>;

  // Service Categories operations (like Treatwell's service organization)
  getServiceCategories(userId: string): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  updateServiceCategory(id: number, category: Partial<InsertServiceCategory>): Promise<ServiceCategory>;
  deleteServiceCategory(id: number): Promise<void>;

  // Payment Methods and Transactions (POS functionality like Planity)
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, method: Partial<InsertPaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<void>;
  
  getTransactions(userId: string, limit?: number): Promise<(Transaction & { client?: Client; appointment?: Appointment })[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction>;

  // Booking Pages operations (custom booking pages like Treatwell)
  getBookingPages(userId: string): Promise<BookingPage[]>;
  getBookingPageBySlug(slug: string): Promise<BookingPage | undefined>;
  createBookingPage(page: InsertBookingPage): Promise<BookingPage>;
  updateBookingPage(id: number, page: Partial<InsertBookingPage>): Promise<BookingPage>;
  deleteBookingPage(id: number): Promise<void>;

  // Client Communication History
  getClientCommunications(clientId: number): Promise<ClientCommunication[]>;
  createClientCommunication(communication: InsertClientCommunication): Promise<ClientCommunication>;

  // Staff Availability and Time Off (advanced scheduling like Planity)
  getStaffAvailability(staffId: number): Promise<StaffAvailability[]>;
  createStaffAvailability(availability: InsertStaffAvailability): Promise<StaffAvailability>;
  updateStaffAvailability(id: number, availability: Partial<InsertStaffAvailability>): Promise<StaffAvailability>;
  deleteStaffAvailability(id: number): Promise<void>;
  
  getStaffTimeOff(staffId: number): Promise<StaffTimeOff[]>;
  createStaffTimeOff(timeOff: InsertStaffTimeOff): Promise<StaffTimeOff>;
  updateStaffTimeOff(id: number, timeOff: Partial<InsertStaffTimeOff>): Promise<StaffTimeOff>;
  deleteStaffTimeOff(id: number): Promise<void>;

  // Inventory Management (for beauty products)
  getInventory(userId: string): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory>;
  deleteInventoryItem(id: number): Promise<void>;
  getLowStockItems(userId: string): Promise<Inventory[]>;

  // Marketing Campaigns (like Treatwell's marketing tools)
  getMarketingCampaigns(userId: string): Promise<MarketingCampaign[]>;
  createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign>;
  updateMarketingCampaign(id: number, campaign: Partial<InsertMarketingCampaign>): Promise<MarketingCampaign>;
  deleteMarketingCampaign(id: number): Promise<void>;

  // Client Preferences and Notes
  getClientPreferences(clientId: number): Promise<ClientPreferences | undefined>;
  createClientPreferences(preferences: InsertClientPreferences): Promise<ClientPreferences>;
  updateClientPreferences(clientId: number, preferences: Partial<InsertClientPreferences>): Promise<ClientPreferences>;

  // Advanced booking operations
  getAvailableTimeSlots(userId: string, serviceId: number, staffId: number | null, date: string): Promise<string[]>;
  checkSlotAvailability(userId: string, date: string, startTime: string, endTime: string, staffId?: number): Promise<boolean>;
  
  // Online marketplace features (like Treatwell)
  searchSalons(query: string, location?: string, service?: string): Promise<User[]>;
  getSalonProfile(userId: string): Promise<{
    user: User;
    services: Service[];
    staff: Staff[];
    reviews: (Review & { client: Client })[];
    businessSettings: BusinessSettings | undefined;
  }>;

  // Revenue and financial reporting
  getRevenueByPeriod(userId: string, startDate: string, endDate: string): Promise<{ period: string; revenue: number }[]>;
  getPaymentSummary(userId: string, startDate: string, endDate: string): Promise<{
    totalRevenue: number;
    paidAmount: number;
    pendingAmount: number;
    refundedAmount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Authentication methods
  async createUser(userData: RegisterRequest): Promise<User> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const userId = nanoid();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 jours d'essai

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
      trialEndDate: trialEndDate,
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
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

  // Client Authentication methods
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
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
      isVerified: false,
    };

    const [client] = await db.insert(clientAccounts).values(newClient).returning();
    return client;
  }

  async validateClientAccount(email: string, password: string): Promise<ClientAccount | null> {
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

  // Messaging Operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  async getMessagesByConversation(conversationId: string, limit: number = 50): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(conversationData).returning();
    return conversation;
  }

  async getConversationByParticipants(professionalUserId: string, clientAccountId: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.professionalUserId, professionalUserId),
          eq(conversations.clientAccountId, clientAccountId)
        )
      );
    return conversation;
  }

  async updateConversation(conversationId: string, updates: Partial<InsertConversation>): Promise<void> {
    await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.professionalUserId, userId))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async getConversationsByClient(clientAccountId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.clientAccountId, clientAccountId))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async markConversationMessagesAsRead(conversationId: string, userId?: string, clientId?: string): Promise<void> {
    let whereCondition = eq(messages.conversationId, conversationId);
    
    if (userId) {
      whereCondition = and(whereCondition, eq(messages.toUserId, userId));
    }
    if (clientId) {
      whereCondition = and(whereCondition, eq(messages.toClientId, clientId));
    }

    await db
      .update(messages)
      .set({ isRead: true, updatedAt: new Date() })
      .where(whereCondition);
  }

  async getUnreadMessageCount(userId?: string, clientId?: string): Promise<number> {
    let whereCondition = eq(messages.isRead, false);
    
    if (userId) {
      whereCondition = and(whereCondition, eq(messages.toUserId, userId));
    }
    if (clientId) {
      whereCondition = and(whereCondition, eq(messages.toClientId, clientId));
    }

    const result = await db
      .select({ count: count() })
      .from(messages)
      .where(whereCondition);
    
    return result[0]?.count || 0;
  }

  async deleteMessage(messageId: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, messageId));
  }

  async searchMessages(query: string, userId?: string, clientId?: string): Promise<Message[]> {
    let whereCondition = sql`${messages.content} ILIKE ${`%${query}%`}`;
    
    if (userId) {
      whereCondition = and(whereCondition, eq(messages.toUserId, userId));
    }
    if (clientId) {
      whereCondition = and(whereCondition, eq(messages.toClientId, clientId));
    }

    return await db
      .select()
      .from(messages)
      .where(whereCondition)
      .orderBy(desc(messages.createdAt))
      .limit(50);
  }

  // SMS Notification Operations
  async createSmsNotification(smsData: InsertSmsNotification): Promise<SmsNotification> {
    const [smsNotification] = await db.insert(smsNotifications).values(smsData).returning();
    return smsNotification;
  }

  async updateSmsNotification(id: number, updates: Partial<InsertSmsNotification>): Promise<void> {
    await db
      .update(smsNotifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(smsNotifications.id, id));
  }

  async getSmsNotificationsByAppointment(appointmentId: number): Promise<SmsNotification[]> {
    return await db
      .select()
      .from(smsNotifications)
      .where(eq(smsNotifications.appointmentId, appointmentId))
      .orderBy(desc(smsNotifications.createdAt));
  }

  async getAllSmsNotifications(userId: string, limit: number = 100): Promise<SmsNotification[]> {
    // Get SMS notifications for appointments belonging to this user
    return await db
      .select({
        id: smsNotifications.id,
        recipientPhone: smsNotifications.recipientPhone,
        recipientName: smsNotifications.recipientName,
        message: smsNotifications.message,
        notificationType: smsNotifications.notificationType,
        appointmentId: smsNotifications.appointmentId,
        status: smsNotifications.status,
        externalId: smsNotifications.externalId,
        sentAt: smsNotifications.sentAt,
        deliveredAt: smsNotifications.deliveredAt,
        failureReason: smsNotifications.failureReason,
        createdAt: smsNotifications.createdAt,
        updatedAt: smsNotifications.updatedAt,
      })
      .from(smsNotifications)
      .leftJoin(appointments, eq(smsNotifications.appointmentId, appointments.id))
      .where(or(
        eq(appointments.userId, userId),
        isNull(smsNotifications.appointmentId) // Include custom SMS not tied to appointments
      ))
      .orderBy(desc(smsNotifications.createdAt))
      .limit(limit);
  }

  // Email Notification Operations
  async createEmailNotification(emailData: InsertEmailNotification): Promise<EmailNotification> {
    const [emailNotification] = await db.insert(emailNotifications).values(emailData).returning();
    return emailNotification;
  }

  async updateEmailNotification(id: number, updates: Partial<InsertEmailNotification>): Promise<void> {
    await db
      .update(emailNotifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailNotifications.id, id));
  }

  async getEmailNotificationsByAppointment(appointmentId: number): Promise<EmailNotification[]> {
    return await db
      .select()
      .from(emailNotifications)
      .where(eq(emailNotifications.appointmentId, appointmentId))
      .orderBy(desc(emailNotifications.createdAt));
  }

  // Notification Preferences
  async getNotificationPreferences(userId?: string, clientAccountId?: string): Promise<NotificationPreference | undefined> {
    let whereCondition;
    if (userId) {
      whereCondition = eq(notificationPreferences.userId, userId);
    } else if (clientAccountId) {
      whereCondition = eq(notificationPreferences.clientAccountId, clientAccountId);
    } else {
      return undefined;
    }

    const [preferences] = await db
      .select()
      .from(notificationPreferences)
      .where(whereCondition);
    return preferences;
  }

  async updateNotificationPreferences(userId: string, preferences: Partial<InsertNotificationPreference>): Promise<void> {
    const existing = await this.getNotificationPreferences(userId);
    
    if (existing) {
      await db
        .update(notificationPreferences)
        .set({ ...preferences, updatedAt: new Date() })
        .where(eq(notificationPreferences.userId, userId));
    } else {
      await db
        .insert(notificationPreferences)
        .values({ userId, ...preferences });
    }
  }

  // Service operations
  async getServices(userId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(and(eq(services.userId, userId), eq(services.isActive, true)))
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
    await db.update(services).set({ isActive: false }).where(eq(services.id, id));
  }

  // Client operations
  async getClients(userId: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.lastVisit), clients.firstName);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
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

  async searchClients(userId: string, query: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.userId, userId),
          sql`(${clients.firstName} || ' ' || ${clients.lastName}) ILIKE ${`%${query}%`}`
        )
      )
      .orderBy(clients.firstName);
  }

  // Staff operations
  async getStaff(userId: string): Promise<Staff[]> {
    return await db
      .select()
      .from(staff)
      .where(and(eq(staff.userId, userId), eq(staff.isActive, true)))
      .orderBy(staff.firstName);
  }

  async getStaffMember(id: number): Promise<Staff | undefined> {
    const [staffMember] = await db.select().from(staff).where(eq(staff.id, id));
    return staffMember;
  }

  async createStaffMember(staffData: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffData).returning();
    return newStaff;
  }

  async updateStaffMember(id: number, staffData: Partial<InsertStaff>): Promise<Staff> {
    const [updated] = await db
      .update(staff)
      .set(staffData)
      .where(eq(staff.id, id))
      .returning();
    return updated;
  }

  async deleteStaffMember(id: number): Promise<void> {
    await db.update(staff).set({ isActive: false }).where(eq(staff.id, id));
  }

  // Appointment operations
  async getAppointments(userId: string, date?: string): Promise<(Appointment & { client?: Client; service?: Service })[]> {
    const query = db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        clientId: appointments.clientId,
        serviceId: appointments.serviceId,
        staffId: appointments.staffId,
        clientName: appointments.clientName,
        clientEmail: appointments.clientEmail,
        clientPhone: appointments.clientPhone,
        appointmentDate: appointments.appointmentDate,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        status: appointments.status,
        notes: appointments.notes,
        totalPrice: appointments.totalPrice,
        depositPaid: appointments.depositPaid,
        paymentStatus: appointments.paymentStatus,
        createdAt: appointments.createdAt,
        client: clients,
        service: services,
        staff: staff,
      })
      .from(appointments)
      .leftJoin(clients, eq(appointments.clientId, clients.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(staff, eq(appointments.staffId, staff.id))
      .where(
        date 
          ? and(eq(appointments.userId, userId), eq(appointments.appointmentDate, date))
          : eq(appointments.userId, userId)
      )
      .orderBy(appointments.appointmentDate, appointments.startTime);

    return await query;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
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

  async getAppointmentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      )
      .orderBy(appointments.appointmentDate, appointments.startTime);
  }

  // Waiting list operations
  async getWaitingList(userId: string): Promise<(WaitingListItem & { client?: Client; service?: Service })[]> {
    const query = db
      .select({
        id: waitingList.id,
        userId: waitingList.userId,
        clientId: waitingList.clientId,
        serviceId: waitingList.serviceId,
        preferredDate: waitingList.preferredDate,
        isFlexible: waitingList.isFlexible,
        notified: waitingList.notified,
        createdAt: waitingList.createdAt,
        client: clients,
        service: services,
      })
      .from(waitingList)
      .leftJoin(clients, eq(waitingList.clientId, clients.id))
      .leftJoin(services, eq(waitingList.serviceId, services.id))
      .where(eq(waitingList.userId, userId))
      .orderBy(waitingList.createdAt);

    return await query;
  }

  async addToWaitingList(item: InsertWaitingList): Promise<WaitingListItem> {
    const [newItem] = await db.insert(waitingList).values(item).returning();
    return newItem;
  }

  async removeFromWaitingList(id: number): Promise<void> {
    await db.delete(waitingList).where(eq(waitingList.id, id));
  }

  // Forum operations
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.isActive, true))
      .orderBy(forumCategories.name);
  }

  async getForumPosts(categoryId?: number, limit = 20): Promise<(ForumPost & { user: User })[]> {
    const query = db
      .select({
        id: forumPosts.id,
        categoryId: forumPosts.categoryId,
        userId: forumPosts.userId,
        title: forumPosts.title,
        content: forumPosts.content,
        isPinned: forumPosts.isPinned,
        isLocked: forumPosts.isLocked,
        viewCount: forumPosts.viewCount,
        likeCount: forumPosts.likeCount,
        replyCount: forumPosts.replyCount,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        user: users,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .where(categoryId ? eq(forumPosts.categoryId, categoryId) : undefined)
      .orderBy(desc(forumPosts.isPinned), desc(forumPosts.updatedAt))
      .limit(limit);

    return await query;
  }

  async getForumPost(id: number): Promise<(ForumPost & { user: User; replies: (ForumReply & { user: User })[] }) | undefined> {
    const [post] = await db
      .select({
        id: forumPosts.id,
        categoryId: forumPosts.categoryId,
        userId: forumPosts.userId,
        title: forumPosts.title,
        content: forumPosts.content,
        isPinned: forumPosts.isPinned,
        isLocked: forumPosts.isLocked,
        viewCount: forumPosts.viewCount,
        likeCount: forumPosts.likeCount,
        replyCount: forumPosts.replyCount,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        user: users,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .where(eq(forumPosts.id, id));

    if (!post) return undefined;

    const replies = await db
      .select({
        id: forumReplies.id,
        postId: forumReplies.postId,
        userId: forumReplies.userId,
        content: forumReplies.content,
        likeCount: forumReplies.likeCount,
        createdAt: forumReplies.createdAt,
        user: users,
      })
      .from(forumReplies)
      .leftJoin(users, eq(forumReplies.userId, users.id))
      .where(eq(forumReplies.postId, id))
      .orderBy(forumReplies.createdAt);

    // Increment view count
    await db
      .update(forumPosts)
      .set({ viewCount: sql`${forumPosts.viewCount} + 1` })
      .where(eq(forumPosts.id, id));

    return { ...post, replies };
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [newReply] = await db.insert(forumReplies).values(reply).returning();
    
    // Update post reply count
    await db
      .update(forumPosts)
      .set({ 
        replyCount: sql`${forumPosts.replyCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(forumPosts.id, reply.postId!));

    return newReply;
  }

  async likeForumPost(userId: string, postId: number): Promise<void> {
    // Check if already liked
    const [existing] = await db
      .select()
      .from(forumLikes)
      .where(and(eq(forumLikes.userId, userId), eq(forumLikes.postId, postId)));

    if (!existing) {
      await db.insert(forumLikes).values({ userId, postId });
      await db
        .update(forumPosts)
        .set({ likeCount: sql`${forumPosts.likeCount} + 1` })
        .where(eq(forumPosts.id, postId));
    }
  }

  async unlikeForumPost(userId: string, postId: number): Promise<void> {
    const deleted = await db
      .delete(forumLikes)
      .where(and(eq(forumLikes.userId, userId), eq(forumLikes.postId, postId)))
      .returning();

    if (deleted.length > 0) {
      await db
        .update(forumPosts)
        .set({ likeCount: sql`${forumPosts.likeCount} - 1` })
        .where(eq(forumPosts.id, postId));
    }
  }

  // Analytics
  async getDashboardStats(userId: string): Promise<{
    todayAppointments: number;
    weekRevenue: number;
    monthRevenue: number;
    totalClients: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [todayAppointments] = await db
      .select({ count: count() })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        eq(appointments.appointmentDate, today)
      ));

    const [weekRevenue] = await db
      .select({ sum: sql<string>`COALESCE(SUM(${appointments.totalPrice}), 0)` })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, weekAgo),
        eq(appointments.status, 'completed')
      ));

    const [monthRevenue] = await db
      .select({ sum: sql<string>`COALESCE(SUM(${appointments.totalPrice}), 0)` })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, monthAgo),
        eq(appointments.status, 'completed')
      ));

    const [totalClients] = await db
      .select({ count: count() })
      .from(clients)
      .where(eq(clients.userId, userId));

    return {
      todayAppointments: todayAppointments?.count || 0,
      weekRevenue: parseFloat(weekRevenue?.sum || '0'),
      monthRevenue: parseFloat(monthRevenue?.sum || '0'),
      totalClients: totalClients?.count || 0,
    };
  }

  // Advanced Analytics for Dashboard
  async getRevenueChart(userId: string): Promise<Array<{ date: string; revenue: number }>> {
    // Generate realistic demo data for last 30 days
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic revenue based on day of week
      const dayOfWeek = date.getDay();
      let baseRevenue = 0;
      
      if (dayOfWeek === 0) { // Sunday - closed
        baseRevenue = 0;
      } else if (dayOfWeek === 6) { // Saturday - busy
        baseRevenue = 800 + Math.random() * 400;
      } else if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays
        baseRevenue = 400 + Math.random() * 300;
      }
      
      data.push({
        date: dateStr,
        revenue: Math.round(baseRevenue)
      });
    }
    
    return data;
  }

  async getUpcomingAppointments(userId: string): Promise<Array<{ date: string; time: string; clientName: string; serviceName: string }>> {
    // Generate demo upcoming appointments
    const appointments = [];
    const today = new Date();
    
    const clients = ['Sophie Martin', 'Emma Leroy', 'Marie Dubois', 'Claire Bernard', 'Julie Moreau'];
    const services = ['Coupe + Brushing', 'Coloration', 'Mèches', 'Soin Hydratant', 'Balayage'];
    const times = ['09:00', '10:30', '14:00', '15:30', '16:30'];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + Math.floor(i / 2));
      
      appointments.push({
        date: date.toISOString().split('T')[0],
        time: times[i % times.length],
        clientName: clients[i % clients.length],
        serviceName: services[i % services.length]
      });
    }
    
    return appointments;
  }

  async getTopServices(userId: string): Promise<Array<{ serviceName: string; count: number; revenue: number }>> {
    // Demo data for top services
    return [
      { serviceName: 'Coupe + Brushing', count: 45, revenue: 2250 },
      { serviceName: 'Coloration', count: 28, revenue: 3360 },
      { serviceName: 'Balayage', count: 22, revenue: 3300 },
      { serviceName: 'Mèches', count: 18, revenue: 2160 },
      { serviceName: 'Soin Hydratant', count: 15, revenue: 750 }
    ];
  }

  async getStaffPerformance(userId: string): Promise<Array<{ staffName: string; revenue: number; appointmentCount: number }>> {
    // Demo staff performance data
    return [
      { staffName: 'Marie Dubois', revenue: 4850, appointmentCount: 68 },
      { staffName: 'Sophie Martin', revenue: 3720, appointmentCount: 52 },
      { staffName: 'Emma Leroy', revenue: 2890, appointmentCount: 41 }
    ];
  }

  // Reviews operations
  async getReviews(userId: string): Promise<(Review & { client: Client; service: Service })[]> {
    return await db
      .select()
      .from(reviews)
      .leftJoin(clients, eq(reviews.clientId, clients.id))
      .leftJoin(services, eq(reviews.serviceId, services.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Advanced Analytics operations
  async getAnalyticsOverview(userId: string, timeRange: string): Promise<any> {
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    
    return {
      totalRevenue: '12,450',
      revenueGrowth: '15',
      newClients: 28,
      clientGrowth: '12',
      retentionRate: 87,
      averageRating: 4.8,
      totalReviews: 156
    };
  }

  async getAnalyticsRevenueChart(userId: string, timeRange: string): Promise<any[]> {
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];
    const today = new Date();
    
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = date.getDay();
      let baseRevenue = 0;
      
      if (dayOfWeek === 0) {
        baseRevenue = 0;
      } else if (dayOfWeek === 6) {
        baseRevenue = 800 + Math.random() * 400;
      } else {
        baseRevenue = 400 + Math.random() * 300;
      }
      
      data.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        revenue: Math.round(baseRevenue)
      });
    }
    
    return data;
  }

  async getClientSegments(userId: string, timeRange: string): Promise<any[]> {
    return [
      { name: 'Nouveaux', value: 35 },
      { name: 'Réguliers', value: 45 },
      { name: 'VIP', value: 15 },
      { name: 'Inactifs', value: 5 }
    ];
  }

  async getServiceAnalytics(userId: string, timeRange: string): Promise<any[]> {
    return [
      { name: 'Coupe', revenue: 3200, appointments: 64 },
      { name: 'Coloration', revenue: 4800, appointments: 32 },
      { name: 'Balayage', revenue: 3600, appointments: 24 },
      { name: 'Soins', revenue: 1200, appointments: 48 },
      { name: 'Mèches', revenue: 2400, appointments: 20 }
    ];
  }

  async getLoyaltyStats(userId: string): Promise<any> {
    return {
      totalMembers: 267,
      pointsRedeemed: 15420,
      avgLoyaltyScore: 78
    };
  }

  async getTopClients(userId: string, timeRange: string): Promise<any[]> {
    return [
      {
        id: 1,
        firstName: 'Sophie',
        lastName: 'Martin',
        totalSpent: 1250,
        visitCount: 12,
        lastVisit: new Date().toISOString(),
        loyaltyLevel: 'gold'
      },
      {
        id: 2,
        firstName: 'Emma',
        lastName: 'Leroy',
        totalSpent: 890,
        visitCount: 8,
        lastVisit: new Date().toISOString(),
        loyaltyLevel: 'silver'
      },
      {
        id: 3,
        firstName: 'Marie',
        lastName: 'Dubois',
        totalSpent: 2150,
        visitCount: 18,
        lastVisit: new Date().toISOString(),
        loyaltyLevel: 'platinum'
      }
    ];
  }

  // Loyalty program operations
  async getLoyaltyProgram(clientId: number): Promise<LoyaltyProgram | undefined> {
    const [loyalty] = await db
      .select()
      .from(loyaltyProgram)
      .where(eq(loyaltyProgram.clientId, clientId));
    return loyalty;
  }

  async createLoyaltyProgram(loyalty: InsertLoyaltyProgram): Promise<LoyaltyProgram> {
    const [newLoyalty] = await db.insert(loyaltyProgram).values(loyalty).returning();
    return newLoyalty;
  }

  async updateLoyaltyPoints(clientId: number, points: number): Promise<void> {
    await db
      .update(loyaltyProgram)
      .set({ 
        points: sql`${loyaltyProgram.points} + ${points}`,
        lastActivity: new Date()
      })
      .where(eq(loyaltyProgram.clientId, clientId));
  }

  // Business Settings operations (like Planity's business configuration)
  async getBusinessSettings(userId: string): Promise<BusinessSettings | undefined> {
    const [settings] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.userId, userId));
    return settings;
  }

  async createBusinessSettings(settings: InsertBusinessSettings): Promise<BusinessSettings> {
    const [newSettings] = await db.insert(businessSettings).values(settings).returning();
    return newSettings;
  }

  async updateBusinessSettings(userId: string, settings: Partial<InsertBusinessSettings>): Promise<BusinessSettings> {
    const [updatedSettings] = await db
      .update(businessSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(businessSettings.userId, userId))
      .returning();
    return updatedSettings;
  }

  // Service Categories operations (like Treatwell's service organization)
  async getServiceCategories(userId: string): Promise<ServiceCategory[]> {
    return db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.userId, userId))
      .orderBy(serviceCategories.sortOrder);
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [newCategory] = await db.insert(serviceCategories).values(category).returning();
    return newCategory;
  }

  async updateServiceCategory(id: number, category: Partial<InsertServiceCategory>): Promise<ServiceCategory> {
    const [updatedCategory] = await db
      .update(serviceCategories)
      .set(category)
      .where(eq(serviceCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteServiceCategory(id: number): Promise<void> {
    await db.delete(serviceCategories).where(eq(serviceCategories.id, id));
  }

  // Payment Methods and Transactions (POS functionality like Planity)
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(paymentMethods.name);
  }

  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const [newMethod] = await db.insert(paymentMethods).values(method).returning();
    return newMethod;
  }

  async updatePaymentMethod(id: number, method: Partial<InsertPaymentMethod>): Promise<PaymentMethod> {
    const [updatedMethod] = await db
      .update(paymentMethods)
      .set(method)
      .where(eq(paymentMethods.id, id))
      .returning();
    return updatedMethod;
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
  }

  async getTransactions(userId: string, limit = 50): Promise<(Transaction & { client?: Client; appointment?: Appointment })[]> {
    const results = await db
      .select({
        transaction: transactions,
        client: clients,
        appointment: appointments,
      })
      .from(transactions)
      .leftJoin(clients, eq(transactions.clientId, clients.id))
      .leftJoin(appointments, eq(transactions.appointmentId, appointments.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);

    return results.map(row => ({
      ...row.transaction,
      client: row.client || undefined,
      appointment: row.appointment || undefined,
    }));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set(transaction)
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  // Booking Pages operations (custom booking pages like Treatwell)
  async getBookingPages(userId: string): Promise<BookingPage[]> {
    return db
      .select()
      .from(bookingPages)
      .where(eq(bookingPages.userId, userId))
      .orderBy(desc(bookingPages.createdAt));
  }

  async getBookingPageBySlug(slug: string): Promise<BookingPage | undefined> {
    const [page] = await db
      .select()
      .from(bookingPages)
      .where(eq(bookingPages.slug, slug));
    return page;
  }

  async createBookingPage(page: InsertBookingPage): Promise<BookingPage> {
    const [newPage] = await db.insert(bookingPages).values(page).returning();
    return newPage;
  }

  async updateBookingPage(id: number, page: Partial<InsertBookingPage>): Promise<BookingPage> {
    const [updatedPage] = await db
      .update(bookingPages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(bookingPages.id, id))
      .returning();
    return updatedPage;
  }

  async deleteBookingPage(id: number): Promise<void> {
    await db.delete(bookingPages).where(eq(bookingPages.id, id));
  }

  // Client Communication History
  async getClientCommunications(clientId: number): Promise<ClientCommunication[]> {
    return db
      .select()
      .from(clientCommunications)
      .where(eq(clientCommunications.clientId, clientId))
      .orderBy(desc(clientCommunications.createdAt));
  }

  async createClientCommunication(communication: InsertClientCommunication): Promise<ClientCommunication> {
    const [newCommunication] = await db.insert(clientCommunications).values(communication).returning();
    return newCommunication;
  }

  // Staff Availability and Time Off (advanced scheduling like Planity)
  async getStaffAvailability(staffId: number): Promise<StaffAvailability[]> {
    return db
      .select()
      .from(staffAvailability)
      .where(eq(staffAvailability.staffId, staffId))
      .orderBy(staffAvailability.dayOfWeek, staffAvailability.startTime);
  }

  async createStaffAvailability(availability: InsertStaffAvailability): Promise<StaffAvailability> {
    const [newAvailability] = await db.insert(staffAvailability).values(availability).returning();
    return newAvailability;
  }

  async updateStaffAvailability(id: number, availability: Partial<InsertStaffAvailability>): Promise<StaffAvailability> {
    const [updatedAvailability] = await db
      .update(staffAvailability)
      .set(availability)
      .where(eq(staffAvailability.id, id))
      .returning();
    return updatedAvailability;
  }

  async deleteStaffAvailability(id: number): Promise<void> {
    await db.delete(staffAvailability).where(eq(staffAvailability.id, id));
  }

  async getStaffTimeOff(staffId: number): Promise<StaffTimeOff[]> {
    return db
      .select()
      .from(staffTimeOff)
      .where(eq(staffTimeOff.staffId, staffId))
      .orderBy(desc(staffTimeOff.startDate));
  }

  async createStaffTimeOff(timeOff: InsertStaffTimeOff): Promise<StaffTimeOff> {
    const [newTimeOff] = await db.insert(staffTimeOff).values(timeOff).returning();
    return newTimeOff;
  }

  async updateStaffTimeOff(id: number, timeOff: Partial<InsertStaffTimeOff>): Promise<StaffTimeOff> {
    const [updatedTimeOff] = await db
      .update(staffTimeOff)
      .set(timeOff)
      .where(eq(staffTimeOff.id, id))
      .returning();
    return updatedTimeOff;
  }

  async deleteStaffTimeOff(id: number): Promise<void> {
    await db.delete(staffTimeOff).where(eq(staffTimeOff.id, id));
  }

  // Inventory Management (for beauty products)
  async getInventory(userId: string): Promise<Inventory[]> {
    return db
      .select()
      .from(inventory)
      .where(eq(inventory.userId, userId))
      .orderBy(inventory.name);
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    const [item] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory> {
    const [updatedItem] = await db
      .update(inventory)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }

  async getLowStockItems(userId: string): Promise<Inventory[]> {
    return db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.userId, userId),
          sql`${inventory.currentStock} <= ${inventory.minStock}`
        )
      )
      .orderBy(inventory.name);
  }

  // Marketing Campaigns (like Treatwell's marketing tools)
  async getMarketingCampaigns(userId: string): Promise<MarketingCampaign[]> {
    return db
      .select()
      .from(marketingCampaigns)
      .where(eq(marketingCampaigns.userId, userId))
      .orderBy(desc(marketingCampaigns.createdAt));
  }

  async createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign> {
    const [newCampaign] = await db.insert(marketingCampaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateMarketingCampaign(id: number, campaign: Partial<InsertMarketingCampaign>): Promise<MarketingCampaign> {
    const [updatedCampaign] = await db
      .update(marketingCampaigns)
      .set(campaign)
      .where(eq(marketingCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteMarketingCampaign(id: number): Promise<void> {
    await db.delete(marketingCampaigns).where(eq(marketingCampaigns.id, id));
  }

  // Client Preferences and Notes
  async getClientPreferences(clientId: number): Promise<ClientPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(clientPreferences)
      .where(eq(clientPreferences.clientId, clientId));
    return preferences;
  }

  async createClientPreferences(preferences: InsertClientPreferences): Promise<ClientPreferences> {
    const [newPreferences] = await db.insert(clientPreferences).values(preferences).returning();
    return newPreferences;
  }

  async updateClientPreferences(clientId: number, preferences: Partial<InsertClientPreferences>): Promise<ClientPreferences> {
    const [updatedPreferences] = await db
      .update(clientPreferences)
      .set({ ...preferences, updatedAt: new Date() })
      .where(eq(clientPreferences.clientId, clientId))
      .returning();
    return updatedPreferences;
  }

  // Advanced booking operations
  async getAvailableTimeSlots(userId: string, serviceId: number, staffId: number | null, date: string): Promise<string[]> {
    // Get business settings for working hours
    const businessSettings = await this.getBusinessSettings(userId);
    
    // Get service duration
    const service = await this.getServices(userId).then(services => 
      services.find(s => s.id === serviceId)
    );
    
    if (!service) return [];
    
    const duration = service.duration;
    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Default working hours if no business settings
    let startHour = 9;
    let endHour = 18;
    
    if (businessSettings) {
      // Map day of week to business settings columns
      const dayColumns = [
        { open: businessSettings.sundayOpen, close: businessSettings.sundayClose },
        { open: businessSettings.mondayOpen, close: businessSettings.mondayClose },
        { open: businessSettings.tuesdayOpen, close: businessSettings.tuesdayClose },
        { open: businessSettings.wednesdayOpen, close: businessSettings.wednesdayClose },
        { open: businessSettings.thursdayOpen, close: businessSettings.thursdayClose },
        { open: businessSettings.fridayOpen, close: businessSettings.fridayClose },
        { open: businessSettings.saturdayOpen, close: businessSettings.saturdayClose },
      ];
      
      const daySchedule = dayColumns[dayOfWeek];
      if (!daySchedule.open || !daySchedule.close) return []; // Closed day
      
      startHour = parseInt(daySchedule.open.split(':')[0]);
      endHour = parseInt(daySchedule.close.split(':')[0]);
    }
    
    // Get existing appointments for the date
    const existingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          eq(appointments.appointmentDate, date),
          staffId ? eq(appointments.staffId, staffId) : undefined
        )
      );
    
    // Generate available slots
    const slots: string[] = [];
    const slotInterval = 30; // minutes
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotEndTime = new Date(`2000-01-01 ${slotTime}`);
        slotEndTime.setMinutes(slotEndTime.getMinutes() + duration);
        const endTimeStr = `${slotEndTime.getHours().toString().padStart(2, '0')}:${slotEndTime.getMinutes().toString().padStart(2, '0')}`;
        
        // Check if this slot conflicts with existing appointments
        const hasConflict = existingAppointments.some(apt => {
          return (slotTime >= apt.startTime && slotTime < apt.endTime) ||
                 (endTimeStr > apt.startTime && endTimeStr <= apt.endTime) ||
                 (slotTime <= apt.startTime && endTimeStr >= apt.endTime);
        });
        
        if (!hasConflict && slotEndTime.getHours() <= endHour) {
          slots.push(slotTime);
        }
      }
    }
    
    return slots;
  }

  async checkSlotAvailability(userId: string, date: string, startTime: string, endTime: string, staffId?: number): Promise<boolean> {
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          eq(appointments.appointmentDate, date),
          staffId ? eq(appointments.staffId, staffId) : undefined,
          sql`(
            (${startTime} >= ${appointments.startTime} AND ${startTime} < ${appointments.endTime}) OR
            (${endTime} > ${appointments.startTime} AND ${endTime} <= ${appointments.endTime}) OR
            (${startTime} <= ${appointments.startTime} AND ${endTime} >= ${appointments.endTime})
          )`
        )
      )
      .limit(1);
    
    return existingAppointment.length === 0;
  }

  // Online marketplace features (like Treatwell)
  async searchSalons(query: string, location?: string, service?: string): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(
        and(
          eq(users.isProfessional, true),
          sql`(
            ${users.businessName} ILIKE ${'%' + query + '%'} OR
            ${users.firstName} ILIKE ${'%' + query + '%'} OR
            ${users.lastName} ILIKE ${'%' + query + '%'}
          )`,
          location ? sql`${users.address} ILIKE ${'%' + location + '%'}` : undefined
        )
      )
      .limit(20);
  }

  async getSalonProfile(userId: string): Promise<{
    user: User;
    services: Service[];
    staff: Staff[];
    reviews: (Review & { client: Client })[];
    businessSettings: BusinessSettings | undefined;
  }> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error('Salon not found');

    const [services, staff, businessSettings] = await Promise.all([
      this.getServices(userId),
      this.getStaff(userId),
      this.getBusinessSettings(userId),
    ]);

    const reviewResults = await db
      .select({
        review: reviews,
        client: clients,
      })
      .from(reviews)
      .leftJoin(clients, eq(reviews.clientId, clients.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(10);

    const reviewsWithClients = reviewResults.map(row => ({
      ...row.review,
      client: row.client!,
    }));

    return {
      user,
      services,
      staff,
      reviews: reviewsWithClients,
      businessSettings,
    };
  }

  // Revenue and financial reporting
  async getRevenueByPeriod(userId: string, startDate: string, endDate: string): Promise<{ period: string; revenue: number }[]> {
    const results = await db
      .select({
        date: appointments.appointmentDate,
        revenue: sql<number>`COALESCE(SUM(CAST(${appointments.totalPrice} AS NUMERIC)), 0)`,
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          eq(appointments.status, 'completed'),
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      )
      .groupBy(appointments.appointmentDate)
      .orderBy(appointments.appointmentDate);

    return results.map(row => ({
      period: row.date,
      revenue: Number(row.revenue),
    }));
  }

  async getPaymentSummary(userId: string, startDate: string, endDate: string): Promise<{
    totalRevenue: number;
    paidAmount: number;
    pendingAmount: number;
    refundedAmount: number;
  }> {
    const results = await db
      .select({
        totalAmount: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS NUMERIC)), 0)`,
        status: transactions.status,
        type: transactions.type,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate)
        )
      )
      .groupBy(transactions.status, transactions.type);

    let totalRevenue = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    let refundedAmount = 0;

    results.forEach(row => {
      const amount = Number(row.totalAmount);
      if (row.type === 'payment') {
        totalRevenue += amount;
        if (row.status === 'completed') {
          paidAmount += amount;
        } else if (row.status === 'pending') {
          pendingAmount += amount;
        }
      } else if (row.type === 'refund' && row.status === 'completed') {
        refundedAmount += amount;
      }
    });

    return {
      totalRevenue,
      paidAmount,
      pendingAmount,
      refundedAmount,
    };
  }
}

export const storage = new DatabaseStorage();
