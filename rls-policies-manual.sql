-- Script SQL à exécuter dans Supabase SQL Editor
-- https://supabase.com/dashboard/project/efkekkajoyfgtyqziohy/sql

BEGIN;

-- 1) SALONS : lecture publique minimale
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "salons_select_public" ON public.salons;
CREATE POLICY "salons_select_public" ON public.salons 
FOR SELECT TO public USING (true);

-- 2) PROFESSIONNELS : lecture publique  
ALTER TABLE public.professionnels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "professionnels_select_public" ON public.professionnels;
CREATE POLICY "professionnels_select_public" ON public.professionnels 
FOR SELECT TO public USING (true);

-- 3) SALON_SERVICES : lecture publique
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "salon_services_select_public" ON public.salon_services;
CREATE POLICY "salon_services_select_public" ON public.salon_services 
FOR SELECT TO public USING (true);

-- 4) SERVICES : lecture publique
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "services_select_public" ON public.services;
CREATE POLICY "services_select_public" ON public.services 
FOR SELECT TO public USING (true);

COMMIT;

-- Vérification des politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('salons', 'professionnels', 'salon_services', 'services')
ORDER BY tablename, policyname;