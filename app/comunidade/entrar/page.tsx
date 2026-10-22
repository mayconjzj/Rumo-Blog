import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { communitySignInAction } from "../actions";

export const metadata = {
  title: "Entrar na comunidade | Revista Rumo",
  robots: { index: false, follow: false },
};

export default async function CommunitySignIn({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; cadastro?: string; returnTo?: string }>;
}) {
  const query = await searchParams;
  const { data: session } = await auth.getSession();
  if (session?.user) redirect(query.returnTo?.startsWith("/pesquisas/") ? query.returnTo : "/pesquisas");

  return (
    <main className="community-auth-page">
      <div className="community-auth-panel">
        <Link href="/" className="community-auth-brand">RUMO<span>.</span></Link>
        <p className="community-auth-eyebrow">COMUNIDADE CIENTÍFICA</p>
        <h1>Entre para avaliar pesquisas.</h1>
        <p className="community-auth-copy">Use sua conta para publicar avaliações fundamentadas e participar das discussões. Uma avaliação comunitária não equivale a revisão científica formal.</p>
        {query.cadastro === "ok" && <p className="community-auth-success" role="status">Cadastro concluído. Entre com seu e-mail e senha.</p>}
        {query.erro && <p className="community-auth-error" role="alert">{query.erro === "campos" ? "Preencha e-mail e senha." : "Não foi possível entrar. Confira os dados e tente novamente."}</p>}
        <form action={communitySignInAction} className="community-auth-form">
          <input type="hidden" name="returnTo" value={query.returnTo?.startsWith("/pesquisas/") ? query.returnTo : "/pesquisas"} />
          <label htmlFor="community-email">E-mail</label>
          <input id="community-email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="community-password">Senha</label>
          <input id="community-password" name="password" type="password" autoComplete="current-password" required />
          <button type="submit">Entrar na comunidade ↗</button>
        </form>
        <p className="community-auth-switch">Ainda não tem conta? <Link href={query.returnTo ? `/comunidade/cadastro?returnTo=${encodeURIComponent(query.returnTo)}` : "/comunidade/cadastro"}>Criar conta</Link></p>
        <Link href="/pesquisas" className="community-auth-back">← Voltar às pesquisas</Link>
      </div>
    </main>
  );
}
