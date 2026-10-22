import Link from "next/link";
import { communitySignUpAction } from "../actions";

export const metadata = {
  title: "Criar conta | Comunidade Revista Rumo",
  robots: { index: false, follow: false },
};

export default async function CommunitySignUp({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; returnTo?: string }>;
}) {
  const query = await searchParams;
  return (
    <main className="community-auth-page">
      <div className="community-auth-panel">
        <Link href="/" className="community-auth-brand">RUMO<span>.</span></Link>
        <p className="community-auth-eyebrow">COMUNIDADE CIENTÍFICA</p>
        <h1>Crie sua conta.</h1>
        <p className="community-auth-copy">Uma conta permite publicar uma avaliação por artigo e manter o histórico das suas contribuições. O cadastro não comprova, por si só, formação acadêmica ou qualificação científica.</p>
        {query.erro && <p className="community-auth-error" role="alert">Informe um nome, e-mail válido e senha com pelo menos 10 caracteres. Se o problema continuar, tente outro e-mail.</p>}
        <form action={communitySignUpAction} className="community-auth-form">
          <input type="hidden" name="returnTo" value={query.returnTo?.startsWith("/pesquisas/") ? query.returnTo : "/pesquisas"} />
          <label htmlFor="community-name">Nome público</label>
          <input id="community-name" name="name" autoComplete="name" minLength={2} maxLength={100} required />
          <label htmlFor="community-email">E-mail</label>
          <input id="community-email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="community-password">Senha (mínimo 10 caracteres)</label>
          <input id="community-password" name="password" type="password" autoComplete="new-password" minLength={10} required />
          <button type="submit">Criar conta ↗</button>
        </form>
        <p className="community-auth-switch">Já tem conta? <Link href="/comunidade/entrar">Entrar</Link></p>
        <Link href="/pesquisas" className="community-auth-back">← Voltar às pesquisas</Link>
      </div>
    </main>
  );
}
