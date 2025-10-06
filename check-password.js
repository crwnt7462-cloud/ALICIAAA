import bcrypt from 'bcryptjs';

// Le hash existant dans la base
const existingHash = '$2b$10$zUtf6Ud67tGq0YUz2VSBS.Q0wzKVtQFP3cji.HF9Ed60ZJ3cSeRUy';

// Essayons de retrouver le mot de passe original
const possiblePasswords = [
  '123456',
  'password',
  'password123',
  'admin',
  'admin123',
  'test',
  'test123',
  'correct',
  'correct123',
  'salon',
  'salon123',
  'demo',
  'demo123',
  '1234',
  '12345',
  '123456789',
  'qwerty',
  'azerty',
  'milop',
  'MILOP',
  'melo',
  'MELO',
  'melop',
  'MELOP'
];

console.log('🔍 Vérification du hash existant...');

for (const password of possiblePasswords) {
  const isMatch = bcrypt.compareSync(password, existingHash);
  if (isMatch) {
    console.log(`✅ TROUVÉ! Le mot de passe est: "${password}"`);
    process.exit(0);
  } else {
    console.log(`❌ "${password}" ne correspond pas`);
  }
}

console.log('\n❌ Aucun mot de passe trouvé dans la liste.');
console.log('Hash à vérifier:', existingHash);
