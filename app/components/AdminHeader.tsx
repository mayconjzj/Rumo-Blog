import Link from "next/link";
import LogoutButton from "@/app/admin/LogoutButton";

export default function AdminHeader({ email }: { email: string }) {
  return (
    <header className="admin-site-header">
      <Link className="brand" href="/" aria-label="Rumo, página inicial" style={{ color: "#fff" }}>
        <span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span>
      </Link>
      <div className="admin-header-actions">
        <span className="admin-user">Conectado como {email}</span>
        <LogoutButton />
        <nav className="admin-desktop-nav" aria-label="Navegação administrativa">
          <Link href="/admin/metricas">Métricas</Link>
          <Link href="/admin/submissoes">Submissões</Link>
          <Link href="/">Ver site ↗</Link>
        </nav>
        <details className="admin-mobile-menu">
          <summary aria-label="Abrir menu administrativo"><span className="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span><span>Menu</span></summary>
          <nav className="admin-mobile-panel" aria-label="Navegação administrativa móvel">
            <Link href="/admin/metricas">Métricas</Link>
            <Link href="/admin/submissoes">Submissões científicas</Link>
            <Link href="/">Ver site ↗</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
