"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffAvailability = exports.clientCommunications = exports.bookingPages = exports.transactions = exports.paymentMethods = exports.serviceCategories = exports.businessSettings = exports.notificationPreferences = exports.emailNotifications = exports.smsNotifications = exports.notifications = exports.promotions = exports.loyaltyProgram = exports.reviews = exports.salonPhotos = exports.pushTokens = exports.cancellationPredictions = exports.appointmentHistory = exports.smartPlanningLogs = exports.autoPromotions = exports.aiPredictions = exports.clientBehaviorData = exports.aiSettings = exports.forumLikes = exports.forumReplies = exports.forumPosts = exports.forumCategories = exports.waitingList = exports.appointments = exports.clientPhotos = exports.clientNotes = exports.clients = exports.services = exports.pricingRules = exports.professionalSettings = exports.servicePhotos = exports.staffMembers = exports.clientReliability = exports.staff = exports.promoCodes = exports.subscriptions = exports.businessRegistrationSchema = exports.professionals = exports.businessRegistrations = exports.clientFavorites = exports.clientAccounts = exports.userSubscriptions = exports.subscriptionPlans = exports.users = exports.sessions = void 0;
exports.salonPages = exports.salonTemplates = exports.insertUserSubscriptionSchema = exports.insertSubscriptionPlanSchema = exports.insertSalonPhotoAdvancedSchema = exports.insertSalonAlbumSchema = exports.photoAdvancedRelations = exports.albumRelations = exports.salonPhotosAdvanced = exports.salonAlbums = exports.insertSubscriptionSchema = exports.insertClientPreferencesSchema = exports.insertMarketingCampaignSchema = exports.insertInventorySchema = exports.insertStaffTimeOffSchema = exports.insertStaffAvailabilitySchema = exports.insertClientCommunicationSchema = exports.insertBookingPageSchema = exports.insertTransactionSchema = exports.insertPaymentMethodSchema = exports.insertServiceCategorySchema = exports.insertBusinessSettingsSchema = exports.insertPromotionSchema = exports.insertReviewSchema = exports.insertForumReplySchema = exports.insertForumPostSchema = exports.insertAppointmentSchema = exports.insertStaffMemberSchema = exports.insertClientSchema = exports.insertServiceSchema = exports.clientRegisterSchema = exports.registerSchema = exports.loginSchema = exports.insertUserSchema = exports.salonRegistrations = exports.insertSalonPhotoSchema = exports.customTags = exports.photos = exports.salons = exports.forumRepliesRelations = exports.forumPostsRelations = exports.appointmentsRelations = exports.clientsRelations = exports.staffMembersRelations = exports.servicesRelations = exports.usersRelations = exports.clientPreferences = exports.marketingCampaigns = exports.inventory = exports.staffTimeOff = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
var drizzle_orm_2 = require("drizzle-orm");
var drizzle_zod_1 = require("drizzle-zod");
var zod_1 = require("zod");
// Session storage table (mandatory for Replit Auth)
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, function (table) { return [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]; });
// Suppression du système de messagerie selon les spécifications
// User storage table (mandatory for Replit Auth)
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    email: (0, pg_core_1.varchar)("email").unique().notNull(),
    password: (0, pg_core_1.varchar)("password"), // For custom auth
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    businessName: (0, pg_core_1.varchar)("business_name"),
    siret: (0, pg_core_1.varchar)("siret"),
    phone: (0, pg_core_1.varchar)("phone"),
    address: (0, pg_core_1.text)("address"),
    city: (0, pg_core_1.varchar)("city"),
    isProfessional: (0, pg_core_1.boolean)("is_professional").default(true),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    subscriptionPlan: (0, pg_core_1.varchar)("subscription_plan").default("basic-pro"), // basic-pro, advanced-pro, premium-pro
    subscriptionStatus: (0, pg_core_1.varchar)("subscription_status").default("inactive"), // active, inactive, trial, cancelled
    trialEndDate: (0, pg_core_1.timestamp)("trial_end_date"),
    mentionHandle: (0, pg_core_1.varchar)("mention_handle").unique(), // @identifiant unique pour mentions dans messagerie
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Table des abonnements disponibles
exports.subscriptionPlans = (0, pg_core_1.pgTable)("subscription_plans", {
    id: (0, pg_core_1.varchar)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)("currency").default("EUR"),
    billingCycle: (0, pg_core_1.varchar)("billing_cycle").default("monthly"), // monthly, yearly
    features: (0, pg_core_1.jsonb)("features").notNull(), // Array of features
    isPopular: (0, pg_core_1.boolean)("is_popular").default(false),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Table des souscriptions actives des utilisateurs
exports.userSubscriptions = (0, pg_core_1.pgTable)("user_subscriptions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }, { onDelete: "cascade" }),
    planId: (0, pg_core_1.varchar)("plan_id").notNull().references(function () { return exports.subscriptionPlans.id; }),
    status: (0, pg_core_1.varchar)("status").default("active"), // active, inactive, cancelled, trial
    startDate: (0, pg_core_1.timestamp)("start_date").defaultNow(),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    trialEndDate: (0, pg_core_1.timestamp)("trial_end_date"),
    cancelledAt: (0, pg_core_1.timestamp)("cancelled_at"),
    stripeSubscriptionId: (0, pg_core_1.varchar)("stripe_subscription_id"),
    stripeCustomerId: (0, pg_core_1.varchar)("stripe_customer_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Client accounts table for customer authentication
exports.clientAccounts = (0, pg_core_1.pgTable)("client_accounts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    email: (0, pg_core_1.varchar)("email"),
    password: (0, pg_core_1.varchar)("password"),
    phone: (0, pg_core_1.varchar)("phone"),
    address: (0, pg_core_1.text)("address"),
    city: (0, pg_core_1.varchar)("city"),
    postalCode: (0, pg_core_1.varchar)("postal_code"),
    dateOfBirth: (0, pg_core_1.date)("date_of_birth"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    loyaltyPoints: (0, pg_core_1.integer)("loyalty_points").default(0),
    clientStatus: (0, pg_core_1.varchar)("client_status").default("active"), // active, inactive, blocked
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    lastLoginAt: (0, pg_core_1.timestamp)("last_login_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Table des salons favoris des clients
exports.clientFavorites = (0, pg_core_1.pgTable)("client_favorites", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    clientId: (0, pg_core_1.varchar)("client_id").notNull(), // référence au client
    salonId: (0, pg_core_1.varchar)("salon_id").notNull(), // référence au salon
    addedAt: (0, pg_core_1.timestamp)("added_at").defaultNow(),
});
// Business registrations table for professional signups
exports.businessRegistrations = (0, pg_core_1.pgTable)("business_registrations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    businessName: (0, pg_core_1.varchar)("business_name").notNull(),
    slug: (0, pg_core_1.varchar)("slug").unique(), // AJOUT colonne slug pour recherche par URL
    businessType: (0, pg_core_1.varchar)("business_type").notNull(),
    siret: (0, pg_core_1.varchar)("siret").notNull().unique(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.varchar)("city").notNull(),
    postalCode: (0, pg_core_1.varchar)("postal_code").notNull(),
    phone: (0, pg_core_1.varchar)("phone").notNull(),
    email: (0, pg_core_1.varchar)("email").notNull(),
    ownerFirstName: (0, pg_core_1.varchar)("owner_first_name").notNull(),
    ownerLastName: (0, pg_core_1.varchar)("owner_last_name").notNull(),
    legalForm: (0, pg_core_1.varchar)("legal_form").notNull(),
    vatNumber: (0, pg_core_1.varchar)("vat_number"),
    description: (0, pg_core_1.text)("description"),
    planType: (0, pg_core_1.varchar)("plan_type").notNull(),
    status: (0, pg_core_1.varchar)("status").default("pending"), // pending, approved, rejected
    stripeCustomerId: (0, pg_core_1.varchar)("stripe_customer_id"),
    stripeSubscriptionId: (0, pg_core_1.varchar)("stripe_subscription_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Table professionals
exports.professionals = (0, pg_core_1.pgTable)("professionals", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    salon_id: (0, pg_core_1.varchar)("salon_id").notNull(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    role: (0, pg_core_1.varchar)("role"),
    email: (0, pg_core_1.varchar)("email"),
    phone: (0, pg_core_1.varchar)("phone"),
    specialties: (0, pg_core_1.jsonb)("specialties"),
    color: (0, pg_core_1.varchar)("color"),
    is_active: (0, pg_core_1.boolean)("is_active").default(true),
    work_schedule: (0, pg_core_1.jsonb)("work_schedule"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Schema for business registration validation
exports.businessRegistrationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.businessRegistrations).omit({
    id: true,
    status: true,
    stripeCustomerId: true,
    stripeSubscriptionId: true,
    createdAt: true,
    updatedAt: true,
});
// Subscription plans and business information
exports.subscriptions = (0, pg_core_1.pgTable)("subscriptions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    planType: (0, pg_core_1.varchar)("plan_type").notNull(), // basic, premium, trial
    status: (0, pg_core_1.varchar)("status").default("pending"), // pending, active, cancelled, expired
    priceMonthly: (0, pg_core_1.decimal)("price_monthly", { precision: 10, scale: 2 }).notNull(),
    // Business information
    companyName: (0, pg_core_1.varchar)("company_name").notNull(),
    siret: (0, pg_core_1.varchar)("siret").notNull(),
    businessAddress: (0, pg_core_1.text)("business_address").notNull(),
    businessPhone: (0, pg_core_1.varchar)("business_phone"),
    businessEmail: (0, pg_core_1.varchar)("business_email"),
    legalForm: (0, pg_core_1.varchar)("legal_form"), // SARL, SAS, auto-entrepreneur, etc.
    vatNumber: (0, pg_core_1.varchar)("vat_number"),
    // Billing information
    billingAddress: (0, pg_core_1.text)("billing_address"),
    billingName: (0, pg_core_1.varchar)("billing_name"),
    // Subscription dates
    startDate: (0, pg_core_1.timestamp)("start_date"),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    nextBillingDate: (0, pg_core_1.timestamp)("next_billing_date"),
    // Payment information
    stripeCustomerId: (0, pg_core_1.varchar)("stripe_customer_id"),
    stripeSubscriptionId: (0, pg_core_1.varchar)("stripe_subscription_id"),
    lastPaymentDate: (0, pg_core_1.timestamp)("last_payment_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Système de vérification email supprimé - inscription directe
// Promotional codes and special offers
exports.promoCodes = (0, pg_core_1.pgTable)("promo_codes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    code: (0, pg_core_1.varchar)("code").notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    discountType: (0, pg_core_1.varchar)("discount_type").notNull(), // percentage, fixed_amount
    discountValue: (0, pg_core_1.decimal)("discount_value", { precision: 10, scale: 2 }).notNull(),
    validFrom: (0, pg_core_1.timestamp)("valid_from").notNull(),
    validUntil: (0, pg_core_1.timestamp)("valid_until").notNull(),
    maxUses: (0, pg_core_1.integer)("max_uses"),
    currentUses: (0, pg_core_1.integer)("current_uses").default(0),
    applicableServices: (0, pg_core_1.jsonb)("applicable_services"), // Array of service IDs
    weekendPremium: (0, pg_core_1.boolean)("weekend_premium").default(false), // Prix majoré weekend
    salonId: (0, pg_core_1.varchar)("salon_id").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Staff table (matches existing PostgreSQL structure)
exports.staff = (0, pg_core_1.pgTable)("staff", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    firstName: (0, pg_core_1.varchar)("first_name").notNull(),
    lastName: (0, pg_core_1.varchar)("last_name").notNull(),
    email: (0, pg_core_1.varchar)("email"),
    phone: (0, pg_core_1.varchar)("phone"),
    specialties: (0, pg_core_1.text)("specialties"),
    serviceIds: (0, pg_core_1.text)("service_ids").array(), // Array of specific service IDs this staff can perform
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    avatar: (0, pg_core_1.varchar)("avatar"),
    bio: (0, pg_core_1.text)("bio"),
    workingHours: (0, pg_core_1.text)("working_hours"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Client reliability tracking for deposit adjustments
exports.clientReliability = (0, pg_core_1.pgTable)("client_reliability", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    clientId: (0, pg_core_1.varchar)("client_id").notNull(),
    salonId: (0, pg_core_1.varchar)("salon_id").notNull(),
    consecutiveCancellations: (0, pg_core_1.integer)("consecutive_cancellations").default(0),
    lastCancellationDate: (0, pg_core_1.timestamp)("last_cancellation_date"),
    customDepositPercentage: (0, pg_core_1.integer)("custom_deposit_percentage"), // Override default deposit
    reliabilityScore: (0, pg_core_1.integer)("reliability_score").default(100), // 0-100 scale
    totalAppointments: (0, pg_core_1.integer)("total_appointments").default(0),
    totalCancellations: (0, pg_core_1.integer)("total_cancellations").default(0),
    totalNoShows: (0, pg_core_1.integer)("total_no_shows").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Staff management for individual/group agenda views
exports.staffMembers = (0, pg_core_1.pgTable)("staff_members", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    salonId: (0, pg_core_1.varchar)("salon_id").notNull(),
    firstName: (0, pg_core_1.varchar)("first_name").notNull(),
    lastName: (0, pg_core_1.varchar)("last_name").notNull(),
    email: (0, pg_core_1.varchar)("email"),
    phone: (0, pg_core_1.varchar)("phone"),
    specialties: (0, pg_core_1.jsonb)("specialties"), // Array of specialty IDs/names
    workSchedule: (0, pg_core_1.jsonb)("work_schedule"), // Weekly schedule
    color: (0, pg_core_1.varchar)("color").default("#8B5CF6"), // Color for calendar display
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Service photos and gallery
exports.servicePhotos = (0, pg_core_1.pgTable)("service_photos", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    serviceId: (0, pg_core_1.integer)("service_id").notNull(),
    photoUrl: (0, pg_core_1.text)("photo_url").notNull(),
    caption: (0, pg_core_1.text)("caption"),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    isMain: (0, pg_core_1.boolean)("is_main").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Professional settings and configurations - PERSISTENT STORAGE
exports.professionalSettings = (0, pg_core_1.pgTable)("professional_settings", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    salonName: (0, pg_core_1.varchar)("salon_name"),
    salonDescription: (0, pg_core_1.text)("salon_description"),
    salonColors: (0, pg_core_1.jsonb)("salon_colors"), // Theme colors
    workingHours: (0, pg_core_1.jsonb)("working_hours"), // Weekly schedule
    bookingSettings: (0, pg_core_1.jsonb)("booking_settings"), // Deposit %, advance booking rules
    notificationSettings: (0, pg_core_1.jsonb)("notification_settings"), // Email/SMS preferences
    paymentSettings: (0, pg_core_1.jsonb)("payment_settings"), // Stripe config
    salonPhotos: (0, pg_core_1.jsonb)("salon_photos"), // Array of photo URLs
    socialLinks: (0, pg_core_1.jsonb)("social_links"), // Instagram, Facebook, etc.
    businessInfo: (0, pg_core_1.jsonb)("business_info"), // SIRET, address, etc.
    customFields: (0, pg_core_1.jsonb)("custom_fields"), // Any additional professional data
    lastModified: (0, pg_core_1.timestamp)("last_modified").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Weekend and premium pricing
exports.pricingRules = (0, pg_core_1.pgTable)("pricing_rules", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    salonId: (0, pg_core_1.varchar)("salon_id").notNull(),
    serviceId: (0, pg_core_1.integer)("service_id"),
    dayOfWeek: (0, pg_core_1.varchar)("day_of_week"), // "0"=Sunday, "6"=Saturday
    timeSlot: (0, pg_core_1.varchar)("time_slot"), // e.g., "09:00-12:00"
    priceMultiplier: (0, pg_core_1.decimal)("price_multiplier", { precision: 3, scale: 2 }).default("1.0"),
    fixedSurcharge: (0, pg_core_1.decimal)("fixed_surcharge", { precision: 10, scale: 2 }).default("0"),
    isWeekendPremium: (0, pg_core_1.boolean)("is_weekend_premium").default(false),
    description: (0, pg_core_1.text)("description"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Services offered by the professional
exports.services = (0, pg_core_1.pgTable)("services", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    categoryId: (0, pg_core_1.integer)("category_id").references(function () { return exports.serviceCategories.id; }),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    duration: (0, pg_core_1.integer)("duration").notNull(), // in minutes
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    isOnlineBookable: (0, pg_core_1.boolean)("is_online_bookable").default(true),
    requiresDeposit: (0, pg_core_1.boolean)("requires_deposit").default(false),
    depositAmount: (0, pg_core_1.decimal)("deposit_amount", { precision: 10, scale: 2 }),
    depositPercentage: (0, pg_core_1.integer)("deposit_percentage").default(30), // Pourcentage acompte choisi par le pro (0-100%)
    maxAdvanceBooking: (0, pg_core_1.integer)("max_advance_booking").default(30), // days
    color: (0, pg_core_1.text)("color").default("#8B5CF6"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Staff members (removed duplicate - already defined above as staff)
// Using the staff table defined above in the new advanced features section
// Client accounts (for customer login and authentication) - REMOVED DUPLICATE - Using definition above
// Clients (managed by professionals)
exports.clients = (0, pg_core_1.pgTable)("clients", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    clientAccountId: (0, pg_core_1.varchar)("client_account_id").references(function () { return exports.clientAccounts.id; }), // Link to client account if they have one
    firstName: (0, pg_core_1.varchar)("first_name").notNull(),
    lastName: (0, pg_core_1.varchar)("last_name").notNull(),
    email: (0, pg_core_1.varchar)("email"),
    notes: (0, pg_core_1.text)("notes"),
    preferences: (0, pg_core_1.text)("preferences"),
    totalSpent: (0, pg_core_1.decimal)("total_spent", { precision: 10, scale: 2 }).default("0"),
    visitCount: (0, pg_core_1.integer)("visit_count").default(0),
    lastVisit: (0, pg_core_1.timestamp)("last_visit"),
    rating: (0, pg_core_1.integer)("rating"), // 1-5 stars
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Notes de suivi clients
exports.clientNotes = (0, pg_core_1.pgTable)("client_notes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    content: (0, pg_core_1.text)("content").notNull(),
    author: (0, pg_core_1.varchar)("author").notNull(), // Nom de l'auteur
    isEditable: (0, pg_core_1.boolean)("is_editable").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Photos clients
exports.clientPhotos = (0, pg_core_1.pgTable)("client_photos", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    photoUrl: (0, pg_core_1.text)("photo_url").notNull(),
    fileName: (0, pg_core_1.varchar)("file_name"),
    fileSize: (0, pg_core_1.integer)("file_size"), // Taille en bytes
    mimeType: (0, pg_core_1.varchar)("mime_type"), // image/jpeg, image/png
    caption: (0, pg_core_1.text)("caption"),
    uploadedAt: (0, pg_core_1.timestamp)("uploaded_at").defaultNow(),
});
// Appointments
exports.appointments = (0, pg_core_1.pgTable)("appointments", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    clientId: (0, pg_core_1.integer)("client_id").references(function () { return exports.clients.id; }),
    clientAccountId: (0, pg_core_1.varchar)("client_account_id").references(function () { return exports.clientAccounts.id; }), // Lien vers compte client si connecté
    serviceId: (0, pg_core_1.integer)("service_id").references(function () { return exports.services.id; }),
    staffId: (0, pg_core_1.integer)("staff_id").references(function () { return exports.staff.id; }),
    clientName: (0, pg_core_1.varchar)("client_name"), // for walk-in clients
    clientEmail: (0, pg_core_1.varchar)("client_email"),
    clientPhone: (0, pg_core_1.varchar)("client_phone"),
    appointmentDate: (0, pg_core_1.date)("appointment_date").notNull(),
    startTime: (0, pg_core_1.time)("start_time").notNull(),
    endTime: (0, pg_core_1.time)("end_time").notNull(),
    status: (0, pg_core_1.varchar)("status").notNull().default("scheduled"), // scheduled, confirmed, completed, cancelled, no-show
    notes: (0, pg_core_1.text)("notes"),
    totalPrice: (0, pg_core_1.decimal)("total_price", { precision: 10, scale: 2 }),
    depositPaid: (0, pg_core_1.decimal)("deposit_paid", { precision: 10, scale: 2 }),
    paymentStatus: (0, pg_core_1.varchar)("payment_status").default("pending"), // pending, partial, paid, refunded
    stripeSessionId: (0, pg_core_1.text)("stripe_session_id"),
    source: (0, pg_core_1.varchar)("source").default("app_direct"), // instagram, google, facebook, tiktok, app_direct, autre
    isManualBlock: (0, pg_core_1.boolean)("is_manual_block").default(false), // Flag pour blocs manuels créés par pro
    createdByPro: (0, pg_core_1.boolean)("created_by_pro").default(false), // Audit : créé par le professionnel
    allowOverlap: (0, pg_core_1.boolean)("allow_overlap").default(false), // Autoriser chevauchement pour blocs manuels
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Waiting list for appointments
exports.waitingList = (0, pg_core_1.pgTable)("waiting_list", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    clientId: (0, pg_core_1.integer)("client_id").references(function () { return exports.clients.id; }),
    serviceId: (0, pg_core_1.integer)("service_id").references(function () { return exports.services.id; }),
    preferredDate: (0, pg_core_1.date)("preferred_date"),
    isFlexible: (0, pg_core_1.boolean)("is_flexible").default(false),
    notified: (0, pg_core_1.boolean)("notified").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Forum categories
exports.forumCategories = (0, pg_core_1.pgTable)("forum_categories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    icon: (0, pg_core_1.varchar)("icon"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Forum posts
exports.forumPosts = (0, pg_core_1.pgTable)("forum_posts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    categoryId: (0, pg_core_1.integer)("category_id").references(function () { return exports.forumCategories.id; }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    title: (0, pg_core_1.varchar)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    isPinned: (0, pg_core_1.boolean)("is_pinned").default(false),
    isLocked: (0, pg_core_1.boolean)("is_locked").default(false),
    viewCount: (0, pg_core_1.integer)("view_count").default(0),
    likeCount: (0, pg_core_1.integer)("like_count").default(0),
    replyCount: (0, pg_core_1.integer)("reply_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Forum replies
exports.forumReplies = (0, pg_core_1.pgTable)("forum_replies", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    postId: (0, pg_core_1.integer)("post_id").references(function () { return exports.forumPosts.id; }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    content: (0, pg_core_1.text)("content").notNull(),
    likeCount: (0, pg_core_1.integer)("like_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Forum likes
exports.forumLikes = (0, pg_core_1.pgTable)("forum_likes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(function () { return exports.users.id; }),
    postId: (0, pg_core_1.integer)("post_id").references(function () { return exports.forumPosts.id; }),
    replyId: (0, pg_core_1.integer)("reply_id").references(function () { return exports.forumReplies.id; }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Tables pour l'IA et l'automatisation
exports.aiSettings = (0, pg_core_1.pgTable)("ai_settings", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull().references(function () { return exports.users.id; }),
    smartPlanningEnabled: (0, pg_core_1.boolean)("smart_planning_enabled").default(true),
    noShowPredictionEnabled: (0, pg_core_1.boolean)("no_show_prediction_enabled").default(true),
    autoRebookingEnabled: (0, pg_core_1.boolean)("auto_rebooking_enabled").default(true),
    businessCopilotEnabled: (0, pg_core_1.boolean)("business_copilot_enabled").default(true),
    noShowThreshold: (0, pg_core_1.numeric)("no_show_threshold", { precision: 3, scale: 2 }).default("0.30"), // Seuil de probabilité pour demander un acompte
    rebookingDaysAdvance: (0, pg_core_1.integer)("rebooking_days_advance").default(7), // Jours avant d'envoyer des suggestions de rebooking
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.clientBehaviorData = (0, pg_core_1.pgTable)("client_behavior_data", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    noShowCount: (0, pg_core_1.integer)("no_show_count").default(0),
    cancelCount: (0, pg_core_1.integer)("cancel_count").default(0),
    totalAppointments: (0, pg_core_1.integer)("total_appointments").default(0),
    avgDaysBetweenVisits: (0, pg_core_1.numeric)("avg_days_between_visits", { precision: 8, scale: 2 }),
    preferredTimeSlots: (0, pg_core_1.jsonb)("preferred_time_slots"), // ["09:00-12:00", "14:00-17:00"]
    seasonalPatterns: (0, pg_core_1.text)("seasonal_patterns"), // JSON des patterns saisonniers
    lastNoShow: (0, pg_core_1.timestamp)("last_no_show"),
    riskScore: (0, pg_core_1.numeric)("risk_score", { precision: 3, scale: 2 }).default("0.00"), // Score de risque de no-show (0-1)
    loyaltyScore: (0, pg_core_1.numeric)("loyalty_score", { precision: 3, scale: 2 }).default("0.00"), // Score de fidélité (0-1)
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.aiPredictions = (0, pg_core_1.pgTable)("ai_predictions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    appointmentId: (0, pg_core_1.integer)("appointment_id").notNull().references(function () { return exports.appointments.id; }),
    predictionType: (0, pg_core_1.varchar)("prediction_type", { length: 50 }).notNull(), // "no_show", "cancellation", "rebooking"
    confidence: (0, pg_core_1.numeric)("confidence", { precision: 3, scale: 2 }).notNull(), // Niveau de confiance (0-1)
    factors: (0, pg_core_1.text)("factors"), // JSON des facteurs influençant la prédiction
    actionTaken: (0, pg_core_1.varchar)("action_taken", { length: 100 }), // Action automatique prise
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.autoPromotions = (0, pg_core_1.pgTable)("auto_promotions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull().references(function () { return exports.users.id; }),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).notNull(), // "discount", "package", "loyalty"
    targetSegment: (0, pg_core_1.varchar)("target_segment", { length: 100 }), // "new_clients", "lapsed_clients", "vip_clients"
    conditions: (0, pg_core_1.text)("conditions"), // JSON des conditions de la promo
    aiGenerated: (0, pg_core_1.boolean)("ai_generated").default(false),
    aiReasoning: (0, pg_core_1.text)("ai_reasoning"), // Pourquoi l'IA a suggéré cette promo
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("draft"), // "draft", "active", "paused", "ended"
    startDate: (0, pg_core_1.timestamp)("start_date"),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.smartPlanningLogs = (0, pg_core_1.pgTable)("smart_planning_logs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull().references(function () { return exports.users.id; }),
    date: (0, pg_core_1.date)("date").notNull(),
    originalSlots: (0, pg_core_1.integer)("original_slots").notNull(),
    optimizedSlots: (0, pg_core_1.integer)("optimized_slots").notNull(),
    gapsReduced: (0, pg_core_1.integer)("gaps_reduced").notNull(),
    revenueImpact: (0, pg_core_1.numeric)("revenue_impact", { precision: 10, scale: 2 }), // Impact estimé sur le CA
    optimizationAlgorithm: (0, pg_core_1.varchar)("optimization_algorithm", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.appointmentHistory = (0, pg_core_1.pgTable)("appointment_history", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(function () { return exports.appointments.id; }),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull().references(function () { return exports.users.id; }),
    actionType: (0, pg_core_1.varchar)("action_type", { length: 20 }).notNull(), // created, confirmed, cancelled, no_show, completed, rescheduled
    actionDate: (0, pg_core_1.timestamp)("action_date").notNull(),
    previousDate: (0, pg_core_1.timestamp)("previous_date"), // For rescheduled appointments
    cancelReason: (0, pg_core_1.text)("cancel_reason"), // Reason for cancellation
    daysBeforeAppointment: (0, pg_core_1.integer)("days_before_appointment"), // How many days before appointment was cancelled
    timeSlot: (0, pg_core_1.varchar)("time_slot", { length: 10 }), // Morning, afternoon, evening
    dayOfWeek: (0, pg_core_1.integer)("day_of_week"), // 1-7 (Monday-Sunday)
    weatherCondition: (0, pg_core_1.varchar)("weather_condition", { length: 20 }), // For external factors
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.cancellationPredictions = (0, pg_core_1.pgTable)("cancellation_predictions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    appointmentId: (0, pg_core_1.integer)("appointment_id").notNull().references(function () { return exports.appointments.id; }),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    predictionScore: (0, pg_core_1.numeric)("prediction_score", { precision: 3, scale: 2 }).notNull(), // 0.00-1.00
    riskFactors: (0, pg_core_1.text)("risk_factors").array(), // Array of risk factors identified
    confidence: (0, pg_core_1.numeric)("confidence", { precision: 3, scale: 2 }).notNull(), // Confidence in prediction
    recommendedAction: (0, pg_core_1.varchar)("recommended_action", { length: 50 }), // deposit_required, reminder_call, flexible_policy
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    processedAt: (0, pg_core_1.timestamp)("processed_at"),
});
exports.pushTokens = (0, pg_core_1.pgTable)("push_tokens", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    token: (0, pg_core_1.text)("token").notNull(),
    deviceType: (0, pg_core_1.text)("device_type"), // "ios" | "android"
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    lastUsed: (0, pg_core_1.timestamp)("last_used").defaultNow()
});
// Salon photos table
exports.salonPhotos = (0, pg_core_1.pgTable)("salon_photos", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    photoUrl: (0, pg_core_1.text)("photo_url").notNull(),
    photoType: (0, pg_core_1.varchar)("photo_type").default("gallery"), // logo, interior, team, results, gallery
    caption: (0, pg_core_1.text)("caption"),
    sortOrder: (0, pg_core_1.integer)("sort_order").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    serviceId: (0, pg_core_1.integer)("service_id").notNull().references(function () { return exports.services.id; }),
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(function () { return exports.appointments.id; }),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    comment: (0, pg_core_1.text)("comment").notNull(),
    isPublic: (0, pg_core_1.boolean)("is_public").default(true),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    helpfulCount: (0, pg_core_1.integer)("helpful_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.loyaltyProgram = (0, pg_core_1.pgTable)("loyalty_program", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    points: (0, pg_core_1.integer)("points").default(0),
    totalSpent: (0, pg_core_1.numeric)("total_spent", { precision: 10, scale: 2 }).default("0"),
    membershipLevel: (0, pg_core_1.text)("membership_level").default("bronze"),
    lastActivity: (0, pg_core_1.timestamp)("last_activity").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.promotions = (0, pg_core_1.pgTable)("promotions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    discountType: (0, pg_core_1.text)("discount_type").notNull(),
    discountValue: (0, pg_core_1.numeric)("discount_value", { precision: 10, scale: 2 }).notNull(),
    code: (0, pg_core_1.text)("code"),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    usageLimit: (0, pg_core_1.integer)("usage_limit"),
    usageCount: (0, pg_core_1.integer)("usage_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    clientId: (0, pg_core_1.integer)("client_id").references(function () { return exports.clients.id; }),
    type: (0, pg_core_1.text)("type").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    isRead: (0, pg_core_1.boolean)("is_read").default(false),
    scheduledFor: (0, pg_core_1.timestamp)("scheduled_for"),
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Suppression des tables de messagerie selon les spécifications
// SMS and notification logs
exports.smsNotifications = (0, pg_core_1.pgTable)("sms_notifications", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    recipientPhone: (0, pg_core_1.varchar)("recipient_phone").notNull(),
    recipientName: (0, pg_core_1.varchar)("recipient_name"),
    message: (0, pg_core_1.text)("message").notNull(),
    notificationType: (0, pg_core_1.varchar)("notification_type").notNull(), // appointment_confirmation, reminder, cancellation, custom
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(function () { return exports.appointments.id; }),
    status: (0, pg_core_1.varchar)("status").default("pending"), // pending, sent, delivered, failed
    externalId: (0, pg_core_1.varchar)("external_id"), // SMS provider message ID
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    deliveredAt: (0, pg_core_1.timestamp)("delivered_at"),
    failureReason: (0, pg_core_1.text)("failure_reason"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Email notification logs
exports.emailNotifications = (0, pg_core_1.pgTable)("email_notifications", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    recipientEmail: (0, pg_core_1.varchar)("recipient_email").notNull(),
    recipientName: (0, pg_core_1.varchar)("recipient_name"),
    subject: (0, pg_core_1.varchar)("subject").notNull(),
    htmlContent: (0, pg_core_1.text)("html_content").notNull(),
    textContent: (0, pg_core_1.text)("text_content"),
    notificationType: (0, pg_core_1.varchar)("notification_type").notNull(),
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(function () { return exports.appointments.id; }),
    status: (0, pg_core_1.varchar)("status").default("pending"),
    externalId: (0, pg_core_1.varchar)("external_id"),
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    deliveredAt: (0, pg_core_1.timestamp)("delivered_at"),
    openedAt: (0, pg_core_1.timestamp)("opened_at"),
    failureReason: (0, pg_core_1.text)("failure_reason"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Notification preferences for users
exports.notificationPreferences = (0, pg_core_1.pgTable)("notification_preferences", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").references(function () { return exports.users.id; }),
    clientAccountId: (0, pg_core_1.varchar)("client_account_id").references(function () { return exports.clientAccounts.id; }),
    smsEnabled: (0, pg_core_1.boolean)("sms_enabled").default(true),
    emailEnabled: (0, pg_core_1.boolean)("email_enabled").default(true),
    appointmentReminders: (0, pg_core_1.boolean)("appointment_reminders").default(true),
    reminderTimeBefore: (0, pg_core_1.integer)("reminder_time_before").default(24), // hours before appointment
    marketingMessages: (0, pg_core_1.boolean)("marketing_messages").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Business Settings (like Avyento's business configuration)
exports.businessSettings = (0, pg_core_1.pgTable)("business_settings", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    businessType: (0, pg_core_1.text)("business_type").default("salon"), // salon, spa, barbershop, wellness
    timeZone: (0, pg_core_1.text)("time_zone").default("Europe/Paris"),
    language: (0, pg_core_1.text)("language").default("fr"),
    currency: (0, pg_core_1.text)("currency").default("EUR"),
    // Working hours configuration
    mondayOpen: (0, pg_core_1.time)("monday_open"),
    mondayClose: (0, pg_core_1.time)("monday_close"),
    tuesdayOpen: (0, pg_core_1.time)("tuesday_open"),
    tuesdayClose: (0, pg_core_1.time)("tuesday_close"),
    wednesdayOpen: (0, pg_core_1.time)("wednesday_open"),
    wednesdayClose: (0, pg_core_1.time)("wednesday_close"),
    thursdayOpen: (0, pg_core_1.time)("thursday_open"),
    thursdayClose: (0, pg_core_1.time)("thursday_close"),
    fridayOpen: (0, pg_core_1.time)("friday_open"),
    fridayClose: (0, pg_core_1.time)("friday_close"),
    saturdayOpen: (0, pg_core_1.time)("saturday_open"),
    saturdayClose: (0, pg_core_1.time)("saturday_close"),
    sundayOpen: (0, pg_core_1.time)("sunday_open"),
    sundayClose: (0, pg_core_1.time)("sunday_close"),
    // Appointment settings
    defaultAppointmentDuration: (0, pg_core_1.integer)("default_appointment_duration").default(60),
    bookingAdvanceLimit: (0, pg_core_1.integer)("booking_advance_limit").default(30), // days
    bufferTimeBetweenAppointments: (0, pg_core_1.integer)("buffer_time").default(15), // minutes
    allowOnlineBooking: (0, pg_core_1.boolean)("allow_online_booking").default(true),
    requireDeposit: (0, pg_core_1.boolean)("require_deposit").default(false),
    defaultDepositAmount: (0, pg_core_1.numeric)("default_deposit_amount", { precision: 10, scale: 2 }).default("20.00"),
    // Notification preferences
    sendSmsReminders: (0, pg_core_1.boolean)("send_sms_reminders").default(true),
    sendEmailReminders: (0, pg_core_1.boolean)("send_email_reminders").default(true),
    reminderHoursBefore: (0, pg_core_1.integer)("reminder_hours_before").default(24),
    // Booking page customization
    brandColor: (0, pg_core_1.text)("brand_color").default("#8B5CF6"),
    logoUrl: (0, pg_core_1.text)("logo_url"),
    welcomeMessage: (0, pg_core_1.text)("welcome_message").default("Bienvenue ! Prenez rendez-vous en quelques clics."),
    description: (0, pg_core_1.text)("description"),
    showPrices: (0, pg_core_1.boolean)("show_prices").default(true),
    showDuration: (0, pg_core_1.boolean)("show_duration").default(true),
    enableInstantBooking: (0, pg_core_1.boolean)("enable_instant_booking").default(true),
    // Salon policies for booking confirmation
    cancellationPolicy: (0, pg_core_1.text)("cancellation_policy").default("Annulation gratuite jusqu'à 24h avant le rendez-vous"),
    latenessPolicy: (0, pg_core_1.text)("lateness_policy").default("Retard de plus de 15min = annulation automatique"),
    depositPolicy: (0, pg_core_1.text)("deposit_policy").default("30% d'acompte requis pour valider la réservation"),
    modificationPolicy: (0, pg_core_1.text)("modification_policy").default("Modification possible jusqu'à 12h avant"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Service Categories (like Treatwell's service organization)
exports.serviceCategories = (0, pg_core_1.pgTable)("service_categories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    icon: (0, pg_core_1.text)("icon"),
    color: (0, pg_core_1.text)("color").default("#8B5CF6"),
    sortOrder: (0, pg_core_1.integer)("sort_order").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Payment Methods and Transactions
exports.paymentMethods = (0, pg_core_1.pgTable)("payment_methods", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    type: (0, pg_core_1.text)("type").notNull(), // stripe, cash, bank_transfer, paypal
    name: (0, pg_core_1.text)("name").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    settings: (0, pg_core_1.text)("settings"), // JSON configuration
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.transactions = (0, pg_core_1.pgTable)("transactions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(function () { return exports.appointments.id; }),
    clientId: (0, pg_core_1.integer)("client_id").references(function () { return exports.clients.id; }),
    amount: (0, pg_core_1.numeric)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.text)("currency").default("EUR"),
    type: (0, pg_core_1.text)("type").notNull(), // payment, refund, deposit
    status: (0, pg_core_1.text)("status").notNull(), // pending, completed, failed, cancelled
    paymentMethod: (0, pg_core_1.text)("payment_method").notNull(),
    paymentIntentId: (0, pg_core_1.text)("payment_intent_id"), // Stripe payment intent ID
    description: (0, pg_core_1.text)("description"),
    metadata: (0, pg_core_1.text)("metadata"), // JSON for additional data
    processedAt: (0, pg_core_1.timestamp)("processed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Online Booking Public Pages
// Pages de réservation personnalisées créées par les professionnels
exports.bookingPages = (0, pg_core_1.pgTable)("booking_pages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").references(function () { return exports.users.id; }).notNull(),
    pageUrl: (0, pg_core_1.text)("page_url").unique().notNull(),
    salonName: (0, pg_core_1.text)("salon_name").notNull(),
    salonDescription: (0, pg_core_1.text)("salon_description"),
    salonAddress: (0, pg_core_1.text)("salon_address"),
    salonPhone: (0, pg_core_1.text)("salon_phone"),
    salonEmail: (0, pg_core_1.text)("salon_email"),
    selectedServices: (0, pg_core_1.integer)("selected_services").array().default([]),
    template: (0, pg_core_1.text)("template").default("moderne"),
    primaryColor: (0, pg_core_1.text)("primary_color").default("#8B5CF6"),
    secondaryColor: (0, pg_core_1.text)("secondary_color").default("#F59E0B"),
    logoUrl: (0, pg_core_1.text)("logo_url"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    showPrices: (0, pg_core_1.boolean)("show_prices").default(true),
    enableOnlineBooking: (0, pg_core_1.boolean)("enable_online_booking").default(true),
    requireDeposit: (0, pg_core_1.boolean)("require_deposit").default(true),
    depositPercentage: (0, pg_core_1.integer)("deposit_percentage").default(30),
    businessHours: (0, pg_core_1.jsonb)("business_hours"),
    isPublished: (0, pg_core_1.boolean)("is_published").default(false),
    views: (0, pg_core_1.integer)("views").default(0),
    bookings: (0, pg_core_1.integer)("bookings").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow()
});
// Client Communication History
exports.clientCommunications = (0, pg_core_1.pgTable)("client_communications", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(function () { return exports.appointments.id; }),
    type: (0, pg_core_1.text)("type").notNull(), // sms, email, phone_call, in_person
    subject: (0, pg_core_1.text)("subject"),
    content: (0, pg_core_1.text)("content").notNull(),
    status: (0, pg_core_1.text)("status").default("sent"), // sent, delivered, failed, read
    sentAt: (0, pg_core_1.timestamp)("sent_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Staff Availability and Time Off
exports.staffAvailability = (0, pg_core_1.pgTable)("staff_availability", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    staffId: (0, pg_core_1.integer)("staff_id").notNull().references(function () { return exports.staffMembers.id; }),
    dayOfWeek: (0, pg_core_1.integer)("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
    startTime: (0, pg_core_1.time)("start_time").notNull(),
    endTime: (0, pg_core_1.time)("end_time").notNull(),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.staffTimeOff = (0, pg_core_1.pgTable)("staff_time_off", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    staffId: (0, pg_core_1.integer)("staff_id").notNull().references(function () { return exports.staffMembers.id; }),
    startDate: (0, pg_core_1.date)("start_date").notNull(),
    endDate: (0, pg_core_1.date)("end_date").notNull(),
    reason: (0, pg_core_1.text)("reason"),
    type: (0, pg_core_1.text)("type").default("vacation"), // vacation, sick, personal, training
    isApproved: (0, pg_core_1.boolean)("is_approved").default(false),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Inventory Management (for beauty products)
exports.inventory = (0, pg_core_1.pgTable)("inventory", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category"), // hair_care, skin_care, tools, etc.
    brand: (0, pg_core_1.text)("brand"),
    sku: (0, pg_core_1.text)("sku"),
    barcode: (0, pg_core_1.text)("barcode"),
    currentStock: (0, pg_core_1.integer)("current_stock").default(0),
    minStock: (0, pg_core_1.integer)("min_stock").default(0),
    maxStock: (0, pg_core_1.integer)("max_stock"),
    unitCost: (0, pg_core_1.numeric)("unit_cost", { precision: 10, scale: 2 }),
    sellingPrice: (0, pg_core_1.numeric)("selling_price", { precision: 10, scale: 2 }),
    supplier: (0, pg_core_1.text)("supplier"),
    expiryDate: (0, pg_core_1.date)("expiry_date"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Marketing Campaigns
exports.marketingCampaigns = (0, pg_core_1.pgTable)("marketing_campaigns", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return exports.users.id; }),
    name: (0, pg_core_1.text)("name").notNull(),
    type: (0, pg_core_1.text)("type").notNull(), // email, sms, social_media
    subject: (0, pg_core_1.text)("subject"),
    content: (0, pg_core_1.text)("content").notNull(),
    targetAudience: (0, pg_core_1.text)("target_audience"), // all_clients, new_clients, loyal_clients, etc.
    scheduledFor: (0, pg_core_1.timestamp)("scheduled_for"),
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    status: (0, pg_core_1.text)("status").default("draft"), // draft, scheduled, sent, failed
    recipientCount: (0, pg_core_1.integer)("recipient_count").default(0),
    openRate: (0, pg_core_1.numeric)("open_rate", { precision: 5, scale: 2 }),
    clickRate: (0, pg_core_1.numeric)("click_rate", { precision: 5, scale: 2 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Client Preferences and Notes
exports.clientPreferences = (0, pg_core_1.pgTable)("client_preferences", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    clientId: (0, pg_core_1.integer)("client_id").notNull().references(function () { return exports.clients.id; }),
    preferredStaffId: (0, pg_core_1.integer)("preferred_staff_id").references(function () { return exports.staffMembers.id; }),
    preferredTimeSlots: (0, pg_core_1.jsonb)("preferred_time_slots"), // ["09:00-12:00", "14:00-17:00"]
    preferredDays: (0, pg_core_1.jsonb)("preferred_days"), // ["monday", "tuesday"]
    allergies: (0, pg_core_1.text)("allergies"),
    skinType: (0, pg_core_1.text)("skin_type"),
    hairType: (0, pg_core_1.text)("hair_type"),
    previousTreatments: (0, pg_core_1.text)("previous_treatments"),
    avoidIngredients: (0, pg_core_1.text)("avoid_ingredients"),
    communicationPreference: (0, pg_core_1.text)("communication_preference").default("email"), // email, sms, phone
    marketingOptIn: (0, pg_core_1.boolean)("marketing_opt_in").default(true),
    reminderOptIn: (0, pg_core_1.boolean)("reminder_opt_in").default(true),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_2.relations)(exports.users, function (_a) {
    var many = _a.many, one = _a.one;
    return ({
        services: many(exports.services),
        clients: many(exports.clients),
        appointments: many(exports.appointments),
        staff: many(exports.staffMembers),
        forumPosts: many(exports.forumPosts),
        forumReplies: many(exports.forumReplies),
        forumLikes: many(exports.forumLikes),
        reviews: many(exports.reviews),
        loyaltyPrograms: many(exports.loyaltyProgram),
        promotions: many(exports.promotions),
        notifications: many(exports.notifications),
        businessSettings: one(exports.businessSettings),
        serviceCategories: many(exports.serviceCategories),
        paymentMethods: many(exports.paymentMethods),
        transactions: many(exports.transactions),
        bookingPages: many(exports.bookingPages),
        inventory: many(exports.inventory),
        marketingCampaigns: many(exports.marketingCampaigns),
    });
});
exports.servicesRelations = (0, drizzle_orm_2.relations)(exports.services, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(exports.users, {
            fields: [exports.services.userId],
            references: [exports.users.id],
        }),
        appointments: many(exports.appointments),
    });
});
exports.staffMembersRelations = (0, drizzle_orm_2.relations)(exports.staffMembers, function (_a) {
    var many = _a.many;
    return ({
        appointments: many(exports.appointments),
    });
});
exports.clientsRelations = (0, drizzle_orm_2.relations)(exports.clients, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(exports.users, {
            fields: [exports.clients.userId],
            references: [exports.users.id],
        }),
        appointments: many(exports.appointments),
    });
});
exports.appointmentsRelations = (0, drizzle_orm_2.relations)(exports.appointments, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.users, {
            fields: [exports.appointments.userId],
            references: [exports.users.id],
        }),
        client: one(exports.clients, {
            fields: [exports.appointments.clientId],
            references: [exports.clients.id],
        }),
        service: one(exports.services, {
            fields: [exports.appointments.serviceId],
            references: [exports.services.id],
        }),
        staff: one(exports.staffMembers, {
            fields: [exports.appointments.staffId],
            references: [exports.staffMembers.id],
        }),
    });
});
exports.forumPostsRelations = (0, drizzle_orm_2.relations)(exports.forumPosts, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(exports.users, {
            fields: [exports.forumPosts.userId],
            references: [exports.users.id],
        }),
        category: one(exports.forumCategories, {
            fields: [exports.forumPosts.categoryId],
            references: [exports.forumCategories.id],
        }),
        replies: many(exports.forumReplies),
        likes: many(exports.forumLikes),
    });
});
exports.forumRepliesRelations = (0, drizzle_orm_2.relations)(exports.forumReplies, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(exports.users, {
            fields: [exports.forumReplies.userId],
            references: [exports.users.id],
        }),
        post: one(exports.forumPosts, {
            fields: [exports.forumReplies.postId],
            references: [exports.forumPosts.id],
        }),
        likes: many(exports.forumLikes),
    });
});
// Salons - Pages publiques des professionnels
exports.salons = (0, pg_core_1.pgTable)("salons", {
    id: (0, pg_core_1.varchar)("id").primaryKey(), // salon-xxxxx format  
    slug: (0, pg_core_1.varchar)("slug").unique().notNull(), // URL-friendly identifier standardisé
    userId: (0, pg_core_1.varchar)("user_id").references(function () { return exports.users.id; }), // Référence au propriétaire
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    address: (0, pg_core_1.text)("address"),
    phone: (0, pg_core_1.varchar)("phone"),
    email: (0, pg_core_1.varchar)("email"),
    customColors: (0, pg_core_1.text)("custom_colors"), // JSON des couleurs personnalisées
    serviceCategories: (0, pg_core_1.text)("service_categories"), // JSON des catégories de services
    photos: (0, pg_core_1.text)("photos"), // JSON array des URLs photos
    isPublished: (0, pg_core_1.boolean)("is_published").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Client account types for authentication - removed duplicate
// Photos table for image management
exports.photos = (0, pg_core_1.pgTable)("photos", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull(),
    url: (0, pg_core_1.text)("url").notNull(),
    caption: (0, pg_core_1.text)("caption"),
    uploadedAt: (0, pg_core_1.timestamp)("uploaded_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Supprimé pour éviter duplication - utilisation de la définition précédente
// Tags personnalisés pour les professionnels  
exports.customTags = (0, pg_core_1.pgTable)("custom_tags", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    professionalId: (0, pg_core_1.varchar)("professional_id").notNull(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    color: (0, pg_core_1.varchar)("color").default("#6366f1"),
    category: (0, pg_core_1.varchar)("category").default("general"), // general, allergie, preference, comportement
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Schema d'insertion pour les photos de salon
exports.insertSalonPhotoSchema = (0, drizzle_zod_1.createInsertSchema)(exports.salonPhotos).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Table pour les informations de salon lors de l'inscription
exports.salonRegistrations = (0, pg_core_1.pgTable)("salon_registrations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").references(function () { return exports.users.id; }),
    salonName: (0, pg_core_1.varchar)("salon_name").notNull(),
    salonDescription: (0, pg_core_1.text)("salon_description"),
    ownerName: (0, pg_core_1.varchar)("owner_name").notNull(),
    phone: (0, pg_core_1.varchar)("phone").notNull(),
    email: (0, pg_core_1.varchar)("email").notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.varchar)("city").notNull(),
    postalCode: (0, pg_core_1.varchar)("postal_code").notNull(),
    activityType: (0, pg_core_1.varchar)("activity_type").notNull(),
    instagram: (0, pg_core_1.varchar)("instagram"),
    selectedPlan: (0, pg_core_1.varchar)("selected_plan").notNull(),
    stripePaymentUrl: (0, pg_core_1.text)("stripe_payment_url"), // URL de paiement Stripe
    paymentStatus: (0, pg_core_1.varchar)("payment_status").default("pending"), // pending, completed, failed
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z.string().min(6, "Mot de passe trop court")
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z.string().min(6, "Mot de passe trop court"),
    businessName: zod_1.z.string().min(2, "Nom du salon requis"),
    siret: zod_1.z.string().min(14, "Numéro SIRET requis (14 chiffres)").max(14, "Numéro SIRET invalide"),
    firstName: zod_1.z.string().min(2, "Prénom requis"),
    lastName: zod_1.z.string().min(2, "Nom requis"),
    phone: zod_1.z.string().min(10, "Numéro de téléphone requis"),
    address: zod_1.z.string().min(5, "Adresse complète requise"),
    city: zod_1.z.string().min(2, "Ville requise")
});
exports.clientRegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z.string().min(6, "Mot de passe trop court"),
    firstName: zod_1.z.string().min(2, "Prénom requis"),
    lastName: zod_1.z.string().min(2, "Nom requis"),
    phone: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().optional()
});
// Types déjà définis plus haut dans le fichier
// Schemas for validation
exports.insertServiceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.services).omit({
    id: true,
    createdAt: true,
}).extend({
    price: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).transform(function (val) { return String(val); }),
    duration: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).transform(function (val) { return Number(val); }),
});
exports.insertClientSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clients).omit({
    id: true,
    totalSpent: true,
    visitCount: true,
    lastVisit: true,
    createdAt: true,
});
exports.insertStaffMemberSchema = (0, drizzle_zod_1.createInsertSchema)(exports.staffMembers).omit({
    id: true,
    createdAt: true,
});
exports.insertAppointmentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.appointments).omit({
    id: true,
    createdAt: true,
});
exports.insertForumPostSchema = (0, drizzle_zod_1.createInsertSchema)(exports.forumPosts).omit({
    id: true,
    viewCount: true,
    likeCount: true,
    replyCount: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertForumReplySchema = (0, drizzle_zod_1.createInsertSchema)(exports.forumReplies).omit({
    id: true,
    likeCount: true,
    createdAt: true,
});
exports.insertReviewSchema = (0, drizzle_zod_1.createInsertSchema)(exports.reviews).omit({
    id: true,
    helpfulCount: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertPromotionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.promotions).omit({
    id: true,
    usageCount: true,
    createdAt: true,
});
// New validation schemas
exports.insertBusinessSettingsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.businessSettings).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertServiceCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.serviceCategories).omit({
    id: true,
    createdAt: true,
});
exports.insertPaymentMethodSchema = (0, drizzle_zod_1.createInsertSchema)(exports.paymentMethods).omit({
    id: true,
    createdAt: true,
});
exports.insertTransactionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.transactions).omit({
    id: true,
    createdAt: true,
});
exports.insertBookingPageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bookingPages).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertClientCommunicationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clientCommunications).omit({
    id: true,
    sentAt: true,
    createdAt: true,
});
exports.insertStaffAvailabilitySchema = (0, drizzle_zod_1.createInsertSchema)(exports.staffAvailability).omit({
    id: true,
    createdAt: true,
});
exports.insertStaffTimeOffSchema = (0, drizzle_zod_1.createInsertSchema)(exports.staffTimeOff).omit({
    id: true,
    createdAt: true,
});
exports.insertInventorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.inventory).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMarketingCampaignSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketingCampaigns).omit({
    id: true,
    createdAt: true,
});
exports.insertClientPreferencesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clientPreferences).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertSubscriptionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.subscriptions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Tables pour la galerie photo et albums avancée
exports.salonAlbums = (0, pg_core_1.pgTable)("salon_albums", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    salonId: (0, pg_core_1.varchar)("salon_id").references(function () { return exports.salons.id; }, { onDelete: "cascade" }),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    coverImageUrl: (0, pg_core_1.varchar)("cover_image_url"),
    isPublic: (0, pg_core_1.boolean)("is_public").default(true),
    sortOrder: (0, pg_core_1.integer)("sort_order").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.salonPhotosAdvanced = (0, pg_core_1.pgTable)("salon_photos_advanced", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    salonId: (0, pg_core_1.varchar)("salon_id").references(function () { return exports.salons.id; }, { onDelete: "cascade" }),
    albumId: (0, pg_core_1.integer)("album_id").references(function () { return exports.salonAlbums.id; }, { onDelete: "set null" }),
    imageUrl: (0, pg_core_1.varchar)("image_url").notNull(),
    thumbnailUrl: (0, pg_core_1.varchar)("thumbnail_url"),
    highResUrl: (0, pg_core_1.varchar)("high_res_url"), // URL haute résolution
    title: (0, pg_core_1.varchar)("title"),
    description: (0, pg_core_1.text)("description"),
    tags: (0, pg_core_1.text)("tags").array(),
    isPublic: (0, pg_core_1.boolean)("is_public").default(true),
    sortOrder: (0, pg_core_1.integer)("sort_order").default(0),
    uploadedAt: (0, pg_core_1.timestamp)("uploaded_at").defaultNow(),
    metadata: (0, pg_core_1.jsonb)("metadata"), // EXIF, dimensions, etc.
    fileSize: (0, pg_core_1.integer)("file_size"), // Taille en bytes
    width: (0, pg_core_1.integer)("width"), // Largeur en pixels
    height: (0, pg_core_1.integer)("height"), // Hauteur en pixels
});
// Relations pour albums et photos
exports.albumRelations = (0, drizzle_orm_2.relations)(exports.salonAlbums, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        salon: one(exports.salons, {
            fields: [exports.salonAlbums.salonId],
            references: [exports.salons.id],
        }),
        photos: many(exports.salonPhotosAdvanced),
    });
});
exports.photoAdvancedRelations = (0, drizzle_orm_2.relations)(exports.salonPhotosAdvanced, function (_a) {
    var one = _a.one;
    return ({
        salon: one(exports.salons, {
            fields: [exports.salonPhotosAdvanced.salonId],
            references: [exports.salons.id],
        }),
        album: one(exports.salonAlbums, {
            fields: [exports.salonPhotosAdvanced.albumId],
            references: [exports.salonAlbums.id],
        }),
    });
});
// Schémas de validation
exports.insertSalonAlbumSchema = (0, drizzle_zod_1.createInsertSchema)(exports.salonAlbums).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertSalonPhotoAdvancedSchema = (0, drizzle_zod_1.createInsertSchema)(exports.salonPhotosAdvanced).omit({
    id: true,
    uploadedAt: true,
});
// Schémas de validation pour les abonnements
exports.insertSubscriptionPlanSchema = (0, drizzle_zod_1.createInsertSchema)(exports.subscriptionPlans).omit({
    createdAt: true,
    updatedAt: true,
});
exports.insertUserSubscriptionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userSubscriptions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// --- NEW: salon_templates ---
exports.salonTemplates = (0, pg_core_1.pgTable)("salon_templates", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    slug: (0, pg_core_1.varchar)("slug", { length: 128 }).notNull().unique(), // ex: 'default-modern'
    name: (0, pg_core_1.varchar)("name", { length: 128 }).notNull(),
    pageJson: (0, pg_core_1.jsonb)("page_json").notNull(), // JSON décrivant la page par défaut
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow()
});
// --- NEW: salon_pages ---
exports.salonPages = (0, pg_core_1.pgTable)("salon_pages", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    salonId: (0, pg_core_1.varchar)("salon_id", { length: 64 })
        .notNull()
        // @ts-ignore - Assure-toi que `salons` est dans ce fichier et exporté
        .references(function () { return exports.salons.id; }, { onDelete: "cascade" }),
    templateId: (0, pg_core_1.varchar)("template_id", { length: 64 })
        .notNull()
        .references(function () { return exports.salonTemplates.id; }, { onDelete: "restrict" }),
    pageJson: (0, pg_core_1.jsonb)("page_json").notNull(), // Copie modifiable du template
    isPublished: (0, pg_core_1.boolean)("is_published").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow()
}, function (t) { return ({
    idxSalon: (0, pg_core_1.index)("idx_salon_pages_salon").on(t.salonId)
}); });
var templateObject_1, templateObject_2, templateObject_3;
