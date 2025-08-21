import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";

export default function SalonPage() {
  // Données par défaut pour le salon Avyento
  const avyentoSalonData = {
    name: "Salon Avyento",
    description: "Excellence et innovation au service de votre beauté",
    address: "75001 Paris, France",
    phone: "01 42 36 25 14",
    email: "contact@avyento.fr",
    rating: 4.8,
    reviewCount: 127,
    photos: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=500&h=800&fit=crop&q=80"
    ],
    serviceCategories: [
      {
        id: 'coiffure',
        name: 'Coiffure',
        description: 'Coupes, colorations et soins capillaires',
        services: [
          {
            id: 1,
            name: 'Coupe + Brushing',
            price: 45,
            duration: 60,
            description: 'Coupe personnalisée avec brushing professionnel'
          },
          {
            id: 2,
            name: 'Coloration complète',
            price: 85,
            duration: 120,
            description: 'Coloration permanente avec soin protecteur'
          },
          {
            id: 3,
            name: 'Mèches + Balayage',
            price: 95,
            duration: 150,
            description: 'Technique de balayage pour un effet naturel'
          }
        ]
      },
      {
        id: 'esthetique',
        name: 'Esthétique',
        description: 'Soins du visage et épilation',
        services: [
          {
            id: 4,
            name: 'Soin visage purifiant',
            price: 65,
            duration: 75,
            description: 'Nettoyage en profondeur et hydratation'
          },
          {
            id: 5,
            name: 'Épilation sourcils',
            price: 25,
            duration: 30,
            description: 'Mise en forme professionnelle des sourcils'
          }
        ]
      }
    ],
    customColors: {
      primary: '#8b5cf6',
      accent: '#171519',
      buttonText: '#ffffff',
      buttonClass: 'glass-button-violet',
      priceColor: '#7c3aed',
      neonFrame: '#a855f7',
      intensity: 59
    }
  };

  return (
    <SalonPageTemplateFixed 
      salonSlug="salon-avyento"
      salonData={avyentoSalonData}
      customColors={avyentoSalonData.customColors}
    />
  );
}