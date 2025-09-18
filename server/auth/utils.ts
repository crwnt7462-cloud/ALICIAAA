/**
 * Extracts the Bearer token from the Authorization header of an Express request.
 * @param req Express request object
 * @returns Bearer token string or null
 */
export function getBearerToken(req: any): string | null {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (!auth || typeof auth !== 'string') return null;
  const match = auth.match(/^Bearer (.+)$/);
  return match && match[1] ? match[1] : null;
}

/**
 * Decodes a JWT and returns the user id (sub or user.id) if present.
 * @param jwt JWT string
 * @returns user id string or null
 */
export function getUserIdFromJwt(jwt: string | null): string | null {
  if (!jwt || typeof jwt !== 'string') return null;
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1] ?? '', 'base64url').toString());
    if (typeof payload.sub === 'string') return payload.sub;
    if (payload.user && typeof payload.user.id === 'string') return payload.user.id;
    return null;
  } catch {
    return null;
  }
}
