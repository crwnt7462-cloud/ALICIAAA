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
  
  // 🔧 FORCER LA CRÉATION DU SALON DEMO pour corriger la synchronisation
  const { storage } = await import('./storage');
  const demoSalon = {
    id: 'salon-demo',
    name: 'Agashou',
    description: 'Salon de beauté moderne et professionnel',
    longDescription: 'Notre salon vous accueille dans un cadre chaleureux pour tous vos soins de beauté.',
    address: '15 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 25 76 89',
    email: 'contact@salon.fr',
    website: '',
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format'
    ],
    serviceCategories: [
      {
        id: 1,
        name: 'Coiffure',
        expanded: false,
        services: [
          { id: 1, name: 'Cheveux', price: 45, duration: '1h' },
          { id: 2, name: 'Barbe', price: 30, duration: '45min' },
          { id: 3, name: 'Rasage', price: 25, duration: '30min' }
        ]
      }
    ],
    professionals: [],
    rating: 4.9,
    reviewCount: 324,  
    verified: true,
    certifications: ['Bio-certifié', 'Expert L\'Oréal', 'Formation Kérastase', 'Technique Aveda'],
    awards: [],
    customColors: {
      primary: '#06b6d4',
      accent: '#06b6d4',
      buttonText: '#ffffff', 
      priceColor: '#ec4899',
      neonFrame: '#ef4444'
    }
  };
  
  if (storage.salons) {
    storage.salons.set('salon-demo', demoSalon);
    console.log('🚨 SALON DEMO FORCÉ AU DÉMARRAGE:', demoSalon.name);
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
