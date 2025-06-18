import {
  users,
  services,
  clients,
  appointments,
  waitingList,
  forumCategories,
  forumPosts,
  forumReplies,
  forumLikes,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type Client,
  type InsertClient,
  type Appointment,
  type InsertAppointment,
  type WaitingListItem,
  type InsertWaitingList,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type ForumCategory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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

  // Appointment operations
  getAppointments(userId: string, date?: string): Promise<(Appointment & { client?: Client; service?: Service })[]>;
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
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Appointment operations
  async getAppointments(userId: string, date?: string): Promise<(Appointment & { client?: Client; service?: Service })[]> {
    const query = db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        clientId: appointments.clientId,
        serviceId: appointments.serviceId,
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
      })
      .from(appointments)
      .leftJoin(clients, eq(appointments.clientId, clients.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
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
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const upcomingAppointments = await db
      .select({
        date: appointments.appointmentDate,
        time: appointments.startTime,
        clientName: sql<string>`CONCAT(${clients.firstName}, ' ', ${clients.lastName})`,
        serviceName: services.name,
      })
      .from(appointments)
      .leftJoin(clients, eq(appointments.clientId, clients.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, today),
        lte(appointments.appointmentDate, nextWeek),
        eq(appointments.status, 'confirmed')
      ))
      .orderBy(appointments.appointmentDate, appointments.startTime)
      .limit(10);

    return upcomingAppointments.map(item => ({
      date: item.date,
      time: item.time,
      clientName: item.clientName || 'Client inconnu',
      serviceName: item.serviceName || 'Service inconnu',
    }));
  }

  async getTopServices(userId: string): Promise<Array<{ serviceName: string; count: number; revenue: number }>> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const topServices = await db
      .select({
        serviceName: services.name,
        count: sql<string>`COUNT(*)`,
        revenue: sql<string>`COALESCE(SUM(${appointments.totalPrice}), 0)`,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, thirtyDaysAgo),
        eq(appointments.status, 'completed')
      ))
      .groupBy(services.id, services.name)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    return topServices.map(item => ({
      serviceName: item.serviceName || 'Service inconnu',
      count: parseInt(item.count),
      revenue: parseFloat(item.revenue),
    }));
  }

  async getStaffPerformance(userId: string): Promise<Array<{ staffName: string; revenue: number; appointmentCount: number }>> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // For demo purposes, we'll use mock staff data since we don't have a staff table yet
    // In a real implementation, you would join with a staff/employees table
    const staffPerformance = await db
      .select({
        revenue: sql<string>`COALESCE(SUM(${appointments.totalPrice}), 0)`,
        appointmentCount: sql<string>`COUNT(*)`,
      })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, thirtyDaysAgo),
        eq(appointments.status, 'completed')
      ));

    const totalRevenue = parseFloat(staffPerformance[0]?.revenue || '0');
    const totalAppointments = parseInt(staffPerformance[0]?.appointmentCount || '0');

    // Demo staff data - in production this would come from a real staff table
    return [
      { staffName: 'Marie Dubois', revenue: Math.floor(totalRevenue * 0.45), appointmentCount: Math.floor(totalAppointments * 0.4) },
      { staffName: 'Sophie Martin', revenue: Math.floor(totalRevenue * 0.35), appointmentCount: Math.floor(totalAppointments * 0.35) },
      { staffName: 'Emma Leroy', revenue: Math.floor(totalRevenue * 0.20), appointmentCount: Math.floor(totalAppointments * 0.25) },
    ].filter(staff => staff.revenue > 0 || staff.appointmentCount > 0);
  }
}

export const storage = new DatabaseStorage();
