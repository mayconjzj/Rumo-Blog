"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export type LoginState = { error: string };

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe o e-mail e a senha." };
  }

  const { error } = await auth.signIn.email({ email, password });

  if (error) {
    return { error: "Não foi possível entrar. Confira o e-mail e a senha." };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || email.toLowerCase() !== adminEmail) {
    await auth.signOut();
    return { error: "Esta conta não tem permissão para acessar a área administrativa." };
  }

  redirect("/admin");
}
