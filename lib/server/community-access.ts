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
  if (!email || !userId) return { status: "anonymous" };
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("SELECT community_enabled FROM public.community_user_profiles WHERE auth_user_id = $1 LIMIT 1", [userId]) as { community_enabled: boolean }[];
  if (rows[0]?.community_enabled === false) return { status: "disabled", userId, email };
  return { status: "enabled", userId, email, name: user?.name?.trim().slice(0, 100) || email.split("@")[0] || "Membro da comunidade" };
}
