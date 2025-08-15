# Guide du Système de Template Salon Standardisé

## Vue d'ensemble

Le système de template salon standardisé a été conçu pour créer facilement des pages salon cohérentes et professionnelles. Il inclut :

- **SalonPageTemplate.tsx** : Template principal avec onglets complets
- **SalonGalleryTemplate.tsx** : Composant galerie avec carrousel et swipe
- **useSalonPageTemplate.ts** : Hook pour charger les données salon
- **createSalonPage.ts** : Utilitaires pour générer de nouvelles pages salon

## Architecture

### 1. Template Principal (SalonPageTemplate.tsx)

Le template principal contient :
- **Header** avec image de couverture, logo, informations principales
- **Onglets** : Aperçu, Services, Équipe, Galerie, Avis
- **Actions** : Favoris, partage, réservation
- **Responsive** : Optimisé mobile et desktop

#### Structure des onglets :
- **Aperçu** : Informations contact, horaires, équipements, statistiques
- **Services** : Liste organisée par catégorie avec prix et réservation
- **Équipe** : Profils des professionnels avec spécialités et notes
- **Galerie** : Albums photos avec carrousel horizontal
- **Avis** : Système d'avis avec réponses propriétaire

### 2. Galerie Template (SalonGalleryTemplate.tsx)

Fonctionnalités galerie :
- **Albums** : Organisation par collections (Réalisations, Avant/Après, etc.)
- **Carrousel horizontal** : Navigation fluide avec flèches
- **Swipe mobile** : Gestes tactiles pour navigation
- **Viewer plein écran** : Zoom et navigation au clavier
- **Upload** : Gestion upload photos (propriétaires uniquement)

### 3. Hook de données (useSalonPageTemplate.ts)

Le hook gère :
- **Chargement API** : Données réelles depuis PostgreSQL
- **Fallback** : Données par défaut si API indisponible
- **État loading** : Gestion des états de chargement
- **Authentification** : Détection propriétaire salon

### 4. Générateur de pages (createSalonPage.ts)

Utilitaires pour :
- **Code génération** : Création automatique pages salon
- **Configuration** : Personnalisation services, staff, horaires
- **Démonstrations** : Salons prédéfinis pour tests

## Utilisation

### Créer une nouvelle page salon

1. **Utilisez le générateur** :
```typescript
import { generateSalonPageCode } from '@/utils/createSalonPage';

const config = {
  salonName: 'Mon Nouveau Salon',
  salonSlug: 'mon-nouveau-salon',
  customCoverImage: 'https://...',
  customAddress: '123 Rue Example, Paris',
  customServices: [
    { name: 'Service 1', description: '...', price: 50, duration: 60, category: 'coiffure' }
  ]
};

const code = generateSalonPageCode(config);
// Créez un fichier .tsx avec ce code
```

2. **Ajoutez la route** dans App.tsx :
```typescript
import MonNouveauSalon from "@/pages/salons/MonNouveauSalon";
// ...
<Route path="/salons/mon-nouveau-salon" component={MonNouveauSalon} />
```

### Template manuel simple

```typescript
import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function MonSalon() {
  const salonSlug = 'mon-salon';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);
  
  const defaultData = getDefaultSalonData('Mon Salon', salonSlug);
  
  // Personnalisations spécifiques
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Mon Salon',
    description: 'Description personnalisée',
    // ... autres personnalisations
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
    </div>;
  }

  return (
    <SalonPageTemplate
      salonData={customizedSalonData}
      services={services.length > 0 ? services : defaultData.services}
      staff={staff.length > 0 ? staff : defaultData.staff}
      reviews={reviews.length > 0 ? reviews : defaultData.reviews}
      isOwner={isOwner}
    />
  );
}
```

## Personnalisation

### Données salon

```typescript
interface SalonData {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  coverImageUrl?: string;
  logo?: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  amenities: string[];
  priceRange: string;
}
```

### Services

