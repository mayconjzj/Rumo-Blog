"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { communitySignOutAction } from "../comunidade/actions";

type Props = { isAuthenticated: boolean };

export default function HomeSiteHeaderClient({ isAuthenticated }: Props) {
  const pathname = usePathname();
  const isResearch = pathname === "/pesquisas" || pathname.startsWith("/pesquisas/");
  return <>
    <div className="top-strip"><div className="container top-strip-inner"><span>REVISTA CIENTÍFICA MULTIDISCIPLINAR</span><span>Ciência aberta · leitura gratuita · submissões gratuitas</span></div></div>
    <header className="site-header"><div className="container nav-wrap">
      <Link className="brand" href="/" aria-label="Rumo, página inicial"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
      <nav className="main-nav" aria-label="Navegação principal">
        <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
        <a href="/#sobre">Sobre</a>
        <Link className={isResearch ? "nav-active" : undefined} aria-current={isResearch ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
      </nav>
      <div className="public-auth-actions">
        {isAuthenticated ? <form action={communitySignOutAction}><button className="public-login-link public-logout-button" type="submit">Sair</button></form> : <>
          <Link className="public-login-link" href="/login">Entrar</Link>
          <Link className="public-signup-link" href="/sign-up">Criar conta <span aria-hidden="true">↗</span></Link>
        </>}
      </div>
      <Link className="admin-link" href="/submeter">Submeter artigo <span aria-hidden="true">↗</span></Link>
      <details className="mobile-nav-menu"><summary aria-label="Abrir menu de navegação"><span className="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span></summary>
        <nav className="mobile-nav-panel" aria-label="Navegação móvel">
          <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
          <a href="/#sobre">Sobre</a>
          <Link className={isResearch ? "nav-active" : undefined} aria-current={isResearch ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
          <Link className={pathname === "/submeter" ? "nav-active" : undefined} aria-current={pathname === "/submeter" ? "page" : undefined} href="/submeter">Submeter artigo</Link>
          <div className="mobile-auth-actions">
            {isAuthenticated ? <form action={communitySignOutAction}><button className="mobile-logout-button" type="submit">Sair da conta</button></form> : <>
              <Link className="mobile-login-link" href="/login">Entrar</Link>
              <Link className="mobile-signup-link" href="/sign-up">Criar conta ↗</Link>
            </>}
          </div>
        </nav>
      </details>
    </div></header>
  </>;
}
