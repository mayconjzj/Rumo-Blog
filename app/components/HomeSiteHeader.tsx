"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeSiteHeader() {
  const pathname = usePathname();
  return <>
    <div className="top-strip"><div className="container top-strip-inner"><span>REVISTA CIENTÍFICA MULTIDISCIPLINAR</span><span>Ciência aberta · leitura gratuita · submissões gratuitas</span></div></div>
    <header className="site-header"><div className="container nav-wrap">
      <Link className="brand" href="/" aria-label="Rumo, página inicial"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
      <nav className="main-nav" aria-label="Navegação principal">
        <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
        <a href="/#sobre">Sobre</a>
        <Link className={pathname === "/pesquisas" || pathname.startsWith("/pesquisas/") ? "nav-active" : undefined} aria-current={pathname === "/pesquisas" || pathname.startsWith("/pesquisas/") ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
      </nav>
      <Link className="admin-link" href="/submeter">Submeter artigo <span aria-hidden="true">↗</span></Link>
      <details className="mobile-nav-menu"><summary aria-label="Abrir menu de navegação"><span className="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span></summary>
        <nav className="mobile-nav-panel" aria-label="Navegação móvel">
          <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
          <a href="/#sobre">Sobre</a>
          <Link className={pathname === "/pesquisas" || pathname.startsWith("/pesquisas/") ? "nav-active" : undefined} aria-current={pathname === "/pesquisas" || pathname.startsWith("/pesquisas/") ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
          <Link className={pathname === "/submeter" ? "nav-active" : undefined} aria-current={pathname === "/submeter" ? "page" : undefined} href="/submeter">Submeter artigo</Link>
        </nav>
      </details>
    </div></header>
  </>;
}
