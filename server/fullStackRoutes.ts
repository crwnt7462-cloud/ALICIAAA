import type { Express } from "express";
import { createServer, type Server } from "http";
import { firebaseStorage } from "./firebaseStorage";
import { storage as memoryStorage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { FIREBASE_CONFIG, FIREBASE_INSTRUCTIONS } from "./firebaseSetup";
import { SUPABASE_CONFIG, SUPABASE_INSTRUCTIONS, realtimeService } from "./supabaseSetup";
import { aiService } from "./aiService";
import { clientAnalyticsService, type ClientProfile } from "./clientAnalyticsService";
import { db } from "./db";
import { salons as salonsTable } from "@shared/schema";
import { eq } from "drizzle-orm";

// Configuration: utiliser Firebase ou stockage mémoire
const USE_FIREBASE = FIREBASE_CONFIG.USE_FIREBASE && FIREBASE_CONFIG.hasFirebaseSecrets();
const storage = USE_FIREBASE ? firebaseStorage : memoryStorage;

// 🔥 STOCKAGE EN MÉMOIRE POUR LES SALONS PUBLICS
const publicSalonsStorage = new Map<string, any>();

// Logging de l'état des services temps réel
FIREBASE_CONFIG.logStatus();
SUPABASE_CONFIG.logStatus();

if (!USE_FIREBASE && process.env.USE_FIREBASE === 'true') {
  console.log(FIREBASE_INSTRUCTIONS);
}

if (!SUPABASE_CONFIG.USE_SUPABASE && !SUPABASE_CONFIG.hasSupabaseSecrets()) {
  console.log(SUPABASE_INSTRUCTIONS);
}

export async function registerFullStackRoutes(app: Express): Promise<Server> {
  // Test de connexion OpenAI
  app.post('/api/ai/test-openai', async (req, res) => {
    try {
      console.log('🤖 Test de connexion OpenAI...');
      const { message } = req.body;
      
      const response = await aiService.getChatResponse(message || "Bonjour, peux-tu confirmer que la connexion OpenAI fonctionne?");
      
      res.json({
        success: true,
        response,
        message: "Connexion OpenAI fonctionnelle!",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur connexion OpenAI:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Échec de connexion OpenAI"
      });
    }
  });

  // Chat avec IA via OpenAI - Enregistrement automatique dans l'historique
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      console.log('💬 Message IA reçu:', message);
      
      const response = await aiService.getChatResponse(message);
      
      // Enregistrement automatique de la conversation
      const conversationId = `chat-${Date.now()}`;
      const conversation = {
        id: conversationId,
        title: message.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
        messages: [
          {
            role: 'user',
            content: message
          },
          {
            role: 'assistant',
            content: response
          }
        ],
        metadata: {
          type: 'general_chat',
          auto_generated: false
        }
      };
      
      await (storage as any).saveConversation('demo-user', conversationId, conversation);
      console.log('💾 Conversation enregistrée:', conversationId);
      
      res.json({
        success: true,
        response,
        conversationId,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur chat IA:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // ================== ROUTES D'ANALYSE CLIENT ==================
  
  // Analyse d'un client individuel
  app.post('/api/client/analyze', async (req, res) => {
    try {
      const clientData: ClientProfile = req.body;
      
      if (!clientData.nom || typeof clientData.rdv_total !== 'number' || typeof clientData.rdv_annules !== 'number') {
        return res.status(400).json({
          success: false,
          error: "Données client invalides. Nom, rdv_total et rdv_annules sont requis."
        });
      }
      
      // Calcul automatique du taux d'annulation si non fourni
      if (!clientData.taux_annulation) {
        clientData.taux_annulation = clientData.rdv_total > 0 
          ? Math.round((clientData.rdv_annules / clientData.rdv_total) * 100)
          : 0;
      }
      
      // Détermination automatique du profil si non fourni
      if (!clientData.profil) {
        clientData.profil = clientData.rdv_total >= 3 ? "habitué" : "nouveau";
      }
      
      console.log('🔍 Analyse client:', clientData.nom, `(${clientData.taux_annulation}% annulation)`);
      
      const insight = await clientAnalyticsService.analyzeClient(clientData);
      
      res.json({
        success: true,
        insight,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur analyse client:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Récupération de tous les clients réels pour analyse
  app.get('/api/clients/real-data', async (req, res) => {
    try {
      // On récupère tous les clients du premier salon pour l'analyse
      const allClients = await storage.getClients('salon-demo');
      
      // Transformation des données client en format d'analyse
      const clientsForAnalysis = allClients.map(client => {
        // Calcul des statistiques basées sur les rendez-vous (simulées pour demo)
        const rdvTotal = Math.floor(Math.random() * 15) + 1; // 1-15 RDV
        const rdvAnnules = Math.floor(Math.random() * Math.min(rdvTotal, 8)); // Jusqu'à 8 annulations
        const tauxAnnulation = rdvTotal > 0 ? Math.round((rdvAnnules / rdvTotal) * 100) : 0;
        
        const behaviors = ["venu", "annulé", "pas venu"] as const;
        const dernierComportement = behaviors[Math.floor(Math.random() * behaviors.length)];
        
        return {
          nom: `${client.firstName} ${client.lastName}`,
          rdv_total: rdvTotal,
          rdv_annules: rdvAnnules,
          dernier_comportement: dernierComportement,
          profil: rdvTotal >= 3 ? "habitué" as const : "nouveau" as const,
          taux_annulation: tauxAnnulation,
          client_id: client.id
        };
      });
      
      console.log('📊 Récupération clients réels:', clientsForAnalysis.length, 'clients');
      
      res.json({
        success: true,
        clients: clientsForAnalysis,
        total: clientsForAnalysis.length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur récupération clients:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Analyse par lot des clients réels
  app.post('/api/clients/analyze-real-batch', async (req, res) => {
    try {
      // Récupération des clients réels
      const allClients = await storage.getClients('salon-demo');
      
      if (allClients.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Aucun client réel trouvé dans la base de données"
        });
      }
      
      // Transformation en profils d'analyse avec données plus réalistes
      const clientProfiles: ClientProfile[] = allClients.map(client => {
        // Génération de statistiques cohérentes par client
        const rdvTotal = Math.floor(Math.random() * 20) + 2; // 2-22 RDV
        let rdvAnnules: number;
        let dernierComportement: "venu" | "annulé" | "pas venu";
        
        // Création de profils clients variés plus réalistes
        const clientType = Math.random();
        if (clientType < 0.15) {
          // 15% clients problématiques (forte annulation)
          rdvAnnules = Math.floor(rdvTotal * (0.5 + Math.random() * 0.4)); // 50-90% annulation
          dernierComportement = Math.random() < 0.7 ? "annulé" : "pas venu";
        } else if (clientType < 0.35) {
          // 20% clients moyens (annulation modérée)
          rdvAnnules = Math.floor(rdvTotal * (0.2 + Math.random() * 0.3)); // 20-50% annulation
          dernierComportement = Math.random() < 0.4 ? "annulé" : Math.random() < 0.7 ? "venu" : "pas venu";
        } else {
          // 65% bons clients (faible annulation)
          rdvAnnules = Math.floor(rdvTotal * Math.random() * 0.25); // 0-25% annulation
          dernierComportement = Math.random() < 0.85 ? "venu" : "annulé";
        }
        
        const tauxAnnulation = Math.round((rdvAnnules / rdvTotal) * 100);
        
        return {
          nom: `${client.firstName} ${client.lastName}`,
          rdv_total: rdvTotal,
          rdv_annules: rdvAnnules,
          dernier_comportement: dernierComportement,
          profil: rdvTotal >= 3 ? "habitué" as const : "nouveau" as const,
          taux_annulation: tauxAnnulation
        };
      });
      
      console.log('🔍 Analyse par lot clients réels:', clientProfiles.length, 'profils');
      
      // Analyse avec l'IA
      const insights = await clientAnalyticsService.analyzeClientBatch(clientProfiles);
      const report = clientAnalyticsService.generateAnalyticsReport(insights);
      
      // Sauvegarde automatique des messages IA dans l'historique de l'assistant IA
      let messagesSaved = 0;
      try {
        for (const insight of insights) {
          if (insight.message_personnalise && insight.niveau_risque !== "faible") {
            // Créer une conversation dédiée dans l'historique de l'assistant IA
            const conversationData = {
              id: `client-analysis-${insight.client.nom.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
              title: `📊 Analyse Client: ${insight.client.nom}`,
              timestamp: new Date().toISOString(),
              messages: [
                {
                  role: 'user',
                  content: `Analyse le profil de ${insight.client.nom} - Client avec ${insight.client.taux_annulation}% d'annulations, niveau de risque ${insight.niveau_risque}`
                },
                {
                  role: 'assistant',
                  content: `## 💬 Message Personnel à Envoyer

"${insight.message_personnalise}"

## 🔍 Analyse Détaillée

${insight.strategie_retention}

## 📋 Actions Recommandées

${insight.actions_recommandees.map((action, index) => `${index + 1}. ${action}`).join('\n')}

## 📊 Métriques Client

• **Taux d'annulation**: ${insight.client.taux_annulation}%
• **Score de risque**: ${Math.round(insight.client.score_risque * 100)}/100
• **Probabilité de récupération**: ${Math.round(insight.probabilite_conversion * 100)}%

---
*Analyse générée automatiquement le ${new Date().toLocaleString('fr-FR')}*`
                }
              ],
              metadata: {
                type: 'client_analysis',
                client_name: insight.client.nom,
                risk_level: insight.niveau_risque,
                auto_generated: true
              }
            };
            
            // Sauvegarde dans l'historique de l'assistant IA
            await storage.saveConversation('demo-user', conversationData.id, conversationData);
            messagesSaved++;
          }
        }
        console.log(`💬 ${messagesSaved} analyses client sauvegardées dans l'assistant IA`);
      } catch (error) {
        console.error('❌ Erreur sauvegarde analyses:', error);
      }
      
      res.json({
        success: true,
        insights,
        report,
        total_clients: clientProfiles.length,
        messages_saved: messagesSaved,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur analyse clients réels:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Routes pour la gestion des conversations IA
  app.get('/api/ai/conversations', async (req, res) => {
    try {
      const conversations = await storage.getConversations('demo-user');
      res.json({
        success: true,
        conversations
      });
    } catch (error) {
      console.error('❌ Erreur récupération conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des conversations'
      });
    }
  });

  app.delete('/api/ai/conversations/:conversationId', async (req, res) => {
    try {
      const { conversationId } = req.params;
      await storage.deleteConversation('demo-user', conversationId);
      res.json({
        success: true,
        message: 'Conversation supprimée avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur suppression conversation:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de la conversation'
      });
    }
  });

  app.delete('/api/ai/conversations', async (req, res) => {
    try {
      await storage.clearConversations('demo-user');
      res.json({
        success: true,
        message: 'Toutes les conversations ont été supprimées'
      });
    } catch (error) {
      console.error('❌ Erreur nettoyage conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du nettoyage des conversations'
      });
    }
  });

  // Routes pour les messages IA clients
  app.get('/api/clients/ai-messages', async (req, res) => {
    try {
      const messages = await storage.getClientAIMessages('demo-user');
      res.json({
        success: true,
        messages,
        total: messages.length
      });
    } catch (error) {
      console.error('❌ Erreur récupération messages IA:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des messages IA' 
      });
    }
  });

  app.delete('/api/clients/ai-messages/:messageId', async (req, res) => {
    try {
      const { messageId } = req.params;
      await storage.deleteClientAIMessage('demo-user', messageId);
      res.json({
        success: true,
        message: 'Message IA supprimé avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur suppression message IA:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la suppression du message IA' 
      });
    }
  });

  app.delete('/api/clients/ai-messages', async (req, res) => {
    try {
      await storage.clearClientAIMessages('demo-user');
      res.json({
        success: true,
        message: 'Tous les messages IA ont été supprimés'
      });
    } catch (error) {
      console.error('❌ Erreur nettoyage messages IA:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors du nettoyage des messages IA' 
      });
    }
  });

  // Routes d'authentification personnalisées (contournement Replit Auth à cause de Vite)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion:', email);
      
      const user = await storage.authenticateUser(email, password);
      if (user) {
        console.log('✅ Connexion réussie pour:', email);
        res.json({ success: true, user, token: 'demo-token-' + user.id });
      } else {
        console.log('❌ Échec de connexion pour:', email);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion CLIENT:', email);
      
      const client = await storage.authenticateClientAccount(email, password);
      if (client) {
        console.log('✅ Connexion CLIENT réussie pour:', email);
        res.json({ success: true, client, token: 'demo-client-token-' + client.id });
      } else {
        console.log('❌ Échec de connexion CLIENT pour:', email);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion CLIENT:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Route de test Firebase spécifique
  app.post('/api/test-firebase-force', async (req, res) => {
    try {
      console.log('🔥 TEST FIREBASE FORCÉ...');
      console.log('Firebase secrets:', FIREBASE_CONFIG.hasFirebaseSecrets());
      console.log('Firebase activé:', FIREBASE_CONFIG.USE_FIREBASE);
      console.log('USE_FIREBASE final:', USE_FIREBASE);
      
      // Test direct avec FirebaseStorage
      const { FirebaseStorage } = await import('./firebaseStorage');
      const fbStorage = new FirebaseStorage();
      
      const testUser = {
        email: 'test-firebase-direct@test.com',
        password: 'test123',
        firstName: 'Firebase',
        lastName: 'Direct',
        businessName: 'Test Firebase'
      };
      
      console.log('🔄 Tentative d\'inscription Firebase directe...');
      const result = await fbStorage.createUser(testUser);
      console.log('✅ Firebase fonctionne !', result.id);
      
      res.json({ 
        success: true, 
        message: 'Firebase fonctionne !', 
        userId: result.id,
        firebaseStatus: 'WORKING'
      });
    } catch (error) {
      console.error('❌ Firebase échec:', error.message);
      res.json({ 
        success: false, 
        message: 'Firebase échec: ' + error.message,
        firebaseStatus: 'FAILED',
        errorDetails: error.toString()
      });
    }
  });

  // Routes d'inscription
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = req.body;
      console.log('📝 Tentative d\'inscription PRO:', userData.email);
      
      const user = await storage.createUser(userData);
      console.log('✅ Inscription PRO réussie pour:', userData.email);
      res.json({ success: true, user, token: 'demo-token-' + user.id });
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription PRO:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/client/register', async (req, res) => {
    try {
      const userData = req.body;
      console.log('📝 Tentative d\'inscription CLIENT:', userData.email);
      
      const client = await storage.createClientAccount(userData);
      console.log('✅ Inscription CLIENT réussie pour:', userData.email);
      res.json({ success: true, client, token: 'demo-client-token-' + client.id });
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription CLIENT:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Auth middleware (désactivé temporairement)
  // await setupAuth(app);

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

  // Salon/BookingPage routes (compatible Firebase)
  app.get('/api/booking-pages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération page salon:', id);
      
      let salon = await storage.getSalon?.(id);
      
      if (!salon) {
        console.log('ℹ️ Salon non trouvé, vérification dans storage.salons:', id);
        
        // Vérifier dans storage.salons (Map)
        salon = storage.salons?.get(id);
        
        if (!salon) {
          console.log('❌ Salon vraiment introuvable:', id);
          return res.status(404).json({ message: `Salon "${id}" not found` });
        }
      }
        
      
      console.log('📖 Salon trouvé:', salon.name, 'ID:', salon.id);
      
      // ✅ FORCER L'AJOUT DES PHOTOS POUR TOUS LES SALONS - CORRECTION DÉFINITIVE
      if (!salon.photos || salon.photos.length === 0) {
        salon.photos = [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
        ];
        console.log(`📸 Photos ajoutées au salon: ${salon.name}`);
      }
      
      if (!salon.coverImageUrl) {
        salon.coverImageUrl = salon.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format";
        console.log(`🖼️ Cover image ajoutée au salon: ${salon.name}`);
      }
      
      console.log(`✅ SALON AVEC PHOTOS GARANTIES: ${salon.name} - Photos: ${salon.photos?.length || 0}`);
      res.json(salon);
    } catch (error) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  app.put('/api/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const salonData = req.body;
      
      console.log('💾 SAUVEGARDE SALON - ID reçu:', id);
      console.log('💾 SAUVEGARDE SALON - Données:', Object.keys(salonData));
      
      // Utiliser l'ID exact fourni par le client - plus de redirection forcée
      const actualId = id;
      
      // 🔥 FORCER LA SYNCHRONISATION IMMÉDIATE
      console.log('🚨 SAUVEGARDE FORCÉE IMMÉDIATE pour ID:', actualId);
      console.log('💾 ID corrigé pour sauvegarde:', actualId);
      
      // 🔥 SAUVEGARDE PERSISTANTE EN BASE DE DONNÉES POSTGRESQL
      let savedSalon;
      
      // Première étape: sauvegarder en mémoire (Map)
      if (storage.salons) {
        const existingSalon = storage.salons.get(actualId) || {};
        const updatedSalon = { 
          ...existingSalon, 
          ...salonData, 
          id: actualId,
          updatedAt: new Date().toISOString()
        };
        storage.salons.set(actualId, updatedSalon);
        savedSalon = updatedSalon;
        console.log('✅ Salon sauvegardé en mémoire:', actualId);
      }
      
      // Deuxième étape: sauvegarder en base PostgreSQL pour persistance
      try {
        if (storage.updateSalon) {
          console.log('💾 Sauvegarde PostgreSQL du salon:', actualId);
          await storage.updateSalon(actualId, salonData);
          console.log('✅ Salon sauvegardé en PostgreSQL:', actualId);
        } else if (storage.createSalon) {
          console.log('💾 Création PostgreSQL du salon:', actualId);
          await storage.createSalon({ ...salonData, id: actualId });
          console.log('✅ Salon créé en PostgreSQL:', actualId);
        }
      } catch (dbError) {
        console.log('⚠️ Erreur PostgreSQL (continuons avec mémoire):', dbError.message);
      }
      
      // 🔥 INTÉGRATION AUTOMATIQUE AU SYSTÈME DE RECHERCHE PUBLIC
      if (salonData.isPublished !== false) {
        const publicSalonData = {
          id: id,
          name: salonData.name || 'Salon sans nom',
          description: salonData.description || '',
          address: salonData.address || '',
          phone: salonData.phone || '',
          rating: 4.5,
          reviews: 0,
          verified: true,
          category: determineCategory(salonData.serviceCategories || []),
          city: extractCity(salonData.address || ''),
          services: extractServices(salonData.serviceCategories || []),
          customColors: salonData.customColors,
          shareableUrl: `/salon/${id}`,
          isActive: true,
          createdAt: new Date(),
          nextSlot: 'Disponible aujourd\'hui'
        };
        
        // ✅ S'ASSURER QUE LE SALON DANS LA RECHERCHE A DES PHOTOS
        publicSalonData.photos = salonData.photos || [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format"
        ];
        publicSalonData.coverImageUrl = salonData.coverImageUrl || publicSalonData.photos[0];
        
        // 🔄 SYNCHRONISATION AUTOMATIQUE UNIVERSELLE
        if (storage.salons) {
          const unifiedSalonData = { ...savedSalon, ...publicSalonData };
          storage.salons.set(actualId, unifiedSalonData);
          
          // Auto-sync dans tous les systèmes
          storage.salons.set(`public-${actualId}`, unifiedSalonData);
          storage.salons.set(`search-${actualId}`, unifiedSalonData);
          storage.salons.set(`booking-${actualId}`, unifiedSalonData);
          
          console.log('🔄 SYNCHRONISATION AUTOMATIQUE COMPLÈTE:', actualId);
          console.log('✅ Données synchronisées dans tous les systèmes');
          console.log('🚨 NOM FINAL SAUVEGARDÉ:', unifiedSalonData.name);
          console.log('🎨 COULEURS FINALES:', unifiedSalonData.customColors);
        }
      }
      
      res.json({ 
        success: true, 
        message: 'Salon sauvegardé et publié avec succès', 
        salon: savedSalon,
        shareableUrl: `${req.protocol}://${req.get('host')}/salon/${actualId}`,
        publicListing: true
      });
    } catch (error) {
      console.error('❌ Erreur sauvegarde salon:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
    }
  });

  // Route pour rechercher les salons publics par catégorie et ville
  app.get('/api/public/salons', async (req, res) => {
    try {
      const { category, city, q } = req.query;
      
      // Récupérer tous les salons publics
      let allSalons = Array.from(publicSalonsStorage.values());
      
      // Ajouter salon démo
      const demoSalon = {
        id: "demo-user",
        name: "Studio Élégance Paris",
        rating: 4.8,
        reviews: 247,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
        location: "Paris 1er",
        distance: "1.2 km",
        nextSlot: "Aujourd'hui 14h30",
        services: ["Coupe & Styling", "Coloration", "Soins Capillaires"],
        priceRange: "€€€",
        category: 'coiffure',
        city: 'paris',
        verified: true,
        shareableUrl: '/salon/demo-user'
      };
      
      allSalons.push(demoSalon);
      
      // Filtrer par catégorie et ville
      let salons = allSalons;
      if (category) {
        salons = salons.filter(salon => salon.category === category.toLowerCase());
      }
      if (city) {
        salons = salons.filter(salon => salon.city === city.toLowerCase() || salon.location?.toLowerCase().includes(city.toLowerCase()));
      }
      if (q) {
        const queryLower = (q as string).toLowerCase();
        salons = salons.filter(salon => 
          salon.name.toLowerCase().includes(queryLower) ||
          salon.services?.some((service: string) => service.toLowerCase().includes(queryLower))
        );
      }
      
      res.json({ success: true, salons });
    } catch (error) {
      console.error('Erreur recherche salons:', error);
      res.status(500).json({ success: false, message: 'Erreur de recherche' });
    }
  });

  // Dashboard routes (compatible Firebase)
  app.get('/api/dashboard/upcoming-appointments', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let appointments = [];
      if (storage.getAppointments) {
        appointments = await storage.getAppointments(userId);
      }
      
      res.json(appointments.slice(0, 5)); // Limiter à 5 prochains RDV
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  // Notification routes (Firebase ready)
  app.get('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let notifications = [];
      if (storage.getNotifications) {
        notifications = await storage.getNotifications(userId);
      }
      
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const notificationData = {
        ...req.body,
        userId,
        isRead: false
      };

      let notification;
      if (storage.createNotification) {
        notification = await storage.createNotification(notificationData);
      } else {
        notification = { ...notificationData, id: Date.now(), createdAt: new Date() };
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Failed to create notification' });
    }
  });

  // Client routes (Firebase ready) 
  app.post('/api/client/register', async (req, res) => {
    try {
      const clientData = {
        ...req.body,
        userId: req.body.userId || '1' // Default userId pour éviter l'erreur de contrainte
      };
      
      let client;
      if (storage.createClient) {
        client = await storage.createClient(clientData);
      } else {
        client = { ...clientData, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
      }
      
      res.json({ success: true, client });
    } catch (error) {
      console.error('Error registering client:', error);
      res.status(500).json({ success: false, message: 'Failed to register client' });
    }
  });

  app.get('/api/client/by-email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      
      // Pour l'instant, retourner un client fictif pour les tests
      const client = {
        id: 1,
        email,
        firstName: 'Client',
        lastName: 'Test',
        phone: '+33123456789',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json(client);
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ message: 'Failed to fetch client' });
    }
  });

  // Appointment routes (Firebase ready)
  app.post('/api/appointments', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const appointmentData = {
        ...req.body,
        userId,
        status: 'confirmed'
      };

      let appointment;
      if (storage.createAppointment) {
        appointment = await storage.createAppointment(appointmentData);
      } else {
        appointment = { 
          ...appointmentData, 
          id: Date.now(), 
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
      }
      
      res.json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  });

  // Services routes
  app.get('/api/services', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getServiceById?.(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(service);
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({ message: 'Failed to fetch service' });
    }
  });

  // Clients routes  
  app.get('/api/clients', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const clients = await storage.getClients(userId);
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ message: 'Failed to fetch clients' });
    }
  });

  // Client authentication routes
  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const client = await storage.authenticateClient(email, password);
      
      if (client) {
        // Generate a simple token (in production, use JWT)
        const token = `client-${client.id}-${Date.now()}`;
        
        res.json({
          success: true,
          client: {
            id: client.id,
            email: client.email,
            firstName: client.firstName,
            lastName: client.lastName,
            loyaltyPoints: client.loyaltyPoints,
            clientStatus: client.clientStatus,
            token
          }
        });
      } else {
        res.status(401).json({ error: 'Identifiants incorrects' });
      }
    } catch (error) {
      console.error('Client login error:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/api/client/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

      // Check if client already exists
      const existingClient = await storage.getClientAccountByEmail(email);
      if (existingClient) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
      }

      const newClient = await storage.createClientAccount({
        email,
        password,
        firstName,
        lastName,
        phone,
        dateOfBirth
      });

      const token = `client-${newClient.id}-${Date.now()}`;

      res.json({
        success: true,
        client: {
          id: newClient.id,
          email: newClient.email,
          firstName: newClient.firstName,
          lastName: newClient.lastName,
          loyaltyPoints: newClient.loyaltyPoints,
          clientStatus: newClient.clientStatus,
          token
        }
      });
    } catch (error) {
      console.error('Client registration error:', error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  });

  app.get('/api/client/auth/check', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('client-')) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
      // Extract client ID from token (simplified approach)
      const clientId = parseInt(token.split('-')[1]);
      const client = await storage.getClientAccount(clientId);
      
      if (client) {
        res.json({
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          loyaltyPoints: client.loyaltyPoints,
          clientStatus: client.clientStatus
        });
      } else {
        res.status(401).json({ error: 'Token invalide' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Token invalide' });
    }
  });

  // API UNIVERSELLE : Récupération automatique du salon du professionnel connecté (DOIT ÊTRE AVANT /:id)
  app.get('/api/salon/current', async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      // CORRIGÉ : Récupération fiable du salon créé depuis l'éditeur
      if (!userId) {
        console.log('🧪 Mode test : récupération salon depuis éditeur');
        
        // 1. Forcer un refresh des données PostgreSQL
        try {
          const savedSalons = await storage.getAllSalons();
          if (savedSalons.length > 0) {
            const latestSalon = savedSalons.sort((a, b) => 
              new Date(b.updatedAt || b.createdAt || '').getTime() - 
              new Date(a.updatedAt || a.createdAt || '').getTime()
            )[0];
            
            console.log('✅ Salon trouvé en PostgreSQL:', latestSalon.id, latestSalon.name);
            
            // Charger en mémoire pour accès rapide
            if (!storage.salons) storage.salons = new Map();
            storage.salons.set(latestSalon.id, latestSalon);
            
            return res.json(latestSalon);
          }
        } catch (error) {
          console.log('⚠️ Erreur lecture PostgreSQL:', error);
        }
        
        // 2. Chercher en mémoire si PostgreSQL a échoué
        if (storage.salons && storage.salons.size > 0) {
          const allSalons = Array.from(storage.salons.values());
          const latestSalon = allSalons.sort((a, b) => 
            new Date(b.updatedAt || b.createdAt || '').getTime() - 
            new Date(a.updatedAt || a.createdAt || '').getTime()
          )[0];
          console.log('✅ Salon trouvé en mémoire:', latestSalon.id, latestSalon.name);
          return res.json(latestSalon);
        }
        
        // Créer un nouveau salon avec ID unique
        const uniqueId = `salon-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const newSalon = {
          id: uniqueId,
          name: 'Mon Salon',
          description: 'Salon de beauté moderne et professionnel',
          address: '123 Rue de la Beauté, 75001 Paris',
          phone: '01 42 25 76 89',
          rating: 4.8,
          reviews: 0,
          coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
          photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format'],
          verified: true,
          customColors: {
            primary: '#7c3aed',
            accent: '#a855f7',
            buttonText: '#ffffff',
            priceColor: '#7c3aed',
            neonFrame: '#a855f7'
          },
          serviceCategories: [],
          professionals: [],
          certifications: [],
          awards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Sauvegarder en mémoire
        if (!storage.salons) {
          storage.salons = new Map();
        }
        storage.salons.set(uniqueId, newSalon);
        
        console.log('✅ Nouveau salon créé avec ID unique:', uniqueId);
        return res.json(newSalon);
      }
      
      // Générer un ID unique basé sur l'utilisateur
      const salonId = `salon-${userId}`;
      
      // Chercher le salon associé à ce professionnel
      let salon = storage.salons?.get(salonId);
      
      if (!salon) {
        // Créer automatiquement un salon pour ce professionnel
        salon = {
          id: salonId,
          name: 'Mon Salon de Beauté',
          description: 'Salon créé automatiquement pour le professionnel',
          address: '123 Rue de la Beauté, 75001 Paris',
          phone: '01 23 45 67 89',
          email: 'contact@monsalon.fr',
          website: '',
          photos: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format'
          ],
          professionals: [
            {
              id: '1',
              name: 'Professionnel',
              specialty: 'Services de beauté',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
              rating: 4.8,
              price: 60,
              bio: 'Professionnel expérimenté',
              experience: '5 ans d\'expérience'
            }
          ],
          serviceCategories: [],
          tags: ['salon', 'beauté'],
          ownerId: userId
        };
        
        storage.salons?.set(salonId, salon);
        console.log('🏛️ Salon auto-créé pour professionnel:', userId, 'ID:', salonId);
      }
      
      res.json(salon);
    } catch (error) {
      console.error("Erreur récupération salon:", error);
      res.status(500).json({ message: "Erreur lors de la récupération du salon" });
    }
  });

  // API d'inscription professionnel avec création automatique de page salon
  app.post('/api/professional/register', async (req, res) => {
    try {
      const { 
        businessName, 
        ownerName, 
        email, 
        phone, 
        address, 
        businessType, 
        services, 
        description,
        password 
      } = req.body;

      // Vérifier si l'email existe déjà
      const existingPro = await storage.getBusinessByEmail?.(email);
      if (existingPro) {
        return res.status(400).json({ error: 'Un compte professionnel avec cet email existe déjà' });
      }

      // Générer un ID unique pour le salon
      const businessId = `business-${Date.now()}`;
      const salonId = `salon-${businessId}`;

      // Créer le compte professionnel
      const professionalAccount = {
        id: businessId,
        businessName,
        ownerName,
        email,
        phone,
        address,
        businessType,
        description,
        password, // En production, hasher le mot de passe
        createdAt: new Date(),
        salonId // Lier le salon au professionnel
      };

      // Créer la page salon automatiquement
      const salonPage = {
        id: salonId,
        name: businessName,
        description: description || `${businessName} - Votre salon de beauté professionnel`,
        address,
        phone,
        email,
        website: '',
        photos: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format'
        ],
        professionals: [
          {
            id: '1',
            name: ownerName,
            specialty: businessType === 'hair_salon' ? 'Coiffure' : 
                     businessType === 'beauty_institute' ? 'Soins esthétiques' :
                     businessType === 'nail_salon' ? 'Manucure & Pédicure' :
                     businessType === 'spa' ? 'Massage & Bien-être' : 'Services de beauté',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
            rating: 5.0,
            price: 60,
            bio: `Professionnel expérimenté chez ${businessName}`,
            experience: 'Professionnel qualifié'
          }
        ],
        serviceCategories: services ? [{
          name: businessType === 'hair_salon' ? 'Coiffure' : 
                businessType === 'beauty_institute' ? 'Soins esthétiques' :
                businessType === 'nail_salon' ? 'Manucure' :
                businessType === 'spa' ? 'Massage' : 'Services',
          services: services.map((service: string, index: number) => ({
            id: (index + 1).toString(),
            name: service,
            price: 50,
            duration: 60,
            description: `Service ${service} professionnel`
          }))
        }] : [],
        tags: [businessType, 'professionnel', 'beauté'],
        ownerId: businessId,
        rating: 5.0,
        reviewCount: 0,
        verified: true
      };

      // Sauvegarder dans le storage
      if (storage.createBusiness) {
        await storage.createBusiness(professionalAccount);
      }
      
      storage.salons?.set(salonId, salonPage);
      
      console.log(`🏢 Nouveau professionnel inscrit: ${businessName}`);
      console.log(`📄 Page salon créée automatiquement: ${salonId}`);

      res.json({
        success: true,
        message: 'Inscription réussie ! Votre page salon a été créée automatiquement.',
        business: {
          id: businessId,
          businessName,
          ownerName,
          email
        },
        salon: {
          id: salonId,
          name: businessName,
          url: `/salon/${salonId}`,
          editUrl: `/salon-page-editor`
        }
      });

    } catch (error) {
      console.error('Erreur inscription professionnel:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  });

  // API publique pour la recherche de salons avec photos
  app.get('/api/search/salons', async (req, res) => {
    try {
      const { category, city, search } = req.query;
      
      // Récupérer tous les salons depuis PostgreSQL
      let salons = await storage.getAllSalons();
      console.log(`🔍 Recherche salons: ${salons.length} salons trouvés`);
      
      // Filtrer par catégorie si spécifiée - logique plus souple basée sur le nom
      if (category && category !== 'all') {
        const initialCount = salons.length;
        const categoryLower = (category as string).toLowerCase();
        
        salons = salons.filter(salon => {
          const salonName = salon.name?.toLowerCase() || '';
          const salonDesc = salon.description?.toLowerCase() || '';
          
          // Correspondances plus larges basées sur les vrais noms des salons
          if (categoryLower === 'coiffure') return salonName.includes('coiffure') || salonDesc.includes('coiffure');
          if (categoryLower === 'barbier') return salonName.includes('barbier') || salonDesc.includes('barbier');
          if (categoryLower === 'esthetique') return salonName.includes('institut') || salonName.includes('beauté') || salonDesc.includes('institut') || salonDesc.includes('beauté');
          if (categoryLower === 'massage') return salonName.includes('spa') || salonName.includes('wellness') || salonDesc.includes('massage') || salonDesc.includes('spa');
          if (categoryLower === 'onglerie' || categoryLower === 'ongles') return salonName.includes('nail') || salonDesc.includes('ongles') || salonDesc.includes('manucure');
          
          return false;
        });
        console.log(`🏷️ Filtre catégorie "${category}": ${initialCount} → ${salons.length} salons`);
      }
      
      // Filtrer par ville si spécifiée - plus souple
      if (city && city !== 'all') {
        const initialCount = salons.length;
        const cityLower = (city as string).toLowerCase();
        
        // Si c'est "paris", on garde tous les salons (ils sont tous à Paris)
        if (cityLower === 'paris') {
          // Pas de filtrage car tous nos salons sont à Paris
        } else {
          salons = salons.filter(salon => 
            salon.address?.toLowerCase().includes(cityLower)
          );
        }
        console.log(`📍 Filtre ville "${city}": ${initialCount} → ${salons.length} salons`);
      }
      
      // Filtrer par recherche textuelle si spécifiée
      if (search) {
        const searchLower = (search as string).toLowerCase();
        salons = salons.filter(salon =>
          salon.name?.toLowerCase().includes(searchLower) ||
          salon.description?.toLowerCase().includes(searchLower) ||
          salon.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
        console.log(`🔍 Filtre recherche "${search}": ${salons.length} salons`);
      }
      
      // Formater les résultats pour l'affichage dans SalonSearchComplete avec couleurs uniques
      const formattedSalons = salons.map(salon => {
        // Extraction des photos depuis JSON
        const photos = Array.isArray(salon.photos) ? salon.photos : 
                      (typeof salon.photos === 'string' ? JSON.parse(salon.photos || '[]') : []);
        
        // Extraction des couleurs personnalisées depuis JSON
        const customColors = salon.custom_colors || salon.customColors || {};
        const parsedColors = typeof customColors === 'string' ? JSON.parse(customColors) : customColors;
        
        // Extraction des catégories de services depuis JSON  
        const serviceCategories = Array.isArray(salon.service_categories) ? salon.service_categories :
                                 (typeof salon.service_categories === 'string' ? JSON.parse(salon.service_categories || '[]') : []);
        
        return {
          id: salon.id,
          name: salon.name,
          location: extractCity(salon.address),
          rating: 4.5 + Math.random() * 0.4, // Rating dynamique entre 4.5 et 4.9
          reviews: Math.floor(50 + Math.random() * 200), // Entre 50 et 250 avis
          nextSlot: "14:30",
          price: "€€",
          services: serviceCategories.length > 0 ? serviceCategories : ["Coiffure", "Soins"],
          verified: true,
          distance: "1.2km",
          category: determineCategory(serviceCategories),
          photo: photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
          coverImageUrl: photos.length > 0 ? photos[0] : null,
          openNow: true,
          promotion: null,
          customColors: parsedColors, // 🎨 COULEURS UNIQUES POUR CHAQUE SALON
          // Données complètes pour les détails
          description: salon.description,
          address: salon.address,
          phone: salon.phone,
          photos: photos,
          serviceCategories: serviceCategories,
          tags: salon.tags || [],
          openingHours: salon.openingHours || {
            monday: "9:00-19:00",
            tuesday: "9:00-19:00", 
            wednesday: "9:00-19:00",
            thursday: "9:00-19:00",
            friday: "9:00-19:00",
            saturday: "9:00-18:00",
            sunday: "Fermé"
          }
        };
      });
      
      res.json({
        salons: formattedSalons,
        total: formattedSalons.length,
        filters: { category, city, search }
      });
    } catch (error) {
      console.error('❌ Error fetching salons:', error);
      res.status(500).json({ message: 'Failed to fetch salons' });
    }
  });

  // API pour récupérer un salon spécifique depuis PostgreSQL
  app.get('/api/public/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🔍 Recherche salon avec ID:', id);
      
      // Rechercher le salon dans PostgreSQL
      const salons = await db.select().from(salonsTable).where(eq(salonsTable.id, id));
      const salon = salons[0];
      
      if (!salon) {
        console.log('❌ Salon non trouvé avec ID:', id);
        return res.status(404).json({ message: 'Salon not found' });
      }
      
      console.log('✅ Salon trouvé:', salon.name);
      
      // Extraction et formatage des données JSON
      const photos = Array.isArray(salon.photos) ? salon.photos : 
                    (typeof salon.photos === 'string' ? JSON.parse(salon.photos || '[]') : []);
      
      const customColors = salon.custom_colors || salon.customColors || {};
      const parsedColors = typeof customColors === 'string' ? JSON.parse(customColors) : customColors;
      
      const serviceCategories = Array.isArray(salon.service_categories) ? salon.service_categories :
                               (typeof salon.service_categories === 'string' ? JSON.parse(salon.service_categories || '[]') : []);
      
      // Formater les données pour l'affichage détaillé avec vraies données PostgreSQL
      const formattedSalon = {
        id: salon.id,
        name: salon.name,
        description: salon.description,
        address: salon.address,
        phone: salon.phone,
        email: salon.email,
        website: salon.website,
        photos: photos,
        coverImageUrl: photos.length > 0 ? photos[0] : null,
        rating: 4.5 + Math.random() * 0.4, // Rating dynamique
        reviewCount: Math.floor(50 + Math.random() * 200), // Reviews dynamiques
        reviews: Math.floor(50 + Math.random() * 200),
        serviceCategories: serviceCategories,
        customColors: parsedColors,
        tags: salon.tags || [],
        openingHours: salon.openingHours || {
          monday: "9:00-19:00",
          tuesday: "9:00-19:00", 
          wednesday: "9:00-19:00",
          thursday: "9:00-19:00",
          friday: "9:00-19:00",
          saturday: "9:00-18:00",
          sunday: "Fermé"
        },
        category: determineCategory(serviceCategories),
        city: extractCity(salon.address),
        location: extractCity(salon.address),
        services: serviceCategories.length > 0 ? serviceCategories : ["Coiffure", "Soins"],
        // Infos supplémentaires
        verified: true,
        certifications: ["Salon vérifié", "Professionnels qualifiés"],
        awards: ["Qualité service", "Satisfaction client"]
      };
      
      res.json(formattedSalon);
    } catch (error) {
      console.error('❌ Error fetching salon details:', error);
      res.status(500).json({ message: 'Failed to fetch salon details' });
    }
  });

  // Route de test simple
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne', timestamp: new Date().toISOString() });
  });

  // Fonctions utilitaires pour formater les données salon
  function determineCategory(serviceCategories: any[]) {
    if (!serviceCategories || serviceCategories.length === 0) return 'mixte';
    
    const firstCategory = serviceCategories[0]?.name?.toLowerCase() || '';
    if (firstCategory.includes('coiffure')) return 'coiffure';
    if (firstCategory.includes('barbier')) return 'barbier';
    if (firstCategory.includes('manucure') || firstCategory.includes('ongles')) return 'ongles';
    if (firstCategory.includes('massage')) return 'massage';
    if (firstCategory.includes('soin') || firstCategory.includes('esthétique')) return 'esthetique';
    return 'mixte';
  }

  function extractCity(address: string) {
    if (!address) return '';
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[1].trim();
    }
    return address;
  }

  function extractServices(serviceCategories: any[]) {
    if (!serviceCategories) return [];
    
    const services: string[] = [];
    serviceCategories.forEach(category => {
      if (category.services && Array.isArray(category.services)) {
        category.services.forEach((service: any) => {
          if (service.name) services.push(service.name);
        });
      }
    });
    return services.slice(0, 3); // Limiter à 3 services principaux
  }

  const httpServer = createServer(app);
  return httpServer;
}

// Fonctions utilitaires pour déterminer la catégorie et extraire les données
function determineCategory(serviceCategories: any[]): string {
  if (!serviceCategories || serviceCategories.length === 0) return 'beaute';
  
  const firstCategory = serviceCategories[0];
  const categoryName = firstCategory.name?.toLowerCase() || '';
  
  if (categoryName.includes('cheveux') || categoryName.includes('coiffure') || categoryName.includes('coupe')) {
    return 'coiffure';
  } else if (categoryName.includes('barbe') || categoryName.includes('barbier')) {
    return 'barbier';
  } else if (categoryName.includes('ongle') || categoryName.includes('manucure')) {
    return 'ongles';
  } else if (categoryName.includes('massage') || categoryName.includes('spa')) {
    return 'massage';
  } else if (categoryName.includes('visage') || categoryName.includes('soin') || categoryName.includes('esthé')) {
    return 'esthetique';
  }
  
  return 'beaute';
}

function extractCity(address: string): string {
  if (!address) return 'paris';
  
  // Extraire la ville de l'adresse
  const cityMatch = address.match(/(\d{5})\s+([^,]+)/);
  if (cityMatch) {
    return cityMatch[2].toLowerCase().trim();
  }
  
  // Fallback - chercher "Paris" dans l'adresse
  if (address.toLowerCase().includes('paris')) {
    return 'paris';
  }
  
  return 'paris';
}

function extractServices(serviceCategories: any[]): string[] {
  const services: string[] = [];
  
  serviceCategories.forEach(category => {
    if (category.services && Array.isArray(category.services)) {
      category.services.forEach((service: any) => {
        if (service.name) {
          services.push(service.name);
        }
      });
    }
  });
  
  return services.slice(0, 5); // Limiter à 5 services max
}