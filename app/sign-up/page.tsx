import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import CommunityAuthShell from "../components/CommunityAuthShell";
import { communitySignUpAction } from "../comunidade/actions";

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
      {query.erro && (
        <p className="community-auth-error" role="alert">
          {query.erro === "senha"
            ? "As senhas não coincidem. Confira os dois campos."
            : query.erro === "cadastro"
              ? "Não foi possível criar a conta. Verifique os dados ou tente outro e-mail."
              : "Informe um nome válido, e-mail e senha com pelo menos 10 caracteres."}
        </p>
      )}
      <form action={communitySignUpAction} className="login-form community-login-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="community-name">Nome público</label>
        <input
          id="community-name"
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          placeholder="Como seu nome será exibido"
          required
        />
        <label htmlFor="community-signup-email">E-mail</label>
        <input
          id="community-signup-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="voce@exemplo.com"
          required
        />
        <label htmlFor="community-signup-password">Senha (mínimo 10 caracteres)</label>
        <input
          id="community-signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          placeholder="Crie uma senha segura"
          required
        />
        <label htmlFor="community-confirm-password">Confirme a senha</label>
        <input
          id="community-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          placeholder="Digite a senha novamente"
          required
        />
        <button className="login-submit" type="submit">Criar conta <span aria-hidden="true">↗</span></button>
      </form>
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
