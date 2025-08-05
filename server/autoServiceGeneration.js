import { storage } from './storage.js';

// Fonction pour générer automatiquement des services pour tous les salons
async function generateServicesForAllSalons() {
  console.log('🔧 Génération automatique de services pour tous les salons...');
  
  const serviceTemplates = {
    'Coiffure': [
      {
        name: "Coupe + Brushing Femme",
        description: "Coupe de cheveux personnalisée avec shampoing et brushing professionnel",
        price: "65",
        duration: 90,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: true,
        depositAmount: "19.50"
      },
      {
        name: "Coloration Complète",
        description: "Coloration racines et longueurs avec soin nourrissant",
        price: "120",
        duration: 180,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: true,
        depositAmount: "36.00"
      },
      {
        name: "Mèches ou Balayage",
        description: "Technique de décoloration partielle pour un effet naturel",
        price: "95",
        duration: 150,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: true,
        depositAmount: "28.50"
      },
      {
        name: "Coupe Homme",
        description: "Coupe masculine moderne avec finitions",
        price: "35",
        duration: 45,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: false,
        depositAmount: null
      }
    ],
    'Esthétique': [
      {
        name: "Soin Visage Complet",
        description: "Nettoyage, gommage et masque hydratant",
        price: "75",
        duration: 60,
        categoryId: 2,
        color: "#F59E0B",
        requiresDeposit: true,
        depositAmount: "22.50"
      },
      {
        name: "Épilation Sourcils",
        description: "Mise en forme et épilation des sourcils",
        price: "25",
        duration: 30,
        categoryId: 2,
        color: "#F59E0B",
        requiresDeposit: false,
        depositAmount: null
      },
      {
        name: "Soin Anti-âge",
        description: "Soin régénérant avec massage facial",
        price: "95",
        duration: 75,
        categoryId: 2,
        color: "#F59E0B",
        requiresDeposit: true,
        depositAmount: "28.50"
      }
    ],
    'Manucure': [
      {
        name: "Manucure Classique",
        description: "Soin des ongles avec vernis au choix",
        price: "45",
        duration: 60,
        categoryId: 3,
        color: "#EC4899",
        requiresDeposit: true,
        depositAmount: "13.50"
      },
      {
        name: "Pose Gel",
        description: "Application gel avec décoration simple",
        price: "65",
        duration: 90,
        categoryId: 3,
        color: "#EC4899",
        requiresDeposit: true,
        depositAmount: "19.50"
      }
    ],
    'Massage': [
      {
        name: "Massage Relaxant",
        description: "Massage corps entier aux huiles essentielles",
        price: "85",
        duration: 60,
        categoryId: 4,
        color: "#10B981",
        requiresDeposit: true,
        depositAmount: "25.50"
      },
      {
        name: "Massage Dos",
        description: "Massage ciblé zone dos et épaules",
        price: "55",
        duration: 30,
        categoryId: 4,
        color: "#10B981",
        requiresDeposit: false,
        depositAmount: null
      }
    ]
  };

  try {
    // Récupérer tous les salons
    const allSalons = await storage.getAllSalons?.() || [];
    console.log(`📊 ${allSalons.length} salons trouvés pour génération de services`);

    for (const salon of allSalons) {
      console.log(`🏢 Génération services pour: ${salon.name} (ID: ${salon.id})`);
      
      // Déterminer les types de services selon le nom/description du salon
      let serviceTypesToGenerate = ['Coiffure']; // Par défaut
      
      if (salon.name.toLowerCase().includes('institut') || salon.name.toLowerCase().includes('beauté')) {
        serviceTypesToGenerate = ['Coiffure', 'Esthétique'];
      } else if (salon.name.toLowerCase().includes('nail') || salon.name.toLowerCase().includes('ongle')) {
        serviceTypesToGenerate = ['Manucure'];
      } else if (salon.name.toLowerCase().includes('spa') || salon.name.toLowerCase().includes('massage')) {
        serviceTypesToGenerate = ['Massage', 'Esthétique'];
      } else if (salon.name.toLowerCase().includes('barbier')) {
        serviceTypesToGenerate = ['Coiffure'];
      }

      let servicesCreated = 0;
      
      // Générer les services pour ce salon
      for (const serviceType of serviceTypesToGenerate) {
        const templates = serviceTemplates[serviceType] || [];
        
        for (const template of templates) {
          try {
            const serviceData = {
              ...template,
              userId: salon.id, // Utiliser l'ID du salon comme userId
              isActive: true,
              isOnlineBookable: true,
              maxAdvanceBooking: 30
            };
            
            await storage.createService(serviceData);
            servicesCreated++;
            console.log(`  ✅ Service créé: ${template.name} - ${template.price}€`);
          } catch (error) {
            console.log(`  ℹ️ Service ${template.name} existe déjà ou erreur`);
          }
        }
      }
      
      console.log(`🎯 ${servicesCreated} services créés pour ${salon.name}`);
    }
    
    console.log('✅ Génération automatique de services terminée pour tous les salons!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération automatique de services:', error);
  }
}

// Fonction pour créer des services pour un salon spécifique
async function generateServicesForSalon(salonId, salonName = '', serviceTypes = ['Coiffure']) {
  const serviceTemplates = {
    'Coiffure': [
      {
        name: "Coupe + Brushing Femme",
        description: "Coupe de cheveux personnalisée avec shampoing et brushing professionnel",
        price: "65",
        duration: 90,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: true,
        depositAmount: "19.50"
      },
      {
        name: "Coloration Complète",
        description: "Coloration racines et longueurs avec soin nourrissant",
        price: "120",
        duration: 180,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: true,
        depositAmount: "36.00"
      },
      {
        name: "Mèches ou Balayage",
        description: "Technique de décoloration partielle pour un effet naturel",
        price: "95",
        duration: 150,
        categoryId: 1,
        color: "#8B5CF6",
        requiresDeposit: true,
        depositAmount: "28.50"
      },
      {
        name: "Soin Capillaire",
        description: "Masque capillaire profond pour cheveux abîmés",
        price: "35",
        duration: 45,
        categoryId: 2,
        color: "#F59E0B",
        requiresDeposit: false,
        depositAmount: null
      }
    ]
  };

  let servicesCreated = 0;
  
  for (const serviceType of serviceTypes) {
    const templates = serviceTemplates[serviceType] || serviceTemplates['Coiffure'];
    
    for (const template of templates) {
      try {
        const serviceData = {
          ...template,
          userId: salonId,
          isActive: true,
          isOnlineBookable: true,
          maxAdvanceBooking: 30
        };
        
        await storage.createService(serviceData);
        servicesCreated++;
        console.log(`✅ Service créé pour ${salonName}: ${template.name} - ${template.price}€`);
      } catch (error) {
        console.log(`ℹ️ Service ${template.name} existe déjà pour ${salonName}`);
      }
    }
  }
  
  return servicesCreated;
}

export {
  generateServicesForAllSalons,
  generateServicesForSalon
};