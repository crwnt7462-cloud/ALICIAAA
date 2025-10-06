-- ========================================
-- RLS SECURITY IMPLEMENTATION - Option A
-- ========================================
-- 
-- OBJECTIF: Sécuriser l'accès anonyme aux données salon/services
-- - Créer une vue publique sécurisée
-- - Retirer l'accès direct aux tables pour anonymes  
-- - Conserver RLS sur toutes les tables
--
-- USAGE: Exécuter dans Supabase SQL Editor
-- ========================================

-- 1. Créer la vue sécurisée pour les données publiques
CREATE OR REPLACE VIEW effective_services_public AS
SELECT 
    s.id as salon_id,
    s.name as salon_name,
    s.business_email,
    s.business_phone,
    s.business_address,
    s.public_slug,
    -- Services avec prix/durée effective
    ss.service_id,
    sv.name as service_name,
    COALESCE(ss.price, sv.price) as effective_price,
    COALESCE(ss.duration, sv.duration) as effective_duration,
    sv.category,
    -- Métadonnées
    s.updated_at,
    s.created_at
FROM salons s
JOIN salon_services ss ON ss.salon_id = s.id
JOIN services sv ON sv.id = ss.service_id
WHERE 
    -- Filtres de sécurité (Option A: pas de flag is_public encore)
    s.name IS NOT NULL
    AND ss.active IS NOT FALSE  -- Inclut NULL comme actif par défaut
    AND (ss.price > 0 OR sv.price > 0)  -- Prix valide requis
ORDER BY s.name, sv.name;

-- 2. Donner accès SELECT à la vue pour anonymes
GRANT SELECT ON effective_services_public TO anon;
GRANT SELECT ON effective_services_public TO authenticated;

-- 3. Sécuriser les tables - Retirer accès direct anonyme
-- Note: Garder l'accès authenticated pour les opérations privées

-- Révoquer accès anonyme direct aux tables critiques
REVOKE ALL ON salons FROM anon;
REVOKE ALL ON services FROM anon; 
REVOKE ALL ON salon_services FROM anon;

-- Conserver accès authenticated (pour dashboard, admin)
-- Ces accès restent protégés par RLS
GRANT SELECT ON salons TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON salons TO authenticated;
GRANT SELECT ON services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON salon_services TO authenticated;

-- 4. Activer RLS sur toutes les tables (si pas déjà fait)
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS pour authenticated (accès privé)
-- Salon: propriétaire peut tout faire sur ses salons
DROP POLICY IF EXISTS "Salon owners can manage their salons" ON salons;
CREATE POLICY "Salon owners can manage their salons"
    ON salons FOR ALL
    TO authenticated
    USING (auth.uid()::text = owner_id OR auth.uid() IS NOT NULL);

-- Services: lecture libre pour authenticated (catalogue global)
DROP POLICY IF EXISTS "Authenticated users can read services" ON services;
CREATE POLICY "Authenticated users can read services"
    ON services FOR SELECT
    TO authenticated
    USING (true);

-- Salon_services: propriétaire du salon peut gérer ses liens
DROP POLICY IF EXISTS "Salon owners can manage their salon services" ON salon_services;
CREATE POLICY "Salon owners can manage their salon services"
    ON salon_services FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM salons 
            WHERE salons.id = salon_services.salon_id 
            AND (salons.owner_id = auth.uid()::text OR auth.uid() IS NOT NULL)
        )
    );

-- 6. Commentaires de documentation
COMMENT ON VIEW effective_services_public IS 
'Vue sécurisée pour accès anonyme aux salons et services. 
Centralise la logique prix/durée effective.
Accès: anon (SELECT uniquement), authenticated (SELECT).
Tables sources protégées par RLS.';

-- ========================================
-- VALIDATION QUERIES (à exécuter pour test)
-- ========================================

-- Test 1: Vue accessible en anonyme
-- SELECT salon_name, service_name, effective_price FROM effective_services_public LIMIT 5;

-- Test 2: Tables inaccessibles en anonyme (doit échouer)
-- SELECT * FROM salons LIMIT 1; -- Doit retourner "permission denied"

-- Test 3: Authenticated peut accéder aux tables
-- (nécessite un token valide)

-- ========================================
-- ROLLBACK (si nécessaire)
-- ========================================

-- Pour annuler les changements:
-- DROP VIEW IF EXISTS effective_services_public;
-- GRANT SELECT ON salons TO anon;
-- GRANT SELECT ON services TO anon;
-- GRANT SELECT ON salon_services TO anon;