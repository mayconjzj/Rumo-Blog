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
  const featured = articles[0];
  const secondary = articles.slice(1, 3);

  return (
    <main className="rumo-home">
      <div className="home-topline">
        <div className="container home-topline-inner">
          <span>RUMO / CONHECIMENTO FINANCEIRO</span>
          <span>Informação para decisões melhores</span>
        </div>
      </div>

      <header className="home-header">
        <div className="container home-nav-wrap">
          <a className="brand home-brand" href="/" aria-label="Rumo, página inicial">
            <span className="brand-mark">R</span>
            <span>rumo<span className="brand-period">.</span></span>
          </a>
          <nav className="home-nav" aria-label="Navegação principal">
            <a className="home-nav-current" href="#inicio">Início</a>
            <a href="#conteudos">Conteúdos</a>
            <a href="#sobre">Sobre o Rumo</a>
          </nav>
          <a className="home-header-cta" href="#conteudos">Explorar conteúdos <ArrowIcon /></a>
          <a className="home-mobile-admin" href="/login" aria-label="Área administrativa">↗</a>
        </div>
      </header>

      <section className="home-hero" id="inicio">
        <div className="home-hero-pattern" aria-hidden="true" />
        <div className="container home-hero-layout">
          <div className="home-hero-copy">
            <div className="home-eyebrow"><span /> IDEIAS PARA ENXERGAR MAIS LONGE</div>
            <h1>O mercado muda.<br />O conhecimento <em>fica.</em></h1>
            <p>Entenda investimentos, economia e empresas com conteúdo claro, análise cuidadosa e uma visão de longo prazo.</p>
            <div className="home-hero-actions">
              <a className="home-primary-button" href="#conteudos">Descubra os conteúdos <ArrowIcon /></a>
              <a className="home-secondary-link" href="#sobre">Conheça o Rumo <span>→</span></a>
            </div>
            <div className="home-hero-footnote"><span /> Conhecimento independente. Decisões mais conscientes.</div>
          </div>

          <div className="home-editorial-panel">
            <div className="home-panel-top">
              <span className="home-panel-kicker">EM DESTAQUE</span>
              <span className="home-panel-index">R / 01</span>
            </div>
            {featured ? (
              <a className="home-featured-story" href={"/artigos/" + featured.slug}>
                <span className="home-featured-category">{featured.category}</span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="home-featured-bottom"><span>{featured.readTime}</span><strong>Ler análise <ArrowIcon /></strong></span>
              </a>
            ) : (
              <div className="home-featured-empty">
                <div className="home-chart-label">PERSPECTIVA DE LONGO PRAZO</div>
                <svg viewBox="0 0 440 210" role="img" aria-label="Ilustração abstrata de uma trajetória de crescimento">
                  <defs><linearGradient id="rumoArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#549CFF" stopOpacity=".32" /><stop offset="100%" stopColor="#549CFF" stopOpacity="0" /></linearGradient></defs>
                  <g stroke="#29405b" strokeWidth="1"><path d="M0 40H440M0 90H440M0 140H440M0 190H440" /><path d="M55 0V210M125 0V210M195 0V210M265 0V210M335 0V210M405 0V210" /></g>
                  <path d="M0 185 C40 178 60 150 92 160 S150 135 182 124 S240 140 272 82 S330 100 360 53 S410 45 440 18 L440 210 L0 210Z" fill="url(#rumoArea)" />
                  <path d="M0 185 C40 178 60 150 92 160 S150 135 182 124 S240 140 272 82 S330 100 360 53 S410 45 440 18" fill="none" stroke="#6BAAFF" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="440" cy="18" r="5" fill="#6BAAFF" />
                </svg>
                <p>Um ponto de partida para compreender melhor o cenário à sua volta.</p>
                <a href="#conteudos">Explore a biblioteca <ArrowIcon /></a>
              </div>
            )}
            <div className="home-panel-footer"><span>INVESTIMENTOS</span><span>ECONOMIA</span><span>ESTRATÉGIA</span></div>
          </div>
        </div>
      </section>

      <div className="home-topic-band" aria-label="Temas do Rumo">
        <div className="container home-topic-inner">
          <span>Explore por perspectiva</span><i />
          <a href="#conteudos">Investimentos</a><b>·</b><a href="#conteudos">Economia</a><b>·</b><a href="#conteudos">Empresas</a><b>·</b><a href="#conteudos">Educação financeira</a>
        </div>
      </div>

      {secondary.length > 0 && (
        <section className="home-latest-section">
          <div className="container">
            <div className="home-section-head">
              <div><span className="home-section-label">LEITURAS RECENTES / 01</span><h2>Ideias que merecem <em>atenção.</em></h2></div>
              <a href="#conteudos">Ver todos os conteúdos <ArrowIcon /></a>
            </div>
            <div className="home-latest-grid">
              {secondary.map((article, index) => (
                <a className="home-latest-card" href={"/artigos/" + article.slug} key={article.slug}>
                  <div className="home-latest-meta"><span>{article.category}</span><span>0{index + 2}</span></div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="home-latest-bottom"><span>{article.date} · {article.readTime}</span><strong>Leia mais ↗</strong></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-library-section" id="conteudos">
        <div className="container">
          <div className="home-section-head home-library-head">
            <div><span className="home-section-label">BIBLIOTECA RUMO / 02</span><h2>Conhecimento para <em>avançar.</em></h2></div>
            <p>Pesquise por tema ou explore as categorias. Uma biblioteca feita para transformar informação em entendimento.</p>
          </div>
          <ArticleBrowser articles={articles} />
        </div>
      </section>

      <section className="home-about-section" id="sobre">
        <div className="container home-about-layout">
          <div className="home-about-monogram" aria-hidden="true">R<span>.</span></div>
          <div className="home-about-copy">
            <span className="home-section-label">NOSSO PROPÓSITO / 03</span>
            <h2>Menos ruído.<br />Mais <em>direção.</em></h2>
            <p>O Rumo é um espaço independente sobre investimentos, economia e educação financeira. Nosso objetivo é transformar temas complexos em conhecimento claro, útil e acessível — sem promessas fáceis, com foco em compreensão e visão de longo prazo.</p>
          </div>
          <a className="home-back-top" href="#inicio" aria-label="Voltar ao início">↑</a>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container home-footer-inner">
          <a className="brand home-footer-brand" href="/"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></a>
          <span>Informação para decisões melhores.</span>
          <div><a href="#inicio">Voltar ao topo ↑</a><span>© 2026 Rumo Blog</span></div>
        </div>
      </footer>
    </main>
  );
}
