"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/admin-auth";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function disableCommunityProfile(formData: FormData) {
  const { email: adminEmail } = await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();
  if (!uuidPattern.test(userId)) redirect("/admin/usuarios?erro=usuario");
  if (!process.env.DATABASE_URL) redirect("/admin/usuarios?erro=banco");
  const sql = neon(process.env.DATABASE_URL);
  try {
    const rows = await sql.query('SELECT id FROM neon_auth."user" WHERE id = $1 LIMIT 1', [userId]);
    if (!rows.length) redirect("/admin/usuarios?erro=usuario");
    await sql.query(
      "INSERT INTO public.community_user_profiles (auth_user_id, community_enabled, updated_at, disabled_at, disabled_by) VALUES ($1, FALSE, NOW(), NOW(), $2) ON CONFLICT (auth_user_id) DO UPDATE SET community_enabled = FALSE, updated_at = NOW(), disabled_at = NOW(), disabled_by = EXCLUDED.disabled_by",
      [userId, adminEmail],
    );
  } catch {
    redirect("/admin/usuarios?erro=banco");
  }
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?sucesso=desativado");
}

export async function enableCommunityProfile(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();
  if (!uuidPattern.test(userId)) redirect("/admin/usuarios?erro=usuario");
  if (!process.env.DATABASE_URL) redirect("/admin/usuarios?erro=banco");
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql.query(
      "INSERT INTO public.community_user_profiles (auth_user_id, community_enabled, updated_at, disabled_at, disabled_by) VALUES ($1, TRUE, NOW(), NULL, NULL) ON CONFLICT (auth_user_id) DO UPDATE SET community_enabled = TRUE, updated_at = NOW(), disabled_at = NULL, disabled_by = NULL",
      [userId],
    );
  } catch {
    redirect("/admin/usuarios?erro=banco");
  }
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?sucesso=reativado");
}
