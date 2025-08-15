import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Global WebSocket server instance
let wss: WebSocketServer;

// Fonction pour diffuser des mises à jour via WebSocket
export function broadcastSalonUpdate(salonId: string, salonData: any) {
  if (wss) {
    const message = JSON.stringify({
      type: 'salon-updated',
      salonId: salonId,
      salonData: salonData,
      timestamp: Date.now()
    });
    
    console.log('📢 Diffusion WebSocket salon-updated:', salonId);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Route pour récupérer le salon personnel de l'utilisateur connecté
  app.get('/api/salon/my-salon', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log('🔍 Recherche salon pour utilisateur:', userId);
      
      // Récupérer le salon de l'utilisateur
      const salon = await storage.getSalonByUserId(userId);
      
      if (salon) {
        console.log('✅ Salon trouvé:', salon.name);
        res.json({ salon });
      } else {
        console.log('❌ Aucun salon trouvé pour cet utilisateur');
        res.status(404).json({ message: "Aucun salon trouvé" });
      }
    } catch (error) {
      console.error("Error fetching user salon:", error);
      res.status(500).json({ message: "Failed to fetch salon" });
    }
  });
  
  // This endpoint is used to serve public assets.
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath || '';
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // The endpoint for serving private objects that can be accessed publicly
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // This endpoint is used to get the upload URL for an object entity.
  app.post("/api/objects/upload", async (_req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Gallery API routes
  app.get("/api/salons/:salonId/albums", async (_req, res) => {
    try {
      // For demo, return sample albums
      const albums = [
        {
          id: 1,
          name: "Réalisations Coiffure",
          description: "Nos plus belles coupes et créations capillaires",
          coverImageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
          photoCount: 12,
          isPublic: true,
          sortOrder: 0
        },
        {
          id: 2,
          name: "Salon & Ambiance",
          description: "Découvrez l'atmosphère unique de notre barbershop",
          coverImageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
          photoCount: 8,
          isPublic: true,
          sortOrder: 1
        },
        {
          id: 3,
          name: "Barbe & Rasage",
          description: "L'art du rasage traditionnel et moderne",
          coverImageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
          photoCount: 15,
          isPublic: true,
          sortOrder: 2
        }
      ];
      res.json(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ error: "Failed to fetch albums" });
    }
  });

  app.get("/api/salons/:salonId/albums/:albumId/photos", async (req, res) => {
    try {
      const albumId = parseInt(req.params.albumId);
      
      // Sample photos by album
      const photosByAlbum: Record<number, any[]> = {
        1: [ // Réalisations Coiffure
          {
            id: 1,
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=2000&q=90",
            title: "Coupe Dégradée Moderne",
            description: "Une coupe tendance avec un dégradé progressif parfaitement maîtrisé",
            tags: ["coupe", "dégradé", "moderne"],
            width: 1200,
            height: 800
          },
          {
            id: 2,
            imageUrl: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=2000&q=90",
            title: "Style Classique Gentleman",
            description: "Un style intemporel pour l'homme moderne qui allie élégance et sophistication",
            tags: ["classique", "gentleman", "élégant"],
            width: 1200,
            height: 800
          }
        ],
        2: [ // Salon & Ambiance
          {
            id: 3,
            imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=2000&q=90",
            title: "Espace de Coupe Principal",
            description: "Notre espace principal avec ses fauteuils vintage et son ambiance authentique",
            tags: ["salon", "vintage", "authentique"],
            width: 1200,
            height: 800
          }
        ],
        3: [ // Barbe & Rasage
          {
            id: 4,
            imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2000&q=90",
            title: "Rasage Traditionnel au Coupe-Chou",
            description: "L'art ancestral du rasage à l'ancienne avec nos outils traditionnels",
            tags: ["rasage", "traditionnel", "coupe-chou"],
            width: 1200,
            height: 800
          }
        ]
      };

      const photos = photosByAlbum[albumId] || [];
      res.json(photos);
    } catch (error) {
      console.error("Error fetching album photos:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time synchronization
  wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });
  
  console.log('🔌 WebSocket server configuré sur /ws');
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('📱 Nouvelle connexion WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 Message WebSocket reçu:', data.type);
        
        // Retransmettre le message à tous les clients connectés
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      } catch (error) {
        console.error('❌ Erreur WebSocket:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('🔌 Connexion WebSocket fermée');
    });
  });
  
  return httpServer;
}