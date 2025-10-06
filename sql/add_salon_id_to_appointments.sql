-- Migration: Ajouter salon_id à la table appointments
-- Date: 2025-10-05

-- 1. Ajouter la colonne salon_id
ALTER TABLE appointments 
ADD COLUMN salon_id UUID REFERENCES salons(id);

-- 2. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_appointments_salon_id ON appointments(salon_id);

-- 3. Mettre à jour les données existantes
-- Associer les appointments existants au salon du propriétaire
UPDATE appointments 
SET salon_id = (
  SELECT s.id 
  FROM salons s 
  WHERE s.owner_id = appointments.user_id 
  LIMIT 1
)
WHERE salon_id IS NULL;

-- 4. Rendre la colonne obligatoire après la migration
ALTER TABLE appointments 
ALTER COLUMN salon_id SET NOT NULL;

-- 5. Vérification
SELECT 
  COUNT(*) as total_appointments,
  COUNT(salon_id) as appointments_with_salon,
  COUNT(DISTINCT salon_id) as unique_salons
FROM appointments;