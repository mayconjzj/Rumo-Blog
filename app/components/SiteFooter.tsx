import Link from "next/link";

const editorialLinks = [
  { href: "/politica-editorial", label: "Política editorial" },
  { href: "/avaliacao-por-pares", label: "Avaliação por pares" },
  { href: "/etica-publicacao", label: "Ética e integridade" },
  { href: "/privacidade", label: "Privacidade e dados" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-column">
          <Link className="brand brand-footer" href="/" aria-label="Revista Rumo — página inicial">
            <span className="brand-mark">R</span>
            <span>rumo<span className="brand-period">.</span></span>
          </Link>
          <p className="footer-description">
            Conhecimento científico em circulação. Um espaço multidisciplinar para compartilhar pesquisas e ampliar o acesso à ciência.
          </p>
          <span className="footer-access-note"><span aria-hidden="true" /> Leitura e submissão gratuitas</span>
        </div>
        <nav className="footer-nav-column" aria-label="Navegação do rodapé">
          <h2>Explore</h2>
          <Link href="/">Página inicial</Link>
          <Link href="/pesquisas">Pesquisas publicadas</Link>
          <Link href="/#artigos">Conteúdo editorial</Link>
          <Link href="/#sobre">Sobre a revista</Link>
        </nav>
        <nav className="footer-nav-column" aria-label="Políticas e informações">
          <h2>Informações editoriais</h2>
          {editorialLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <div className="footer-submit-column">
          <span className="footer-eyebrow">TEM UMA PESQUISA?</span>
          <h2>Compartilhe seu trabalho.</h2>
          <p>Consulte as orientações editoriais e envie seu manuscrito para triagem.</p>
          <Link className="footer-submit-link" href="/submeter">Submeter artigo <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} Revista Rumo</span>
          <span>Ciência aberta · Conhecimento compartilhado</span>
          <Link href="/privacidade">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
