import Link from "next/link";
import { ResetPasswordForm } from "../auth/PasswordRecoveryForms";

export const metadata = {
  title: "Redefinir senha | Revista Rumo",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="community-auth-page">
      <div className="community-auth-panel">
        <Link href="/" className="community-auth-brand">RUMO<span>.</span></Link>
        <p className="community-auth-eyebrow">RECUPERAÇÃO DE CONTA</p>
        <h1>Crie uma nova senha.</h1>
        <p className="community-auth-copy">Escolha uma senha com pelo menos 10 caracteres. Por segurança, o link de redefinição pode expirar ou ser usado apenas uma vez.</p>
        <ResetPasswordForm token={token ?? ""} />
        <Link href="/pesquisas" className="community-auth-back">← Voltar às pesquisas</Link>
      </div>
    </main>
  );
}
