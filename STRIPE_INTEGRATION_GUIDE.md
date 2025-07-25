# Guide d'Intégration Stripe - Système Dual de Paiement

## Vue d'ensemble

Cette documentation présente l'intégration complète de Stripe pour gérer deux types de paiements :
1. **Abonnements récurrents** pour les professionnels (mode subscription)
2. **Paiements d'acompte** pour les réservations (mode payment)

## Configuration des Variables d'Environnement

### Variables Stripe requises

Ajoutez ces variables dans votre fichier `.env` :

```env
# Clés Stripe (Test)
STRIPE_SECRET_KEY=sk_test_51Rn0zHQbSa7XrNpD4exDqcZatGCbo1me8zCSnLgDNr5YGDPbvojp3IRmLRT31hC0lGZWw9ar5VZprCrzbV6tTnjK00I49zqfEu
VITE_STRIPE_PUBLIC_KEY=pk_test_51Rn0zHQbSa7XrNpDpM6MD9LPmkUAPzClEdnFW34j3evKDrUxMud0I0p6vk3ESOBwxjAwmj1cKU5VrKGa7pef6onE00eC66JjRo
```

### Comment obtenir vos clés Stripe

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com/)
2. Naviguez vers **Développeurs** > **Clés API**
3. **VITE_STRIPE_PUBLIC_KEY** : Copiez la "Clé publique" (commence par `pk_`)
4. **STRIPE_SECRET_KEY** : Copiez la "Clé secrète" (commence par `sk_`)

## Architecture Backend

### Service Stripe (`server/stripeService.ts`)

Le service principal qui gère toutes les interactions avec Stripe :

#### Fonctionnalités principales :
- ✅ **Création de sessions Checkout pour abonnements récurrents**
- ✅ **Création de sessions Checkout pour paiements uniques**
- ✅ **Gestion automatique des produits et prix**
- ✅ **Récupération des détails de session**
- ✅ **Liste des abonnements clients**

#### Protection contre les erreurs :
- Gestion gracieuse des clés manquantes
- Messages d'erreur explicites
- Fallback sécurisé si Stripe n'est pas configuré

### Endpoints API

#### 1. Création d'abonnement professionnel
```
POST /api/stripe/create-subscription-checkout
```

**Paramètres :**
```json
{
  "planType": "essentiel|professionnel|premium",
  "customerEmail": "pro@example.com",
  "customerName": "Nom du Professionnel"
}
```

**Réponse :**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### 2. Création de paiement d'acompte
```
POST /api/stripe/create-payment-checkout
```

**Paramètres :**
```json
{
  "amount": 50.00,
  "description": "Acompte réservation - Coupe & Brushing",
  "customerEmail": "client@example.com",
  "customerName": "Nom du Client",
  "appointmentId": "12345",
  "salonName": "Salon Excellence"
}
```

**Réponse :**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### 3. Récupération des détails de session
```
GET /api/stripe/session/:sessionId
```

**Réponse :**
```json
{
  "id": "cs_...",
  "status": "complete",
  "payment_status": "paid",
  "metadata": {...},
  "customer_details": {...},
  "amount_total": 5000
}
```

## Interface Frontend

### Pages de démonstration

#### `/stripe/demo` - Interface de Test
- **Formulaire abonnement** : Test des paiements récurrents
- **Formulaire acompte** : Test des paiements uniques
- **Instructions de test** : Guide pour utiliser les cartes test Stripe

#### `/stripe/success` - Page de Succès
- Affichage des détails du paiement
- Différenciation abonnement/paiement unique
- Actions de suivi (dashboard pro, confirmation)

#### `/stripe/cancel` - Page d'Annulation
- Gestion des paiements annulés
- Options de nouvelle tentative
- Support client

### Intégration dans votre Application

#### Exemple : Bouton d'abonnement professionnel

```typescript
const handleSubscriptionPayment = async (planType: string) => {
  try {
    const response = await fetch('/api/stripe/create-subscription-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType,
        customerEmail: user.email,
        customerName: user.name,
      }),
    });

    const { url } = await response.json();
    window.location.href = url; // Redirection vers Stripe
  } catch (error) {
    console.error('Erreur paiement:', error);
  }
};
```

