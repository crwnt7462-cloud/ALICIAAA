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

assertSupabaseEnv();
const router = Router();

// ───────── GET /api/salons/:id ─────────
// 200 JSON du salon (id + champ texte principal si présent), sinon 404 JSON strict
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabaseForJwt(null);
  const selectCols = ['id', 'name', 'label', 'title'];
  const { data, error } = await supabase
    .from('salons')
    .select(selectCols.join(', '))
    .eq('id', id)
    .single();
  const d = data as any;
  if (error || !d || typeof d !== 'object' || !('id' in d) || !d.id) {
    return res.status(404).json({ error: 'Salon not found' });
  }
  let name = null;
  for (const key of ['name', 'label', 'title']) {
    if (key in d && d[key]) {
      name = d[key];
      break;
    }
  }
  return res.status(200).json({ id: d.id, name });
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
const PATCH_WHITELIST = ["name", "description", "address", "phone", "specialties"] as const;
const PatchSalonSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  address: z.string().max(300).optional(),
  phone: z.string().max(50).optional(),
  specialties: z.string().max(200).optional(),
}).strict();

router.patch('/:id', async (req, res) => {
  const jwt = getBearerToken(req);
  if (!jwt) return res.status(401).json({ error: 'Missing Bearer token' });
  const userId = getUserIdFromJwt(jwt);
  if (!userId) return res.status(401).json({ error: 'Invalid token' });
  const { id } = req.params;
  const supabase = getSupabaseForJwt(jwt);

  // Détection PRIMARY_TEXT_COL comme /first
  const selectCols = ['name', 'label', 'title'] as const;
  const { data: firstSalon } = await supabase
    .from('salons')
    .select(selectCols.join(', '))
    .eq('id', id)
    .single();
  let PRIMARY_TEXT_COL: typeof selectCols[number] | undefined = undefined;
  if (firstSalon && typeof firstSalon === 'object') {
    for (const key of selectCols) {
      if (Object.prototype.hasOwnProperty.call(firstSalon, key) && (firstSalon as any)[key]) {
        PRIMARY_TEXT_COL = key;
        break;
      }
    }
  }

  // WHITELIST dynamique
  let whitelist = [...PATCH_WHITELIST];
  if (PRIMARY_TEXT_COL && !whitelist.includes(PRIMARY_TEXT_COL as any)) {
    whitelist = [...whitelist, PRIMARY_TEXT_COL as any];
  }

  // Filtrage whitelist
  let payload: Partial<Record<string, any>> = {};
  for (const key of whitelist) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      payload[key] = req.body[key];
    }
  }

  // Validation zod
  const parse = PatchSalonSchema.safeParse(payload);
  if (!parse.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[PATCH /salons/:id] DEV', {
        userId, salonId: id, payloadKeys: Object.keys(payload), whitelist, PRIMARY_TEXT_COL, affectedCount: 0, error: parse.error.errors
      });
    }
    return res.status(400).json({ error: 'Invalid payload', details: parse.error.errors });
  }

  // Ownership stricte
  const { data: salonRow, error: getErr } = await supabase
    .from('salons')
    .select('id,owner_id')
    .eq('id', id)
    .single();
  if (getErr || !salonRow) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (String(salonRow.owner_id) !== String(userId)) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[PATCH /salons/:id] DEV', { userId, salonId: id, ownerId: salonRow.owner_id, affectedCount: 0, error: 'Ownership KO' });
    }
    return res.status(403).json({ error: 'Forbidden' });
  }

  // PATCH
  const { data: updated, error: patchErr } = await supabase
    .from('salons')
    .update(payload)
    .eq('id', id)
    .eq('owner_id', userId)
    .select()
    .single();
  const affected = updated ? 1 : 0;
  if (process.env.NODE_ENV === 'development') {
    console.error('[PATCH /salons/:id] DEV', { userId, salonId: id, payloadKeys: Object.keys(payload), whitelist, PRIMARY_TEXT_COL, affectedCount: affected, error: patchErr });
  }
  return res.status(200).json({ affected, data: updated });
});

export default router;
