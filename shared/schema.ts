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
  subscriptionStatus: varchar("subscription_status").default("free"), // free, basic, premium, trial
  trialEndDate: timestamp("trial_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription plans and business information
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  planType: varchar("plan_type").notNull(), // basic, premium, trial
  status: varchar("status").default("pending"), // pending, active, cancelled, expired
  priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
  // Business information
  companyName: varchar("company_name").notNull(),
  siret: varchar("siret").notNull(),
  businessAddress: text("business_address").notNull(),
  businessPhone: varchar("business_phone"),
  businessEmail: varchar("business_email"),
  legalForm: varchar("legal_form"), // SARL, SAS, auto-entrepreneur, etc.
  vatNumber: varchar("vat_number"),
  // Billing information
  billingAddress: text("billing_address"),
  billingName: varchar("billing_name"),
  // Subscription dates
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  // Payment information
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  lastPaymentDate: timestamp("last_payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services offered by the professional
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  isOnlineBookable: boolean("is_online_bookable").default(true),
  requiresDeposit: boolean("requires_deposit").default(false),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  maxAdvanceBooking: integer("max_advance_booking").default(30), // days
  color: text("color").default("#8B5CF6"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staff members
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  specialties: text("specialties"), // JSON array of service IDs or names
  isActive: boolean("is_active").default(true),
  avatar: varchar("avatar"),
  bio: text("bio"),
  workingHours: text("working_hours"), // JSON object with schedule
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
  staffId: integer("staff_id").references(() => staff.id),
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

export const appointmentHistory = pgTable("appointment_history", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  actionType: varchar("action_type", { length: 20 }).notNull(), // created, confirmed, cancelled, no_show, completed, rescheduled
  actionDate: timestamp("action_date").notNull(),
  previousDate: timestamp("previous_date"), // For rescheduled appointments
  cancelReason: text("cancel_reason"), // Reason for cancellation
  daysBeforeAppointment: integer("days_before_appointment"), // How many days before appointment was cancelled
  timeSlot: varchar("time_slot", { length: 10 }), // Morning, afternoon, evening
  dayOfWeek: integer("day_of_week"), // 1-7 (Monday-Sunday)
  weatherCondition: varchar("weather_condition", { length: 20 }), // For external factors
  createdAt: timestamp("created_at").defaultNow(),
});

export const cancellationPredictions = pgTable("cancellation_predictions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointments.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  predictionScore: numeric("prediction_score", { precision: 3, scale: 2 }).notNull(), // 0.00-1.00
  riskFactors: text("risk_factors").array(), // Array of risk factors identified
  confidence: numeric("confidence", { precision: 3, scale: 2 }).notNull(), // Confidence in prediction
  recommendedAction: varchar("recommended_action", { length: 50 }), // deposit_required, reminder_call, flexible_policy
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  deviceType: text("device_type"), // "ios" | "android"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsed: timestamp("last_used").defaultNow()
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isPublic: boolean("is_public").default(true),
  isVerified: boolean("is_verified").default(false),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loyaltyProgram = pgTable("loyalty_program", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  points: integer("points").default(0),
  totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0"),
  membershipLevel: text("membership_level").default("bronze"),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  discountType: text("discount_type").notNull(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  code: text("code"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Settings (like Planity's business configuration)
export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  businessType: text("business_type").default("salon"), // salon, spa, barbershop, wellness
  timeZone: text("time_zone").default("Europe/Paris"),
  language: text("language").default("fr"),
  currency: text("currency").default("EUR"),
  // Working hours configuration
  mondayOpen: time("monday_open"),
  mondayClose: time("monday_close"),
  tuesdayOpen: time("tuesday_open"),
  tuesdayClose: time("tuesday_close"),
  wednesdayOpen: time("wednesday_open"),
  wednesdayClose: time("wednesday_close"),
  thursdayOpen: time("thursday_open"),
  thursdayClose: time("thursday_close"),
  fridayOpen: time("friday_open"),
  fridayClose: time("friday_close"),
  saturdayOpen: time("saturday_open"),
  saturdayClose: time("saturday_close"),
  sundayOpen: time("sunday_open"),
  sundayClose: time("sunday_close"),
  // Appointment settings
  defaultAppointmentDuration: integer("default_appointment_duration").default(60),
  bookingAdvanceLimit: integer("booking_advance_limit").default(30), // days
  bufferTimeBetweenAppointments: integer("buffer_time").default(15), // minutes
  allowOnlineBooking: boolean("allow_online_booking").default(true),
  requireDeposit: boolean("require_deposit").default(false),
  defaultDepositAmount: numeric("default_deposit_amount", { precision: 10, scale: 2 }).default("20.00"),
  // Notification preferences
  sendSmsReminders: boolean("send_sms_reminders").default(true),
  sendEmailReminders: boolean("send_email_reminders").default(true),
  reminderHoursBefore: integer("reminder_hours_before").default(24),
  // Booking page customization
  brandColor: text("brand_color").default("#8B5CF6"),
  logoUrl: text("logo_url"),
  welcomeMessage: text("welcome_message").default("Bienvenue ! Prenez rendez-vous en quelques clics."),
  description: text("description"),
  showPrices: boolean("show_prices").default(true),
  showDuration: boolean("show_duration").default(true),
  enableInstantBooking: boolean("enable_instant_booking").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service Categories (like Treatwell's service organization)
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color").default("#8B5CF6"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Methods and Transactions
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // stripe, cash, bank_transfer, paypal
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  settings: text("settings"), // JSON configuration
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  clientId: integer("client_id").references(() => clients.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("EUR"),
  type: text("type").notNull(), // payment, refund, deposit
  status: text("status").notNull(), // pending, completed, failed, cancelled
  paymentMethod: text("payment_method").notNull(),
  paymentIntentId: text("payment_intent_id"), // Stripe payment intent ID
  description: text("description"),
  metadata: text("metadata"), // JSON for additional data
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Online Booking Public Pages
export const bookingPages = pgTable("booking_pages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  welcomeMessage: text("welcome_message"),
  termsAndConditions: text("terms_and_conditions"),
  customCss: text("custom_css"),
  logoUrl: text("logo_url"),
  backgroundImageUrl: text("background_image_url"),
  primaryColor: text("primary_color").default("#8B5CF6"),
  isActive: boolean("is_active").default(true),
  allowGuestBooking: boolean("allow_guest_booking").default(true),
  requirePhoneNumber: boolean("require_phone_number").default(true),
  showStaffSelection: boolean("show_staff_selection").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client Communication History
export const clientCommunications = pgTable("client_communications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  type: text("type").notNull(), // sms, email, phone_call, in_person
  subject: text("subject"),
  content: text("content").notNull(),
  status: text("status").default("sent"), // sent, delivered, failed, read
  sentAt: timestamp("sent_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staff Availability and Time Off
export const staffAvailability = pgTable("staff_availability", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull().references(() => staff.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const staffTimeOff = pgTable("staff_time_off", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull().references(() => staff.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
  type: text("type").default("vacation"), // vacation, sick, personal, training
  isApproved: boolean("is_approved").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory Management (for beauty products)
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // hair_care, skin_care, tools, etc.
  brand: text("brand"),
  sku: text("sku"),
  barcode: text("barcode"),
  currentStock: integer("current_stock").default(0),
  minStock: integer("min_stock").default(0),
  maxStock: integer("max_stock"),
  unitCost: numeric("unit_cost", { precision: 10, scale: 2 }),
  sellingPrice: numeric("selling_price", { precision: 10, scale: 2 }),
  supplier: text("supplier"),
  expiryDate: date("expiry_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Marketing Campaigns
export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // email, sms, social_media
  subject: text("subject"),
  content: text("content").notNull(),
  targetAudience: text("target_audience"), // all_clients, new_clients, loyal_clients, etc.
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  status: text("status").default("draft"), // draft, scheduled, sent, failed
  recipientCount: integer("recipient_count").default(0),
  openRate: numeric("open_rate", { precision: 5, scale: 2 }),
  clickRate: numeric("click_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client Preferences and Notes
export const clientPreferences = pgTable("client_preferences", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  preferredStaffId: integer("preferred_staff_id").references(() => staff.id),
  preferredTimeSlots: text("preferred_time_slots").array(), // ["09:00-12:00", "14:00-17:00"]
  preferredDays: text("preferred_days").array(), // ["monday", "tuesday"]
  allergies: text("allergies"),
  skinType: text("skin_type"),
  hairType: text("hair_type"),
  previousTreatments: text("previous_treatments"),
  avoidIngredients: text("avoid_ingredients"),
  communicationPreference: text("communication_preference").default("email"), // email, sms, phone
  marketingOptIn: boolean("marketing_opt_in").default(true),
  reminderOptIn: boolean("reminder_opt_in").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  services: many(services),
  clients: many(clients),
  appointments: many(appointments),
  staff: many(staff),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  forumLikes: many(forumLikes),
  reviews: many(reviews),
  loyaltyPrograms: many(loyaltyProgram),
  promotions: many(promotions),
  notifications: many(notifications),
  businessSettings: one(businessSettings),
  serviceCategories: many(serviceCategories),
  paymentMethods: many(paymentMethods),
  transactions: many(transactions),
  bookingPages: many(bookingPages),
  inventory: many(inventory),
  marketingCampaigns: many(marketingCampaigns),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  user: one(users, {
    fields: [services.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  user: one(users, {
    fields: [staff.userId],
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
  staff: one(staff, {
    fields: [appointments.staffId],
    references: [staff.id],
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

export type InsertStaff = typeof staff.$inferInsert;
export type Staff = typeof staff.$inferSelect;

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

export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export type LoyaltyProgram = typeof loyaltyProgram.$inferSelect;
export type InsertLoyaltyProgram = typeof loyaltyProgram.$inferInsert;

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = typeof promotions.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

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

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
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

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  helpfulCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  usageCount: true,
  createdAt: true,
});

// New types for extended functionality
export type BusinessSettings = typeof businessSettings.$inferSelect;
export type InsertBusinessSettings = typeof businessSettings.$inferInsert;

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = typeof serviceCategories.$inferInsert;

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type BookingPage = typeof bookingPages.$inferSelect;
export type InsertBookingPage = typeof bookingPages.$inferInsert;

export type ClientCommunication = typeof clientCommunications.$inferSelect;
export type InsertClientCommunication = typeof clientCommunications.$inferInsert;

export type StaffAvailability = typeof staffAvailability.$inferSelect;
export type InsertStaffAvailability = typeof staffAvailability.$inferInsert;

export type StaffTimeOff = typeof staffTimeOff.$inferSelect;
export type InsertStaffTimeOff = typeof staffTimeOff.$inferInsert;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = typeof marketingCampaigns.$inferInsert;

export type ClientPreferences = typeof clientPreferences.$inferSelect;
export type InsertClientPreferences = typeof clientPreferences.$inferInsert;

// New validation schemas
export const insertBusinessSettingsSchema = createInsertSchema(businessSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertBookingPageSchema = createInsertSchema(bookingPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientCommunicationSchema = createInsertSchema(clientCommunications).omit({
  id: true,
  sentAt: true,
  createdAt: true,
});

export const insertStaffAvailabilitySchema = createInsertSchema(staffAvailability).omit({
  id: true,
  createdAt: true,
});

export const insertStaffTimeOffSchema = createInsertSchema(staffTimeOff).omit({
  id: true,
  createdAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns).omit({
  id: true,
  createdAt: true,
});

export const insertClientPreferencesSchema = createInsertSchema(clientPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
