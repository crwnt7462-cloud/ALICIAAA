import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export class StripeService {
  // Create payment intent for appointment deposit
  async createPaymentIntent(amount: number, metadata: any = {}) {
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
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("Failed to retrieve payment intent:", error);
      throw new Error("Impossible de récupérer l'intention de paiement");
    }
  }

  // Create refund for cancellation
  async createRefund(paymentIntentId: string, amount?: number) {
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
    try {
      return await stripe.customers.listPaymentMethods(customerId);
    } catch (error) {
      console.error("Failed to list payment methods:", error);
      throw new Error("Impossible de récupérer les moyens de paiement");
    }
  }
}

export const stripeService = new StripeService();