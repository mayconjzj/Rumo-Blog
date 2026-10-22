"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

function safeReturnTo(value: FormDataEntryValue | null): string {
  const path = String(value ?? "");
  return path.startsWith("/pesquisas/") && !path.startsWith("//")
    ? path
    : "/pesquisas";
}

export async function communitySignInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeReturnTo(formData.get("returnTo"));

  if (!email || !password) redirect("/comunidade/entrar?erro=campos");
  const { error } = await auth.signIn.email({ email, password });
  if (error) redirect("/comunidade/entrar?erro=credenciais");
  redirect(returnTo);
}

export async function communitySignUpAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const returnTo = safeReturnTo(formData.get("returnTo"));
  const encodedReturnTo = encodeURIComponent(returnTo);

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    password.length < 10
  ) {
    redirect(`/comunidade/cadastro?erro=campos&returnTo=${encodedReturnTo}`);
  }

  if (password !== confirmPassword) {
    redirect(`/comunidade/cadastro?erro=senha&returnTo=${encodedReturnTo}`);
  }

  const { error } = await auth.signUp.email({ name, email, password });
  if (error) {
    redirect(`/comunidade/cadastro?erro=cadastro&returnTo=${encodedReturnTo}`);
  }

  redirect(
    `/comunidade/entrar?cadastro=ok&returnTo=${encodedReturnTo}`,
  );
}
