-- Migration SQL pour empêcher les public_slug vides
-- À exécuter dans Supabase SQL Editor

-- 1. D'abord, s'assurer que tous les salons existants ont un public_slug
UPDATE salons 
SET public_slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '^-|-$', '', 'g'
  )
) 
WHERE (public_slug IS NULL OR public_slug = '') 
  AND is_template = false 
  AND name IS NOT NULL;

-- 2. Pour les salons sans nom, utiliser l'id
UPDATE salons 
SET public_slug = 'salon-' || substr(id::text, 1, 8)
WHERE (public_slug IS NULL OR public_slug = '') 
  AND is_template = false 
  AND (name IS NULL OR name = '');

-- 3. Ajouter une contrainte pour empêcher les public_slug vides sur les salons non-template
ALTER TABLE salons 
ADD CONSTRAINT check_public_slug_not_empty 
CHECK (
  is_template = true OR 
  (public_slug IS NOT NULL AND length(trim(public_slug)) > 0)
);

-- 4. Créer un index unique sur public_slug pour empêcher les doublons
CREATE UNIQUE INDEX IF NOT EXISTS idx_salons_public_slug_unique 
ON salons (public_slug) 
WHERE is_template = false AND public_slug IS NOT NULL;

-- 5. Fonction pour générer automatiquement un public_slug
CREATE OR REPLACE FUNCTION generate_public_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Si c'est un salon (pas un template) et qu'il n'a pas de public_slug
  IF NEW.is_template = false AND (NEW.public_slug IS NULL OR NEW.public_slug = '') THEN
    -- Générer un slug basé sur le nom
    IF NEW.name IS NOT NULL AND NEW.name != '' THEN
      NEW.public_slug := lower(
        regexp_replace(
          regexp_replace(
            regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'),
            '\s+', '-', 'g'
          ),
          '^-|-$', '', 'g'
        )
      );
    ELSE
      -- Fallback sur l'ID
      NEW.public_slug := 'salon-' || substr(NEW.id::text, 1, 8);
    END IF;
    
    -- S'assurer de l'unicité en ajoutant un suffixe si nécessaire
    WHILE EXISTS (SELECT 1 FROM salons WHERE public_slug = NEW.public_slug AND id != NEW.id) LOOP
      NEW.public_slug := NEW.public_slug || '-' || substr(NEW.id::text, 1, 8);
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer le trigger
DROP TRIGGER IF EXISTS trigger_generate_public_slug ON salons;
CREATE TRIGGER trigger_generate_public_slug
  BEFORE INSERT OR UPDATE ON salons
  FOR EACH ROW
  EXECUTE FUNCTION generate_public_slug();