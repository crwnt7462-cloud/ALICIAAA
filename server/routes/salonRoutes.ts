// @ts-nocheck
import { Router } from "express";
import { createSalonFromTemplate } from "../services/salonService";
// Shim local minimal pour getAuthUser
type User = { id: string; role?: string } | null;
async function getAuthUser(req: any): Promise<User> {
  return (req && (req as any).user) ? (req as any).user : null;
}

const router = Router();

// Auth douce spécifique à la route dry-run (pour ne rien casser ailleurs)
router.use("/from-template/dry-run", async (req: any, res, next) => {
  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "Non authentifié" });
    req.user = user;
    next();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Auth error" });
  }
});

// POST /api/salons/from-template/dry-run
router.post("/from-template/dry-run", async (req: any, res) => {
  try {
    const result = await createSalonFromTemplate(req, {
      templateId: req.body?.templateId,
      dryRun: true,
    });
    return res.status(200).json(result);
  } catch (e: any) {
    console.error("[dry-run createSalonFromTemplate] error", e);
    return res.status(e?.status || 500).json({ error: e?.message || "Server error" });
  }
});

export default router;
