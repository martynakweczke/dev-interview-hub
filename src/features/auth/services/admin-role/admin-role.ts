export const ADMIN_ROLE = "admin";

export function isAdmin(
  claims: Record<string, unknown> | null | undefined
): boolean {
  const metadata = claims?.metadata;

  if (typeof metadata !== "object" || metadata === null) {
    return false;
  }

  return "role" in metadata && metadata.role === ADMIN_ROLE;
}
