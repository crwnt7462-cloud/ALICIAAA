import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createAutomaticSalonPage, linkSalonToProfessional } from './autoSalonCreation';
import { aiService } from "./aiService";
import { clientAnalyticsService, type ClientProfile } from "./clientAnalyticsService";

export async function registerFullStackRoutes(app: Express): Promise<Server> {
  
  // ============= CORE SALON ROUTES =============
  
  app.get('/api/user/salon', async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
      const demoSalon = await storage.getSalon('salon-demo');
      if (demoSalon) {
        return res.status(200).json(demoSalon);
      } else {
        return res.status(404).json({ error: 'Salon not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/user/subscription', async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    try {
      const authHeader = req.headers.authorization;
      let userId = null;

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        }
      }

      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userSubscription = {
        plan: 'premium-pro',
        status: 'active',
        features: [
          'unlimited_bookings',
          'ai_assistant',
          'advanced_analytics',
          'priority_support'
        ],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      };

      return res.status(200).json(userSubscription);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // ============= AUTHENTICATION ROUTES =============
  
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = `demo-token-${user.id}`;
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          businessName: user.businessName,
          subscriptionPlan: user.subscriptionPlan
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  // ============= EMAIL VERIFICATION =============
  
  app.post('/api/send-verification-email', async (req, res) => {
    try {
      const { email, userType } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      // Demo verification code for development
      const verificationCode = '123456';
      
      res.json({ 
        success: true, 
        message: 'Verification code sent',
        code: verificationCode // Remove in production
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  });

  app.post('/api/verify-email', async (req, res) => {
    try {
      const { email, code, userType, userData } = req.body;
      
      if (!email || !code || !userType || !userData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Demo code verification
      if (code !== '123456') {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      if (userType === 'professional') {
        const professionalData = {
          businessName: userData.businessName,
          ownerName: `${userData.ownerFirstName} ${userData.ownerLastName}`,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          address: `${userData.address}, ${userData.city} ${userData.postalCode}`,
          businessType: 'salon',
          subscriptionPlan: userData.planType || 'basic-pro',
          services: [],
          description: '',
          city: userData.city,
          postalCode: userData.postalCode,
          legalForm: userData.legalForm,
          vatNumber: userData.vatNumber || '',
          siret: userData.siret
        };

        // Create salon page
        const createdSalon = await createAutomaticSalonPage(professionalData);
        await linkSalonToProfessional(createdSalon.id, email);

        // Create user account
        const userAccountData = {
          email: userData.email,
          password: userData.password,
          businessName: userData.businessName,
          firstName: userData.ownerFirstName,
          lastName: userData.ownerLastName,
          phone: userData.phone,
          address: `${userData.address}, ${userData.city} ${userData.postalCode}`,
          subscriptionPlan: userData.planType || 'basic-pro'
        };

        const user = await storage.createUser(userAccountData);

        res.json({
          success: true,
          message: 'Account created successfully',
          account: {
            id: user.id,
            businessName: user.businessName,
            salonId: createdSalon.id,
            salonUrl: createdSalon.shareableUrl,
            subscriptionPlan: user.subscriptionPlan
          }
        });
      } else {
        // Client registration
        const clientData = {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || '',
          subscriptionPlan: 'free'
        };

        const user = await storage.createUser(clientData);

        res.json({
          success: true,
          message: 'Client account created successfully',
          account: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Account creation failed' });
    }
  });

  // ============= BUSINESS ROUTES =============
  
  app.get('/api/salons', async (req, res) => {
    try {
      const salons = Array.from(storage.salons?.values() || [])
        .filter(salon => salon.isPublished)
        .map(salon => ({
          id: salon.id,
          name: salon.name,
          description: salon.description,
          address: salon.address,
          city: salon.city,
          rating: salon.rating || 4.5,
          photo: salon.photos?.[0] || '',
          services: salon.services || [],
          priceRange: salon.priceRange || '€€'
        }));

      res.json(salons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch salons' });
    }
  });

  app.get('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const salon = storage.salons?.get(salonId);
      
      if (!salon) {
        return res.status(404).json({ error: 'Salon not found' });
      }
      
      res.json(salon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch salon' });
    }
  });

  app.put('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const updateData = req.body;
      
      let salon = storage.salons?.get(salonId);
      if (!salon) {
        return res.status(404).json({ error: 'Salon not found' });
      }
      
      const updatedSalon = { ...salon, ...updateData, updatedAt: new Date() };
      storage.salons?.set(salonId, updatedSalon);
      
      res.json(updatedSalon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update salon' });
    }
  });

  // ============= AI ASSISTANT ROUTES =============
  
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await aiService.processMessage(message, context);
      
      res.json({
        success: true,
        response: response.content,
        suggestions: response.suggestions || []
      });
    } catch (error) {
      res.status(500).json({ error: 'AI service unavailable' });
    }
  });

  // ============= HTTP SERVER SETUP =============
  
  const httpServer = createServer(app);
  return httpServer;
}