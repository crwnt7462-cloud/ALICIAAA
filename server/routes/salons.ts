// ───────── GET /api/salons (liste paginée/filtrée/triée, sécurité, metrics, logs) ─────────
// Acceptation :
// - curl -sS http://localhost:3000/healthz → {"ok":true}
// - export TEST_TOKEN="$(jq -r '.access_token' /tmp/sb_login.json)"
// - export SALON_ID="$(./scripts/seed_salon.sh | head -n1)"
// - curl -sS -H 'Accept: application/json' "http://localhost:3000/api/salons/$SALON_ID" | jq . → 200 JSON du salon
// - ./scripts/test_salon.sh → affiche :
//   ◦ GET status: 200
//   ◦ PATCH status: 200
//   ◦ affected: 1 (si ownership OK)
//   ◦ After PATCH, <col>: Nom test patch (re-GET OK)
import { Router } from "express";
import { getSupabaseForJwt, assertSupabaseEnv } from "../lib/supabaseClient";
import { z } from "zod";
import { getBearerToken, getUserIdFromJwt } from "../auth/utils";
import { duplicateFromTemplate } from '../services/salons';

assertSupabaseEnv();
const router = Router();

// Tous les handlers router.get sont déclarés après cette ligne pour éviter ReferenceError.

// ───────── GET /api/salons (liste paginée/filtrée/triée, sécurité, metrics, logs) ─────────
router.get('/', async (req, res) => {
  const jwt = getBearerToken(req);
  if (!jwt) return res.status(401).json({ error: 'Missing Bearer token' });
  const userId = getUserIdFromJwt(jwt);
  if (!userId) return res.status(401).json({ error: 'Invalid token' });
  const supabase = getSupabaseForJwt(jwt);
  // Champs autorisés (projection)
  const allowedFields = [
    'id','name','description','business_email','business_phone','business_address','legal_form','siret','vat_number','billing_name','billing_address','custom_colors','revision','updated_at','created_at'
  ];
  const forbiddenFields = ['owner_id','is_template'];
  // Paramètres query
  const q = req.query.q ? String(req.query.q) : undefined;
  const sort = req.query.sort ? String(req.query.sort) : 'updated_at';
  const order = req.query.order === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const per_page = Math.min(50, Math.max(1, parseInt(String(req.query.per_page || '20'), 10) || 20));
  const fields = req.query.fields ? String(req.query.fields).split(',').map(f => f.trim()).filter(Boolean) : null;
  const includeMetrics = req.query.include === 'metrics';
  // Validation des champs
  if (fields) {
    for (const f of fields) {
      if (!allowedFields.includes(f) || forbiddenFields.includes(f)) {
        return res.status(400).json({ error: 'Forbidden field in projection', field: f });
      }
    }
  }
  if (!['name','updated_at','created_at'].includes(sort)) {
    return res.status(400).json({ error: 'Invalid sort field' });
  }
  if (per_page > 50) {
    return res.status(400).json({ error: 'per_page capped at 50' });
  }
  // Construction de la requête
  // Always select owner_id for filtering, but do not return it in data
  const selectFields = (fields ? [...fields, 'owner_id'] : ['id','name','updated_at','owner_id']);
  let query = supabase.from('salons').select(selectFields.join(', '), { count: 'exact' });
  query = query.eq('owner_id', userId);
  if (q) {
    query = query.ilike('name', `%${q}%`);
  }
  query = query.order(sort, { ascending: order === 'asc' });
  query = query.range((page-1)*per_page, page*per_page-1);
  // Exécution
  const { data, error, count } = await query;
  if (error) {
    return res.status(500).json({ error: 'Query failed', details: error.message });
  }
  // Remove owner_id from each row in data
  const safeData = Array.isArray(data) ? data.map(row => {
    if (row && typeof row === 'object' && 'owner_id' in row) {
      const { owner_id, ...rest } = row;
      return rest;
    }
    return row;
  }) : [];
  // Metrics optionnel
  let metrics = undefined;
  if (includeMetrics) {
    const { data: mdata } = await supabase
      .from('salons')
      .select('updated_at')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);
    metrics = {
      count: count || 0,
      last_updated_at: mdata && mdata[0] ? mdata[0].updated_at : null
    };
  }
  // Pagination
  const total = count || 0;
  const total_pages = Math.max(1, Math.ceil(total / per_page));
  // Log info minimal (route hit)
  console.info('[salon_get_list] route hit', { page, per_page, sort, order });
  return res.status(200)
    .set('Cache-Control', 'private, no-store')
    .json({
      data: safeData,
      page,
      per_page,
      total,
      total_pages,
      sort,
      order,
      ...(includeMetrics ? { metrics } : {})
    });
});

