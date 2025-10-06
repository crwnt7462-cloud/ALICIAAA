import { SupabaseClient } from './salons';

export interface ApplyTemplateToSalonParams {
  salonId: string;
  templateSlug: string;
  supabase: SupabaseClient;
}

export async function applyTemplateToSalon({
  salonId,
  templateSlug,
  supabase
}: ApplyTemplateToSalonParams): Promise<{ id: string; updated: boolean }> {
  // Récupérer le template
  const { data: template, error: templateError } = await supabase
    .from('salon_templates')
    .select('*')
    .eq('slug', templateSlug)
    .single();
  if (templateError || !template) {
    const err = new Error('Template not found') as Error & { code: string };
    err.code = 'TEMPLATE_NOT_FOUND';
    throw err;
  }
  // Champs à copier
  const allowedFields = [
    'name', 'description', 'business_email', 'business_phone', 'business_address',
    'social_instagram', 'social_facebook', 'custom_colors'
  ];
  const payload: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if ((template as Record<string, unknown>)[key] !== undefined) payload[key] = (template as Record<string, unknown>)[key];
  }
  // Appliquer le template au salon existant (update)
  const { error: updateError } = await supabase
    .from('salons')
    .update(payload)
    .eq('id', salonId);
  if (updateError) {
    const err = new Error('Supabase update error') as Error & { code: string; supabaseError: unknown };
    err.code = 'SUPABASE_ERROR';
    err.supabaseError = updateError;
    throw err;
  }
  return { id: salonId, updated: true };
}
