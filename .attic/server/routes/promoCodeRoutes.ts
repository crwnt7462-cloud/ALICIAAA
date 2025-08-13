import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../replitAuth';
import { z } from 'zod';

const router = Router();

// Schema for promo code creation/update
const promoCodeSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().min(5),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.number().min(1),
  validFrom: z.string().transform(str => new Date(str)),
  validUntil: z.string().transform(str => new Date(str)),
  maxUses: z.number().optional(),
  weekendPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  applicableServices: z.array(z.number()).optional(),
});

// Get all promo codes for a salon
router.get('/api/promo-codes', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const promoCodes = await storage.getPromoCodes(userId);
    res.json(promoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ message: 'Failed to fetch promo codes' });
  }
});

// Create new promo code
router.post('/api/promo-codes', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = promoCodeSchema.parse(req.body);
    
    const promoCode = await storage.createPromoCode({
      ...validatedData,
      salonId: userId,
      currentUses: 0,
    });
    
    res.status(201).json(promoCode);
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ message: 'Failed to create promo code' });
  }
});

// Update promo code
router.patch('/api/promo-codes/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const promoCodeId = parseInt(req.params.id);
    const validatedData = promoCodeSchema.partial().parse(req.body);
    
    const promoCode = await storage.updatePromoCode(promoCodeId, userId, validatedData);
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    
    res.json(promoCode);
  } catch (error) {
    console.error('Error updating promo code:', error);
    res.status(500).json({ message: 'Failed to update promo code' });
  }
});

// Delete promo code
router.delete('/api/promo-codes/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const promoCodeId = parseInt(req.params.id);
    
    const success = await storage.deletePromoCode(promoCodeId, userId);
    
    if (!success) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting promo code:', error);
    res.status(500).json({ message: 'Failed to delete promo code' });
  }
});

// Validate promo code for booking
router.post('/api/promo-codes/validate', async (req, res) => {
  try {
    const { code, serviceId, bookingDate, totalAmount } = req.body;
    
    const validation = await storage.validatePromoCode(code, {
      serviceId,
      bookingDate: new Date(bookingDate),
      totalAmount,
    });
    
    res.json(validation);
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ message: 'Failed to validate promo code' });
  }
});

export default router;