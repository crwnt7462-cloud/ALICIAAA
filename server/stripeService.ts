import Stripe from 'stripe';

// Configuration Stripe avec gestion des clés manquantes
let stripe: Stripe | null = null;

function initializeStripe() {
  const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Rn0zHQbSa7XrNpD4exDqcZatGCbo1me8zCSnLgDNr5YGDPbvojp3IRmLRT31hC0lGZWw9ar5VZprCrzbV6tTnjK00I49zqfEu';
  
  if (!stripeKey) {
    console.warn('STRIPE_SECRET_KEY non configurée - services Stripe désactivés');
    return null;
  }
  
  if (!stripe) {
    stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
    });
  }
  
  return stripe;
}

function getStripe(): Stripe {
  const stripeInstance = initializeStripe();
  if (!stripeInstance) {
    throw new Error('Stripe n\'est pas configuré - veuillez définir STRIPE_SECRET_KEY');
  }
  return stripeInstance;
}

export interface CreateSubscriptionCheckoutParams {
  priceId: string;
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentCheckoutParams {
  amount: number; // en centimes
  currency: string;
  description: string;
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export class StripeService {
  
  /**
   * Créer une session Checkout pour un abonnement récurrent
   */
  async createSubscriptionCheckout(params: CreateSubscriptionCheckoutParams): Promise<Stripe.Checkout.Session> {
    try {
      const stripeInstance = getStripe();
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        customer_email: params.customerEmail,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata || {},
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_creation: 'always',
        subscription_data: {
          metadata: params.metadata || {},
        },
      });

      return session;
    } catch (error) {
      console.error('Erreur création session abonnement:', error);
      throw error;
    }
  }

  /**
   * Créer une session Checkout pour un paiement unique
   */
  async createPaymentCheckout(params: CreatePaymentCheckoutParams): Promise<Stripe.Checkout.Session> {
    try {
      const stripeInstance = getStripe();
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: params.currency,
              product_data: {
                name: params.description,
              },
              unit_amount: params.amount,
            },
            quantity: 1,
          },
        ],
        customer_email: params.customerEmail,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata || {},
        billing_address_collection: 'required',
        customer_creation: 'always',
      });

      return session;
    } catch (error) {
      console.error('Erreur création session paiement:', error);
      throw error;
    }
  }

  /**
   * Récupérer une session Checkout
   */
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      const stripeInstance = getStripe();
      const session = await stripeInstance.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'subscription', 'payment_intent'],
      });
      return session;
    } catch (error) {
      console.error('Erreur récupération session:', error);
      throw error;
    }
  }

  /**
   * Créer un produit et un prix pour un abonnement
   */
  async createSubscriptionProduct(name: string, monthlyPrice: number): Promise<{ productId: string; priceId: string }> {
    try {
      const stripeInstance = getStripe();
      // Créer le produit
      const product = await stripeInstance.products.create({
        name,
        type: 'service',
      });

      // Créer le prix récurrent
      const price = await stripeInstance.prices.create({
        unit_amount: monthlyPrice * 100, // Convertir en centimes
        currency: 'eur',
        recurring: {
          interval: 'month',
        },
        product: product.id,
      });

      return {
        productId: product.id,
        priceId: price.id,
      };
    } catch (error) {
      console.error('Erreur création produit/prix:', error);
      throw error;
    }
  }

  /**
   * Lister les abonnements d'un client
   */
  async getCustomerSubscriptions(customerEmail: string): Promise<Stripe.Subscription[]> {
    try {
      const stripeInstance = getStripe();
      const customers = await stripeInstance.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return [];
      }

      const subscriptions = await stripeInstance.subscriptions.list({
        customer: customers.data[0].id,
        status: 'all',
      });

      return subscriptions.data;
    } catch (error) {
      console.error('Erreur récupération abonnements:', error);
      throw error;
    }
  }
  // Créer une session Stripe Checkout pour réservation avec acompte
  async createBookingCheckout(bookingData: {
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    depositAmount: number;
    selectedDate: string;
    selectedTime: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    try {
      const stripeInstance = getStripe();
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Acompte - ${bookingData.serviceName}`,
                description: `Réservation du ${bookingData.selectedDate} à ${bookingData.selectedTime}`,
              },
              unit_amount: bookingData.depositAmount * 100, // Stripe utilise les centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: bookingData.successUrl,
        cancel_url: bookingData.cancelUrl,
        metadata: {
          serviceId: bookingData.serviceId,
          serviceName: bookingData.serviceName,
          servicePrice: bookingData.servicePrice.toString(),
          depositAmount: bookingData.depositAmount.toString(),
          selectedDate: bookingData.selectedDate,
          selectedTime: bookingData.selectedTime,
          clientName: bookingData.clientName,
          clientPhone: bookingData.clientPhone,
          clientEmail: bookingData.clientEmail,
          bookingType: 'appointment_deposit'
        },
      });

      return session;
    } catch (error) {
      console.error('Erreur création session booking Stripe:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();