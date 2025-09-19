-- Migration initiale : création de la table salons (extrait Supabase)
CREATE TABLE public.salons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  business_email text,
  business_phone text,
  business_address text,
  legal_form text,
  siret text,
  vat_number text,
  billing_name text,
  billing_address text,
  custom_colors jsonb,
  owner_id uuid,
  is_template boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  revision integer NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);
-- Index pour recherche rapide par owner
CREATE INDEX IF NOT EXISTS idx_salons_owner_id ON public.salons(owner_id);
-- Index pour recherche par siret
CREATE INDEX IF NOT EXISTS idx_salons_siret ON public.salons(siret);
-- Activer la sécurité RLS (à compléter selon policies réelles)
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
