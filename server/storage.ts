import {
  users,
  clientAccounts,
  services,
  staffMembers,
  inventory,
  businessRegistrations,
  salonRegistrations,
  salons,
  subscriptions,
  emailVerifications,
  photos,
  type User,
  type ClientAccount,
  type Service,
  type StaffMember,

  type BusinessRegistration,
  type SalonRegistration,
  type Subscription,
  type InsertUser,
  type InsertClientAccount,
  type InsertService,
  type InsertStaffMember,

  type InsertBusinessRegistration,
  type InsertSalonRegistration,
  type InsertSubscription
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
  getInventory(userId: string): Promise<any[]>;
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
  getSalons(): Promise<any[]>;
  updateSalon(salonId: string, updateData: any): Promise<any>;
  saveSalonData(salonId: string, salonData: any): Promise<any>;

  // Salon operations
  getSalons(): Promise<any[]>;
  
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
    // Hasher le mot de passe avant de l'enregistrer
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [user] = await db.insert(users).values({
      id: crypto.randomUUID(),
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      businessName: userData.businessName,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      isProfessional: userData.isProfessional ?? true,
      isVerified: userData.isVerified ?? false,
      subscriptionPlan: userData.subscriptionPlan || 'basic-pro',
      subscriptionStatus: userData.subscriptionStatus || 'inactive',
      trialEndDate: userData.trialEndDate,
      mentionHandle: userData.mentionHandle,
    }).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    console.log(`🔐 Tentative de connexion: ${email}`);
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) return null;
    
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log(`✅ Connexion réussie pour: ${email}`);
    } else {
      console.log(`❌ Échec de connexion pour: ${email}`);
    }
    
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
    const result = await db.select().from(services).where(eq(services.userId, salonId));
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
    return await db.select().from(staffMembers).where(eq(staffMembers.salonId, userId));
  }

  async getStaffBySalonId(salonId: string): Promise<any[]> {
    return await db.select().from(staffMembers).where(eq(staffMembers.salonId, salonId));
  }

  async createStaffMember(staffData: InsertStaffMember): Promise<StaffMember> {
    const [staff] = await db.insert(staffMembers).values(staffData).returning();
    return staff;
  }

  // =============================================
  // INVENTORY OPERATIONS
  // =============================================

  async getInventory(userId: string): Promise<any[]> {
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
    console.log(`📊 Récupération stats dashboard pour: ${userId}`);
    
    try {
      // Compter les vrais clients pour ce professionnel (pour l'instant retourner 0 car nouvelle pro)
      const totalClients = 0; // TODO: COUNT from clientAccounts WHERE professionalId = userId
      
      // Calculer les revenus du mois (pour l'instant 0 car nouvelle pro)
      const monthlyRevenue = 0; // TODO: SUM payments WHERE professionalId = userId AND month = current
      
      // Compter les RDV d'aujourd'hui (pour l'instant 0 car nouvelle pro)
      const appointmentsToday = 0; // TODO: COUNT appointments WHERE professionalId = userId AND date = today
      
      // Note de satisfaction moyenne (pour l'instant 0 car nouvelle pro)
      const satisfactionRate = 0; // TODO: AVG ratings WHERE professionalId = userId
      
      const stats = {
        totalClients,
        monthlyRevenue,
        appointmentsToday,
        satisfactionRate
      };
      
      console.log(`📈 Stats calculées pour ${userId}:`, stats);
      return stats;
    } catch (error) {
      console.error("❌ Erreur récupération stats dashboard:", error);
      // Retourner stats à 0 pour nouvelle pro en cas d'erreur
      return {
        totalClients: 0,
        monthlyRevenue: 0,
        appointmentsToday: 0,
        satisfactionRate: 0
      };
    }
  }

  async getUpcomingAppointments(userId: string, salonId?: string): Promise<any[]> {
    console.log(`📅 Récupération RDV à venir pour: ${userId}`);
    
    // Pour une nouvelle professionnelle, pas de RDV encore
    return []; // Nouveau salon = pas de rendez-vous encore
  }

  async getRevenueChart(userId: string): Promise<any> {
    console.log(`📈 Récupération graphique revenus pour: ${userId}`);
    
    // Pour une nouvelle professionnelle, pas de revenus historiques
    return {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      data: [0, 0, 0, 0, 0, 0] // Nouveau salon = pas de revenus encore
    };
  }

  async getTopServices(userId: string): Promise<any[]> {
    console.log(`🔝 Récupération top services pour: ${userId}`);
    
    // Pour une nouvelle professionnelle, pas de services top encore
    return []; // Nouveau salon = pas de services populaires encore
  }

  async getStaffPerformance(userId: string): Promise<any> {
    console.log(`👥 Récupération performance staff pour: ${userId}`);
    
    // Pour une nouvelle professionnelle, pas d'équipe encore
    return []; // Nouveau salon = pas d'employés encore
  }

  async getClientRetentionRate(userId: string): Promise<any> {
    console.log(`📊 Récupération rétention client pour: ${userId}`);
    
    // Pour une nouvelle professionnelle, pas de rétention encore
    return {
      currentMonth: 0,
      previousMonth: 0,
      trend: 'stable' // Nouveau salon = pas de données de rétention
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
    // Implementation temporaire - nécessite configuration email
    return {
      email,
      verificationCode,
      userType: 'professional',
      isUsed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };
  }

  async getEmailVerification(email: string, code: string): Promise<any> {
    // Implementation temporaire
    return null;
  }

  async markEmailVerificationAsUsed(email: string, code: string): Promise<boolean> {
    // Implementation temporaire
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

  async getSalons(): Promise<any[]> {
    // Retourner tous les salons de la Map + PostgreSQL
    try {
      const postgresqlSalons = await db.select().from(salons);
      console.log(`📊 ${postgresqlSalons.length} salons trouvés en PostgreSQL`);
      return postgresqlSalons;
    } catch (error) {
      console.error('❌ Erreur lecture salons PostgreSQL:', error);
      return Array.from(this.salons.values());
    }
  }

  async getSalon(salonId: string): Promise<any> {
    console.log(`📖 Récupération données salon: ${salonId}`);
    
    // D'abord chercher en base de données PostgreSQL
    try {
      console.log(`🔍 Recherche salon PostgreSQL: ${salonId}`);
      const salonResults = await db.select().from(salons).where(eq(salons.id, salonId));
      console.log(`🔍 Résultats trouvés: ${salonResults.length}`);
      
      if (salonResults.length > 0) {
        const salon = salonResults[0];
        console.log(`✅ Salon trouvé en PostgreSQL: ${salon.name}`);
        return {
          ...salon,
          customColors: typeof salon.customColors === 'string' ? JSON.parse(salon.customColors) : salon.customColors || {},
          serviceCategories: typeof salon.serviceCategories === 'string' ? JSON.parse(salon.serviceCategories) : salon.serviceCategories || [],
          photos: typeof salon.photos === 'string' ? JSON.parse(salon.photos) : salon.photos || []
        };
      } else {
        console.log(`⚠️ Aucun salon trouvé en PostgreSQL pour ID: ${salonId}`);
      }
    } catch (error) {
      console.error('❌ Erreur lecture PostgreSQL salon:', error);
    }
    
    // Fallback sur mémoire
    if (this.salons.has(salonId)) {
      console.log(`📦 Salon trouvé en mémoire: ${salonId}`);
      return this.salons.get(salonId);
    }
    
    console.log(`❌ Salon non trouvé: ${salonId}`);
    return null;
  }

  async createSalon(salonData: any): Promise<any> {
    console.log('📝 Création salon dans PostgreSQL:', salonData.id);
    
    try {
      const [salon] = await db.insert(salons).values({
        id: salonData.id,
        name: salonData.name,
        description: salonData.description,
        address: salonData.address,
        phone: salonData.phone,
        email: salonData.email,
        customColors: JSON.stringify(salonData.customColors || {}),
        serviceCategories: JSON.stringify(salonData.serviceCategories || []),
        photos: JSON.stringify(salonData.photos || []),
        isPublished: salonData.isPublished || true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      console.log('✅ Salon sauvegardé en PostgreSQL:', salon.id);
      
      // Aussi stocker en mémoire pour l'instant
      this.salons.set(salonData.id, salonData);
      
      return salon;
    } catch (error) {
      console.error('❌ Erreur création salon PostgreSQL:', error);
      // Fallback en mémoire
      this.salons.set(salonData.id, salonData);
      return salonData;
    }
  }



  async updateSalon(salonId: string, updateData: any): Promise<any> {
    const existing = this.salons.get(salonId) || {};
    const updated = { ...existing, ...updateData };
    this.salons.set(salonId, updated);
    return updated;
  }

  // Méthodes pour gestion des photos de salon
  async getSalonPhotos(salonId: string): Promise<any[]> {
    return []; // TODO: Implémenter avec base de données
  }

  async addSalonPhoto(salonId: string, photoData: any): Promise<any> {
    return { id: Date.now(), ...photoData }; // TODO: Implémenter avec base de données
  }

  async updateSalonPhoto(photoId: string, updateData: any): Promise<any> {
    return { id: photoId, ...updateData }; // TODO: Implémenter avec base de données
  }

  async deleteSalonPhoto(photoId: string): Promise<boolean> {
    return true; // TODO: Implémenter avec base de données
  }

  // Méthodes pour gestion des clients
  async getClientAccountByEmail(email: string): Promise<any> {
    // Simulation - en réalité, chercher en base de données
    return null;
  }

  async getClientsByProfessional(professionalId: string): Promise<any[]> {
    return []; // TODO: Implémenter avec base de données
  }

  async createClient(clientData: any): Promise<any> {
    return { id: Date.now(), ...clientData }; // TODO: Implémenter avec base de données
  }

  async updateClient(clientId: string, updateData: any): Promise<any> {
    return { id: clientId, ...updateData }; // TODO: Implémenter avec base de données
  }

  async deleteClient(clientId: string): Promise<boolean> {
    return true; // TODO: Implémenter avec base de données
  }

  // Méthodes pour notes clients et tags
  async createOrUpdateClientNote(clientId: string, note: string, professionalId: string): Promise<any> {
    return { clientId, note, professionalId, updatedAt: new Date() }; // TODO: Implémenter avec base de données
  }

  async getCustomTagsByProfessional(professionalId: string): Promise<any[]> {
    return []; // TODO: Implémenter avec base de données
  }

  async createCustomTag(tagData: any): Promise<any> {
    return { id: Date.now(), ...tagData }; // TODO: Implémenter avec base de données
  }

  async deleteCustomTag(tagId: string): Promise<boolean> {
    return true; // TODO: Implémenter avec base de données
  }

  // Méthodes pour gestion du staff
  async getStaffBySalon(salonId: string): Promise<any[]> {
    try {
      const staffList = await db.select()
        .from(staffMembers)
        .where(and(
          eq(staffMembers.salonId, salonId),
          eq(staffMembers.isActive, true)
        ));
      
      console.log('👥 Staff trouvé en PostgreSQL:', salonId, '->', staffList.length, 'membres');
      return staffList;
    } catch (error) {
      console.error('❌ Erreur récupération staff PostgreSQL:', error);
      return [];
    }
  }

  async createStaff(staffData: any): Promise<any> {
    return { id: Date.now(), ...staffData }; // TODO: Implémenter avec base de données
  }

  async updateStaff(staffId: string, updateData: any): Promise<any> {
    return { id: staffId, ...updateData }; // TODO: Implémenter avec base de données
  }

  async deleteStaff(staffId: string): Promise<boolean> {
    return true; // TODO: Implémenter avec base de données
  }

  // Méthodes pour gestion des rendez-vous
  async createAppointment(appointmentData: any): Promise<any> {
    return { id: Date.now(), ...appointmentData }; // TODO: Implémenter avec base de données
  }

  async updateAppointment(appointmentId: string, updateData: any): Promise<any> {
    return { id: appointmentId, ...updateData }; // TODO: Implémenter avec base de données
  }

  async deleteAppointment(appointmentId: string): Promise<boolean> {
    return true; // TODO: Implémenter avec base de données
  }

  // Méthode pour enregistrement business
  async getBusinessRegistration(userId: string): Promise<any> {
    return null; // TODO: Implémenter avec base de données
  }

  // Méthode pour services par utilisateur
  async getServicesByUserId(userId: string): Promise<any[]> {
    return []; // TODO: Implémenter avec base de données
  }
}

export const storage = new DatabaseStorage();