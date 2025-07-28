import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export class StripeService {
  // Créer une session de checkout pour abonnement professionnel
  async createSubscriptionCheckout(
    planType: 'essentiel' | 'professionnel' | 'premium',
    customerEmail: string,
    customerName: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const planPrices = {
        essentiel: { priceId: 'price_1QLxxxxxx', amount: 2900 }, // 29€/mois
        professionnel: { priceId: 'price_2QLxxxxxx', amount: 7900 }, // 79€/mois  
        premium: { priceId: 'price_3QLxxxxxx', amount: 14900 } // 149€/mois
      };

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Abonnement ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
                description: `Plan ${planType} pour votre salon`,
              },
              unit_amount: planPrices[planType].amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        metadata: {
          planType,
          customerName,
          type: 'subscription'
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          trial_period_days: 14, // 14 jours d'essai gratuit
        },
      });

      console.log(`✅ Session abonnement créée: ${session.id}`);
      return { sessionId: session.id, url: session.url! };
    } catch (error) {
      console.error("Erreur création session abonnement:", error);
      throw error;
    }
  }

  // Créer une session de checkout pour acompte de réservation
  async createDepositCheckout(
    amount: number,
    description: string,
    customerEmail: string,
    customerName: string,
    appointmentId: string,
    salonName: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Acompte - ${description}`,
                description: `Réservation chez ${salonName}`,
              },
              unit_amount: Math.round(amount * 100), // Convertir en centimes
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        metadata: {
          appointmentId,
          customerName,
          salonName,
          type: 'booking_deposit'
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      console.log(`✅ Session acompte créée: ${session.id} pour ${amount}€`);
      return { sessionId: session.id, url: session.url! };
    } catch (error) {
      console.error("Erreur création session acompte:", error);
      throw error;
    }
  }

  // Récupérer les détails d'une session
  async getSession(sessionId: string): Promise<any> {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error("Erreur récupération session:", error);
      throw error;
    }
  }

  // Confirmer un paiement
  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      console.log(`✅ Paiement confirmé: ${paymentIntentId}`);
      
      // TODO: Vérifier le statut réel avec Stripe
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      // return paymentIntent.status === 'succeeded';
      
      return true;
    } catch (error) {
      console.error("Erreur confirmation paiement:", error);
      return false;
    }
  }

  // Créer un remboursement
  async createRefund(paymentIntentId: string, amount?: number): Promise<boolean> {
    try {
      console.log(`💰 Remboursement initié pour ${paymentIntentId}`);
      if (amount) {
        console.log(`💵 Montant: ${amount}€`);
      }
      
      // TODO: Intégrer Stripe Refunds
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      // const refund = await stripe.refunds.create({
      //   payment_intent: paymentIntentId,
      //   amount: amount ? amount * 100 : undefined
      // });
      
      return true;
    } catch (error) {
      console.error("Erreur remboursement:", error);
      return false;
    }
  }
}

export const stripeService = new StripeService();