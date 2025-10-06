import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://efkekkajoyfgtyqziohy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI3ODI5NCwiZXhwIjoyMDcyODU0Mjk0fQ.KLfHaxzhEXfgq-gSTQXLWYG5emngLbrCBK6w7me78yw'
);

async function main() {
  const { data, error } = await supabase
    .from('services')
    .insert([{
      name: 'Test direct',
      price: 42,
      duration: 60,
      description: 'Test insert direct via script',
      photos: ['https://placekitten.com/200/200'],
      user_id: '9d3ab728-cd3f-4314-b302-4173c8e1f657' // Remplace par un vrai UUID de ta table auth.users
    }])
    .select();

  console.log('data:', data);
  console.log('error:', error);
}

main();