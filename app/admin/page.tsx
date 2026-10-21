import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: session } = await auth.getSession();
  const userEmail = session?.user?.email?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user) {
    redirect("/login");
  }

  if (!adminEmail || userEmail !== adminEmail) {
    redirect("/");
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, letterSpacing: "0.12em", fontSize: 12 }}>RUMO / ADMIN</p>
          <h1 style={{ marginBottom: 8 }}>Painel administrativo</h1>
          <p style={{ marginTop: 0, color: "#666" }}>Sessão autenticada como {session.user.email}.</p>
        </div>
        <LogoutButton />
      </header>
      <section style={{ marginTop: 36, border: "1px solid #ddd", borderRadius: 12, padding: 24 }}>
        <h2>Autenticação configurada</h2>
        <p>O acesso a esta página é restrito ao e-mail administrativo configurado no ambiente da Vercel.</p>
        <p>O gerenciamento de artigos ainda precisa ser implementado nesta área.</p>
        <Link href="/">Voltar ao site</Link>
      </section>
    </main>
  );
}