```typescript
interface SalonService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string; // 'coiffure', 'soins', 'ongles', etc.
}
```

### Staff

```typescript
interface SalonStaff {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
}
```

### Avis

```typescript
interface SalonReview {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  verified: boolean;
  ownerResponse?: {
    message: string;
    date: string;
  };
}
```

## Salons de démonstration

### Salons créés avec le template :

1. **Barbier Gentleman Marais** (`/salons/barbier-gentleman-marais`)
   - Salon de coiffure traditionnel
   - Services : Coupe, barbe, rasage traditionnel
   - Ambiance authentique Marais

2. **Salon Excellence Paris** (`/salons/salon-excellence-paris`)
   - Salon haut de gamme Champs-Élysées
   - Services premium : Coupe, coloration expert
   - Clientèle prestige

3. **Institut Belle Époque** (`/salons/institut-belle-epoque`)
   - Institut de beauté traditionnel
   - Services : Soins visage, massage, ongles
   - Depuis 1923

4. **Modern Hair Studio** (`/salons/modern-hair-studio`)
   - Studio coiffure moderne
   - Services : Coupes tendance, colorations fantasy
   - Clientèle jeune et créative

## Intégration API

### Endpoints utilisés :
- `GET /api/salons/by-slug/:slug` - Données salon
- `GET /api/salons/:id/services` - Services salon
- `GET /api/salons/:id/staff` - Équipe salon  
- `GET /api/salons/:id/reviews` - Avis clients
- `GET /api/salons/:id/albums` - Albums photos
- `GET /api/salons/:id/albums/:albumId/photos` - Photos album

### Fallback automatique :
Si l'API n'est pas disponible, le template utilise automatiquement des données par défaut personnalisables.

## Styles CSS

Le template utilise les classes CSS standardisées Avyento :
- `.avyento-card` : Cartes avec effet glass
- `.avyento-button-primary` : Boutons principaux
- `.avyento-button-secondary` : Boutons secondaires
- `.avyento-glass-effect` : Effet glassmorphism

## Avantages

### Pour les développeurs :
- **Cohérence** : Même structure pour tous les salons
- **Réutilisabilité** : Template unique pour tous
- **Maintenabilité** : Modifications centralisées
- **Rapidité** : Création salon en minutes

### Pour les salons :
- **Professionnalisme** : Design moderne et cohérent
- **Fonctionnalités** : Galerie, avis, réservation intégrés
- **Responsive** : Optimisé tous appareils
- **SEO** : Structure optimisée référencement

### Pour les clients :
- **Navigation** : Interface familière et intuitive
- **Information** : Toutes les infos en un endroit
- **Réservation** : Processus simplifié
- **Avis** : Transparence et confiance

## Migration

### Migrer un salon existant :

1. **Sauvegardez** l'ancien code
2. **Créez** la nouvelle page avec le template
3. **Personnalisez** les données spécifiques
4. **Testez** toutes les fonctionnalités
5. **Remplacez** l'ancienne route
6. **Vérifiez** la navigation

### Exemple migration :
```bash
# Sauvegarde
mv MonAncienSalon.tsx MonAncienSalon.backup.tsx

# Création nouveau
cp TemplateExample.tsx MonNouveauSalon.tsx

# Personnalisation dans le nouveau fichier
# Test et validation
# Mise en production
```

## Maintenance

### Mises à jour template :
- Les améliorations du template principal bénéficient automatiquement à tous les salons
- Les personnalisations spécifiques sont préservées
- Migration progressive possible

### Ajout de fonctionnalités :
- Nouvelles fonctionnalités dans SalonPageTemplate.tsx
- Extension des interfaces TypeScript si nécessaire
- Documentation mise à jour

## Support

Pour toute question ou problème :
1. Consultez ce guide
2. Vérifiez les exemples de salons existants
3. Testez avec les données par défaut
4. Contactez l'équipe de développement

---

*Guide mis à jour le 15/08/2025 - Version Template Salon v1.0*