// POST /api/salons/from-template
router.post('/from-template', async (req, res) => {
  const jwt = getBearerToken(req);
  if (!jwt) return res.status(401).json({ error: 'Missing Bearer token' });
  const userId = getUserIdFromJwt(jwt);
  if (!userId) return res.status(401).json({ error: 'Invalid token' });
  const { template_slug } = req.body;
  if (!template_slug) return res.status(400).json({ error: 'Missing template_slug' });
  const supabase = getSupabaseForJwt(jwt);
  try {
    const result = await duplicateFromTemplate({ ownerId: userId, templateSlug: template_slug, supabase });
    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && (err as any).code === 'TEMPLATE_NOT_FOUND') {
      return res.status(404).json({ error: 'Template not found' });
    }
    return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
  }
});

// ───────── GET /api/salons/:id (détail sécurisé, shape complète, ETag, logs, 304) ─────────
router.get('/:id', async (req, res) => {
  const jwt = getBearerToken(req);
  if (!jwt) return res.status(401).json({ error: 'Missing Bearer token' });
  const userId = getUserIdFromJwt(jwt);
  if (!userId) return res.status(401).json({ error: 'Invalid token' });
  const { id } = req.params;
  const supabase = getSupabaseForJwt(jwt);
  // Champs autorisés (shape complète, pas owner_id ni is_template)
  const allowedFields = [
    'id','name','description','business_email','business_phone','business_address','legal_form','siret','vat_number','billing_name','billing_address','custom_colors','revision','updated_at'
  ];
  // Always select owner_id for ownership check, but do not return it
  const selectFields = [...allowedFields, 'owner_id'];
  const { data, error } = await supabase
    .from('salons')
    .select(selectFields.join(', '))
    .eq('id', id)
    .eq('owner_id', userId)
    .maybeSingle();
  // Type guard: data must be a valid object with owner_id and revision
  if (
    error ||
    !data ||
    typeof data !== 'object' ||
    !('owner_id' in data) ||
    !('revision' in data)
  ) {
    // Log info minimal (route hit)
    console.info('[salon_get_detail] route hit', { salon_id: id });
    return res.status(404).json({ error: 'Salon not found' });
  }
  const salonData = data as any;
  const etag = `W/"revision-${salonData.revision}"`;
  const etagIn = req.headers['if-none-match'];
  if (etagIn && etagIn === etag) {
    // Log info minimal (route hit 304)
    console.info('[salon_get_detail] 304', { salon_id: id });
    return res.status(304).set('ETag', etag).set('Cache-Control', 'private, no-store').end();
  }
  // Log info minimal (route hit 200)
  console.info('[salon_get_detail] 200', { salon_id: id });
  // Remove owner_id before sending response
  const { owner_id, ...safeData } = salonData;
  return res.status(200)
    .set('ETag', etag)
    .set('Cache-Control', 'private, no-store')
    .json(safeData);
});

