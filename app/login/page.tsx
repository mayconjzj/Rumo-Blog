import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import CommunityAuthShell from "../components/CommunityAuthShell";
import { communitySignInAction } from "../comunidade/actions";

export const metadata = {
  title: "Entrar | Revista Rumo",
  robots: { index: false, follow: false },
};

type SearchParams = {
  erro?: string;
  cadastro?: string;
  returnTo?: string;
};

function getSafeReturnTo(value?: string) {
  return value === "/submeter" ||
    (value?.startsWith("/pesquisas/") && !value.startsWith("//"))
    ? value
    : "/pesquisas";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const returnTo = getSafeReturnTo(query.returnTo);
  const { data } = await auth.getSession();
  const email = data?.user?.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (data?.user) redirect(adminEmail && email === adminEmail ? "/admin" : returnTo);

  return (
    <CommunityAuthShell
      eyebrow="ACESSO À COMUNIDADE"
      title="Entre para avaliar pesquisas."
      description="Use sua conta para publicar avaliações fundamentadas e participar das discussões. Uma avaliação comunitária não equivale a revisão científica formal."
    >
      {query.cadastro === "ok" && (
        <p className="community-auth-success" role="status">
          Cadastro concluído. Entre com seu e-mail e senha.
        </p>
      )}
      {query.erro && (
        <p className="community-auth-error" role="alert">
          {query.erro === "campos"
            ? "Preencha e-mail e senha."
            : "Não foi possível entrar. Confira os dados e tente novamente."}
        </p>
      )}
      <form action={communitySignInAction} className="login-form community-login-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="community-email">E-mail</label>
        <input
          id="community-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
        />
        <label htmlFor="community-password">Senha</label>
        <input
          id="community-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          required
        />
        <button className="login-submit" type="submit">Entrar <span aria-hidden="true">↗</span></button>
      </form>
      <p className="login-subtitle">
        <Link href="/forgot-password">Esqueci minha senha</Link>
      </p>
      <p className="login-subtitle">
        Ainda não tem conta?{" "}
        <Link
          href={returnTo !== "/pesquisas" ? `/sign-up?returnTo=${encodeURIComponent(returnTo)}` : "/sign-up"}
        >
          Criar conta
        </Link>
      </p>
      <Link href="/pesquisas" className="login-home-link">
        ← Voltar às pesquisas
      </Link>
      <div className="login-security-note">
        <span className="security-symbol" aria-hidden="true">i</span>
        <p>Proteja suas credenciais e não compartilhe sua senha.</p>
      </div>
    </CommunityAuthShell>
  );
}
