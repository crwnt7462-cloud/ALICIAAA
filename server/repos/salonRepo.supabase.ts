import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export function makeSalonRepoSupabase() {
  return {
    async list() {
      const { data, error } = await supabase.from('salons').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
    async get(id: string) {
      const { data, error } = await supabase.from('salons').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    },
    async insert(values: any) {
      // Insère dans la table salon_templates
      const { data, error } = await supabase.from('salon_templates').insert([values]);
      if (error) throw new Error(error.message);
      return data;
    },
    async select() {
      // Correction : nom de table Supabase
      const { data, error } = await supabase.from('salon_templates').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    }
  };
}
