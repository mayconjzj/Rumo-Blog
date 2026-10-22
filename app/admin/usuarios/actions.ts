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
  let userExists = false;
  try {
    const rows = await sql.query('SELECT id FROM neon_auth."user" WHERE id = $1 LIMIT 1', [userId]);
    userExists = rows.length > 0;
  } catch {
    redirect("/admin/usuarios?erro=banco");
  }
  if (!userExists) redirect("/admin/usuarios?erro=usuario");
  try {
    await sql.query("INSERT INTO public.community_user_profiles (auth_user_id, community_enabled, updated_at, disabled_at, disabled_by) VALUES ($1, FALSE, NOW(), NOW(), $2) ON CONFLICT (auth_user_id) DO UPDATE SET community_enabled = FALSE, updated_at = NOW(), disabled_at = NOW(), disabled_by = EXCLUDED.disabled_by", [userId, adminEmail]);
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
    await sql.query("INSERT INTO public.community_user_profiles (auth_user_id, community_enabled, updated_at, disabled_at, disabled_by) VALUES ($1, TRUE, NOW(), NULL, NULL) ON CONFLICT (auth_user_id) DO UPDATE SET community_enabled = TRUE, updated_at = NOW(), disabled_at = NULL, disabled_by = NULL", [userId]);
  } catch {
    redirect("/admin/usuarios?erro=banco");
  }
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?sucesso=reativado");
}

 
export async function deleteUserAccount(formData: FormData) {
  const { email: adminEmail } = await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();

  if (!uuidPattern.test(userId)) redirect("/admin/usuarios?erro=usuario");
  if (!process.env.DATABASE_URL) redirect("/admin/usuarios?erro=banco");

  const sql = neon(process.env.DATABASE_URL);

  try {
    const rows = (await sql.query(
      'SELECT id, email FROM neon_auth."user" WHERE id = $1 LIMIT 1',
      [userId],
    )) as { id: string; email: string }[];

    const user = rows[0];
    if (!user) redirect("/admin/usuarios?erro=usuario");

    // Never allow the administrator to remove their own admin identity here.
    if (user.email.trim().toLowerCase() === adminEmail.toLowerCase()) {
      redirect("/admin/usuarios?erro=nao-pode-excluir-admin");
    }

    // Neon Auth cascades this deletion to its login sessions and linked auth
    // accounts. Research submissions remain as editorial records.
    await sql.query('DELETE FROM neon_auth."user" WHERE id = $1', [userId]);
  } catch (error) {
    // Next.js redirect() throws internally; preserve redirect control flow.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Failed to delete Neon Auth user", error);
    redirect("/admin/usuarios?erro=banco");
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?sucesso=excluido");
}
