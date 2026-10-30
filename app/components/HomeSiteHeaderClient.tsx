"use client";

import Link from "next/link";
import Brand from "./ui/Brand";
import Button from "./ui/Button";
import { usePathname } from "next/navigation";
import { communitySignOutAction } from "../comunidade/actions";

type Props = { isAuthenticated: boolean };

export default function HomeSiteHeaderClient({ isAuthenticated }: Props) {
  const pathname = usePathname();
  const isResearch = pathname === "/pesquisas" || pathname.startsWith("/pesquisas/");
  return <>
    <div className="top-strip"><div className="container top-strip-inner"><span>REVISTA CIENTÍFICA MULTIDISCIPLINAR</span><span>Ciência aberta · leitura gratuita · submissões gratuitas</span></div></div>
    <header className="site-header"><div className="container nav-wrap">
      <Brand label="Rumo, página inicial" />
      <nav className="main-nav" aria-label="Navegação principal">
        <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
        <Link href="/#sobre">Sobre</Link>
        <Link className={isResearch ? "nav-active" : undefined} aria-current={isResearch ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
      </nav>
      <div className="public-auth-actions">
        {isAuthenticated ? <form action={communitySignOutAction}><Button type="submit" variant="outline" className="public-login-link public-logout-button">Sair</Button></form> : <>
          <Button href="/login" variant="outline" className="public-login-link">Entrar</Button>
          <Button href="/sign-up" variant="navy" className="public-signup-link" arrow="up-right">Criar conta</Button>
        </>}
      </div>
      <Button href="/submeter" variant="outline" className="admin-link" arrow="up-right">Submeter artigo</Button>
      <details className="mobile-nav-menu"><summary aria-label="Abrir menu de navegação"><span className="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span></summary>
        <nav className="mobile-nav-panel" aria-label="Navegação móvel">
          <Link className={pathname === "/" ? "nav-active" : undefined} aria-current={pathname === "/" ? "page" : undefined} href="/">Início</Link>
          <a href="/#sobre">Sobre</a>
          <Link className={isResearch ? "nav-active" : undefined} aria-current={isResearch ? "page" : undefined} href="/pesquisas">Pesquisas</Link>
          <Link className={pathname === "/submeter" ? "nav-active" : undefined} aria-current={pathname === "/submeter" ? "page" : undefined} href="/submeter">Submeter artigo</Link>
          <div className="mobile-auth-actions">
            {isAuthenticated ? <form action={communitySignOutAction}><Button type="submit" variant="outline" className="mobile-logout-button">Sair da conta</Button></form> : <>
              <Button href="/login" variant="outline" className="mobile-login-link">Entrar</Button>
              <Button href="/sign-up" variant="navy" className="mobile-signup-link" arrow="up-right">Criar conta</Button>
            </>}
          </div>
        </nav>
      </details>
    </div></header>
  </>;
}
