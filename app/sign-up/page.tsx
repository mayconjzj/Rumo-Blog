import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import CommunityAuthShell from "../components/CommunityAuthShell";
import CommunitySignUpForm from "./CommunitySignUpForm";
import GoogleAuthButton from "../components/GoogleAuthButton";

export const metadata = {
  title: "Criar conta | Revista Rumo",
  robots: { index: false, follow: false },
};

type SearchParams = { erro?: string; returnTo?: string };

function getSafeReturnTo(value?: string) {
  return value === "/submeter" ||
    (value?.startsWith("/pesquisas/") && !value.startsWith("//"))
    ? value
    : "/pesquisas";
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const returnTo = getSafeReturnTo(query.returnTo);
  const { data } = await auth.getSession();

  if (data?.user) {
    const email = data.user.email?.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    redirect(adminEmail && email === adminEmail ? "/admin" : returnTo);
  }

  return (
    <CommunityAuthShell
      eyebrow="CADASTRO DA COMUNIDADE"
      title="Crie sua conta."
      description="Cadastre-se para avaliar pesquisas científicas e acompanhar suas contribuições na comunidade Rumo."
    >
      <div className="google-auth-section">\n        <GoogleAuthButton returnTo={returnTo} label="Criar conta com Google" />\n        <div className="auth-divider"><span>ou cadastre-se com e-mail</span></div>\n      </div>\n      <CommunitySignUpForm returnTo={returnTo} />

      <p className="login-subtitle">
        Já tem conta?{" "}
        <Link href={returnTo !== "/pesquisas" ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}>
          Entrar
        </Link>
      </p>
      <Link href="/pesquisas" className="login-home-link">
        ← Voltar às pesquisas
      </Link>
    </CommunityAuthShell>
  );
}