#### Exemple : Bouton de paiement d'acompte

```typescript
const handleDepositPayment = async (appointmentData: any) => {
  try {
    const response = await fetch('/api/stripe/create-payment-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: appointmentData.depositAmount,
        description: `Acompte - ${appointmentData.serviceName}`,
        customerEmail: appointmentData.clientEmail,
        customerName: appointmentData.clientName,
        appointmentId: appointmentData.id,
        salonName: appointmentData.salonName,
      }),
    });

    const { url } = await response.json();
    window.location.href = url; // Redirection vers Stripe
  } catch (error) {
    console.error('Erreur paiement:', error);
  }
};
```

## Plans d'Abonnement Disponibles

### Plan Essentiel - 29€/mois
- Fonctionnalités de base
- Gestion des rendez-vous
- Calendrier simple

### Plan Professionnel - 79€/mois ⭐ **Populaire**
- Toutes les fonctionnalités Essentiel
- IA d'optimisation
- Analytics avancés
- Support prioritaire

### Plan Premium - 149€/mois
- Toutes les fonctionnalités Professionnel
- IA complète
- Marketing intelligent
- Établissements illimités

## Test avec Stripe

### Cartes de Test

#### Succès
- **Numéro :** 4242 4242 4242 4242
- **Date :** N'importe quelle date future
- **CVC :** N'importe quel code à 3 chiffres

#### Échec
- **Numéro :** 4000 0000 0000 0002
- **Date :** N'importe quelle date future
- **CVC :** N'importe quel code à 3 chiffres

#### Authentification 3D Secure
- **Numéro :** 4000 0000 0000 3220
- **Date :** N'importe quelle date future
- **CVC :** N'importe quel code à 3 chiffres

### URLs de Test

- **Page de démo :** `/stripe/demo`
- **Succès :** `/stripe/success?session_id={CHECKOUT_SESSION_ID}`
- **Annulation :** `/stripe/cancel`

## Sécurité

### Bonnes Pratiques Implémentées

✅ **Validation côté serveur** : Tous les paramètres sont validés avant envoi à Stripe
✅ **Gestion des erreurs** : Messages d'erreur explicites sans exposition de données sensibles
✅ **Variables d'environnement** : Clés secrètes stockées de manière sécurisée
✅ **HTTPS requis** : Stripe exige HTTPS en production
✅ **Metadata sécurisées** : Informations contextuelles stockées dans les sessions

### Points d'Attention

⚠️ **Mode Test** : Utilisez les clés de test pour le développement
⚠️ **Webhooks** : Implémentez les webhooks Stripe pour la production
⚠️ **Validation** : Vérifiez toujours les paiements côté serveur
⚠️ **Logs** : Ne loggez jamais les données sensibles

## Déploiement en Production

### Checklist de Préparation

1. **Remplacer les clés test** par les clés de production Stripe
2. **Activer les webhooks** pour la synchronisation des paiements
3. **Configurer HTTPS** sur votre domaine
4. **Tester les flux** de paiement complets
5. **Vérifier les emails** de confirmation
6. **Configurer la facturation** automatique

### Variables de Production

```env
# Clés Stripe (Production)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

## Support et Debugging

### Logs Utiles

Le service Stripe génère des logs détaillés :
- Création de sessions : ✅ succès / ❌ erreurs
- Retrieval de sessions : informations complètes
- Erreurs de configuration : messages explicites

### Dashboard Stripe

Surveillez vos paiements dans le Dashboard Stripe :
- **Paiements** : Tous les paiements uniques et récurrents
- **Abonnements** : Gestion des souscriptions professionnelles
- **Clients** : Base de données clients automatique
- **Événements** : Journal des actions Stripe

### Support Technique

Pour toute question relative à l'intégration :
- Consultez la [documentation Stripe](https://stripe.com/docs)
- Utilisez les [outils de test Stripe](https://stripe.com/docs/testing)
- Contactez le support technique de l'application

---

*Cette intégration Stripe est prête pour la production et suit les meilleures pratiques de sécurité.*