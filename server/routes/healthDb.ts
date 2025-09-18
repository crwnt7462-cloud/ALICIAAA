import { Router } from "express";
// server/routes/healthDb.ts
const router = Router();
// Santé DB (stub pour ne pas bloquer le boot). On mettra un vrai ping SQL plus tard.
router.get("/", (_req, res) => {
	res.status(200).json({ ok: true, db: "stub" });
});
export default router;
