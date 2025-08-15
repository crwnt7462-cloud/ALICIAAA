# Guide Interface Unifiée Salon - Avyento

## Vue d'ensemble

Tous les salons démo utilisent maintenant l'interface unifiée **SalonPageTemplate** avec personnalisation des couleurs.

## Interface Unifiée

### ✅ Salons utilisant SalonPageTemplate :

1. **BarbierGentlemanMarais** - `/salon/barbier-gentleman-marais`
2. **SalonExcellenceParis** - `/salon/salon-excellence-paris`
3. **BeautyLoungeMontparnasse** - `/salon/beauty-lounge-montparnasse`
4. **InstitutBeauteSaintGermain** - `/salon/institut-beaute-saint-germain`
5. **SalonModerneRepublique** - `/salon/salon-moderne-republique`
6. **BeautyLashStudio** - `/salon/beauty-lash-studio`

### Design Uniform Avyento

**Interface commune :**
- Navigation par onglets responsive (Services, Équipe, Galerie, Avis, Infos)
- Layout mobile-first avec breakpoints adaptés
- Design minimaliste et épuré selon la DA Avyento
- Galerie avec catégories filtrables
- Système d'avis avec liens vers onglets dédiés
- Boutons glass-button cohérents

## Système de Couleurs Personnalisées

### Principe
- **Interface uniforme** = même structure pour tous
- **Couleurs personnalisées** = accents et boutons aux couleurs du salon

### Hook useCustomColors
```typescript
const { customColors } = useCustomColors(salonData.slug);
```

### Variables appliquées dynamiquement :
- `primary` : Couleur principale (onglets actifs, bordures)
- `accent` : Couleur secondaire
- `buttonText` : Couleur du texte des boutons
- `buttonClass` : Classe CSS des boutons
- `priceColor` : Couleur des prix
- `neonFrame` : Couleur des effets néon
- `intensity` : Intensité des effets

### Salons avec couleurs personnalisées

**Barbier Gentleman Marais (exemple) :**
```json
{
  "primary": "#cf079a",
  "accent": "#171519", 
  "buttonText": "#ffffff",
  "buttonClass": "glass-button-purple",
  "priceColor": "#7c3aed",
  "neonFrame": "#a855f7",
  "intensity": 59
}
```

### Salons par défaut
Les salons sans personnalisation utilisent les couleurs par défaut :
- Primary: #8b5cf6 (violet)
- Interface minimaliste blanc/gris

## Fonctionnalités Communes

### Navigation Responsive
- Mobile : icônes + texte abrégé
- Desktop : icônes + texte complet
- Onglets avec couleurs personnalisées

### Services
- Catégories collapsibles avec descriptions
- Liens vers avis et galerie (pas d'affichage inline)
- Prix et boutons réservation stylisés

### Galerie
- Filtres par catégories : Toutes, Coupes, Rasages, Soins, Ambiance
- Grid responsive : 2 cols mobile → 4 cols desktop
- Hover effects avec couleurs personnalisées

### Équipe & Avis
- Cartes uniformes avec spécialités
- Système d'avis avec réponses salon
- Ratings et métadonnées cohérents

## Avantages

✅ **Cohérence visuelle** : Même expérience utilisateur partout
✅ **Personnalisation** : Chaque salon garde son identité
✅ **Maintenance** : Un seul composant à maintenir
✅ **Responsive** : Optimisé mobile et desktop
✅ **Évolutivité** : Nouvelles fonctionnalités déployées partout

## Pour ajouter un nouveau salon

1. Créer le fichier dans `/pages/salons/NouveauSalon.tsx`
2. Utiliser le pattern existant avec `useSalonPageTemplate`
3. Personnaliser les données spécifiques (services, équipe, etc.)
4. Le système de couleurs personnalisées s'applique automatiquement

## Migration Terminée

Tous les salons démo utilisent maintenant l'interface unifiée SalonPageTemplate avec support complet des couleurs personnalisées et design responsive mobile-first.