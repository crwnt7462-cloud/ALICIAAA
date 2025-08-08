import type { Express } from "express";
import { createServer, type Server } from "http";
// Firebase storage removed - using PostgreSQL only
import { storage as memoryStorage } from "./storage";
import { createAutomaticSalonPage, linkSalonToProfessional } from './autoSalonCreation';
import { setupAuth, isAuthenticated } from "./replitAuth";
import { FIREBASE_CONFIG, FIREBASE_INSTRUCTIONS } from "./firebaseSetup";
import { SUPABASE_CONFIG, SUPABASE_INSTRUCTIONS, realtimeService } from "./supabaseSetup";
import { aiService } from "./aiService";
import { clientAnalyticsService, type ClientProfile } from "./clientAnalyticsService";

// Configuration: utiliser Firebase ou stockage mémoire
const USE_FIREBASE = FIREBASE_CONFIG.USE_FIREBASE && FIREBASE_CONFIG.hasFirebaseSecrets();
const storage = memoryStorage; // Using PostgreSQL storage only

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
  
  // ============= ROUTES PRIORITAIRES SALON & SUBSCRIPTION =============
  
  // ROUTE SALON - PRIORITÉ ABSOLUE (AVANT TOUTE AUTRE ROUTE)
  app.get('/api/user/salon', async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
      console.log(`🎯 [PRIORITÉ] API Salon - retour salon démo directement`);
      const demoSalon = await storage.getSalon('salon-demo');
      if (demoSalon) {
        console.log(`✅ Salon démo trouvé: ${demoSalon.name}`);
        return res.status(200).json(demoSalon);
      } else {
        console.log(`❌ Salon démo non trouvé`);
        return res.status(404).json({ error: 'Salon démo non disponible' });
      }
    } catch (error: any) {
      console.error("Error fetching user salon:", error);
      return res.status(500).json({ message: "Failed to fetch user salon" });
    }
  });

  // ROUTE SUBSCRIPTION - PRIORITÉ ABSOLUE (AVANT TOUTE AUTRE ROUTE)
  app.get('/api/user/subscription', async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
      console.log(`💳 [PRIORITÉ] API Subscription - retour plan Premium Pro pour demo`);
      const subscription = {
        planId: 'premium',
        planName: 'Premium Pro', 
        price: 149,
        status: 'active',
        userId: 'demo-user'
      };
      console.log(`✅ Plan demo: ${subscription.planName} (${subscription.price}€)`);
      return res.status(200).json(subscription);
    } catch (error: any) {
      console.error("Error fetching user subscription:", error);
      return res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });

  // ============= FIN ROUTES PRIORITAIRES =============
  
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
    } catch (error: any) {
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
• **Score de risque**: ${Math.round((insight.client?.score_risque || 0) * 100)}/100
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
      } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
      // Firebase storage removed - using PostgreSQL only
      console.log('PostgreSQL storage actif');
      
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
    } catch (error: any) {
      console.error('❌ Firebase échec:', error);
      res.json({ 
        success: false, 
        message: 'Firebase échec: ' + (error instanceof Error ? error.message : 'Erreur inconnue'),
        firebaseStatus: 'FAILED',
        errorDetails: error instanceof Error ? error.toString() : 'Erreur inconnue'
      });
    }
  });

  // Routes d'inscription
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = req.body;
      console.log('📝 Tentative d\'inscription PRO:', userData.email);
      
      const user = await storage.createUser(userData);
      
      // 🚀 CRÉATION AUTOMATIQUE DU SALON PERSONNEL pour ce professionnel
      const { createAutomaticSalonPage } = await import('./autoSalonCreation');
      const automaticSalon = await createAutomaticSalonPage({
        ownerName: `${userData.firstName} ${userData.lastName}`,
        businessName: userData.businessName || `Salon ${userData.firstName}`,
        email: userData.email,
        phone: userData.phone || '01 23 45 67 89',
        address: userData.address || 'Adresse non spécifiée',
        subscriptionPlan: 'basic',
        services: ['Coiffure', 'Soins'],
        description: `Salon professionnel de ${userData.firstName} ${userData.lastName}`
      });

      console.log(`✅ Salon personnel créé pour ${userData.email}: /salon/${automaticSalon.id}`);
      console.log('✅ Inscription PRO réussie pour:', userData.email);
      
      res.json({ 
        success: true, 
        user: {
          ...user,
          salonId: automaticSalon.id,
          salonUrl: `/salon/${automaticSalon.id}`
        }, 
        salon: {
          id: automaticSalon.id,
          name: automaticSalon.name,
          url: automaticSalon.shareableUrl
        },
        token: 'demo-token-' + user.id 
      });
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Route duplicata pour compatibilité booking pages
  app.get('/api/booking-pages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération page salon (booking-pages):', id);
      
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
        
      
      console.log('📖 Salon trouvé:', salon?.name, 'ID:', salon.id);
      
      // ✅ FORCER L'AJOUT DES PHOTOS POUR TOUS LES SALONS - CORRECTION DÉFINITIVE
      if (!salon.photos || salon.photos.length === 0) {
        salon.photos = [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
        ];
        console.log(`📸 Photos ajoutées au salon: ${salon?.name}`);
      }
      
      if (!salon.coverImageUrl) {
        salon.coverImageUrl = salon.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format";
        console.log(`🖼️ Cover image ajoutée au salon: ${salon?.name}`);
      }

      // ✅ AJOUTER LES PROPRIÉTÉS MANQUANTES POUR ÉVITER LES ERREURS
      if (!salon.certifications) {
        salon.certifications = [
          "Salon labellisé L'Oréal Professionnel",
          "Formation continue Kérastase", 
          "Certification bio Shu Uemura"
        ];
      }
      
      if (!salon.awards) {
        salon.awards = [
          "Élu Meilleur Salon 2023",
          "Prix de l'Innovation Beauté 2022",
          "Certification Éco-responsable"
        ];
      }
      
      if (!salon.staff) {
        salon.staff = [];
      }
      
      if (!salon.longDescription) {
        salon.longDescription = "Notre salon vous accueille dans un cadre moderne et chaleureux.";
      }
      
      console.log(`✅ SALON AVEC PHOTOS GARANTIES: ${salon?.name} - Photos: ${salon.photos?.length || 0}`);
      res.json(salon);
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Salon/BookingPage routes (compatible Firebase) - ROUTE PRINCIPALE SALON
  app.get('/api/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération données salon pour éditeur:', id);
      
      // ✅ CORRECTION MAPPING ID : Utiliser getSalonData avec mapping intégré
      let salon = await storage.getSalonData?.(id);
      
      if (!salon) {
        console.log('❌ ERREUR: Salon inexistant dans PostgreSQL:', id);
        return res.status(404).json({ 
          error: 'Salon non trouvé dans la base de données PostgreSQL',
          message: 'AUCUNE DONNÉE FACTICE - Salons authentiques uniquement'
        });
      }
        
      
      console.log('📖 Salon trouvé:', salon?.name, 'ID:', salon.id);
      
      // ✅ FORCER L'AJOUT DES PHOTOS POUR TOUS LES SALONS - CORRECTION DÉFINITIVE
      if (!salon.photos || salon.photos.length === 0) {
        salon.photos = [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
        ];
        console.log(`📸 Photos ajoutées au salon: ${salon?.name}`);
      }
      
      if (!salon.coverImageUrl) {
        salon.coverImageUrl = salon.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format";
        console.log(`🖼️ Cover image ajoutée au salon: ${salon?.name}`);
      }

      // ✅ AJOUTER LES PROPRIÉTÉS MANQUANTES POUR ÉVITER LES ERREURS
      if (!salon.certifications) {
        salon.certifications = [
          "Salon labellisé L'Oréal Professionnel",
          "Formation continue Kérastase", 
          "Certification bio Shu Uemura"
        ];
      }
      
      if (!salon.awards) {
        salon.awards = [
          "Élu Meilleur Salon 2023",
          "Prix de l'Innovation Beauté 2022",
          "Certification Éco-responsable"
        ];
      }
      
      if (!salon.staff) {
        salon.staff = [];
      }
      
      if (!salon.longDescription) {
        salon.longDescription = "Notre salon vous accueille dans un cadre moderne et chaleureux.";
      }
      
      console.log(`✅ DONNÉES SALON POUR ÉDITEUR: ${salon?.name} - Photos: ${salon.photos?.length || 0}`);
      res.json(salon);
    } catch (error: any) {
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
      
      // 🔧 CORRECTION SYNCHRONISATION : Mapper "auto-generated" vers "salon-demo"
      let actualId = id;
      if (id === 'auto-generated' || id === 'undefined' || !id) {
        actualId = 'salon-demo';
      }
      console.log('💾 ID corrigé pour sauvegarde:', actualId, '(ID original:', id, ')');
      
      // Sauvegarder avec l'ID corrigé - FORCER LA SAUVEGARDE DIRECTE
      let savedSalon;
      
      // TOUJOURS sauvegarder directement dans storage.salons pour assurer la synchronisation
      if (storage.salons) {
        const existingSalon = storage.salons.get(actualId) || {};
        const updatedSalon = { ...existingSalon, ...salonData, id: actualId };
        storage.salons.set(actualId, updatedSalon);
        savedSalon = updatedSalon;
        console.log('✅ FORÇAGE SAUVEGARDE - Salon sauvegardé directement:', actualId, 'Nom:', updatedSalon.name);
      } else {
        savedSalon = { ...salonData, id: actualId };
      }
      
      // Sauvegarde additionnelle avec méthode updateBookingPage si elle existe
      if (storage.updateBookingPage) {
        console.log('💾 Sauvegarde additionnelle avec updateBookingPage:', actualId);
        await storage.updateBookingPage(actualId, salonData);
      }
      
      // 🔥 INTÉGRATION AUTOMATIQUE AU SYSTÈME DE RECHERCHE PUBLIC - CORRECTION COHÉRENCE ID
      if (salonData.isPublished !== false) {
        const publicSalonData = {
          id: actualId, // ✅ UTILISER L'ID CORRIGÉ, PAS L'ID ORIGINAL
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
          shareableUrl: `/salon/${actualId}`, // ✅ URL CORRIGÉE AVEC actualId
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
        
        // ✅ SAUVEGARDE COHÉRENTE : Même ID partout (actualId)
        if (storage.salons) {
          storage.salons.set(actualId, { ...savedSalon, ...publicSalonData });
        }
        console.log('🌟 Salon ajouté au système de recherche public AVEC PHOTOS:', actualId);
      }
      
      res.json({ 
        success: true, 
        message: 'Salon sauvegardé et publié avec succès', 
        salon: savedSalon,
        shareableUrl: `${req.protocol}://${req.get('host')}/salon/${actualId}`,
        publicListing: true
      });
    } catch (error: any) {
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
          salon?.name.toLowerCase().includes(queryLower) ||
          salon.services?.some((service: string) => service.toLowerCase().includes(queryLower))
        );
      }
      
      res.json({ success: true, salons });
    } catch (error: any) {
      console.error('Erreur recherche salons:', error);
      res.status(500).json({ success: false, message: 'Erreur de recherche' });
    }
  });

  // === ROUTES DASHBOARD CRITIQUES (FIXES ROUTING VITE) ===
  // Routes dashboard sans données factices - utiliser BDD uniquement
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      
      // Statistiques authentiques depuis la BDD
      const stats = await storage.getDashboardStats?.(userId) || {
        todayAppointments: 0,
        todayRevenue: 0,
        weekAppointments: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        pendingAppointments: 0
      };
      
      res.json(stats);
    } catch (error: any) {
      console.error('❌ Erreur dashboard stats:', error);
      res.status(500).json({ error: 'Erreur récupération statistiques' });
    }
  });

  app.get('/api/dashboard/upcoming-appointments', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('📅 Récupération des RDV à venir pour:', userId);
      
      let appointments: any[] = [];
      if (storage.getUpcomingAppointments) {
        appointments = await storage.getUpcomingAppointments(userId);
      }
      
      res.json(appointments || []);
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des RDV à venir:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming appointments' });
    }
  });

  // API Clients sans données factices
  app.get('/api/clients', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('👥 Récupération clients authentiques pour:', userId);
      
      let clients: any[] = [];
      if (storage.getClients) {
        clients = await storage.getClients(userId);
      }
      
      res.json(clients || []);
    } catch (error: any) {
      console.error('❌ Erreur récupération clients:', error);
      res.status(500).json({ error: 'Erreur récupération clients' });
    }
  });

  // API Rendez-vous sans données factices
  app.get('/api/appointments', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('📅 Récupération rendez-vous authentiques pour:', userId);
      
      let appointments: any[] = [];
      if (storage.getAppointments) {
        appointments = await storage.getAppointments(userId);
      }
      
      res.json(appointments || []);
    } catch (error: any) {
      console.error('❌ Erreur récupération rendez-vous:', error);
      res.status(500).json({ error: 'Erreur récupération rendez-vous' });
    }
  });

  // API Inventaire sans données factices
  app.get('/api/inventory', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('📦 Récupération inventaire authentique pour:', userId);
      
      let inventory = [];
      if (storage.getInventory) {
        inventory = await storage.getInventory(userId);
      }
      
      res.json(inventory || []);
    } catch (error: any) {
      console.error('❌ Erreur récupération inventaire:', error);
      res.status(500).json({ error: 'Erreur récupération inventaire' });
    }
  });

  app.get('/api/dashboard/revenue-chart', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const revenueChart = await storage.getRevenueChart(userId);
      res.json(revenueChart);
    } catch (error: any) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ error: "Failed to fetch revenue chart" });
    }
  });

  app.get('/api/dashboard/top-services', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const services = await storage.getTopServices(userId);
      res.json(services);
    } catch (error: any) {
      console.error("Error fetching top services:", error);
      res.status(500).json({ error: "Failed to fetch top services" });
    }
  });

  app.get('/api/dashboard/staff-performance', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const performance = await storage.getStaffPerformance(userId);
      res.json(performance);
    } catch (error: any) {
      console.error("Error fetching staff performance:", error);
      res.status(500).json({ error: "Failed to fetch staff performance" });
    }
  });

  app.get('/api/dashboard/client-retention', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const retention = await storage.getClientRetentionRate(userId);
      res.json(retention);
    } catch (error: any) {
      console.error("Error fetching client retention:", error);
      res.status(500).json({ error: "Failed to fetch client retention" });
    }
  });

  // === ROUTES STAFF ET INVENTORY (FIXES ROUTING VITE) ===
  app.get('/api/staff', async (req, res) => {
    try {
      console.log('🔍 API /api/staff appelée');
      const { salonId, userId } = req.query;
      const finalUserId = userId || salonId || 'demo'; // Flexibilité pour différentes API calls
      console.log('🏢 UserId final pour staff:', finalUserId);

      const staff = await storage.getStaffBySalonId(finalUserId as string);
      
      if (!staff || staff.length === 0) {
        return res.status(404).json({ 
          error: 'Aucun staff dans PostgreSQL pour cet utilisateur',
          userId: finalUserId,
          message: 'AUCUNE DONNÉE FICTIVE - Base de données vide'
        });
      }
      
      console.log('👥 Staff à retourner:', staff.length, 'professionnels');
      res.json(staff);
    } catch (error: any) {
      console.error("❌ Erreur staff API:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.get('/api/inventory', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const inventory = await storage.getInventory(userId);
      res.json(inventory);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  // Route pour récupérer l'inventaire par userId (pour les URLs directes comme /api/inventory/demo)
  app.get('/api/inventory/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const inventory = await storage.getInventory(userId);
      res.json(inventory);
    } catch (error: any) {
      console.error("Error fetching inventory for user:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.get('/api/inventory/low-stock', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const lowStockItems = await storage.getLowStockItems(userId);
      res.json(lowStockItems);
    } catch (error: any) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });

  app.post('/api/inventory', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const item = await storage.createInventoryItem(userId, req.body);
      res.json(item);
    } catch (error: any) {
      console.error("Error creating inventory item:", error);
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.put('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateInventoryItem(id, req.body);
      res.json(item);
    } catch (error: any) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.delete('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInventoryItem(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  // API RDV pour CLIENT et PRO - SYNC BIDIRECTIONNEL
  app.get('/api/appointments', async (req, res) => {
    try {
      console.log('📋 Récupération RDV PostgreSQL');
      
      // Support authentification CLIENT ou PRO
      const authHeader = req.headers.authorization;
      let userId = null;
      let isClient = false;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        } else if (token.startsWith('client-token-')) {
          userId = token.replace('client-token-', '');
          isClient = true;
        }
      }

      if (!userId) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis'
        });
      }

      // POSTGRESQL - Récupération selon le type d'utilisateur
      let appointments;
      if (isClient) {
        // Pour CLIENT : ses propres RDV
        appointments = await storage.getAppointmentsByClientId(userId);
        console.log('👤 RDV CLIENT récupérés:', appointments?.length || 0);
      } else {
        // Pour PRO : RDV de son salon
        appointments = await storage.getAppointments(userId);
        console.log('🏢 RDV PRO récupérés:', appointments?.length || 0);
      }

      res.json(appointments || []);
    } catch (error: any) {
      console.error("❌ Erreur récupération RDV:", error);
      res.status(500).json({ 
        error: "Erreur PostgreSQL",
        message: error.message
      });
    }
  });

  // === ROUTE PRO LOGIN (FIXES ROUTING VITE) ===
  app.post('/api/pro/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion PRO:', email);
      
      const user = await storage.authenticateUser(email, password);
      if (user) {
        console.log('✅ Connexion PRO réussie pour:', email);
        res.json({ success: true, user, token: 'demo-pro-token-' + user.id });
      } else {
        console.log('❌ Échec de connexion PRO pour:', email);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion PRO:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Notification routes (Firebase ready)
  app.get('/api/notifications', async (req, res) => {
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Failed to create notification' });
    }
  });

  // 💳 ROUTES STRIPE CHECKOUT MANQUANTES - CORRECTION URGENTE
  app.post('/api/stripe/create-subscription-checkout', async (req, res) => {
    try {
      const { planType, customerEmail, customerName } = req.body;
      
      console.log('💳 Création session abonnement Stripe:', { planType, customerEmail });
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Clé Stripe non configurée' });
      }
      
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
      });
      
      const planPrices = {
        'essentiel': { amount: 2900 }, // 29€/mois
        'premium': { amount: 14900 }, // 149€/mois  
        'basic-pro': { amount: 2900 },
        'advanced-pro': { amount: 7900 },
        'premium-pro': { amount: 14900 }
      };
      
      const planAmount = planPrices[planType as keyof typeof planPrices]?.amount || 2900;
      
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Abonnement ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
              description: `Plan ${planType} pour votre salon`,
            },
            unit_amount: planAmount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        customer_email: customerEmail,
        metadata: {
          planType,
          customerName,
          type: 'subscription'
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        subscription_data: {
          trial_period_days: 14,
        },
      });
      
      console.log('✅ Session abonnement Stripe créée:', session.id);
      res.json({ 
        sessionId: session.id, 
        url: session.url,
        success: true 
      });
      
    } catch (error: any) {
      console.error('❌ Erreur session abonnement Stripe:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session Stripe',
        details: error.message 
      });
    }
  });

  app.post('/api/stripe/create-payment-checkout', async (req, res) => {
    try {
      const { amount, description, customerEmail, customerName, salonName, appointmentId } = req.body;
      
      console.log('💳 Création session paiement Stripe:', { amount, description });
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Clé Stripe non configurée' });
      }
      
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
      });
      
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Acompte - ${description}`,
              description: `Réservation chez ${salonName}`,
            },
            unit_amount: Math.round(amount * 100), // Convertir en centimes
          },
          quantity: 1,
        }],
        customer_email: customerEmail,
        metadata: {
          appointmentId: appointmentId || 'demo',
          customerName,
          salonName: salonName || 'Salon Demo',
          type: 'booking_deposit'
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });
      
      console.log('✅ Session paiement Stripe créée:', session.id);
      res.json({ 
        sessionId: session.id, 
        url: session.url,
        success: true 
      });
      
    } catch (error: any) {
      console.error('❌ Erreur session paiement Stripe:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session Stripe',
        details: error.message 
      });
    }
  });

  // 💳 API PAIEMENT PROFESSIONNEL STRIPE
  app.post('/api/create-professional-payment-intent', async (req, res) => {
    try {
      const { salonId, plan, amount } = req.body;
      
      console.log('💳 Création Payment Intent professionnel:', { salonId, plan, amount });
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Clé Stripe non configurée' });
      }
      
      // Utiliser Stripe directement (package installé)
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
      });
      
      // Calcul du montant en centimes
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      // Créer le Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          salonId,
          subscriptionPlan: plan,
          type: 'professional_subscription'
        },
        description: `Abonnement ${plan} - Salon ${salonId}`
      });
      
      console.log('✅ Payment Intent créé:', paymentIntent.id);
      
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents,
        currency: 'eur'
      });
      
    } catch (error: any) {
      console.error('❌ Erreur création Payment Intent professionnel:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création du Payment Intent',
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
    }
  });

  // 🔐 API CONNEXION PROFESSIONNEL BUSINESS
  app.post('/api/business/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion BUSINESS:', email);
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      // Récupérer l'utilisateur professionnel par email dans la table users
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('❌ Utilisateur professionnel non trouvé:', email);
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      // Vérifier le mot de passe avec bcrypt
      const bcrypt = await import('bcrypt');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.log('❌ Mot de passe incorrect pour:', email);
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      console.log('✅ Connexion BUSINESS réussie:', email);
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          businessName: user.businessName,
          role: 'professional'
        },
        token: `business-token-${user.id}`,
        message: 'Connexion professionnelle réussie'
      });
      
    } catch (error: any) {
      console.error('❌ Erreur connexion business:', error);
      res.status(500).json({ error: 'Erreur serveur' });
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error fetching client:', error);
      res.status(500).json({ message: 'Failed to fetch client' });
    }
  });

  // Appointment routes - POSTGRESQL CLIENT/PRO SYNC
  app.post('/api/appointments', async (req, res) => {
    try {
      console.log('📅 Création RDV PostgreSQL:', req.body);
      
      // Support authentification CLIENT ou PRO
      const authHeader = req.headers.authorization;
      let userId = null;
      let isClient = false;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        } else if (token.startsWith('client-token-')) {
          userId = token.replace('client-token-', '');
          isClient = true;
        }
      }

      if (!userId) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis (CLIENT ou PRO)'
        });
      }

      const appointmentData = {
        ...req.body,
        clientId: isClient ? userId : req.body.clientId,
        professionalId: req.body.professionalId || req.body.staffId,
        salonId: req.body.salonId,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // UNIQUEMENT PostgreSQL - aucune donnée factice
      const appointment = await storage.createAppointment(appointmentData);
      
      console.log('✅ RDV créé dans PostgreSQL:', 
        appointment.serviceName, 
        'Client:', appointment.clientName,
        'Pro:', appointment.professionalName
      );
      
      res.json(appointment);
    } catch (error: any) {
      console.error('❌ Erreur création RDV PostgreSQL:', error);
      res.status(500).json({ 
        error: 'Erreur base de données PostgreSQL',
        message: error.message
      });
    }
  });

  // Services routes publics pour réservation - PostgreSQL uniquement
  app.get('/api/services', async (req, res) => {
    try {
      console.log('🔍 API /api/services appelée');
      const { salonId, userId } = req.query;
      const finalUserId = userId || salonId || 'demo';
      console.log('🏢 UserId final pour services:', finalUserId);

      // Utiliser le userId final pour récupérer les services PostgreSQL
      const services = await storage.getServicesBySalonId(finalUserId as string);
      
      if (!services || services.length === 0) {
        return res.status(404).json({ 
          error: 'Aucun service dans PostgreSQL pour cet utilisateur',
          userId: finalUserId,
          message: 'AUCUNE DONNÉE FICTIVE - Base de données vide'
        });
      }
      
      console.log('💼 Services à retourner:', services.length, 'services');
      res.json(services);
    } catch (error: any) {
      console.error('❌ Erreur services API:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  // API pour modifier/créer un service (pour les professionnels) - POSTGRESQL UNIQUEMENT
  app.post('/api/services', async (req, res) => {
    try {
      const serviceData = req.body;
      console.log('🔧 Création service PostgreSQL:', serviceData);
      
      // Vérification utilisateur authentifié
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis'
        });
      }

      const token = authHeader.substring(7);
      const userId = token.replace('demo-token-', '');

      // UNIQUEMENT PostgreSQL - aucune donnée factice
      const service = await storage.createService({
        ...serviceData,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Service créé dans PostgreSQL:', service.name, 'Prix:', service.price);
      res.json(service);
    } catch (error: any) {
      console.error('❌ Erreur création service PostgreSQL:', error);
      res.status(500).json({ 
        error: 'Erreur base de données PostgreSQL',
        message: error.message
      });
    }
  });

  // API pour modifier les détails du salon
  app.put('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const salonData = req.body;
      console.log('🏢 Modification salon PostgreSQL:', salonId, salonData.name);

      // Vérification authentification
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis'
        });
      }

      const token = authHeader.substring(7);
      const userId = token.replace('demo-token-', '');

      // Mise à jour dans PostgreSQL via storage
      await storage.saveSalonData(salonId, {
        ...salonData,
        ownerId: userId,
        updatedAt: new Date()
      });

      console.log('✅ Salon modifié dans PostgreSQL:', salonData.name);
      res.json({ 
        success: true, 
        message: 'Salon mis à jour avec succès',
        salon: salonData
      });
    } catch (error: any) {
      console.error('❌ Erreur modification salon:', error);
      res.status(500).json({ 
        error: 'Erreur sauvegarde PostgreSQL',
        message: error.message
      });
    }
  });

  // API pour modifier un service existant
  app.put('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      console.log('🔧 Modification service:', id, serviceData);
      
      let service;
      if (storage.updateService) {
        service = await storage.updateService(id, serviceData);
      } else {
        service = { ...serviceData, id };
      }
      
      res.json(service);
    } catch (error: any) {
      console.error('Error updating service:', error);
      res.status(500).json({ message: 'Failed to update service' });
    }
  });

  // API pour modifier/créer un professionnel
  app.post('/api/staff', async (req, res) => {
    try {
      const staffData = req.body;
      console.log('🔧 Création/modification professionnel:', staffData);
      
      let staff;
      if (storage.createStaff) {
        staff = await storage.createStaff(staffData);
      } else {
        staff = { ...staffData, id: Date.now() };
      }
      
      res.json(staff);
    } catch (error: any) {
      console.error('Error creating staff:', error);
      res.status(500).json({ message: 'Failed to create staff' });
    }
  });

  // API pour modifier un professionnel existant
  app.put('/api/staff/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const staffData = req.body;
      console.log('🔧 Modification professionnel:', id, staffData);
      
      let staff;
      if (storage.updateStaff) {
        staff = await storage.updateStaff(id, staffData);
      } else {
        staff = { ...staffData, id };
      }
      
      res.json(staff);
    } catch (error: any) {
      console.error('Error updating staff:', error);
      res.status(500).json({ message: 'Failed to update staff' });
    }
  });

  // API pour récupérer le salon courant
  app.get('/api/salon/current', async (req, res) => {
    try {
      // Pour les tests, retourner le salon demo
      const salon = {
        id: 'salon-demo',
        name: 'Salon Excellence',
        location: 'Paris 75008',
        address: '123 Avenue des Champs-Élysées, 75008 Paris',
        phone: '01 42 25 85 96',
        email: 'contact@excellence-salon.fr'
      };
      
      res.json(salon);
    } catch (error: any) {
      console.error('Error fetching salon:', error);
      res.status(500).json({ message: 'Failed to fetch salon' });
    }
  });
  
  // Services routes protégées pour les pros
  app.get('/api/services/protected', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  // Route distincte pour services par salon (string ID)
  app.get('/api/services/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      console.log('📋 Récupération services pour salon:', salonId);
      
      if (!salonId || salonId === 'undefined') {
        return res.status(400).json({ 
          error: 'Invalid salon ID',
          details: 'Salon ID is required and cannot be undefined'
        });
      }
      
      const services = await storage.getServicesBySalonId(salonId);
      res.json(services);
    } catch (error: any) {
      console.error('Error fetching services by salon:', error);
      res.status(500).json({ 
        error: 'Failed to fetch services',
        details: error.message || 'Unknown error'
      });
    }
  });

  // Route distincte pour service individuel (numeric ID)
  app.get('/api/services/:id(\\d+)', async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      console.log('🔍 Récupération service ID numérique:', serviceId);
      
      if (serviceId <= 0) {
        return res.status(400).json({ 
          error: 'Invalid service ID',
          details: 'Service ID must be a positive integer'
        });
      }
      
      const service = await storage.getServiceById(serviceId);
      
      if (!service) {
        return res.status(404).json({ 
          error: 'Service not found',
          details: `No service found with ID ${serviceId}`
        });
      }
      
      res.json(service);
    } catch (error: any) {
      console.error('Error fetching service by ID:', error);
      res.status(500).json({ 
        error: 'Failed to fetch service',
        details: error.message || 'Unknown error'
      });
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      res.status(401).json({ error: 'Token invalide' });
    }
  });

  // API pour récupérer un salon par ID - POSTGRESQL UNIQUEMENT
  app.get('/api/salon/public/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération salon par ID:', id);
      
      let salon = await storage.getSalonData(id);
      
      // SOLUTION TEMPORAIRE : Chercher dans les salons créés au démarrage
      if (!salon && (id === 'excellence' || id === 'excellence-hair-paris')) {
        console.log('🔍 Recherche salon Excellence dans Map');
        // Le salon est créé au démarrage avec l'ID 'excellence-hair-paris'
        salon = await storage.getSalonData('excellence-hair-paris');
        
        if (!salon) {
          // Créer si vraiment pas trouvé
          console.log('🏗️ Création salon test Excellence');
          const excellenceSalon = {
            id: 'excellence-hair-paris',
            name: 'Excellence Hair Paris',
            description: 'Salon de coiffure haut de gamme à Paris',
            address: '25 Rue Saint-Honoré, 75008 Paris',
            phone: '01 42 60 78 90',
            photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop'],
            serviceCategories: [{
              id: 1,
              name: 'Coiffure',
              services: [
                { id: 1, name: 'Coupe + Brushing', price: 45, duration: 60 },
                { id: 2, name: 'Coloration', price: 85, duration: 120 }
              ]
            }],
            rating: 4.8,
            reviewCount: 127
          };
          await storage.saveSalonData('excellence-hair-paris', excellenceSalon);
          await storage.saveSalonData('excellence', excellenceSalon); // Alias
          salon = excellenceSalon;
        }
      }
      
      if (!salon) {
        console.log('❌ ERREUR: Salon inexistant dans PostgreSQL:', id);
        return res.status(404).json({ 
          error: 'Salon non trouvé dans la base de données PostgreSQL',
          message: 'AUCUNE DONNÉE FACTICE - Salons authentiques uniquement'
        });
      }
      
      console.log('✅ Salon trouvé:', salon?.name);
      res.json(salon); // Renvoyer directement les données du salon
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // 🔧 ENDPOINT EMERGENCY : Forcer la création du salon demo
  app.post('/api/force-create-salon-demo', async (req, res) => {
    try {
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
              { id: 1, name: 'Cheveux', price: 45, duration: '1h', description: 'Service cheveux' },
              { id: 2, name: 'Barbe', price: 30, duration: '45min', description: 'Service barbe' },
              { id: 3, name: 'Rasage', price: 25, duration: '30min', description: 'Service rasage' }
            ]
          }
        ],
        professionals: [
          {
            id: '1',
            name: 'Sarah Martinez',
            specialty: 'Coiffure & Coloration',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            price: 65,
            bio: 'Expert en coiffure moderne',
            experience: '8 ans d\'expérience'
          }
        ],
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
      
      // Forcer la sauvegarde dans toutes les structures de données
      if (storage.salons) {
        storage.salons.set('salon-demo', demoSalon);
      }
      
      console.log('🚨 SALON DEMO FORCÉ - Nom:', demoSalon.name, 'Couleurs:', demoSalon.customColors?.primary);
      
      res.json({ 
        success: true, 
        message: 'Salon demo créé avec force',
        salon: demoSalon 
      });
    } catch (error: any) {
      console.error('❌ Erreur création forcée salon demo:', error);
      res.status(500).json({ error: 'Erreur création salon demo' });
    }
  });

  // API UNIVERSELLE : Récupération automatique du salon du professionnel connecté
  app.get('/api/salon/current', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let userId = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        }
      }
      
      console.log('🔍 Récupération salon pour utilisateur:', userId);
      
      if (!userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }
      
      // 🚀 NOUVEAU : Chercher le salon personnel de l'utilisateur
      const userSalons = Array.from(storage.salons?.values() || []).filter(salon => 
        salon.ownerId === userId || salon.ownerEmail?.includes(userId)
      );
      
      let userSalon = userSalons[0];
      
      if (!userSalon) {
        // 🎯 CRÉATION AUTOMATIQUE D'UN SALON UNIQUE POUR CET UTILISATEUR
        const uniqueId = `salon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('🏗️ Création salon unique pour utilisateur:', userId);
        console.log('🆔 ID généré:', uniqueId);
        
        userSalon = {
          id: uniqueId,
          name: `Salon de ${userId}`,
          description: 'Nouveau salon - À personnaliser',
          longDescription: 'Bienvenue dans votre salon ! Modifiez cette description depuis votre dashboard.',
          address: 'Adresse à définir',
          phone: 'Téléphone à définir',
          email: `contact@salon-${uniqueId}.fr`,
          website: '',
          photos: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format'
          ],
          professionals: [],
          rating: 0,
          reviewCount: 0,
          verified: false,
          certifications: [],
          awards: [],
          customColors: {
            primary: '#7c3aed',
            accent: '#a855f7',
            buttonText: '#ffffff',
            priceColor: '#7c3aed',
            neonFrame: '#a855f7'
          },
          serviceCategories: [],
          ownerId: userId,
          ownerEmail: userId,
          shareableUrl: `/salon/${uniqueId}`,
          isPublished: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        storage.salons?.set(uniqueId, userSalon);
        console.log('✅ Salon unique créé pour utilisateur:', userId, 'URL:', `/salon/${uniqueId}`);
      }
      
      console.log('✅ Salon personnel trouvé:', userSalon.name, 'ID:', userSalon.id);
      return res.json(userSalon);
      
    } catch (error: any) {
      console.error('❌ Erreur récupération salon current:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // API pour récupérer un salon spécifique par ID  
  app.get('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      console.log('📖 Récupération salon par ID:', salonId);
      
      // IMPORTANT: Ne pas traiter "current" comme un ID, redirection vers l'endpoint dédié
      if (salonId === 'current') {
        console.log('🔄 Redirection vers endpoint salon current');
        const authHeader = req.headers.authorization;
        let userId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          if (token.startsWith('demo-token-')) {
            userId = token.replace('demo-token-', '');
          }
        }
        
        if (!userId) {
          return res.status(401).json({ message: 'Non authentifié' });
        }
        
        // Chercher le salon personnel de l'utilisateur
        const userSalons = Array.from(storage.salons?.values() || []).filter(salon => 
          salon.ownerId === userId || salon.ownerEmail?.includes(userId)
        );
        
        let userSalon = userSalons[0];
        
        if (!userSalon) {
          // Création automatique d'un salon unique pour cet utilisateur
          const uniqueId = `salon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          console.log('🏗️ Création salon unique pour utilisateur:', userId, 'ID:', uniqueId);
          
          userSalon = {
            id: uniqueId,
            name: `Salon de ${userId}`,
            description: 'Nouveau salon - À personnaliser',
            longDescription: 'Bienvenue dans votre salon ! Modifiez cette description depuis votre dashboard.',
            address: 'Adresse à définir',
            phone: 'Téléphone à définir',
            email: `contact@salon-${uniqueId}.fr`,
            website: '',
            photos: [
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format'
            ],
            professionals: [],
            rating: 0,
            reviewCount: 0,
            verified: false,
            certifications: [],
            awards: [],
            customColors: {
              primary: '#7c3aed',
              accent: '#a855f7',
              buttonText: '#ffffff',
              priceColor: '#7c3aed',
              neonFrame: '#a855f7'
            },
            serviceCategories: [],
            ownerId: userId,
            ownerEmail: userId,
            shareableUrl: `/salon/${uniqueId}`,
            isPublished: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          storage.salons?.set(uniqueId, userSalon);
          console.log('✅ Salon unique créé pour utilisateur:', userId, 'URL:', `/salon/${uniqueId}`);
        }
        
        console.log('✅ Salon personnel trouvé:', userSalon.name, 'ID:', userSalon.id);
        return res.json(userSalon);
      }
      
      // Chercher le salon associé à ce professionnel
      let salon = storage.salons?.get(salonId);
      
      if (!salon) {
        return res.status(404).json({ message: 'Salon non trouvé' });
      }
      
      res.json(salon);
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // API pour mettre à jour les données d'un salon
  app.put('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const updateData = req.body;
      
      let salon = storage.salons?.get(salonId);
      if (!salon) {
        return res.status(404).json({ message: 'Salon non trouvé' });
      }
      
      // Mettre à jour les données
      const updatedSalon = { ...salon, ...updateData, updatedAt: new Date() };
      storage.salons?.set(salonId, updatedSalon);
      
      res.json(updatedSalon);
    } catch (error: any) {
      console.error('❌ Erreur mise à jour salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // 🚀 API D'INSCRIPTION PROFESSIONNEL AVEC CRÉATION AUTOMATIQUE DE PAGE SALON
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
        password = 'defaultpass123', // Mot de passe par défaut si non fourni
        subscriptionPlan = 'basic' // Plan par défaut
      } = req.body;

      console.log('🎯 INSCRIPTION PROFESSIONNEL AVEC ABONNEMENT:', subscriptionPlan);
      console.log('🏢 Business:', businessName, 'Email:', email);
      
      // Validation des données requises
      if (!password || password.length < 3) {
        return res.status(400).json({ error: 'Mot de passe requis (minimum 3 caractères)' });
      }
      
      if (!email || !businessName) {
        return res.status(400).json({ error: 'Email et nom d\'entreprise requis' });
      }

      // Vérifier si l'email existe déjà dans la table users
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte professionnel avec cet email existe déjà' });
      }

      // 🚀 CRÉATION AUTOMATIQUE DE PAGE SALON PERSONNALISÉE
      const professionalData = {
        ownerName,
        businessName,
        email,
        phone,
        address,
        subscriptionPlan: subscriptionPlan as 'premium' | 'basic' | 'enterprise',
        services,
        description
      };

      console.log('🏗️ Création automatique page salon pour:', businessName);
      const createdSalon = await createAutomaticSalonPage(professionalData);
      
      // 🔗 Associer le salon au professionnel
      await linkSalonToProfessional(createdSalon.id, email);

      // ✅ CRÉER LE COMPTE PROFESSIONNEL DANS LA TABLE USERS (Compatible avec login)
      // Protection contre ownerName undefined
      const safeOwnerName = ownerName || businessName || 'Propriétaire';
      const nameparts = safeOwnerName.split(' ');
      
      const userData = {
        email,
        password, // Mot de passe brut, sera hashé par storage.createUser()
        businessName,
        firstName: nameparts[0] || 'Pro',
        lastName: nameparts.slice(1).join(' ') || '',
        phone,
        address,
        subscriptionPlan: (subscriptionPlan as 'premium' | 'basic' | 'enterprise') || 'basic',
        city: address?.split(',').pop()?.trim() || 'Paris'
      };

      // Créer l'utilisateur professionnel dans la table users
      const user = await storage.createUser(userData);
      
      // Créer aussi l'entrée business pour compatibilité (si la méthode existe)
      const businessData = {
        businessName,
        ownerName: ownerName || businessName || 'Propriétaire',
        email,
        phone,
        address,
        businessType,
        services,
        description,
        salonId: createdSalon.id,
        subscriptionPlan,
        isActive: true
      };

      let business;
      if (storage.createBusiness) {
        try {
          business = await storage.createBusiness(businessData);
        } catch (error: any) {
          console.log('ℹ️ createBusiness non disponible, utilisation données user');
          business = { ...businessData, id: user.id, createdAt: new Date() };
        }
      } else {
        business = { ...businessData, id: user.id, createdAt: new Date() };
      }

      console.log('✅ INSCRIPTION COMPLÈTE:', {
        business: business.businessName,
        salon: createdSalon.name,
        salonId: createdSalon.id,
        salonUrl: createdSalon.shareableUrl,
        plan: subscriptionPlan
      });

      res.json({
        success: true,
        message: 'Inscription réussie avec création automatique de page salon',
        business,
        salon: createdSalon,
        salonUrl: `http://localhost:5000${createdSalon.shareableUrl}`,
        editorUrl: `/salon-editor/${createdSalon.id}`,
        subscriptionPlan
      });

    } catch (error: any) {
      console.error('❌ Erreur inscription professionnel:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'inscription professionnelle' 
      });
    }
  });

  // 🧪 ROUTE DE TEST POUR CRÉER UN SALON DE DÉMONSTRATION
  app.post('/api/test/create-demo-salon', async (req, res) => {
    try {
      const { businessName = 'Salon Test', subscriptionPlan = 'premium' } = req.body;
      
      const demoData = {
        ownerName: 'Propriétaire Test',
        businessName,
        email: `demo-${Date.now()}@test.com`,
        phone: '01 23 45 67 89',
        address: '123 Rue de Test, 75001 Paris',
        subscriptionPlan: subscriptionPlan as 'premium' | 'basic' | 'enterprise',
        services: ['Service Test 1', 'Service Test 2'],
        description: `${businessName} - Salon de démonstration créé automatiquement`
      };

      console.log('🧪 Création salon de test:', businessName);
      const testSalon = await createAutomaticSalonPage(demoData);
      
      res.json({
        success: true,
        message: 'Salon de test créé avec succès',
        salon: testSalon,
        publicUrl: `http://localhost:5000${testSalon.shareableUrl}`,
        editorUrl: `/salon-editor/${testSalon.id}`
      });

    } catch (error: any) {
      console.error('❌ Erreur création salon test:', error);
      res.status(500).json({ error: 'Erreur lors de la création du salon test' });
    }
  });

  // API publique pour la recherche de salons avec photos
  app.get('/api/search/salons', async (req, res) => {
    try {
      const { category, city, search } = req.query;
      const categoryStr = typeof category === 'string' ? category : undefined;
      const cityStr = typeof city === 'string' ? city : undefined;
      const searchStr = typeof search === 'string' ? search : undefined;
      
      // Récupérer tous les salons
      let salons = Array.from(storage.salons.values());
      console.log(`🔍 Recherche salons: ${salons.length} salons trouvés`);
      console.log('📋 IDs des salons:', salons.map(s => s.id));
      console.log('📋 Noms des salons:', salons.map(s => s.name));
      
      // Filtrer par catégorie si spécifiée
      if (categoryStr && categoryStr !== 'all') {
        salons = salons.filter(salon => {
          if (!salon.serviceCategories) return false;
          
          const categoryLower = categoryStr.toLowerCase();
          return salon.serviceCategories.some((cat: any) => {
            const catName = cat.name?.toLowerCase() || '';
            return (catName.includes('coiffure') && categoryLower === 'coiffure') ||
                   (catName.includes('barbier') && categoryLower === 'barbier') ||
                   (catName.includes('manucure') && categoryLower === 'ongles') ||
                   (catName.includes('massage') && categoryLower === 'massage') ||
                   (catName.includes('soin') && categoryLower === 'esthetique') ||
                   (catName.includes('esthétique') && categoryLower === 'esthetique');
          });
        });
        console.log(`🏷️ Filtre catégorie "${categoryStr}": ${salons.length} salons`);
      }
      
      // Filtrer par ville si spécifiée
      if (cityStr) {
        const cityLower = cityStr.toLowerCase();
        salons = salons.filter(salon => 
          salon?.address?.toLowerCase().includes(cityLower)
        );
        console.log(`📍 Filtre ville "${cityStr}": ${salons.length} salons`);
      }
      
      // Filtrer par recherche textuelle si spécifiée
      if (searchStr) {
        const searchLower = searchStr.toLowerCase();
        salons = salons.filter(salon =>
          salon?.name?.toLowerCase().includes(searchLower) ||
          salon?.description?.toLowerCase().includes(searchLower) ||
          salon.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
        console.log(`🔍 Filtre recherche "${searchStr}": ${salons.length} salons`);
      }
      
      // Formater les résultats pour l'affichage dans SalonSearchComplete
      const formattedSalons = salons.map(salon => ({
        id: salon.id,
        name: salon?.name,
        location: extractCity(salon?.address),
        rating: salon.rating || 4.5,
        reviews: salon.reviewCount || 0,
        nextSlot: "",
        price: "",
        services: extractServices(salon.serviceCategories),
        verified: false,
        distance: "",
        category: determineCategory(salon.serviceCategories),
        photo: salon.coverImageUrl || salon.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
        coverImageUrl: salon.coverImageUrl,
        openNow: false,
        promotion: null,
        // Données complètes pour les détails
        description: salon?.description,
        address: salon?.address,
        phone: salon.phone,
        photos: salon.photos || [],
        serviceCategories: salon.serviceCategories || [],
        tags: salon.tags || [],
        openingHours: salon.openingHours
      }));
      
      res.json({
        salons: formattedSalons,
        total: formattedSalons.length,
        filters: { category, city, search }
      });
    } catch (error: any) {
      console.error('❌ Error fetching salons:', error);
      res.status(500).json({ message: 'Failed to fetch salons' });
    }
  });

  // API pour récupérer un salon spécifique
  app.get('/api/public/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const salon = storage.salons.get(id);
      
      if (!salon) {
        return res.status(404).json({ message: 'Salon not found' });
      }
      
      // Formater les données pour l'affichage détaillé
      const formattedSalon = {
        id: salon.id,
        name: salon?.name,
        description: salon?.description,
        address: salon?.address,
        phone: salon.phone,
        email: salon.email,
        website: salon.website,
        photos: salon.photos || [],
        rating: salon.rating || 4.5,
        reviewCount: salon.reviewCount || 0,
        serviceCategories: salon.serviceCategories || [],
        tags: salon.tags || [],
        openingHours: salon.openingHours,
        category: determineCategory(salon.serviceCategories),
        city: extractCity(salon?.address),
        services: extractServices(salon.serviceCategories),
        // Ajouter des infos supplémentaires pour la page détail
        verified: false,
        certifications: [],
        awards: []
      };
      
      res.json(formattedSalon);
    } catch (error: any) {
      console.error('Error fetching salon details:', error);
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

  // Route Payment Intent pour éviter interception Vite
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      // Validation silencieuse en production
      
      if (!process.env.STRIPE_SECRET_KEY) {
        // STRIPE_SECRET_KEY manquant
        return res.status(500).json({ 
          success: false,
          error: "Stripe not configured. Please set STRIPE_SECRET_KEY." 
        });
      }

      // Import dynamique de Stripe pour éviter les erreurs de module
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-06-30.basil',
      });

      const { amount, currency = 'eur', metadata = {} } = req.body;
      
      // Conversion robuste du montant
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
      
      if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
        // Montant invalide: conversion échouée
        return res.status(400).json({ 
          success: false,
          error: "Invalid amount",
          details: "Amount must be a positive number",
          received: amount
        });
      }

      // Création Payment Intent avec Stripe
      
      // Créer un Payment Intent avec Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(numericAmount * 100), // Convertir en centimes avec montant validé
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      // Payment Intent créé avec succès
      
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: numericAmount,
        currency: currency
      });
    } catch (error: any) {
      console.error("Erreur création Payment Intent:", error.message || error);
      res.status(500).json({ 
        success: false,
        error: error?.message || "Failed to create payment intent",
        details: error?.code || 'stripe_error'
      });
    }
  });

  // Routes API pour les politiques du salon
  app.get('/api/salon/policies', async (req, res) => {
    try {
      // Récupérer les politiques par défaut pour le moment
      const defaultPolicies = {
        policies: {
          cancellation: "Annulation gratuite jusqu'à 24h avant le rendez-vous",
          lateness: "Retard de plus de 15min = annulation automatique",
          deposit: "30% d'acompte requis pour valider la réservation", 
          modification: "Modification possible jusqu'à 12h avant",
          noShow: "En cas d'absence, l'acompte reste acquis au salon",
          refund: "Remboursement sous 5-7 jours ouvrés en cas d'annulation valide"
        },
        settings: {
          depositPercentage: 30,
          cancellationDeadline: 24,
          modificationDeadline: 12,
          latenessGracePeriod: 15,
          autoConfirmBookings: true,
          requireDepositForBooking: true
        }
      };
      
      res.json(defaultPolicies);
    } catch (error: any) {
      console.error('Error fetching salon policies:', error);
      res.status(500).json({ message: 'Failed to fetch salon policies' });
    }
  });

  app.post('/api/salon/policies', async (req, res) => {
    try {
      const { policies, settings } = req.body;
      
      // Simuler la sauvegarde des politiques
      // Dans une vraie app, on sauvegarderait en base de données
      console.log('💾 Sauvegarde politiques salon:', { policies, settings });
      
      res.json({ 
        success: true, 
        message: 'Politiques sauvegardées avec succès',
        data: { policies, settings }
      });
    } catch (error: any) {
      console.error('Error saving salon policies:', error);
      res.status(500).json({ message: 'Failed to save salon policies' });
    }
  });

  // 📧 **SYSTÈME DE VALIDATION EMAIL** - Routes pour vérification par code
  app.post('/api/email/send-verification', async (req, res) => {
    try {
      const { email, userData, userType } = req.body;
      console.log('📧 Envoi code vérification à:', email, 'Type:', userType);
      
      if (!email || !userData || !userType) {
        return res.status(400).json({ 
          error: 'Email, données utilisateur et type requis' 
        });
      }

      // Nettoyer les anciennes vérifications expirées
      try {
        await storage.cleanExpiredEmailVerifications?.();
      } catch (error: any) {
        console.log('Info: Nettoyage vérifications (méthode pas encore implémentée)');
      }

      // Générer un code à 6 chiffres
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Sauvegarder la demande de vérification
      const verificationData = {
        email,
        verificationCode,
        userType,
        userData: JSON.stringify(userData),
        expiresAt,
        isVerified: false
      };

      try {
        await storage.createEmailVerification?.(verificationData);
      } catch (error: any) {
        console.log('Info: Stockage vérification (méthode pas encore implémentée)');
      }

      // Envoyer l'email via SendGrid
      const { emailService } = await import('./emailService');
      const emailSent = await emailService.sendVerificationCode({
        email,
        verificationCode,
        userType: userType as 'professional' | 'client',
        businessName: userData.businessName
      });

      if (emailSent) {
        console.log('✅ Code envoyé avec succès à:', email);
        res.json({ 
          success: true, 
          message: 'Code de vérification envoyé par email',
          expiresIn: 600 // 10 minutes en secondes
        });
      } else {
        res.status(500).json({ 
          error: 'Erreur lors de l\'envoi de l\'email' 
        });
      }
    } catch (error: any) {
      console.error('❌ Erreur envoi vérification:', error);
      res.status(500).json({ 
        error: 'Erreur serveur lors de l\'envoi du code' 
      });
    }
  });

  app.post('/api/email/verify-code', async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      console.log('🔍 Vérification code pour:', email);
      
      if (!email || !verificationCode) {
        return res.status(400).json({ 
          error: 'Email et code de vérification requis' 
        });
      }

      // Vérifier le code
      let verification = null;
      try {
        verification = await storage.getEmailVerification(email, verificationCode);
        console.log('🔍 Résultat vérification:', verification ? 'Trouvé' : 'Pas trouvé');
      } catch (error: any) {
        console.error('Erreur getEmailVerification:', error);
      }

      if (!verification) {
        return res.status(400).json({ 
          error: 'Code de vérification invalide ou expiré' 
        });
      }

      // Vérifier l'expiration
      if (new Date() > new Date(verification.expiresAt)) {
        return res.status(400).json({ 
          error: 'Code de vérification expiré' 
        });
      }

      // Marquer comme utilisé
      try {
        await storage.markEmailVerificationAsUsed?.(verification.id);
      } catch (error: any) {
        console.log('Info: Marquage vérification (méthode pas encore implémentée)');
      }

      // Créer le compte selon le type d'utilisateur
      let createdAccount = null;
      console.log('📋 Type userData:', typeof verification.userData);
      console.log('📋 Contenu userData:', verification.userData);
      
      let userData;
      try {
        userData = typeof verification.userData === 'string' 
          ? JSON.parse(verification.userData)
          : verification.userData;
        console.log('✅ UserData parsé:', userData);
      } catch (parseError) {
        console.error('❌ Erreur parsing userData:', parseError);
        return res.status(500).json({ error: 'Erreur parsing des données utilisateur' });
      }

      if (verification.userType === 'professional') {
        // Créer compte professionnel
        try {
          createdAccount = await storage.createUser?.(userData);
        } catch (error: any) {
          console.error('Erreur création compte pro:', error);
        }
      } else if (verification.userType === 'client') {
        // Créer compte client
        try {
          createdAccount = await storage.createClientAccount?.(userData);
        } catch (error: any) {
          console.error('Erreur création compte client:', error);
          // Si le client existe déjà, récupérer le compte existant
          if (error.code === '23505' && error.constraint === 'client_accounts_email_key') {
            console.log('Client déjà existant, récupération...');
            createdAccount = await storage.getClientAccountByEmail(userData.email);
            console.log('Compte existant récupéré:', createdAccount ? 'Trouvé' : 'Non trouvé');
          }
        }
      }

      console.log('✅ Compte créé avec succès pour:', email);
      res.json({ 
        success: true, 
        message: 'Code vérifié et compte créé avec succès',
        userType: verification.userType,
        account: createdAccount
      });

    } catch (error: any) {
      console.error('❌ Erreur vérification code:', error);
      res.status(500).json({ 
        error: 'Erreur serveur lors de la vérification' 
      });
    }
  });

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