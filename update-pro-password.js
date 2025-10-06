import { createClient } from '@supabase/supabase-js';
import { hashSync } from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateProPassword() {
  try {
    console.log('🔑 Mise à jour du mot de passe pour correct@gmail.com...');
    
    // Nouveau mot de passe simple
    const newPassword = 'password123';
    const hashedPassword = hashSync(newPassword, 10);
    
    const { data, error } = await supabase
      .from('pro_users')
      .update({ password: hashedPassword })
      .eq('email', 'correct@gmail.com')
      .select();
    
    if (error) {
      console.error('❌ Erreur:', error.message);
      return;
    }
    
    console.log('✅ Mot de passe mis à jour avec succès !');
    console.log('📧 Email: correct@gmail.com');
    console.log('🔐 Nouveau mot de passe: password123');
    console.log('👤 Utilisateur:', data[0]);
    
  } catch (error) {
    console.error('❌ Erreur script:', error.message);
  }
}

updateProPassword();