// ───────── GET /api/salons/first ─────────
// 200 {id,name} si trouvé, sinon 404 { "error": "No salon found" }
router.get('/first', async (req, res) => {
  const selectCols = ['id', 'name', 'label', 'title'];
  const supabase = getSupabaseForJwt(null);
  const { data, error } = await supabase
    .from('salons')
    .select(selectCols.join(', '))
    .limit(1)
    .single();
  const d = data as any;
  if (error || !d || typeof d !== 'object' || !('id' in d) || !d.id) {
    return res.status(404).json({ error: 'No salon found' });
  }
  let displayName = null;
  for (const key of ['name', 'label', 'title']) {
    if (key in d && typeof d[key] === 'string' && d[key].trim() !== '') {
      displayName = d[key];
      break;
    }
  }
  if (!displayName) {
    displayName = d.id || null;
  }
  return res.status(200).json({ id: d.id, name: displayName });
});

// ───────── PATCH /api/salons/:id ─────────
// Ownership stricte (.eq("id", id).eq("owner_id", userId)), whitelist dynamique incluant PRIMARY_TEXT_COL, 200 { affected, data }, 403/404 JSON strict
const PATCH_WHITELIST = [
  "name",
  "description",
  "business_email",
  "business_phone",
  "business_address",
  "legal_form",
  "siret",
  "vat_number",
  "billing_name",
  "billing_address",
  "custom_colors"
] as const;
const PatchSalonSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  business_email: z.string().email().max(255).optional(),
  business_phone: z.string().regex(/^[+\d\s-]{6,20}$/).optional(),
  business_address: z.string().max(300).optional(),
  legal_form: z.string().max(100).optional(),
  siret: z.string().regex(/^\d{14}$/).optional(),
  vat_number: z.string().regex(/^[A-Z]{2}[0-9A-Z]{2,}$/i).optional(),
  billing_name: z.string().max(200).optional(),
  billing_address: z.string().max(300).optional(),
  custom_colors: z.preprocess(
    (v) => typeof v === 'string' ? (() => { try { return JSON.parse(v); } catch { return v; } })() : v,
    z.object({
      primary: z.string().regex(/^#([0-9a-fA-F]{6})$/),
      secondary: z.string().regex(/^#([0-9a-fA-F]{6})$/)
    })
  ).optional(),
}).strict();

