# Redirection vers le Shell de Paiement

## 🎯 Objectif
Modifier le comportement des boutons "Créer un compte" et "Se connecter" pour rediriger vers le shell de paiement à l'URL `/avyento-style-booking-fixed` au lieu de créer un Intent de paiement Stripe.

## 🔧 Modifications apportées

### 1. Fonction `handleLogin` (Connexion)
**Avant :**
```typescript
setTimeout(() => createPaymentIntent(), 500);
```

**Après :**
```typescript
setTimeout(() => setLocation('/avyento-style-booking-fixed'), 500);
```

### 2. Fonction `handleSubmit` (Inscription)
**Avant :**
```typescript
setTimeout(() => createPaymentIntent(), 500);
```

**Après :**
```typescript
setTimeout(() => setLocation('/avyento-style-booking-fixed'), 500);
```

## 🚀 Fonctionnement

### Scénario 1 : Connexion utilisateur existant
1. L'utilisateur clique sur "J'ai déjà un compte - Se connecter"
2. Modal de connexion s'ouvre
3. L'utilisateur saisit email/mot de passe et valide
4. Si connexion réussie → Toast de succès + redirection vers `/avyento-style-booking-fixed`
5. Si erreur → Message d'erreur affiché

### Scénario 2 : Inscription nouveau utilisateur
1. L'utilisateur remplit le formulaire d'inscription
2. L'utilisateur clique sur "Créer mon compte"
3. Si inscription réussie → Toast de succès + redirection vers `/avyento-style-booking-fixed`
4. Si erreur → Message d'erreur affiché

## 📱 URLs concernées

### Page source (formulaire)
- `/booking` - Page avec formulaire d'inscription/connexion

### Page destination (shell de paiement)
- `/avyento-style-booking-fixed` - Shell de paiement Avyento

## 🔍 Logs de débogage
Des logs ont été ajoutés pour faciliter le débogage :
- `✅ Connexion réussie, redirection vers: /avyento-style-booking-fixed`
- `✅ Inscription réussie, redirection vers: /avyento-style-booking-fixed`

## 🧪 Test
1. Aller sur `http://localhost:5173/booking`
2. Remplir le formulaire ou cliquer sur "Se connecter"
3. Vérifier la redirection vers `http://localhost:5173/avyento-style-booking-fixed`
4. Consulter la console pour voir les logs de débogage

## ⚙️ Configuration technique
- Utilise `useLocation` de wouter pour la navigation
- Délai de 500ms avant redirection pour laisser le temps au toast de s'afficher
- Conservation du token dans localStorage pour la session