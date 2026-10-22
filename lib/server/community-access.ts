import "server-only";

import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";

export type CommunityAccess =
  | { status: "anonymous" }
  | { status: "disabled"; userId: string; email: string }
  | { status: "enabled"; userId: string; email: string; name: string };

export async function getCommunityAccess(): Promise<CommunityAccess> {
  const { data } = await auth.getSession();
  const user = data?.user;
  const email = user?.email?.trim().toLowerCase();
  const userId = user?.id ? String(user.id) : "";

  if (!email || !userId || user?.emailVerified === false) return { status: "anonymous" };
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    const rows = (await sql.query(
      "SELECT community_enabled FROM public.community_user_profiles WHERE auth_user_id = $1 LIMIT 1",
      [userId],
    )) as { community_enabled: boolean }[];

    if (rows[0]?.community_enabled === false) {
      return { status: "disabled", userId, email };
    }
  } catch (error) {
    // The profile table is an optional moderation layer until migration 003
    // has been applied. Do not turn an authenticated visit into a 500 merely
    // because that migration is missing; preserve the default-enabled policy.
    const databaseError = error as { code?: string };
    if (databaseError.code !== "42P01") throw error;
    console.warn(
      "community_user_profiles table is missing; community access defaults to enabled until migration 003 is applied.",
    );
  }

  return {
    status: "enabled",
    userId,
    email,
    name:
      user?.name?.trim().slice(0, 100) ||
      email.split("@")[0] ||
      "Membro da comunidade",
  };
}
