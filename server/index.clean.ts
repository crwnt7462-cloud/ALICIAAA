import express from "express";
import { registerFullStackRoutes } from "./fullStackRoutes";
import { createTestAccounts } from "./seedTestAccounts";
import { seedSalons } from "./seedSalons";
import { setupVite, serveStatic, log } from "./vite";
import { configureSession } from "./sessionMiddleware";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Session configuration
app.use(configureSession());

// Professional request logging for production
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api") && duration > 1000) {
      // Only log slow API requests in production
      log(`${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
    }
  });
  
  next();
});

(async () => {
  // Register application routes
  await registerFullStackRoutes(app);
  
  // Initialize demo data (production ready)
  await createTestAccounts();
  await seedSalons();
  
  // Create demo salon for editor
  try {
    const { storage } = await import("./storage");
    
    const salonDemo = {
      id: "salon-demo",
      name: "Salon Démo",
      description: "Salon d'exemple personnalisable",
      address: "123 Rue de la Beauté, 75001 Paris",
      city: "Paris",
      postalCode: "75001",
      phone: "01 42 34 56 78",
      email: "contact@salon-demo.fr",
      website: "https://salon-demo.fr",
      businessHours: {
        monday: { open: "09:00", close: "19:00", isOpen: true },
        tuesday: { open: "09:00", close: "19:00", isOpen: true },
        wednesday: { open: "09:00", close: "19:00", isOpen: true },
        thursday: { open: "09:00", close: "19:00", isOpen: true },
        friday: { open: "09:00", close: "19:00", isOpen: true },
        saturday: { open: "10:00", close: "18:00", isOpen: true },
        sunday: { open: "10:00", close: "16:00", isOpen: false }
      },
      photos: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop"
      ],
      services: [
        {
          id: "coupe-femme",
          name: "Coupe Femme",
          description: "Coupe et brushing",
          price: 65,
          duration: 60,
          category: "Coiffure"
        },
        {
          id: "coloration",
          name: "Coloration",
          description: "Coloration complète",
          price: 85,
          duration: 120,
          category: "Coloration"
        }
      ],
      professionals: [
        {
          id: "demo-pro-1",
          name: "Sarah Martin",
          specialty: "Coiffure & Coloration",
          photo: "https://images.unsplash.com/photo-1594824947938-bf7d66c0bd5d?w=400&h=400&fit=crop"
        }
      ],
      customColors: {
        primary: "#7c3aed",
        accent: "#a855f7",
        buttonText: "#ffffff",
        priceColor: "#7c3aed"
      },
      shareableUrl: "/salon/salon-demo",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (storage.salons) {
      storage.salons.set("salon-demo", salonDemo);
    }
  } catch (error) {
    console.error("Error creating demo salon:", error);
  }

  // Setup Vite in development
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }
})();