"use client";

import Link from "next/link";

export default function InstitutionalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>INFORMAÇÃO PARA DECISÕES MELHORES</span>
          <span>Conhecimento. Estratégia. Longo prazo.</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Rumo, página inicial">
            <span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span>
          </Link>
          <nav className="main-nav" aria-label="Navegação principal">
            <Link href="/">Início</Link>
            <Link href="/#artigos">Artigos</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contato">Contato</Link>
          </nav>
          <Link className="admin-link" href="/login">Área administrativa <span aria-hidden="true">↗</span></Link>
          <Link className="mobile-admin" href="/login" aria-label="Área administrativa">↗</Link>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="brand brand-footer" href="/"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
          <span>Informação para decisões melhores.</span>
          <nav className="footer-links" aria-label="Links institucionais">
            <Link href="/sobre">Sobre</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
          <span>© {new Date().getFullYear()} Rumo Blog</span>
        </div>
      </footer>
    </>
  );
}
