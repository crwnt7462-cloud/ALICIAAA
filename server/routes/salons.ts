import { Router } from "express";
import { supabase } from "../db";
const router = Router();

// GET /:salonId/services
router.get("/:salonId/services", async (req, res) => {
  try {
    const { salonId } = req.params;
    if (!salonId)
      return res.status(400).json({ ok: false, error: "salonId requis" });
    if (!supabase) throw new Error("Service role not initialized");
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("salon_id", salonId)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data: data ?? [] });
  } catch (e: any) {
    return res
      .status(500)
      .json({ ok: false, error: e?.message ?? "Internal error" });
  }
});

// POST /:salonId/services
router.post("/:salonId/services", async (req, res) => {
  try {
    const { salonId } = req.params;
    const body: any = req.body;
    if (
      !salonId ||
      typeof body?.name !== "string" ||
      typeof body?.price !== "number" ||
      typeof body?.duration !== "number"
    ) {
      return res
        .status(400)
        .json({
          ok: false,
          error: "salonId, name, price(number), duration(number) requis",
        });
    }
    if (!supabase) throw new Error("Service role not initialized");
    const { data: salon, error: eSalon } = await supabase
      .from("salons")
      .select("owner_id")
      .eq("id", salonId)
      .single();
    if (eSalon || !salon?.owner_id) {
      return res
        .status(400)
        .json({ ok: false, error: "owner_id introuvable pour ce salon" });
    }
    const insert = {
      name: body.name.trim(),
      price: body.price,
      duration: body.duration,
      salon_id: salonId,
      user_id: salon.owner_id,
    };
    const { data, error } = await supabase
      .from("services")
      .insert(insert)
      .select("id")
      .single();
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(201).json({ ok: true, id: data.id });
  } catch (e: any) {
    return res
      .status(500)
      .json({ ok: false, error: e?.message ?? "Internal error" });
  }
});

// PUT /:salonId/services/:serviceId
router.put("/:salonId/services/:serviceId", async (req, res) => {
  try {
    const { salonId, serviceId } = req.params;
    const body: any = req.body;
    if (!salonId || !serviceId) {
      return res
        .status(400)
        .json({ ok: false, error: "salonId et serviceId requis" });
    }
    if (!supabase) throw new Error("Service role not initialized");
    const patch: any = {};
    if (typeof body?.name === "string") patch.name = body.name.trim();
    if (typeof body?.price === "number") patch.price = body.price;
    if (typeof body?.duration === "number") patch.duration = body.duration;
    const { error } = await supabase
      .from("services")
      .update(patch)
      .eq("id", serviceId)
      .eq("salon_id", salonId);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res
      .status(500)
      .json({ ok: false, error: e?.message ?? "Internal error" });
  }
});

// DELETE /:salonId/services/:serviceId
router.delete("/:salonId/services/:serviceId", async (req, res) => {
  try {
    const { salonId, serviceId } = req.params;
    if (!salonId || !serviceId) {
      return res
        .status(400)
        .json({ ok: false, error: "salonId et serviceId requis" });
    }
    if (!supabase) throw new Error("Service role not initialized");
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId)
      .eq("salon_id", salonId);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res
      .status(500)
      .json({ ok: false, error: e?.message ?? "Internal error" });
  }
});
export default router;
