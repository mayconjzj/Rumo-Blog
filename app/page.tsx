import { getPublishedPosts } from "@/lib/blogs";
import ArticleBrowser, { type ArticleSummary } from "./ArticleBrowser";

export const dynamic = "force-dynamic";

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function formatArticleDate(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(value))
    .replace(".", "")
    .toUpperCase();
}

export default async function HomePage() {
  const publishedPosts = await getPublishedPosts();
  const articles: ArticleSummary[] = publishedPosts.map((post) => ({
    slug: post.slug,
    category: post.category,
    title: post.title,
    excerpt: post.excerpt,
    date: formatArticleDate(post.published_at ?? post.created_at),
    readTime: Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220)) + " min de leitura",
  }));

  return (
    <main>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>INFORMAÇÃO PARA DECISÕES MELHORES</span>
          <span>Conhecimento. Estratégia. Longo prazo.</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="/" aria-label="Rumo, página inicial">
            <span className="brand-mark">R</span>
            <span>rumo<span className="brand-period">.</span></span>
          </a>
          <nav className="main-nav" aria-label="Navegação principal">
            <a className="nav-active" href="#inicio">Início</a>
            <a href="#artigos">Artigos</a>
            <a href="#sobre">Sobre</a>
          </nav>
          <a className="admin-link" href="/login">Área administrativa <span aria-hidden="true">↗</span></a>
          <a className="mobile-admin" href="/login" aria-label="Área administrativa">↗</a>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> PERSPECTIVA PARA O FUTURO</div>
            <h1>Seu próximo passo começa com <em>conhecimento.</em></h1>
            <p className="hero-description">
              Análises, ideias e educação financeira para quem quer compreender
              melhor o mercado e construir decisões mais conscientes.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#artigos">Explorar artigos <ArrowIcon /></a>
              <a className="text-link" href="#sobre">Conheça o Rumo <span aria-hidden="true">→</span></a>
            </div>
            <div className="hero-note">
              <span className="note-line" />
              <span>Clareza para hoje. Visão para o longo prazo.</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Composição gráfica abstrata sobre crescimento e estratégia">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-grid" />
            <div className="visual-label">VISÃO DE LONGO PRAZO</div>
            <div className="visual-chart">
              <span className="chart-caption">PERSPECTIVA</span>
              <svg viewBox="0 0 460 220" role="img" aria-label="Linha ilustrativa em trajetória ascendente">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#549CFF" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#549CFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 190 C45 175 57 183 91 147 S151 159 183 119 S233 137 264 93 S318 111 347 61 S408 58 460 13 L460 220 L0 220 Z" fill="url(#areaFill)" />
                <path d="M0 190 C45 175 57 183 91 147 S151 159 183 119 S233 137 264 93 S318 111 347 61 S408 58 460 13" fill="none" stroke="#549CFF" strokeWidth="3" strokeLinecap="round" />
                <circle cx="460" cy="13" r="5" fill="#549CFF" />
              </svg>
              <div className="chart-footer"><span>ESTRATÉGIA</span><span>CONSISTÊNCIA</span><span>FUTURO</span></div>
            </div>
            <div className="visual-index">01 <span>—</span> 03</div>
          </div>
        </div>
      </section>

      <section className="articles-section" id="artigos">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-number">01 / BIBLIOTECA</span>
              <h2>Encontre sua próxima <em>leitura.</em></h2>
            </div>
            <p>Pesquise por assunto ou explore as categorias para encontrar conteúdo relevante para suas decisões.</p>
          </div>
          <ArticleBrowser articles={articles} />
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="container about-inner">
          <div className="about-symbol">R<span>.</span></div>
          <div>
            <span className="section-number">02 / NOSSO PROPÓSITO</span>
            <h2>Menos ruído. Mais <em>direção.</em></h2>
            <p>O Rumo é um espaço independente de conteúdo sobre investimentos, economia e educação financeira. Nosso objetivo é transformar temas complexos em conhecimento claro e útil.</p>
          </div>
          <a className="about-link" href="#inicio" aria-label="Voltar ao início">↑</a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand brand-footer" href="/"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></a>
          <span>Informação para decisões melhores.</span>
          <span>© 2026 Rumo Blog</span>
        </div>
      </footer>
    </main>
  );
}
