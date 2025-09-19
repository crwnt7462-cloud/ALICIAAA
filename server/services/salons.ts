


export type SupabaseClient = {
  from: (table: string) => {
    select: (columns: string) => any;
    eq: (col: string, val: unknown) => any;
    single: () => any;
    insert: (payload: unknown[]) => any;
    update?: (payload: unknown) => any;
  };
};

export interface DuplicateFromTemplateParams {
  ownerId: string;
  templateSlug: string;
  supabase: SupabaseClient;
}

export async function duplicateFromTemplate({
  ownerId,
  templateSlug,
  supabase
}: DuplicateFromTemplateParams): Promise<{ id: string; name: string; owner_id: string }> {
  const { data: template, error: templateError } = await supabase
    .from("salon_templates")
    .select("*")
    .eq("slug", templateSlug)
    .single();

  if (templateError || !template) {
    const err = new Error("Template not found") as Error & { code: string };
    err.code = "TEMPLATE_NOT_FOUND";
    throw err;
  }

  const allowedFields = [
    "name", "description", "business_email", "business_phone", "business_address",
    "social_instagram", "social_facebook", "custom_colors"
  ];
  const payload: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if ((template as Record<string, unknown>)[key] !== undefined) payload[key] = (template as Record<string, unknown>)[key];
  }
  payload.is_template = false;
  payload.owner_id = ownerId;

  const { data, error } = await supabase
    .from("salons")
    .insert([payload])
    .select("id,name,owner_id")
    .single();

  if (error) {
    const err = new Error("Supabase insert error") as Error & { code: string; supabaseError: unknown };
    err.code = "SUPABASE_ERROR";
    err.supabaseError = error;
    throw err;
  }

  return data as { id: string; name: string; owner_id: string };
}
