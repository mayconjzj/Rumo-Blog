"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function HomeSiteHeaderClient({ mobileActions }: { mobileActions: ReactNode }) {
  const pathname = usePathname();
  const isResearch = pathname === "/pesquisas" || pathname.startsWith("/pesquisas/");

  return (
    <>
      <nav className="main-nav" aria-label="Navegação principal">
        <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
        <Link href="/#sobre">Sobre</Link>
        <Link className={isResearch ? "nav-active" : undefined} aria-current={isResearch ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
      </nav>
      <details className="mobile-nav-menu">
        <summary aria-label="Abrir menu de navegação">
          <span className="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span>
        </summary>
        <nav className="mobile-nav-panel" aria-label="Navegação móvel">
          <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link className={isResearch ? "nav-active" : undefined} aria-current={isResearch ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
          <Link className={pathname === "/submeter" ? "nav-active" : undefined} aria-current={pathname === "/submeter" ? "page" : undefined} href="/submeter">Submeter artigo</Link>
          {mobileActions}
        </nav>
      </details>
    </>
  );
}
