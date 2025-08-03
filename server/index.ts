import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerFullStackRoutes } from "./fullStackRoutes";
import { createTestAccounts } from "./seedTestAccounts";
import { seedSalons } from "./seedSalons";
import { setupVite, serveStatic, log } from "./vite";
import { configureSession } from "./sessionMiddleware";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Configurer les sessions persistantes
app.use(configureSession());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Utiliser les routes Firebase-compatible
  const server = await registerFullStackRoutes(app);
  
  // Créer les comptes de test au démarrage
  await createTestAccounts();
  
  // Créer les salons de test avec photos
  await seedSalons();
  
  // ✅ CRÉATION SALON DEMO MODIFIABLE - NÉCESSAIRE POUR ÉDITEUR
  try {
    const { storage } = await import("./storage");
    
    // Créer le salon demo modifiable avec ID "salon-demo"
    const salonDemo = {
      id: "salon-demo",
      name: "Salon Démo Modifiable",
      description: "Salon d'exemple que vous pouvez personnaliser dans l'éditeur",
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
        saturday: { open: "09:00", close: "18:00", isOpen: true },
        sunday: { open: "10:00", close: "17:00", isOpen: false }
      },
      serviceCategories: [
        {
          id: "coiffure",
          name: "Coiffure",
          services: [
            { id: "coupe-shampooing", name: "Coupe + Shampooing", duration: 45, price: 45 },
            { id: "coupe-brushing", name: "Coupe + Brushing", duration: 60, price: 65 },
            { id: "coloration", name: "Coloration", duration: 120, price: 85 }
          ]
        },
        {
          id: "soins",
          name: "Soins visage",
          services: [
            { id: "nettoyage-peau", name: "Nettoyage de peau", duration: 60, price: 70 },
            { id: "soin-hydratant", name: "Soin hydratant", duration: 45, price: 55 }
          ]
        }
      ],
      coverImageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop"
      ],
      rating: 4.7,
      reviewCount: 156,
      features: ["WiFi gratuit", "Climatisation", "Parking"],
      socialMedia: {
        instagram: "@salon_demo",
        facebook: "Salon Démo",
        twitter: "@salon_demo"
      },
      isVerified: true,
      isActive: true,
      primaryColor: "#8B5CF6", // Violet par défaut
      customButtonColor: null,
      colorIntensity: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.createSalon(salonDemo);
    console.log('✅ Salon démo modifiable créé avec ID: salon-demo');
    
  } catch (error) {
    console.log('ℹ️ Salon démo existe déjà ou erreur de création:', error);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
