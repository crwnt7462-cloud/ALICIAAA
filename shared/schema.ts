import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  time,
  date,
  numeric
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  businessName: varchar("business_name"),
  phone: varchar("phone"),
  address: text("address"),
  isProfessional: boolean("is_professional").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services offered by the professional
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  notes: text("notes"),
  preferences: text("preferences"),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  visitCount: integer("visit_count").default(0),
  lastVisit: timestamp("last_visit"),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  serviceId: integer("service_id").references(() => services.id),
  clientName: varchar("client_name"), // for walk-in clients
  clientEmail: varchar("client_email"),
  clientPhone: varchar("client_phone"),
  appointmentDate: date("appointment_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  status: varchar("status").notNull().default("scheduled"), // scheduled, confirmed, completed, cancelled, no-show
  notes: text("notes"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  depositPaid: decimal("deposit_paid", { precision: 10, scale: 2 }),
  paymentStatus: varchar("payment_status").default("pending"), // pending, partial, paid, refunded
  createdAt: timestamp("created_at").defaultNow(),
});

// Waiting list for appointments
export const waitingList = pgTable("waiting_list", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  serviceId: integer("service_id").references(() => services.id),
  preferredDate: date("preferred_date"),
  isFlexible: boolean("is_flexible").default(false),
  notified: boolean("notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  replyCount: integer("reply_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum replies
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum likes
export const forumLikes = pgTable("forum_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: integer("post_id").references(() => forumPosts.id),
  replyId: integer("reply_id").references(() => forumReplies.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tables pour l'IA et l'automatisation
export const aiSettings = pgTable("ai_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  smartPlanningEnabled: boolean("smart_planning_enabled").default(true),
  noShowPredictionEnabled: boolean("no_show_prediction_enabled").default(true),
  autoRebookingEnabled: boolean("auto_rebooking_enabled").default(true),
  businessCopilotEnabled: boolean("business_copilot_enabled").default(true),
  noShowThreshold: numeric("no_show_threshold", { precision: 3, scale: 2 }).default("0.30"), // Seuil de probabilité pour demander un acompte
  rebookingDaysAdvance: integer("rebooking_days_advance").default(7), // Jours avant d'envoyer des suggestions de rebooking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clientBehaviorData = pgTable("client_behavior_data", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  noShowCount: integer("no_show_count").default(0),
  cancelCount: integer("cancel_count").default(0),
  totalAppointments: integer("total_appointments").default(0),
  avgDaysBetweenVisits: numeric("avg_days_between_visits", { precision: 8, scale: 2 }),
  preferredTimeSlots: text("preferred_time_slots").array(), // ["09:00-12:00", "14:00-17:00"]
  seasonalPatterns: text("seasonal_patterns"), // JSON des patterns saisonniers
  lastNoShow: timestamp("last_no_show"),
  riskScore: numeric("risk_score", { precision: 3, scale: 2 }).default("0.00"), // Score de risque de no-show (0-1)
  loyaltyScore: numeric("loyalty_score", { precision: 3, scale: 2 }).default("0.00"), // Score de fidélité (0-1)
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiPredictions = pgTable("ai_predictions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointments.id),
  predictionType: varchar("prediction_type", { length: 50 }).notNull(), // "no_show", "cancellation", "rebooking"
  confidence: numeric("confidence", { precision: 3, scale: 2 }).notNull(), // Niveau de confiance (0-1)
  factors: text("factors"), // JSON des facteurs influençant la prédiction
  actionTaken: varchar("action_taken", { length: 100 }), // Action automatique prise
  createdAt: timestamp("created_at").defaultNow(),
});

export const autoPromotions = pgTable("auto_promotions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "discount", "package", "loyalty"
  targetSegment: varchar("target_segment", { length: 100 }), // "new_clients", "lapsed_clients", "vip_clients"
  conditions: text("conditions"), // JSON des conditions de la promo
  aiGenerated: boolean("ai_generated").default(false),
  aiReasoning: text("ai_reasoning"), // Pourquoi l'IA a suggéré cette promo
  status: varchar("status", { length: 20 }).default("draft"), // "draft", "active", "paused", "ended"
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const smartPlanningLogs = pgTable("smart_planning_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  date: date("date").notNull(),
  originalSlots: integer("original_slots").notNull(),
  optimizedSlots: integer("optimized_slots").notNull(),
  gapsReduced: integer("gaps_reduced").notNull(),
  revenueImpact: numeric("revenue_impact", { precision: 10, scale: 2 }), // Impact estimé sur le CA
  optimizationAlgorithm: varchar("optimization_algorithm", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  services: many(services),
  clients: many(clients),
  appointments: many(appointments),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  forumLikes: many(forumLikes),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  user: one(users, {
    fields: [services.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  category: one(forumCategories, {
    fields: [forumPosts.categoryId],
    references: [forumCategories.id],
  }),
  replies: many(forumReplies),
  likes: many(forumLikes),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one, many }) => ({
  user: one(users, {
    fields: [forumReplies.userId],
    references: [users.id],
  }),
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  likes: many(forumLikes),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertService = typeof services.$inferInsert;
export type Service = typeof services.$inferSelect;

export type InsertClient = typeof clients.$inferInsert;
export type Client = typeof clients.$inferSelect;

export type InsertAppointment = typeof appointments.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;

export type InsertWaitingList = typeof waitingList.$inferInsert;
export type WaitingListItem = typeof waitingList.$inferSelect;

export type InsertForumPost = typeof forumPosts.$inferInsert;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertForumReply = typeof forumReplies.$inferInsert;
export type ForumReply = typeof forumReplies.$inferSelect;

export type ForumCategory = typeof forumCategories.$inferSelect;

// Types pour l'IA et l'automatisation
export type AiSettings = typeof aiSettings.$inferSelect;
export type InsertAiSettings = typeof aiSettings.$inferInsert;

export type ClientBehaviorData = typeof clientBehaviorData.$inferSelect;
export type InsertClientBehaviorData = typeof clientBehaviorData.$inferInsert;

export type AiPrediction = typeof aiPredictions.$inferSelect;
export type InsertAiPrediction = typeof aiPredictions.$inferInsert;

export type AutoPromotion = typeof autoPromotions.$inferSelect;
export type InsertAutoPromotion = typeof autoPromotions.$inferInsert;

export type SmartPlanningLog = typeof smartPlanningLogs.$inferSelect;
export type InsertSmartPlanningLog = typeof smartPlanningLogs.$inferInsert;

// Schemas for validation
export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  totalSpent: true,
  visitCount: true,
  lastVisit: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  replyCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  likeCount: true,
  createdAt: true,
});