router.patch('/:id', async (req, res) => {
  const jwt = getBearerToken(req);
  if (!jwt) return res.status(401).json({ error: 'Missing Bearer token' });
  const userId = getUserIdFromJwt(jwt);
  if (!userId) return res.status(401).json({ error: 'Invalid token' });
  const { id } = req.params;
  const supabase = getSupabaseForJwt(jwt);

  // --- OPTIMISTIC LOCKING ---
  // 1. Lecture préalable du salon (avec updated_at)
  const { data: salonRow, error: getErr } = await supabase
    .from('salons')
    .select('id,owner_id,updated_at')
    .eq('id', id)
    .single();
  if (getErr || !salonRow) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (String(salonRow.owner_id) !== String(userId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // 2. Contrôle de version (optimistic locking)
  const lastKnownRevision = req.body.last_known_revision;
  if (typeof lastKnownRevision !== 'number' && typeof lastKnownRevision !== 'string') {
    return res.status(400).json({ error: 'Missing version (last_known_revision required)' });
  }
  const revisionToUse = Number(lastKnownRevision);
  if (!Number.isInteger(revisionToUse)) {
    return res.status(400).json({ error: 'Invalid revision (must be integer)' });
  }

  // 3. Filtrage whitelist (conserve la logique existante)
  let payload: Partial<Record<string, any>> = {};
  let forbidden = [];
  for (const key in req.body) {
    if (PATCH_WHITELIST.includes(key as any)) {
      payload[key] = req.body[key];
    } else if (key !== 'last_known_revision') {
      forbidden.push(key);
    }
  }
  if (forbidden.length > 0) {
    return res.status(400).json({ error: 'Forbidden field(s)', fields: forbidden });
  }

  // 4. Validation zod (conserve la logique existante)
  const parse = PatchSalonSchema.safeParse(payload);
  if (!parse.success) {
    return res.status(422).json({ error: 'Unprocessable Entity', details: parse.error.errors });
  }

  // 5. PATCH (update + updated_at serveur)
  // Appel du RPC patch_salon_with_revision (atomique, whitelist, revision+1, updated_at)
  const { data: updatedRows, error: patchErr } = await supabase
    .rpc('patch_salon_with_revision', {
      p_salon_id: id,
      p_last_known_revision: revisionToUse,
      p_payload: payload
    });
  if (patchErr) {
    return res.status(500).json({ error: 'Update failed', details: patchErr.message });
  }
  if (!updatedRows || updatedRows.length === 0) {
    // Vérifier accessibilité pour différencier 409 vs 404
    const { data: checkSalon } = await supabase
      .from('salons')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (checkSalon) {
      return res.status(409).json({ error: 'Conflict: refresh and retry' });
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  }
  const updated = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;
  if (!updated) {
    return res.status(500).json({ error: 'Update failed', details: 'No updated row returned' });
  }
  // Calculer les champs effectivement modifiés
  const changedFields = Object.keys(payload).filter(k => typeof payload[k] !== 'undefined');
  // Log update
  try {
    await supabase.from('salon_updates').insert({
      salon_id: id,
      user_id: userId,
      changed_fields: changedFields
    });
  } catch (e) {
    // log fail soft
    console.warn('[salon_updates] log insert failed', e);
  }
  return res.status(200).json({
    id: updated.id,
    revision: updated.revision,
    updated_at: updated.updated_at,
    changed_fields: changedFields
  });
});

// ───────── POST /api/salons ─────────
// Création d'un salon : body JSON { name, ...autres champs }, 201 { id, name, owner_id }, 400/401/403 JSON strict
router.post("/api/salons", async (req, res) => {
  // [salons:post] Instrumentation safe
  const jwt = getBearerToken(req);
  const userId = getUserIdFromJwt(jwt);
  console.log("[salons:post]", {
    route_hit: true,
    path: req.path,
    method: req.method,
    has_body: !!req.body,
    body_keys: req.body ? Object.keys(req.body) : [],
    supabase_project_ref: (process.env.SUPABASE_URL || "").split("//")[1]?.split(".")[0] || "unknown"
  });

  const { name, ...otherFields } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: missing owner_id" });
  }
  const supabase = getSupabaseForJwt(jwt);
  const { data, error } = await supabase
    .from("salons")
    .insert([{ name, ...otherFields, owner_id: userId }])
    .select("id,name,owner_id")
    .single();

  console.log("[salons:post]", {
    insert_ok: !error,
    supabase_error_code: error?.code,
    supabase_error_message: error?.message
  });

  if (error) {
    return res.status(400).json({
      code: error.code,
      message: error.message,
      hint: error.hint
    });
  }

  return res.status(201).json(data);
});

// ───────── POST /api/salons/from-template ─────────
// Création d'un salon à partir d'un template : body JSON { template_slug }, 201 { id, name, owner_id }, 400/401/403 JSON strict
router.post("/from-template", async (req, res) => {
  const jwt = getBearerToken(req);
  const userId = getUserIdFromJwt(jwt);
  const template_slug = req.body?.template_slug || "default-modern";
  const owner_id = userId;
  console.log("[salons:from-template]", {
    route_hit: true,
    template_slug,
    owner_present: !!userId,
  });

  if (!owner_id) {
    return res.status(401).json({ error: "Unauthorized: missing owner_id" });
  }

  try {
    const result = await duplicateFromTemplate({ ownerId: owner_id, templateSlug: template_slug });
    console.log("[salons:from-template]", { insert_ok: true });
    return res.status(201).json(result);
  } catch (err: any) {
    if (err.code === "TEMPLATE_NOT_FOUND") {
      return res.status(404).json({ error: "Template not found" });
    }
    if (err.code === "SUPABASE_ERROR") {
      console.log("[salons:from-template]", {
        insert_ok: false,
        supabase_error_code: err.supabaseError?.code,
        supabase_error_message: err.supabaseError?.message,
      });
      return res.status(400).json({
        code: err.supabaseError?.code,
        message: err.supabaseError?.message,
        hint: err.supabaseError?.hint,
      });
    }
    return res.status(400).json({ error: "Unknown error" });
  }
});

export default router;
