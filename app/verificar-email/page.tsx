import Link from "next/link";
import CommunityAuthShell from "../components/CommunityAuthShell";
import VerifyExistingEmailForm from "./VerifyExistingEmailForm";

export const metadata = {
  title: "Confirmar e-mail | Revista Rumo",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <CommunityAuthShell
      eyebrow="CONFIRMAÇÃO DE E-MAIL"
      title="Confirme seu endereço."
      description="Informe o e-mail usado no cadastro para receber um código de confirmação. O código expira em 15 minutos."
    >
      <VerifyExistingEmailForm />
      <p className="login-subtitle">
        <Link href="/login">Voltar ao login</Link>
      </p>
    </CommunityAuthShell>
  );
}
