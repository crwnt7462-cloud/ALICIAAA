import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://efkekkajoyfgtyqziohy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI3ODI5NCwiZXhwIjoyMDcyODU0Mjk0fQ.KLfHaxzhEXfgq-gSTQXLWYG5emngLbrCBK6w7me78yw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Nouveaux membres d'équipe
const newTeamMembers = [
  {
    id: 1,
    name: "Julie Moreau",
    role: "Coiffeuse Senior", 
    bio: "Experte en colorations et coupes tendances, Julie vous accompagne dans votre transformation capillaire.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    nextSlot: "14:30",
    experience: "8 ans d'expérience",
    specialties: ["Colorations", "Coupes tendances", "Soins capillaires"],
    reviewsCount: 127,
    availableToday: true
  },
  {
    id: 2,
    name: "Sarah Martin",
    role: "Esthéticienne",
    bio: "Spécialiste des soins du visage et manucure, Sarah prend soin de votre beauté.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    nextSlot: "15:00",
    experience: "5 ans d'expérience",
    specialties: ["Soins visage", "Manucure", "Épilation"],
    reviewsCount: 98,
    availableToday: true
  },
  {
    id: 3,
    name: "Emma Dubois",
    role: "Styliste",
    bio: "Créative et passionnée, Emma vous conseille pour un style unique qui vous ressemble.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    nextSlot: "16:30",
    experience: "6 ans d'expérience",
    specialties: ["Styling", "Conseil mode", "Coiffures événementielles"],
    reviewsCount: 85,
    availableToday: true
  },
  {
    id: 4,
    name: "Léa Bernard",
    role: "Masseuse",
    bio: "Détente et bien-être, Léa vous offre des moments de relaxation absolue.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    nextSlot: "17:00", 
    experience: "7 ans d'expérience",
    specialties: ["Massage relaxant", "Massage thérapeutique", "Reflexologie"],
    reviewsCount: 142,
    availableToday: true
  }
];

async function updateTeamMembers() {
  try {
    console.log('🔄 Mise à jour des membres d\'équipe...');
    
    // Mettre à jour le salon avec les nouveaux team_members
    const { data, error } = await supabase
      .from('salons')
      .update({ 
        team_members: newTeamMembers
      })
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e');

    if (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      return;
    }

    console.log('✅ Membres d\'équipe mis à jour avec succès !');
    console.log('📋 Nouveaux membres:');
    newTeamMembers.forEach(member => {
      console.log(`  - ${member.name} (${member.role})`);
    });

    // Vérification
    const { data: salon, error: fetchError } = await supabase
      .from('salons')
      .select('team_members')
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e')
      .single();

    if (fetchError) {
      console.error('❌ Erreur lors de la vérification:', fetchError);
      return;
    }

    console.log('🔍 Vérification - Membres actuels dans la base:');
    console.log(JSON.stringify(salon.team_members, null, 2));

  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

updateTeamMembers();