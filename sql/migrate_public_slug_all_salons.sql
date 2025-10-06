-- Script SQL pour générer un slug public pour tous les salons existants sans public_slug
-- À exécuter dans Supabase SQL Editor ou psql

DO $$
DECLARE
  r RECORD;
  base_slug TEXT;
  unique_slug TEXT;
  suffix INT;
BEGIN
  FOR r IN SELECT id, name FROM salons WHERE public_slug IS NULL OR public_slug = '' LOOP
    base_slug := lower(regexp_replace(unaccent(r.name), '[^a-z0-9]+', '-', 'g'));
    base_slug := regexp_replace(base_slug, '(^-|-$)', '', 'g');
    unique_slug := base_slug;
    suffix := 1;
    -- Vérifie l'unicité et ajoute un suffixe si besoin
    WHILE EXISTS (SELECT 1 FROM salons WHERE public_slug = unique_slug) LOOP
      unique_slug := base_slug || '-' || suffix;
      suffix := suffix + 1;
    END LOOP;
    UPDATE salons SET public_slug = unique_slug WHERE id = r.id;
  END LOOP;
END $$;
