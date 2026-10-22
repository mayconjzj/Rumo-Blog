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

  if (data?.user) redirect(returnTo);

  return (
    <CommunityAuthShell
      eyebrow="REVISTA CIENTÍFICA"
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
      <form action={communitySignInAction} className="community-auth-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="community-email">E-mail</label>
        <input
          id="community-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <label htmlFor="community-password">Senha</label>
        <input
          id="community-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <button type="submit">Entrar ↗</button>
      </form>
      <p className="community-auth-switch">
        <Link href="/forgot-password">Esqueci minha senha</Link>
      </p>
      <p className="community-auth-switch">
        Ainda não tem conta?{" "}
        <Link
          href={
            returnTo !== "/pesquisas"
              ? `/sign-up?returnTo=${encodeURIComponent(returnTo)}`
              : "/sign-up"
          }
        >
          Criar conta
        </Link>
      </p>
      <Link href="/pesquisas" className="community-auth-back">
        ← Voltar às pesquisas
      </Link>
    </CommunityAuthShell>
  );
}
