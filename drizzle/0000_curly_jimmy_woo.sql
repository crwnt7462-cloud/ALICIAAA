CREATE TABLE "ai_predictions" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"prediction_type" varchar(50) NOT NULL,
	"confidence" numeric(3, 2) NOT NULL,
	"factors" text,
	"action_taken" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"smart_planning_enabled" boolean DEFAULT true,
	"no_show_prediction_enabled" boolean DEFAULT true,
	"auto_rebooking_enabled" boolean DEFAULT true,
	"business_copilot_enabled" boolean DEFAULT true,
	"no_show_threshold" numeric(3, 2) DEFAULT '0.30',
	"rebooking_days_advance" integer DEFAULT 7,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "appointment_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer,
	"client_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"action_type" varchar(20) NOT NULL,
	"action_date" timestamp NOT NULL,
	"previous_date" timestamp,
	"cancel_reason" text,
	"days_before_appointment" integer,
	"time_slot" varchar(10),
	"day_of_week" integer,
	"weather_condition" varchar(20),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"client_id" integer,
	"client_account_id" varchar,
	"service_id" integer,
	"staff_id" integer,
	"client_name" varchar,
	"client_email" varchar,
	"client_phone" varchar,
	"appointment_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"total_price" numeric(10, 2),
	"deposit_paid" numeric(10, 2),
	"payment_status" varchar DEFAULT 'pending',
	"stripe_session_id" text,
	"source" varchar DEFAULT 'app_direct',
	"is_manual_block" boolean DEFAULT false,
	"created_by_pro" boolean DEFAULT false,
	"allow_overlap" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "auto_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"target_segment" varchar(100),
	"conditions" text,
	"ai_generated" boolean DEFAULT false,
	"ai_reasoning" text,
	"status" varchar(20) DEFAULT 'draft',
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"page_url" text NOT NULL,
	"salon_name" text NOT NULL,
	"salon_description" text,
	"salon_address" text,
	"salon_phone" text,
	"salon_email" text,
	"selected_services" integer[] DEFAULT '{}',
	"template" text DEFAULT 'moderne',
	"primary_color" text DEFAULT '#8B5CF6',
	"secondary_color" text DEFAULT '#F59E0B',
	"logo_url" text,
	"cover_image_url" text,
	"show_prices" boolean DEFAULT true,
	"enable_online_booking" boolean DEFAULT true,
	"require_deposit" boolean DEFAULT true,
	"deposit_percentage" integer DEFAULT 30,
	"business_hours" jsonb,
	"is_published" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"bookings" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "booking_pages_page_url_unique" UNIQUE("page_url")
);
--> statement-breakpoint
CREATE TABLE "business_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" varchar NOT NULL,
	"slug" varchar,
	"business_type" varchar NOT NULL,
	"siret" varchar NOT NULL,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"postal_code" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"owner_first_name" varchar NOT NULL,
	"owner_last_name" varchar NOT NULL,
	"legal_form" varchar NOT NULL,
	"vat_number" varchar,
	"description" text,
	"plan_type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "business_registrations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "business_registrations_siret_unique" UNIQUE("siret")
);
--> statement-breakpoint
CREATE TABLE "business_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_type" text DEFAULT 'salon',
	"time_zone" text DEFAULT 'Europe/Paris',
	"language" text DEFAULT 'fr',
	"currency" text DEFAULT 'EUR',
	"monday_open" time,
	"monday_close" time,
	"tuesday_open" time,
	"tuesday_close" time,
	"wednesday_open" time,
	"wednesday_close" time,
	"thursday_open" time,
	"thursday_close" time,
	"friday_open" time,
	"friday_close" time,
	"saturday_open" time,
	"saturday_close" time,
	"sunday_open" time,
	"sunday_close" time,
	"default_appointment_duration" integer DEFAULT 60,
	"booking_advance_limit" integer DEFAULT 30,
	"buffer_time" integer DEFAULT 15,
	"allow_online_booking" boolean DEFAULT true,
	"require_deposit" boolean DEFAULT false,
	"default_deposit_amount" numeric(10, 2) DEFAULT '20.00',
	"send_sms_reminders" boolean DEFAULT true,
	"send_email_reminders" boolean DEFAULT true,
	"reminder_hours_before" integer DEFAULT 24,
	"brand_color" text DEFAULT '#8B5CF6',
	"logo_url" text,
	"welcome_message" text DEFAULT 'Bienvenue ! Prenez rendez-vous en quelques clics.',
	"description" text,
	"show_prices" boolean DEFAULT true,
	"show_duration" boolean DEFAULT true,
	"enable_instant_booking" boolean DEFAULT true,
	"cancellation_policy" text DEFAULT 'Annulation gratuite jusqu''à 24h avant le rendez-vous',
	"lateness_policy" text DEFAULT 'Retard de plus de 15min = annulation automatique',
	"deposit_policy" text DEFAULT '30% d''acompte requis pour valider la réservation',
	"modification_policy" text DEFAULT 'Modification possible jusqu''à 12h avant',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cancellation_predictions" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"prediction_score" numeric(3, 2) NOT NULL,
	"risk_factors" text[],
	"confidence" numeric(3, 2) NOT NULL,
	"recommended_action" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "client_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"email" varchar,
	"password" varchar,
	"phone" varchar,
	"address" text,
	"city" varchar,
	"postal_code" varchar,
	"date_of_birth" date,
	"profile_image_url" varchar,
	"loyalty_points" integer DEFAULT 0,
	"client_status" varchar DEFAULT 'active',
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_behavior_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"no_show_count" integer DEFAULT 0,
	"cancel_count" integer DEFAULT 0,
	"total_appointments" integer DEFAULT 0,
	"avg_days_between_visits" numeric(8, 2),
	"preferred_time_slots" jsonb,
	"seasonal_patterns" text,
	"last_no_show" timestamp,
	"risk_score" numeric(3, 2) DEFAULT '0.00',
	"loyalty_score" numeric(3, 2) DEFAULT '0.00',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"appointment_id" integer,
	"type" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"status" text DEFAULT 'sent',
	"sent_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" varchar NOT NULL,
	"salon_id" varchar NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"author" varchar NOT NULL,
	"is_editable" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"photo_url" text NOT NULL,
	"file_name" varchar,
	"file_size" integer,
	"mime_type" varchar,
	"caption" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"preferred_staff_id" integer,
	"preferred_time_slots" jsonb,
	"preferred_days" jsonb,
	"allergies" text,
	"skin_type" text,
	"hair_type" text,
	"previous_treatments" text,
	"avoid_ingredients" text,
	"communication_preference" text DEFAULT 'email',
	"marketing_opt_in" boolean DEFAULT true,
	"reminder_opt_in" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_reliability" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" varchar NOT NULL,
	"salon_id" varchar NOT NULL,
	"consecutive_cancellations" integer DEFAULT 0,
	"last_cancellation_date" timestamp,
	"custom_deposit_percentage" integer,
	"reliability_score" integer DEFAULT 100,
	"total_appointments" integer DEFAULT 0,
	"total_cancellations" integer DEFAULT 0,
	"total_no_shows" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"client_account_id" varchar,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar,
	"notes" text,
	"preferences" text,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"visit_count" integer DEFAULT 0,
	"last_visit" timestamp,
	"rating" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_tags" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"color" varchar DEFAULT '#6366f1',
	"category" varchar DEFAULT 'general',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipient_email" varchar NOT NULL,
	"recipient_name" varchar,
	"subject" varchar NOT NULL,
	"html_content" text NOT NULL,
	"text_content" text,
	"notification_type" varchar NOT NULL,
	"appointment_id" integer,
	"status" varchar DEFAULT 'pending',
	"external_id" varchar,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"opened_at" timestamp,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"post_id" integer,
	"reply_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"is_pinned" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"like_count" integer DEFAULT 0,
	"reply_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"like_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"brand" text,
	"sku" text,
	"barcode" text,
	"current_stock" integer DEFAULT 0,
	"min_stock" integer DEFAULT 0,
	"max_stock" integer,
	"unit_cost" numeric(10, 2),
	"selling_price" numeric(10, 2),
	"supplier" text,
	"expiry_date" date,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loyalty_program" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"points" integer DEFAULT 0,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"membership_level" text DEFAULT 'bronze',
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "marketing_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"target_audience" text,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"status" text DEFAULT 'draft',
	"recipient_count" integer DEFAULT 0,
	"open_rate" numeric(5, 2),
	"click_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"client_account_id" varchar,
	"sms_enabled" boolean DEFAULT true,
	"email_enabled" boolean DEFAULT true,
	"appointment_reminders" boolean DEFAULT true,
	"reminder_time_before" integer DEFAULT 24,
	"marketing_messages" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"settings" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"uploaded_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"salon_id" varchar NOT NULL,
	"service_id" integer,
	"day_of_week" varchar,
	"time_slot" varchar,
	"price_multiplier" numeric(3, 2) DEFAULT '1.0',
	"fixed_surcharge" numeric(10, 2) DEFAULT '0',
	"is_weekend_premium" boolean DEFAULT false,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "professional_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"salon_name" varchar,
	"salon_description" text,
	"salon_colors" jsonb,
	"working_hours" jsonb,
	"booking_settings" jsonb,
	"notification_settings" jsonb,
	"payment_settings" jsonb,
	"salon_photos" jsonb,
	"social_links" jsonb,
	"business_info" jsonb,
	"custom_fields" jsonb,
	"last_modified" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" serial PRIMARY KEY NOT NULL,
	"salon_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"role" varchar,
	"email" varchar,
	"phone" varchar,
	"specialties" jsonb,
	"color" varchar,
	"is_active" boolean DEFAULT true,
	"work_schedule" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"description" text,
	"discount_type" varchar NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0,
	"applicable_services" jsonb,
	"weekend_premium" boolean DEFAULT false,
	"salon_id" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"code" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"device_type" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"last_used" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"appointment_id" integer,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"is_public" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"helpful_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salon_albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"salon_id" varchar,
	"name" varchar NOT NULL,
	"description" text,
	"cover_image_url" varchar,
	"is_public" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salon_pages" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"salon_id" varchar(64) NOT NULL,
	"template_id" varchar(64) NOT NULL,
	"page_json" jsonb NOT NULL,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salon_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"photo_url" text NOT NULL,
	"photo_type" varchar DEFAULT 'gallery',
	"caption" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salon_photos_advanced" (
	"id" serial PRIMARY KEY NOT NULL,
	"salon_id" varchar,
	"album_id" integer,
	"image_url" varchar NOT NULL,
	"thumbnail_url" varchar,
	"high_res_url" varchar,
	"title" varchar,
	"description" text,
	"tags" text[],
	"is_public" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"uploaded_at" timestamp DEFAULT now(),
	"metadata" jsonb,
	"file_size" integer,
	"width" integer,
	"height" integer
);
--> statement-breakpoint
CREATE TABLE "salon_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"salon_name" varchar NOT NULL,
	"salon_description" text,
	"owner_name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"postal_code" varchar NOT NULL,
	"activity_type" varchar NOT NULL,
	"instagram" varchar,
	"selected_plan" varchar NOT NULL,
	"stripe_payment_url" text,
	"payment_status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salon_templates" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"slug" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"page_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "salon_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "salons" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"user_id" varchar,
	"name" varchar NOT NULL,
	"description" text,
	"address" text,
	"phone" varchar,
	"email" varchar,
	"custom_colors" text,
	"service_categories" text,
	"photos" text,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "salons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text DEFAULT '#8B5CF6',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"photo_url" text NOT NULL,
	"caption" text,
	"display_order" integer DEFAULT 0,
	"is_main" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"category_id" integer,
	"name" varchar NOT NULL,
	"description" text,
	"duration" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_online_bookable" boolean DEFAULT true,
	"requires_deposit" boolean DEFAULT false,
	"deposit_amount" numeric(10, 2),
	"deposit_percentage" integer DEFAULT 30,
	"max_advance_booking" integer DEFAULT 30,
	"color" text DEFAULT '#8B5CF6',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smart_planning_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"date" date NOT NULL,
	"original_slots" integer NOT NULL,
	"optimized_slots" integer NOT NULL,
	"gaps_reduced" integer NOT NULL,
	"revenue_impact" numeric(10, 2),
	"optimization_algorithm" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sms_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipient_phone" varchar NOT NULL,
	"recipient_name" varchar,
	"message" text NOT NULL,
	"notification_type" varchar NOT NULL,
	"appointment_id" integer,
	"status" varchar DEFAULT 'pending',
	"external_id" varchar,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar,
	"phone" varchar,
	"specialties" text,
	"service_ids" text[],
	"is_active" boolean DEFAULT true,
	"avatar" varchar,
	"bio" text,
	"working_hours" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"salon_id" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar,
	"phone" varchar,
	"specialties" jsonb,
	"work_schedule" jsonb,
	"color" varchar DEFAULT '#8B5CF6',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff_time_off" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reason" text,
	"type" text DEFAULT 'vacation',
	"is_approved" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar DEFAULT 'EUR',
	"billing_cycle" varchar DEFAULT 'monthly',
	"features" jsonb NOT NULL,
	"is_popular" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"price_monthly" numeric(10, 2) NOT NULL,
	"company_name" varchar NOT NULL,
	"siret" varchar NOT NULL,
	"business_address" text NOT NULL,
	"business_phone" varchar,
	"business_email" varchar,
	"legal_form" varchar,
	"vat_number" varchar,
	"billing_address" text,
	"billing_name" varchar,
	"start_date" timestamp,
	"end_date" timestamp,
	"next_billing_date" timestamp,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"last_payment_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"appointment_id" integer,
	"client_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR',
	"type" text NOT NULL,
	"status" text NOT NULL,
	"payment_method" text NOT NULL,
	"payment_intent_id" text,
	"description" text,
	"metadata" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_id" varchar NOT NULL,
	"status" varchar DEFAULT 'active',
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"trial_end_date" timestamp,
	"cancelled_at" timestamp,
	"stripe_subscription_id" varchar,
	"stripe_customer_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"business_name" varchar,
	"siret" varchar,
	"phone" varchar,
	"address" text,
	"city" varchar,
	"is_professional" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"subscription_plan" varchar DEFAULT 'basic-pro',
	"subscription_status" varchar DEFAULT 'inactive',
	"trial_end_date" timestamp,
	"mention_handle" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mention_handle_unique" UNIQUE("mention_handle")
);
--> statement-breakpoint
CREATE TABLE "waiting_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"client_id" integer,
	"service_id" integer,
	"preferred_date" date,
	"is_flexible" boolean DEFAULT false,
	"notified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_predictions" ADD CONSTRAINT "ai_predictions_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_settings" ADD CONSTRAINT "ai_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_history" ADD CONSTRAINT "appointment_history_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_history" ADD CONSTRAINT "appointment_history_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_history" ADD CONSTRAINT "appointment_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_account_id_client_accounts_id_fk" FOREIGN KEY ("client_account_id") REFERENCES "public"."client_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auto_promotions" ADD CONSTRAINT "auto_promotions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_pages" ADD CONSTRAINT "booking_pages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_settings" ADD CONSTRAINT "business_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cancellation_predictions" ADD CONSTRAINT "cancellation_predictions_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cancellation_predictions" ADD CONSTRAINT "cancellation_predictions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_behavior_data" ADD CONSTRAINT "client_behavior_data_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_photos" ADD CONSTRAINT "client_photos_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_photos" ADD CONSTRAINT "client_photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_preferences" ADD CONSTRAINT "client_preferences_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_preferences" ADD CONSTRAINT "client_preferences_preferred_staff_id_staff_members_id_fk" FOREIGN KEY ("preferred_staff_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_client_account_id_client_accounts_id_fk" FOREIGN KEY ("client_account_id") REFERENCES "public"."client_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_post_id_forum_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."forum_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_reply_id_forum_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."forum_replies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_category_id_forum_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_post_id_forum_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."forum_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_program" ADD CONSTRAINT "loyalty_program_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_program" ADD CONSTRAINT "loyalty_program_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_client_account_id_client_accounts_id_fk" FOREIGN KEY ("client_account_id") REFERENCES "public"."client_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_settings" ADD CONSTRAINT "professional_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_albums" ADD CONSTRAINT "salon_albums_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_pages" ADD CONSTRAINT "salon_pages_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_pages" ADD CONSTRAINT "salon_pages_template_id_salon_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."salon_templates"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_photos" ADD CONSTRAINT "salon_photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_photos_advanced" ADD CONSTRAINT "salon_photos_advanced_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_photos_advanced" ADD CONSTRAINT "salon_photos_advanced_album_id_salon_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."salon_albums"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_registrations" ADD CONSTRAINT "salon_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salons" ADD CONSTRAINT "salons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smart_planning_logs" ADD CONSTRAINT "smart_planning_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_notifications" ADD CONSTRAINT "sms_notifications_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_availability" ADD CONSTRAINT "staff_availability_staff_id_staff_members_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_time_off" ADD CONSTRAINT "staff_time_off_staff_id_staff_members_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiting_list" ADD CONSTRAINT "waiting_list_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiting_list" ADD CONSTRAINT "waiting_list_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiting_list" ADD CONSTRAINT "waiting_list_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_salon_pages_salon" ON "salon_pages" USING btree ("salon_id");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");