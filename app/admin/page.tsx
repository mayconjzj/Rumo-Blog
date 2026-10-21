import Link from "next/link";
import { requireAdmin } from "@/lib/server/admin-auth";
import AdminHeader from "@/app/components/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { email } = await requireAdmin();
  return (
    <main className="admin-home">
      <AdminHeader email={email} />
      <div className="admin-home-content">
        <p className="admin-eyebrow">RUMO / EDITORIA CIENTÍFICA</p>
        <h1>Painel administrativo</h1>
        <p className="admin-home-intro">Acompanhe as visitas do site e gerencie os manuscritos enviados para avaliação por pares.</p>
        <div className="admin-home-cards">
          <Link className="admin-home-card" href="/admin/metricas">
            <span className="admin-card-index">01 / DESEMPENHO</span>
            <h2>Métricas do site <span aria-hidden="true">↗</span></h2>
            <p>Visitas, páginas mais acessadas e origem do tráfego.</p>
          </Link>
          <Link className="admin-home-card" href="/admin/submissoes">
            <span className="admin-card-index">02 / EDITORIAL</span>
            <h2>Submissões científicas <span aria-hidden="true">↗</span></h2>
            <p>Triagem, pareceres, decisões editoriais e publicação dos artigos aceitos.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
