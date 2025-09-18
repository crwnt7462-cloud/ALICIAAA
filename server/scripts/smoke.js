
// server/scripts/smoke.js
// Smoke minimal pour API Avyento (serveur)
// - GET /healthz
// - GET /api/salons/:id (avec SALON_ID)
// - PATCH /api/salons/:id (change billingName)
// - Re-GET pour vérifier la persistance

import fetch from "node-fetch";

async function assert(status, okStatus, msg) {
  if (status !== okStatus) {
    throw new Error(`${msg}: ${status}`);
  }
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Variable d'environnement manquante: ${name}`);
  return v;
}

async function run() {
  const base = process.env.BASE_URL || "http://localhost:3000";
  const token = requireEnv("TEST_TOKEN"); // JWT utilisateur de test
  const salonId = requireEnv("SALON_ID"); // ID d'un salon possédé (is_template=false)

  console.log("🚬 Smoke: GET /healthz");
  const h = await fetch(`${base}/healthz`);
  await assert(h.status, 200, "/healthz failed");
  console.log("✅ /healthz OK");

  console.log(`🚬 Smoke: GET /api/salons/${salonId}`);
  const get1 = await fetch(`${base}/api/salons/${salonId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (get1.status === 404) {
    throw new Error(`/api/salons/:id 404 — id inexistant ou non possédé`);
  }
  if (get1.status === 403) {
    throw new Error(`/api/salons/:id 403 — permissions/RLS`);
  }
  await assert(get1.status, 200, "/api/salons/:id failed (GET)");
  const body1 = await get1.json();
  console.log("✅ GET initial OK:", { id: body1.id, billingName: body1.billingName });

  const newBillingName = `SMOKE-${Date.now()}`;

  console.log(`🚬 Smoke: PATCH /api/salons/${salonId} (billingName=${newBillingName})`);
  const patchRes = await fetch(`${base}/api/salons/${salonId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ billingName: newBillingName }),
  });

  if (patchRes.status === 404) throw new Error("PATCH 404 — rowCount=0 (id/non-owner/template)");
  if (patchRes.status === 403) throw new Error("PATCH 403 — RLS/ownership");
  await assert(patchRes.status, 200, "PATCH failed");
  const patchBody = await patchRes.json();
  if (patchBody.billingName !== newBillingName) {
    throw new Error(`PATCH echo mismatch: expected ${newBillingName}, got ${patchBody.billingName}`);
  }
  console.log("✅ PATCH OK");

  console.log(`🚬 Smoke: re-GET /api/salons/${salonId}`);
  const get2 = await fetch(`${base}/api/salons/${salonId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  await assert(get2.status, 200, "re-GET failed");
  const body2 = await get2.json();
  if (body2.billingName !== newBillingName) {
    throw new Error(`Persist mismatch: expected ${newBillingName}, got ${body2.billingName}`);
  }
  console.log("✅ Persistance confirmée. Smoke OK ✅");
}

run().catch((err) => {
  console.error("❌ Smoke failed:", err.message);
  process.exit(1);
});
