import Stripe from 'stripe';
import { SUBSCRIPTION_PLANS } from '../shared/subscriptionPlans';

// Initialisation Stripe avec gestion gracieuse des erreurs
let stripe: Stripe | null = null;

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialisé avec succès');
  } else {
    console.warn('⚠️ STRIPE_SECRET_KEY manquant - Service Stripe désactivé');
  }
} catch (error) {
  console.error('❌ Erreur initialisation Stripe:', error);
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface SubscriptionCheckoutParams {
  planType: string;
  customerEmail: string;
  customerName: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentCheckoutParams {
  amount: number;
  description: string;
  customerEmail: string;
  customerName?: string;
  appointmentId?: string;
  salonName?: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Crée une session Stripe Checkout pour un abonnement professionnel
 */
export async function createSubscriptionCheckout(params: SubscriptionCheckoutParams): Promise<StripeCheckoutSession> {
  if (!stripe) {
    throw new Error('Service Stripe non disponible - Vérifiez STRIPE_SECRET_KEY');
  }

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === params.planType);
  if (!plan) {
    throw new Error(`Plan d'abonnement introuvable: ${params.planType}`);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: params.customerEmail,
      line_items: [{
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.name,
            description: `Abonnement ${plan.name} - ${plan.features.slice(0, 3).join(', ')}`,
          },
          unit_amount: Math.round(plan.price * 100), // Convertir en centimes
          recurring: {
            interval: plan.interval,
          },
        },
        quantity: 1,
      }],
      metadata: {
        planType: params.planType,
        customerName: params.customerName,
        subscriptionType: 'professional',
      },
      success_url: params.successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription-plans`,
      billing_address_collection: 'required',
    });

    console.log(`💳 Session checkout créée pour ${plan.name}: ${session.id}`);

    return {
      sessionId: session.id,
      url: session.url!,
    };
  } catch (error: any) {
    console.error('❌ Erreur création session subscription:', error);
    throw new Error(`Erreur Stripe: ${error?.message || 'Erreur inconnue'}`);
  }
}

/**
 * Crée une session Stripe Checkout pour un paiement unique (acompte)
 */
export async function createPaymentCheckout(params: PaymentCheckoutParams): Promise<StripeCheckoutSession> {
  if (!stripe) {
    throw new Error('Service Stripe non disponible - Vérifiez STRIPE_SECRET_KEY');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: params.customerEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: params.description,
            description: params.salonName ? `${params.salonName} - ${params.description}` : params.description,
          },
          unit_amount: Math.round(params.amount >= 100 ? params.amount : params.amount * 100), // 🔧 Auto-détection: si ≥100 = centimes, sinon euros
        },
        quantity: 1,
      }],
      metadata: {
        appointmentId: params.appointmentId || '',
        salonName: params.salonName || '',
        paymentType: 'deposit',
      },
      success_url: params.successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking`,
    });

    const amountInCents = Math.round(params.amount >= 100 ? params.amount : params.amount * 100);
    console.log(`💰 Session paiement créée pour ${(amountInCents/100).toFixed(2)}€ (${amountInCents} centimes): ${session.id}`);

    return {
      sessionId: session.id,
      url: session.url!,
    };
  } catch (error: any) {
    console.error('❌ Erreur création session paiement:', error);
    throw new Error(`Erreur Stripe: ${error?.message || 'Erreur inconnue'}`);
  }
}

/**
 * Récupère les détails d'une session Stripe
 */
export async function getCheckoutSession(sessionId: string) {
  if (!stripe) {
    throw new Error('Service Stripe non disponible');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(`📋 Session récupérée: ${sessionId} - Status: ${session.payment_status}`);
    return session;
  } catch (error) {
    console.error('❌ Erreur récupération session:', error);
    throw new Error(`Session introuvable: ${sessionId}`);
  }
}

/**
 * Confirme un paiement et retourne les détails
 */
export async function confirmPayment(sessionId: string) {
  const session = await getCheckoutSession(sessionId);
  
  if (session.payment_status === 'paid') {
    console.log(`✅ Paiement confirmé: ${sessionId}`);
    return {
      success: true,
      paymentStatus: session.payment_status,
      metadata: session.metadata || {},
      amount: session.amount_total ? session.amount_total / 100 : 0,
    };
  } else {
    console.log(`❌ Paiement non confirmé: ${sessionId} - Status: ${session.payment_status}`);
    return {
      success: false,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    };
  }
}

/**
 * Liste les abonnements d'un client
 */
export async function listCustomerSubscriptions(customerEmail: string) {
  if (!stripe) {
    throw new Error('Service Stripe non disponible');
  }

  try {
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return [];
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
    });

    console.log(`📊 ${subscriptions.data.length} abonnements trouvés pour ${customerEmail}`);
    return subscriptions.data;
  } catch (error) {
    console.error('❌ Erreur récupération abonnements:', error);
    return [];
  }
}

export { stripe };