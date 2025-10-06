#!/bin/bash

# Script de correction et création de vue pour les services
source .env.local

echo "=== Correction Base de Données Services ==="

# A.1 - Ajout de la colonne duration à services si elle n'existe pas
echo "1) Ajout colonne duration à services..."
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  "$SUPABASE_URL/rest/v1/rpc/sql_execute" \
  -d '{"sql": "ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration int4 DEFAULT 30;"}'

echo ""

# A.2 - Mise à jour des données existantes avec des durées par défaut
echo "2) Mise à jour durées par défaut..."
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  "$SUPABASE_URL/rest/v1/rpc/sql_execute" \
  -d '{"sql": "UPDATE public.services SET duration = CASE WHEN name LIKE \"%Coupe%\" THEN 30 WHEN name LIKE \"%Coloration%\" THEN 90 WHEN name LIKE \"%Balayage%\" THEN 120 ELSE 45 END WHERE duration IS NULL;"}'

echo ""

# A.3 - Création de la vue effective
echo "3) Création vue v_salon_service_effective..."
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  "$SUPABASE_URL/rest/v1/rpc/sql_execute" \
  -d '{
    "sql": "DROP VIEW IF EXISTS public.v_salon_service_effective; CREATE OR REPLACE VIEW public.v_salon_service_effective AS SELECT ss.salon_id, ss.service_id, s.name AS service_name, s.description AS service_description, s.price AS base_price, s.duration AS base_duration, ss.price AS override_price, ss.duration AS override_duration, COALESCE(ss.price, s.price) AS effective_price, COALESCE(ss.duration, s.duration) AS effective_duration, ss.created_at FROM public.salon_services ss JOIN public.services s ON s.id = ss.service_id;"
  }'

echo ""

# A.4 - Droits lecture
echo "4) Attribution droits lecture..."
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  "$SUPABASE_URL/rest/v1/rpc/sql_execute" \
  -d '{"sql": "GRANT SELECT ON public.v_salon_service_effective TO anon, authenticated;"}'

echo ""
echo "=== Fin Corrections ==="