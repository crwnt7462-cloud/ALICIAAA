// server/auth/index.ts
// ⚠️ Stub DEV provisoire pour débloquer le boot.
// Lit req.user si déjà défini par un middleware ; sinon, autorise un mode "mock"
// via l'en-tête Authorization: Bearer dev-pro (role=pro) ou dev-user (role=user).

export type AuthUser = { id: string; role: "pro" | "user" };

export async function getAuthUser(req: any): Promise<AuthUser | null> {
  if (req?.user && req.user.id) return req.user as AuthUser;

  // 2) Mode mock via Authorization
  const h = req?.headers?.authorization as string | undefined;
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1].trim();

  if (token === "dev-pro") {
    return { id: "dev-pro", role: "pro" };
  }
  if (token === "dev-user") {
    return { id: "dev-user", role: "user" };
  }

  // Par défaut, on reste prudent: pas d'utilisateur si on ne reconnaît pas le token
  return null;
}

export function assertProRole(user: { role?: string } | null | undefined) {
  if (!user) {
    const e: any = new Error("Non authentifié");
    e.status = 401;
    throw e;
  }
  if (user.role !== "pro") {
    const e: any = new Error("Accès réservé aux professionnels");
    e.status = 403;
    throw e;
  }
}
