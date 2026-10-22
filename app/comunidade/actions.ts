"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

function safeReturnTo(value: FormDataEntryValue | string | null): string {
  const path = String(value ?? "");
  return path === "/submeter" ||
    (path.startsWith("/pesquisas/") && !path.startsWith("//"))
    ? path
    : "/pesquisas";
}

export async function getCommunityPostSignInPath(returnTo: string): Promise<string> {
  const fallback = safeReturnTo(returnTo);
  const { data, error } = await auth.getSession();
  if (error || !data?.user) return "/login?erro=credenciais";

  const email = data.user.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && email === adminEmail) return "/admin";
  return fallback;
}

export async function communitySignInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeReturnTo(formData.get("returnTo"));
  if (!email || !password) redirect(`/login?erro=campos&returnTo=${encodeURIComponent(returnTo)}`);
  const { error } = await auth.signIn.email({ email, password });
  if (error) redirect(`/login?erro=credenciais&returnTo=${encodeURIComponent(returnTo)}`);
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && email === adminEmail) redirect("/admin");
  redirect(returnTo);
}

export async function communitySignOutAction() {
  await auth.signOut();
  redirect("/");
}
