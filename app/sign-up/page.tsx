import Link from "next/link";
import { communitySignUpAction } from "../comunidade/actions";
export const metadata = { title: "Criar conta | Revista Rumo", robots: { index: false, follow: false } };
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ erro?: string; returnTo?: string }> }) {
 const query = await searchParams;
 const returnTo = query.returnTo?.startsWith("/pesquisas/") && !query.returnTo.startsWith("//") ? query.returnTo : "/pesquisas";
 return <main className="community-auth-page"><div className="community-auth-panel">
  <Link href="/" className="community-auth-brand">RUMO<span>.</span></Link><p className="community-auth-eyebrow">REVISTA CIENTÍFICA</p><h1>Crie sua conta.</h1>
  <p className="community-auth-copy">Crie uma conta para avaliar artigos científicos e acompanhar suas contribuições. O cadastro não comprova, por si só, formação acadêmica ou qualificação científica.</p>
  {query.erro && <p className="community-auth-error" role="alert">{query.erro === "senha" ? "As senhas não coincidem. Confira os dois campos." : query.erro === "cadastro" ? "Não foi possível criar a conta. Verifique os dados ou tente outro e-mail." : "Informe um nome válido, e-mail e senha com pelo menos 10 caracteres."}</p>}
  <form action={communitySignUpAction} className="community-auth-form"><input type="hidden" name="returnTo" value={returnTo} />
   <label htmlFor="community-name">Nome público</label><input id="community-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required />
   <label htmlFor="community-email">E-mail</label><input id="community-email" name="email" type="email" autoComplete="email" maxLength={254} required />
   <label htmlFor="community-password">Senha (mínimo 10 caracteres)</label><input id="community-password" name="password" type="password" autoComplete="new-password" minLength={10} required />
   <label htmlFor="community-confirm-password">Confirme a senha</label><input id="community-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={10} required />
   <button type="submit">Criar conta ↗</button></form>
  <p className="community-auth-switch">Já tem conta? <Link href={returnTo !== "/pesquisas" ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}>Entrar</Link></p>
  <Link href="/pesquisas" className="community-auth-back">← Voltar às pesquisas</Link>
 </div></main>;
}
