import { supabase } from "./db";
import { v4 as uuidv4 } from "uuid";
import { businessRegistrations, services, staffMembers, salonTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";

// Script pour ajouter des données de test des salons demandés
export async function seedTestSalons() {
  console.log('🌱 Ajout des données de test pour les salons...');

  try {
    // Vérifier si les données existent déjà
    const { data: existingSalons } = await supabase.from('businessRegistrations').select('*');
    
    if (existingSalons.length > 0) {
      console.log('✅ Données de salons déjà présentes dans la base');
      return;
    }

    const testSalons = [
      {
        businessName: "Barbier Gentleman Marais",
        slug: "barbier-gentleman-marais",
        businessType: "barbier",
        siret: "12345678901234",
        address: "15 rue des Rosiers",
        city: "Paris",
        postalCode: "75004",
        phone: "01 42 77 88 99",
        email: "contact@barbier-gentleman-marais.fr",
        ownerFirstName: "Antoine",
        ownerLastName: "Martin",
        legalForm: "SARL",
        description: "Barbier traditionnel dans le Marais, spécialisé dans la taille de barbe et coupes classiques",
        planType: "premium",
        status: "approved"
      },
      {
        businessName: "Salon Excellence Paris",
        slug: "salon-excellence-paris",
        businessType: "coiffure",
        siret: "23456789012345",
        address: "25 avenue des Champs-Élysées",
        city: "Paris",
        postalCode: "75008",
        phone: "01 45 62 33 44",
        email: "contact@salon-excellence-paris.fr",
        ownerFirstName: "Sophie",
        ownerLastName: "Dubois",
        legalForm: "SARL",
        description: "Salon de coiffure haut de gamme sur les Champs-Élysées",
        planType: "premium",
        status: "approved"
      },
      {
        businessName: "Institut Beauté Saint-Germain",
        slug: "institut-beaute-saint-germain",
        businessType: "esthetique",
        siret: "34567890123456",
        address: "12 boulevard Saint-Germain",
        city: "Paris",
        postalCode: "75005",
        phone: "01 43 26 55 77",
        email: "contact@institut-beaute-saint-germain.fr",
        ownerFirstName: "Émilie",
        ownerLastName: "Leroy",
        legalForm: "SARL",
        description: "Institut de beauté proposant soins du visage et épilations",
        planType: "advanced",
        status: "approved"
      },
      {
        businessName: "Nail Art Opéra",
        slug: "nail-art-opera",
        businessType: "ongles",
        siret: "45678901234567",
        address: "8 rue de la Paix",
        city: "Paris",
        postalCode: "75002",
        phone: "01 42 61 44 88",
        email: "contact@nail-art-opera.fr",
        ownerFirstName: "Maria",
        ownerLastName: "Garcia",
        legalForm: "EURL",
        description: "Spécialiste nail art et soins des ongles près de l'Opéra",
        planType: "basic",
        status: "approved"
      },
      {
        businessName: "Spa Wellness Bastille",
        slug: "spa-wellness-bastille",
        businessType: "spa",
        siret: "56789012345678",
        address: "20 rue de la Roquette",
        city: "Paris",
        postalCode: "75011",
        phone: "01 48 05 22 66",
        email: "contact@spa-wellness-bastille.fr",
        ownerFirstName: "Claire",
        ownerLastName: "Bernard",
        legalForm: "SARL",
        description: "Spa et centre de bien-être avec massages et soins relaxants",
        planType: "premium",
        status: "approved"
      }
    ];

    // Insérer les salons de test
    for (const salon of testSalons) {
  await supabase.from('businessRegistrations').insert([salon]);
      console.log(`✅ Salon ajouté: ${salon.businessName} (${salon.slug})`);
    }

    console.log('🎉 Données de test des salons ajoutées avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données de test:', error);
  }
}

// Fonction pour ajouter des services de base aux salons
export async function seedTestServices() {
  console.log('🛠️ Ajout des services de test...');

  try {
  const { data: salons } = await supabase.from('businessRegistrations').select('*');
    
    if (salons.length === 0) {
      console.log('⚠️ Aucun salon trouvé, ajout des salons d\'abord...');
      await seedTestSalons();
    }

  const { data: existingServices } = await supabase.from('services').select('*');
    
    if (existingServices.length > 0) {
      console.log('✅ Services déjà présents dans la base');
      return;
    }

    // Services pour barbier
    const barbierServices = [
      {
        userId: "barbier-gentleman-marais",
        name: "Coupe classique",
        description: "Coupe de cheveux traditionnelle",
        price: "35.00",
        duration: 45,
        category: "coupe",
        isActive: true
      },
      {
        userId: "barbier-gentleman-marais", 
        name: "Taille de barbe",
        description: "Taille et entretien de barbe",
        price: "25.00",
        duration: 30,
        category: "barbe",
        isActive: true
      }
    ];

    // Services pour salon de coiffure
    const coiffureServices = [
      {
        userId: "salon-excellence-paris",
        name: "Coupe femme",
        description: "Coupe et brushing",
        price: "65.00",
        duration: 60,
        category: "coupe",
        isActive: true
      },
      {
        userId: "salon-excellence-paris",
        name: "Coloration",
        description: "Coloration complète avec mèches",
        price: "120.00",
        duration: 180,
        category: "coloration",
        isActive: true
      }
    ];

    // Ajouter tous les services
    const allServices = [...barbierServices, ...coiffureServices];
    
    for (const service of allServices) {
  await supabase.from('services').insert([service]);
      console.log(`✅ Service ajouté: ${service.name} pour ${service.userId}`);
    }

    console.log('🎉 Services de test ajoutés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des services de test:', error);
  }
}

// Fonction principale d'initialisation
export async function initializeTestData() {
  console.log('🚀 Initialisation des données de test...');
  await seedTestSalons();
  await seedTestServices();
  console.log('✅ Initialisation terminée !');
}

// Helper pour le seed du template par défaut
export async function seedDefaultSalonTemplate() {
  const slug = "default-modern";
  const { data: already } = await supabase.from('salon').select('*');
  // Sécurise: si Supabase retourne null, utilise un tableau vide
  const safeAlready = already ?? [];
  // Si besoin, filtrer ici sur le slug
  const filtered = safeAlready.filter(tpl => tpl.slug === slug);
  if (filtered.length > 0) return; // déjà seedé

  if (safeAlready.length > 0) return; // déjà seedé

  await supabase.from('salon').insert([
    {
      id: uuidv4(), // UUID valide pour Supabase
      slug,
      name: "Default Modern",
      pageJson: {
        theme: { primary: "#f59e0b", accent: "#d97706", intensity: 35 },
        sections: [
          { type: "hero", title: "Bienvenue", subtitle: "Votre beauté, notre passion" },
          { type: "services", layout: "grid" },
          { type: "team", layout: "cards" },
          { type: "reviews" }
        ]
      }
    }
  ]);

  console.log("✅ Seed: salon_templates -> default-modern");
}