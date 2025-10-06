BEGIN;

-- 1) SALONS : lecture publique minimale (id) pour ne plus bloquer les check existants éventuels
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "salons_select_public" ON public.salons;
CREATE POLICY "salons_select_public"
ON public.salons
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- 2) PROFESSIONNELS : lecture publique (vitrine)
ALTER TABLE public.professionnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionnels FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professionnels_select_public" ON public.professionnels;
CREATE POLICY "professionnels_select_public"
ON public.professionnels
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- 3) SALON_SERVICES & SERVICES en lecture publique
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_services FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "salon_services_select_public" ON public.salon_services;
CREATE POLICY "salon_services_select_public"
ON public.salon_services
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_select_public" ON public.services;
CREATE POLICY "services_select_public"
ON public.services
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

COMMIT;