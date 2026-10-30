import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/server";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type SearchParams = { returnTo?: string };

function getSafeReturnTo(value?: string) {
  return value === "/submeter" ||
    (value?.startsWith("/pesquisas/") && !value.startsWith("//"))
    ? value
    : "/pesquisas";
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();
  const query = await searchParams;
  const returnTo = getSafeReturnTo(query.returnTo);
  const { data } = await auth.getSession();

  if (!data?.user) {
    redirect(`/login?erro=oauth&returnTo=${encodeURIComponent(returnTo)}`);
  }
  if (data.user.emailVerified !== true) redirect("/verificar-email");

  const email = data.user.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && email === adminEmail) redirect("/admin");
  redirect(returnTo);
}
