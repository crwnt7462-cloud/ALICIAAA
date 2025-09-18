// @ts-nocheck
import { and, eq } from "drizzle-orm";
import { supabase } from "../db";
import { getAuthUser } from "../auth";
import { salons } from "../shared/schema";

export type CreateFromTemplateInput = {
  templateId: string;
  dryRun?: boolean;
};

function assertProRole(user: any) {
  if (user?.role !== "pro") {
    const err: any = new Error("Accès réservé aux professionnels");
    err.status = 403;
    throw err;
  }
}

export async function createSalonFromTemplate(req: any, input: CreateFromTemplateInput) {
  const user = await getAuthUser(req);
  if (!user) {
    const err: any = new Error("Non authentifié");
    err.status = 401;
    throw err;
  }
  assertProRole(user);

  const { templateId, dryRun = true } = input || {};
  if (!templateId) {
    const err: any = new Error("templateId requis");
    err.status = 400;
    throw err;
  }

  // Vérifie l’existence du template et son flag isTemplate=true
  const tpl = await db.query.salons.findFirst({
    where: (s, { eq, and }) => and(eq(s.id, templateId), eq(s.isTemplate, true)),
    columns: { id: true, name: true, slug: true, isTemplate: true, ownerId: true },
  });

  if (!tpl) {
    const err: any = new Error("Template introuvable ou invalide");
    err.status = 404;
    throw err;
  }

  // Étape 2.3-A : DRY-RUN — aucune écriture
  if (dryRun) {
    return {
      ok: true,
      mode: "dry-run",
      message: "Validation OK : prêt à cloner sans toucher au template source.",
      template: { id: tpl.id, name: tpl.name, slug: tpl.slug },
      actor: { id: user.id, role: user.role },
    };
  }

  // (À implémenter en 2.3-B+) — clonage réel en transaction
  const err: any = new Error("Clonage non activé (dryRun=false), prochaine étape 2.3-B)");
  err.status = 501;
  throw err;
}
