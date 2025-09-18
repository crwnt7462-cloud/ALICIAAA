import fetch from "node-fetch";

async function run() {
  const base = process.env.BASE_URL || "http://localhost:3000";
  const token = process.env.TEST_TOKEN;

  console.log("🚬 Smoke test: GET /healthz");
  const health = await fetch(`${base}/healthz`);
  if (health.status !== 200) {
    throw new Error(`Healthz failed: ${health.status}`);
  }
  console.log("✅ /healthz OK");

  if (!token) {
    console.warn("⚠️  TEST_TOKEN non défini → on saute les tests d’API protégées");
    return;
  }

  console.log("🚬 Smoke test: GET /api/salons");
  const res = await fetch(`${base}/api/salons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) {
    throw new Error(`/api/salons failed: ${res.status}`);
  }
  console.log("✅ /api/salons OK");
}

run().catch((err) => {
  console.error("❌ Smoke tests failed:", err.message);
  process.exit(1);
});
