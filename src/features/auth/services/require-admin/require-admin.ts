import "server-only";

import { auth } from "@clerk/nextjs/server";

import { isAdmin } from "@/features/auth/services/admin-role/admin-role";

export async function requireAdmin() {
  const { sessionClaims } = await auth();

  return auth.protect(() => isAdmin(sessionClaims));
}
