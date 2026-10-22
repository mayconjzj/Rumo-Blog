import Link from "next/link";
import { ForgotPasswordForm } from "../auth/PasswordRecoveryForms";

export const metadata = {
  title: "Esqueci minha senha | Revista Rumo",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className="community-auth-page">
      <div className="community-auth-panel">
        <Link href="/" className="community-auth-brand">RUMO<span>.</span></Link>
        <p className="community-auth-eyebrow">RECUPERAÇÃO DE CONTA</p>
        <h1>Esqueceu sua senha?</h1>
        <p className="community-auth-copy">Informe o e-mail usado no cadastro. Se houver uma conta associada, você receberá um link para criar uma nova senha.</p>
        <ForgotPasswordForm />
        <Link href="/pesquisas" className="community-auth-back">← Voltar às pesquisas</Link>
      </div>
    </main>
  );
}
