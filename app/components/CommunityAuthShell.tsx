import Link from "next/link";
import type { ReactNode } from "react";

type CommunityAuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function CommunityAuthShell({
  eyebrow,
  title,
  description,
  children,
}: CommunityAuthShellProps) {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="Rumo, voltar à página inicial">
          <span className="brand-mark">R</span>
          <span>rumo<span className="brand-period">.</span></span>
        </Link>
        <Link className="login-back-link" href="/">← Voltar ao site</Link>
      </div>

      <div className="login-layout">
        <section className="login-intro">
          <div className="login-intro-grid" aria-hidden="true" />
          <div className="login-intro-content">
            <span className="login-eyebrow"><span /> REVISTA CIENTÍFICA</span>
            <h1>Conhecimento em movimento começa com <em>boas ideias.</em></h1>
            <p>Participe da comunidade Rumo, acompanhe pesquisas e contribua com discussões fundamentadas.</p>
            <div className="login-motto">
              <span className="login-motto-line" />
              <span>Conhecimento. Estratégia. Longo prazo.</span>
            </div>
          </div>
          <div className="login-visual-note"><span>RUMO / COMUNIDADE</span><span>01 — ACESSO</span></div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-inner">
            <span className="login-step">{eyebrow} <span>01 / 01</span></span>
            <h2 id="login-title">{title}</h2>
            <p className="login-subtitle">{description}</p>
            {children}
          </div>
        </section>
      </div>

      <footer className="login-footer">
        <span>© 2026 Rumo Blog</span>
        <span>INFORMAÇÃO PARA DECISÕES MELHORES</span>
      </footer>
    </main>
  );
}
