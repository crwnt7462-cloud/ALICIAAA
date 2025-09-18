import { Router } from "express";
const router = Router();

// STUB TEMP — ancienne version cassée. On remettra la vraie logique plus tard.
router.get("/", (_req, res) => {
  // Appwrite non utilisé. Fichier neutralisé. Voir Supabase pour la santé DB.
  res.status(200).json({ ok: true, diag: "appwrite", mode: "stub" });
});

export default router;
