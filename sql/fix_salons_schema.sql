DROP VIEW IF EXISTS public.salons_rest;NOTIFY pgrst, 'reload schema';-- ============================================================================
--  [Changelog] Fusion non destructive du plan REST-safe / 42703
--  Date : 2025-09-16
--  Cette version fusionne les blocs normalisés (A→E + Annexe) pour correction PostgREST.
--  Aucune exécution automatique, livrable documentaire uniquement.
--  [Backup] : Le fichier est versionné par Git. Si volumineux, dupliquer manuellement en fix_salons_schema.bak.sql avant modification.
-- ============================================================================

-- =========================================================================
-- BLOC A — Renommage défensif (optionnel, à n’utiliser que si le diag prouve un nom anormal)
-- =========================================================================
-- Utilise ce bloc si le diagnostic (via information_schema.columns) révèle un nom de colonne anormal,
-- par exemple "Id", " id", "ID", ou un identifiant entre guillemets.
--
-- Pour lister les colonnes réelles :
--   SELECT column_name, quote_ident(column_name) AS ident, length(column_name) AS len
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'salons';
--
-- Exemple de renommage (à adapter selon le cas réel) :
--   ALTER TABLE public.salons RENAME COLUMN "Id" TO id;
--   ALTER TABLE public.salons RENAME COLUMN " id" TO id;
--
-- ⚠️ Attention : ce changement peut impacter triggers, index, RLS/policies, et le code applicatif.
--   Toujours re-tester après modification.

-- [Si un bloc similaire existe déjà, le marquer ici comme obsolète/superseded]

-- =========================================================================
-- BLOC B — Création d’une vue REST-safe (contournement immédiat conseillé)
-- =========================================================================
-- Ce bloc crée une vue public.salons_rest exposant uniquement des colonnes sûres.
-- La vue ne modifie pas la table d’origine et sert de façade REST le temps que le cache se régénère.
--
CREATE OR REPLACE VIEW public.salons_rest AS
SELECT
  id,
  coalesce(name, label, title, id::text) AS name,
  owner_id,
  created_at,
  updated_at
FROM public.salons;

-- [Si un bloc similaire existe déjà, le marquer ici comme obsolète/superseded]

-- =========================================================================
-- BLOC C — Droits minimum (GRANT)
-- =========================================================================
-- Accorde les droits de lecture sur la vue aux rôles REST (anon, authenticated, service_role).
-- ⚠️ Si RLS/policies sont actifs sur salons, il peut être nécessaire de les répliquer sur salons_rest.
--   (Exemple : CREATE POLICY ... ON public.salons_rest ...)
--   Service_role a déjà des droits étendus, mais on documente pour cohérence.
--
GRANT SELECT ON public.salons_rest TO anon, authenticated, service_role;

-- [Si un bloc similaire existe déjà, le marquer ici comme obsolète/superseded]

-- =========================================================================
-- BLOC D — Tests REST (commentés)
-- =========================================================================
-- Avant d’exécuter, utilise le script npm diag:supabase ou charge .env.local dans ton shell.
--
-- Tester la vue :
--   curl -i "$SUPABASE_URL/rest/v1/salons_rest?select=id,name&limit=1" \
--     -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
--     -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
--   # Attendu : HTTP 200, JSON avec id et name visibles.
--
-- Après actions Studio (Reload schema cache / Restart project) :
--   curl -i "$SUPABASE_URL/rest/v1/salons?select=id,name&limit=1" ...
--   # Attendu : HTTP 200, id et name visibles.
--
-- Si l’un des tests échoue (erreur 42703, colonne absente) :
--   - Refaire Reload schema cache
--   - Restart project
--   - Vérifier schéma public exposé et RLS/policies

-- [Si un bloc similaire existe déjà, le marquer ici comme obsolète/superseded]

-- =========================================================================
-- BLOC E — Nettoyage / Réversibilité
-- =========================================================================
-- Pour supprimer la vue une fois le cache REST redevenu correct :
--   DROP VIEW IF EXISTS public.salons_rest;
--
-- Si seuls les blocs B–C–E sont utilisés, rien d’irréversible n’a été fait.

-- [Si un bloc similaire existe déjà, le marquer ici comme obsolète/superseded]

-- =========================================================================
-- ANNEXE — Check-list Studio (à copier-coller)
-- =========================================================================
-- 1. Settings → API → Reload schema cache
-- 2. Settings → General → Restart project
-- 3. Settings → API → Exposed schemas doit inclure public
-- 4. RLS/Policies : vérifier table salons et rôle utilisé

-- [Fin de la fusion non destructive]
