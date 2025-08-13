import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../replitAuth';
import { z } from 'zod';

const router = Router();

// Get client reliability data for a salon
router.get('/api/client-reliability', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const reliabilityData = await storage.getClientReliabilityData(userId);
    res.json(reliabilityData);
  } catch (error) {
    console.error('Error fetching client reliability data:', error);
    res.status(500).json({ message: 'Failed to fetch client reliability data' });
  }
});

// Update client reliability after appointment event
router.post('/api/client-reliability/update', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { clientId, eventType, appointmentId } = req.body;
    
    if (!clientId || !eventType) {
      return res.status(400).json({ message: 'Client ID and event type are required' });
    }
    
    const updatedReliability = await storage.updateClientReliability(userId, clientId, eventType, appointmentId);
    res.json(updatedReliability);
  } catch (error) {
    console.error('Error updating client reliability:', error);
    res.status(500).json({ message: 'Failed to update client reliability' });
  }
});

// Get recommended deposit percentage for a client
router.get('/api/client-reliability/:clientId/deposit-recommendation', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const clientId = req.params.clientId;
    const { servicePrice, isWeekendPremium } = req.query;
    
    const recommendation = await storage.getDepositRecommendation(userId, clientId, {
      servicePrice: parseFloat(servicePrice as string),
      isWeekendPremium: isWeekendPremium === 'true',
    });
    
    res.json(recommendation);
  } catch (error) {
    console.error('Error getting deposit recommendation:', error);
    res.status(500).json({ message: 'Failed to get deposit recommendation' });
  }
});

// Set custom deposit percentage for a client
router.post('/api/client-reliability/:clientId/custom-deposit', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const clientId = req.params.clientId;
    const { depositPercentage, reason } = req.body;
    
    if (depositPercentage < 0 || depositPercentage > 100) {
      return res.status(400).json({ message: 'Deposit percentage must be between 0 and 100' });
    }
    
    const updatedReliability = await storage.setCustomDepositPercentage(userId, clientId, depositPercentage, reason);
    res.json(updatedReliability);
  } catch (error) {
    console.error('Error setting custom deposit percentage:', error);
    res.status(500).json({ message: 'Failed to set custom deposit percentage' });
  }
});

// Get appointments that need deposit adjustments
router.get('/api/client-reliability/appointments-needing-attention', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const appointmentsWithRecommendations = await storage.getAppointmentsNeedingDepositAdjustment(userId);
    res.json(appointmentsWithRecommendations);
  } catch (error) {
    console.error('Error fetching appointments needing attention:', error);
    res.status(500).json({ message: 'Failed to fetch appointments needing attention' });
  }
});

export default router;