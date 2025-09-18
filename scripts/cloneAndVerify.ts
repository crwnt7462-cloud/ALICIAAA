
// @ts-nocheck
// scripts/cloneAndVerify.ts — UNIVERSAL
// Usage : HOST=http://localhost:3000 TOKEN="Bearer XXX" TEMPLATE_ID="uuid-template" npx tsx scripts/cloneAndVerify.ts

import "dotenv/config";

// ---------- 0) ENV ----------
const HOST = process.env.HOST || "http://localhost:3000";
const TOKEN = process.env.TOKEN || "";           // "Bearer eyJ..."
const TEMPLATE_ID = process.env.TEMPLATE_ID || "";
if (!TOKEN) { console.error("❌ TOKEN manquant. Ex: TOKEN='Bearer ...'"); process.exit(1); }
if (!TEMPLATE_ID) { console.error("❌ TEMPLATE_ID manquant. Ex: TEMPLATE_ID='uuid'"); process.exit(1); }

// ---------- 1) HELPERS IMPORT DYNAMIQUE ----------
async function tryImport(paths: string[]) {
  for (const p of paths) {
    try { return await import(p); } catch (_) {}
  }
  return null;
}

async function loadDB() {
  const mod = await tryImport([
    "../server/db",
    "../server/database",
    "../server/lib/db",
    "../server/core/db",
  ]);
  if (!mod || !mod.db) {
    console.error("❌ Impossible d'importer `db` (essais: server/db, server/database, ...).");
    process.exit(1);
  }
  return mod.db;
}

async function loadSchema() {
  const mod = await tryImport([
    "../server/shared/schema",
    "../server/db/schema",
    "../server/schema",
    "../server/models/schema",
  ]);
  if (!mod) {
    console.error("❌ Impossible d'importer le schéma Drizzle (schema.ts). Ajuste le chemin.");
    process.exit(1);
  }
  // tolérant : on accepte salons/categories au niveau racine ou groupés
  const salons = mod.salons || mod.Salons || mod.tables?.salons || mod.default?.salons;
  const categories = mod.categories || mod.Categories || mod.tables?.categories || mod.default?.categories;
  if (!salons || !categories) {
    console.error("❌ Le schéma importé ne contient pas `salons` et `categories`.");
    process.exit(1);
  }
  return { salons, categories };
}

async function loadDrizzleOps() {
  const m1 = await tryImport(["drizzle-orm"]);
  const eq = m1?.eq;
  if (!eq) {
    console.error("❌ Impossible d'importer `eq` depuis drizzle-orm.");
    process.exit(1);
  }
  return { eq };
}

// ---------- 2) APPEL API CLONAGE ----------
async function apiCloneCategories() {
  console.log(`▶️ POST ${HOST}/api/salons/from-template/clone-categories`);
  const res = await fetch(`${HOST}/api/salons/from-template/clone-categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": TOKEN },
    body: JSON.stringify({ templateId: TEMPLATE_ID, overrides: { salonName: "Mon Salon Copie" } }),
  });

  let json: any = {};
  try { json = await res.json(); } catch (_) {}

  if (!res.ok) {
    console.error("❌ API error", res.status, json?.error || json);
    process.exit(1);
  }
  if (!json?.id) {
    console.error("❌ API 201 sans `id` dans la réponse:", json);
    process.exit(1);
  }
  console.log("✅ API 201 OK →", json);
  return json.id as string;
}

// ---------- 3) QUERIES DB (compat query.* OU select().from()) ----------
async function getSalon(db: any, tables: any, eq: any, id: string) {
  // Drizzle moderne : db.query.salons.findFirst
  if (db.query?.salons?.findFirst) {
    return await db.query.salons.findFirst({
      where: (s: any, { eq: _eq }: any) => _eq(s.id, id),
    });
  }
  // Fallback : builder
  if (db.select && tables.salons) {
    const rows = await db.select().from(tables.salons).where(eq(tables.salons.id, id)).limit(1);
    return rows?.[0] || null;
  }
  throw new Error("db.query.salons.findFirst et db.select().from indisponibles");
}

async function getCategoriesBySalon(db: any, tables: any, eq: any, salonId: string) {
  // Pas de query.categories par défaut ; on passe par builder
  if (db.select && tables.categories) {
    const col = tables.categories.salonId || tables.categories.salon_id;
    const rows = await db.select().from(tables.categories).where(eq(col, salonId));
    return rows || [];
  }
  throw new Error("db.select().from indisponible pour categories");
}

// ---------- 4) NORMALISATION DES CHAMPS ----------
function pickSalonFields(s: any) {
  if (!s) return s;
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    isTemplate: s.isTemplate ?? s.is_template,
    ownerId: s.ownerId ?? s.owner_id,
    sourceTemplateId: s.sourceTemplateId ?? s.source_template_id,
    createdAt: s.createdAt ?? s.created_at,
  };
}
function catLabel(c: any) {
  const so = ("sortOrder" in c) ? c.sortOrder : c.sort_order;
  return `• ${c.name} (sortOrder=${so ?? 0})`;
}

// ---------- 5) MAIN ----------
(async function main() {
  const newSalonId = await apiCloneCategories();

  const db = await loadDB();
  const { salons, categories } = await loadSchema();
  const { eq } = await loadDrizzleOps();

  const salon = await getSalon(db, { salons, categories }, eq, newSalonId);
  if (!salon) {
    console.error("❌ Salon introuvable en DB:", newSalonId);
    process.exit(1);
  }
  const cats = await getCategoriesBySalon(db, { salons, categories }, eq, newSalonId);

  const norm = pickSalonFields(salon);

  console.log("\n──────── RAPPORT ────────");
  console.log("Salon créé:");
  console.dir(norm, { depth: null });

  console.log("\nCatégories clonées:", cats.length);
  if (cats.length) {
    const lines = cats.slice(0, 5).map(catLabel).join("\n");
    console.log(lines);
    if (cats.length > 5) console.log(`… (+${cats.length - 5} autres)`);
  }
  console.log("Template source: laissé intact par design (aucune update effectuée).");
  console.log("──────── FIN ────────\n");
})().catch((e) => {
  console.error("❌ Script error:", e);
  process.exit(1);
});
