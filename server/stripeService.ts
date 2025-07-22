import Stripe from "stripe";

// Make Stripe optional - app can run without it
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export class StripeService {
  // Create payment intent for appointment deposit
  async createPaymentIntent(amount: number, metadata: any = {}) {
    if (!stripe) {
      throw new Error("Stripe non configuré - veuillez configurer STRIPE_SECRET_KEY");
    }
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          type: "appointment_deposit",
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return paymentIntent;
    } catch (error) {
      console.error("Stripe payment intent creation failed:", error);
      throw new Error("Impossible de créer l'intention de paiement");
    }
  }

  // Create customer for recurring clients
  async createCustomer(email: string, name: string) {
    if (!stripe) {
      throw new Error("Stripe non configuré - veuillez configurer STRIPE_SECRET_KEY");
    }
    
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      
      return customer;
    } catch (error) {
      console.error("Stripe customer creation failed:", error);
      throw new Error("Impossible de créer le client");
    }
  }

  // Retrieve payment intent
  async retrievePaymentIntent(paymentIntentId: string) {
    if (!stripe) {
      throw new Error("Stripe non configuré - veuillez configurer STRIPE_SECRET_KEY");
    }
    
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("Failed to retrieve payment intent:", error);
      throw new Error("Impossible de récupérer l'intention de paiement");
    }
  }

  // Create refund for cancellation
  async createRefund(paymentIntentId: string, amount?: number) {
    if (!stripe) {
      throw new Error("Stripe non configuré - veuillez configurer STRIPE_SECRET_KEY");
    }
    
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      
      return refund;
    } catch (error) {
      console.error("Stripe refund failed:", error);
      throw new Error("Impossible de créer le remboursement");
    }
  }

  // List customer payment methods
  async listPaymentMethods(customerId: string) {
    if (!stripe) {
      throw new Error("Stripe non configuré - veuillez configurer STRIPE_SECRET_KEY");
    }
    
    try {
      return await stripe.customers.listPaymentMethods(customerId);
    } catch (error) {
      console.error("Failed to list payment methods:", error);
      throw new Error("Impossible de récupérer les moyens de paiement");
    }
  }
}

export const stripeService = new StripeService();