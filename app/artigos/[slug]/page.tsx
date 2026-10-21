import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsSection from "../../components/CommentsSection";
import { getPublishedPostBySlug } from "@/lib/blogs";

type ArticleContent = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const articleContents: ArticleContent[] = [
  {
    slug: "investir-bem-comeca-por-entender",
    category: "INVESTIMENTOS",
    title: "Investir bem começa por entender o que você possui",
    excerpt: "Uma abordagem prática para analisar empresas, compreender riscos e tomar decisões com mais clareza.",
    date: "20 OUT 2026",
    readTime: "6 min de leitura",
    intro: "Investir não é apenas escolher um ativo e esperar que seu preço suba. Uma decisão consistente começa com a compreensão do negócio, dos riscos envolvidos e do preço que se paga por seus resultados.",
    sections: [
      { heading: "Comece pelo negócio", paragraphs: [
        "Antes de olhar para a cotação, procure entender como a empresa ganha dinheiro, quem são seus clientes e quais fatores sustentam sua receita. Um negócio compreensível facilita a avaliação dos resultados e dos riscos.",
        "Também vale observar se a empresa possui vantagens competitivas, como custos menores, marca forte, contratos duradouros ou barreiras que dificultem a entrada de concorrentes."
      ]},
      { heading: "Os indicadores precisam de contexto", paragraphs: [
        "Indicadores como retorno sobre o patrimônio (ROE), margens e endividamento ajudam a organizar a análise, mas nenhum deles conta a história completa isoladamente. Um ROE elevado, por exemplo, pode refletir um bom negócio ou um patrimônio líquido reduzido por fatores específicos.",
        "Compare os números ao longo do tempo e com empresas do mesmo setor. A qualidade dos resultados e sua capacidade de se repetir importam tanto quanto o valor de um indicador em um único período."
      ]},
      { heading: "Preço e valor não são a mesma coisa", paragraphs: [
        "Uma empresa excelente pode ser um investimento ruim quando comprada por um preço excessivo. Da mesma forma, uma cotação baixa não significa necessariamente que um ativo esteja barato: o mercado pode estar antecipando uma deterioração real do negócio.",
        "Trabalhar com cenários conservadores, estimar uma faixa de valor e reconhecer a incerteza ajuda a evitar decisões baseadas em uma única previsão."
      ]},
      { heading: "Uma rotina de análise", paragraphs: [
        "Uma rotina simples pode incluir leitura dos relatórios da companhia, acompanhamento da dívida, avaliação da geração de caixa e revisão das premissas quando surgirem novos dados. Registre também o motivo da decisão e o que faria você mudar de opinião.",
        "Este conteúdo tem finalidade educativa e não constitui recomendação individual de investimento. Toda decisão envolve riscos e deve considerar os objetivos e a situação de cada investidor."
      ]}
    ]
  },
  {
    slug: "juros-compostos-o-tempo-como-aliado",
    category: "EDUCAÇÃO FINANCEIRA",
    title: "Juros compostos: o tempo como aliado",
    excerpt: "Entenda como aportes consistentes e horizonte de longo prazo podem transformar uma estratégia financeira.",
    date: "16 OUT 2026",
    readTime: "4 min de leitura",
    intro: "Os juros compostos fazem com que os rendimentos acumulados também possam render. O efeito pode parecer discreto no início, mas ganha relevância à medida que o tempo passa.",
    sections: [
      { heading: "O efeito dos rendimentos sobre rendimentos", paragraphs: [
        "Nos juros simples, o rendimento é calculado sempre sobre o capital inicial. Nos juros compostos, os rendimentos são incorporados ao saldo e passam a participar dos cálculos seguintes.",
        "A fórmula básica é M = C(1+i)^n, em que C é o capital inicial, i é a taxa por período e n é o número de períodos. A taxa e o tempo precisam estar expressos em unidades compatíveis."
      ]},
      { heading: "Regularidade e horizonte", paragraphs: [
        "Aportes recorrentes aumentam o capital investido ao longo do tempo. O resultado depende do valor e da frequência dos aportes, da rentabilidade obtida, dos custos, dos impostos e da inflação.",
        "Simulações são úteis para entender possibilidades, mas não são previsões. Rentabilidade varia e não há garantia de que o retorno projetado será alcançado."
      ]},
      { heading: "Pense em poder de compra", paragraphs: [
        "O saldo nominal não mostra sozinho o ganho real. Para avaliar a evolução do patrimônio, é necessário considerar a inflação e observar quanto os recursos permitem comprar.",
        "Uma estratégia sustentável combina objetivos claros, custos controlados, diversificação adequada e uma reserva compatível com as necessidades pessoais."
      ]}
    ]
  },
  {
    slug: "como-ler-os-indicadores-de-uma-empresa",
    category: "MERCADO",
    title: "Como ler os indicadores de uma empresa",
    excerpt: "ROE, margens e endividamento: o que esses números dizem — e o que deixam de dizer.",
    date: "12 OUT 2026",
    readTime: "7 min de leitura",
    intro: "Indicadores financeiros ajudam a resumir a situação de uma companhia. Seu valor real aparece quando são analisados em conjunto, ao longo do tempo e em relação às características do setor.",
    sections: [
      { heading: "Retorno sobre o patrimônio (ROE)", paragraphs: [
        "O ROE relaciona o lucro líquido ao patrimônio líquido. Ele ajuda a avaliar quanto lucro contábil a empresa gera em relação aos recursos atribuíveis aos acionistas.",
        "Um ROE alto não garante qualidade: endividamento elevado, eventos não recorrentes e mudanças no patrimônio podem distorcer a leitura. É importante entender o que explica o indicador."
      ]},
      { heading: "Margens e geração de caixa", paragraphs: [
        "Margens bruta, operacional e líquida mostram diferentes etapas da conversão da receita em resultado. Compará-las ao longo dos anos pode revelar pressão de custos ou ganhos de eficiência.",
        "Lucro contábil e caixa não são equivalentes. Investimentos, capital de giro e outros fatores podem fazer com que a geração de caixa seja diferente do lucro apresentado."
      ]},
      { heading: "Dívida e comparação setorial", paragraphs: [
        "A dívida precisa ser avaliada considerando o caixa disponível, o custo dos empréstimos, os vencimentos e a estabilidade das receitas. O mesmo nível de endividamento pode representar riscos diferentes em setores distintos.",
        "Não existe um indicador universal que substitua a análise. A leitura mais robusta combina rentabilidade, margens, caixa, dívida, crescimento e preço, sempre considerando o modelo de negócio."
      ]}
    ]
  }
];

export function generateStaticParams() {
  return articleContents.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (post) return { title: post.title + " | Rumo", description: post.excerpt };
  const article = articleContents.find((item) => item.slug === slug);
  if (!article) return { title: "Artigo não encontrado | Rumo" };
  return {
    title: `${article.title} | Rumo`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (post) {
    const paragraphs = post.content.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    return (
      <main className="reading-page">
        <div className="top-strip"><div className="container top-strip-inner"><span>INFORMAÇÃO PARA DECISÕES MELHORES</span><span>Conhecimento. Estratégia. Longo prazo.</span></div></div>
        <header className="site-header"><div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Rumo, página inicial"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
          <nav className="main-nav" aria-label="Navegação principal"><Link href="/">Início</Link><Link className="nav-active" href="/#artigos">Artigos</Link><Link href="/#sobre">Sobre</Link></nav>
          <Link className="admin-link" href="/login">Área administrativa <span aria-hidden="true">↗</span></Link><Link className="mobile-admin" href="/login" aria-label="Área administrativa">↗</Link>
        </div></header>
        <div className="article-breadcrumb container"><Link href="/">Início</Link><span>/</span><Link href="/#artigos">Artigos</Link><span>/</span><span>{post.category}</span></div>
        <article className="reading-article"><header className="reading-header"><span className="category">{post.category}</span><h1>{post.title}</h1><p className="reading-excerpt">{post.excerpt}</p><div className="reading-byline"><div className="author-mark">R</div><div><strong>Redação Rumo</strong><span>Conteúdo independente</span></div><span className="byline-divider" /><time>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(post.published_at ?? post.created_at))}</time></div></header>
          <div className="reading-cover" aria-hidden="true"><div className="cover-grid" /><div className="cover-copy"><span>RUMO / ARTIGO</span><strong>Conhecimento<br />em perspectiva.</strong><i>PUBLICAÇÃO</i></div></div>
          <div className="reading-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="article-end-note"><span>R</span><p>Informação para decisões melhores.</p></div><div className="article-share-row"><span>Este conteúdo foi útil?</span><a href="#comentarios">Deixe sua opinião <span aria-hidden="true">↓</span></a></div></div>
        </article>
        <div className="container reading-comments-wrap"><CommentsSection articleSlug={post.slug} /></div>
        <section className="reading-back"><div className="container reading-back-inner"><div><span className="section-number">CONTINUE EXPLORANDO</span><h2>Mais ideias para <em>seguir em frente.</em></h2></div><Link className="button button-primary" href="/#artigos">Voltar aos artigos <span aria-hidden="true">↗</span></Link></div></section>
        <footer className="site-footer"><div className="container footer-inner"><Link className="brand brand-footer" href="/"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link><span>Informação para decisões melhores.</span><span>© 2026 Rumo Blog</span></div></footer>
      </main>
    );
  }
  const article = articleContents.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <main className="reading-page">
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
            <Link className="nav-active" href="/#artigos">Artigos</Link>
            <Link href="/#sobre">Sobre</Link>
          </nav>
          <Link className="admin-link" href="/login">Área administrativa <span aria-hidden="true">↗</span></Link>
          <Link className="mobile-admin" href="/login" aria-label="Área administrativa">↗</Link>
        </div>
      </header>

      <div className="article-breadcrumb container">
        <Link href="/">Início</Link><span>/</span><Link href="/#artigos">Artigos</Link><span>/</span><span>{article.category}</span>
      </div>

      <article className="reading-article">
        <header className="reading-header">
          <span className="category">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="reading-excerpt">{article.excerpt}</p>
          <div className="reading-byline">
            <div className="author-mark">R</div>
            <div><strong>Redação Rumo</strong><span>Conteúdo independente</span></div>
            <span className="byline-divider" />
            <time>{article.date}</time>
            <span className="byline-divider" />
            <span>{article.readTime}</span>
          </div>
        </header>

        <div className="reading-cover" aria-hidden="true">
          <div className="cover-grid" />
          <div className="cover-copy"><span>RUMO / ANÁLISE</span><strong>Conhecimento<br />em perspectiva.</strong><i>01 — 03</i></div>
          <svg viewBox="0 0 420 230" role="img" aria-label="Gráfico abstrato de tendência">
            <defs><linearGradient id="readingFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#549CFF" stopOpacity=".35" /><stop offset="100%" stopColor="#549CFF" stopOpacity="0" /></linearGradient></defs>
            <path d="M0 190 C40 180 60 145 100 160 S150 105 200 120 S260 65 300 88 S370 35 420 12 L420 230 L0 230Z" fill="url(#readingFill)" />
            <path d="M0 190 C40 180 60 145 100 160 S150 105 200 120 S260 65 300 88 S370 35 420 12" fill="none" stroke="#549CFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="420" cy="12" r="5" fill="#549CFF" />
          </svg>
        </div>

        <div className="reading-body">
          <p className="reading-intro">{article.intro}</p>
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <div className="article-end-note"><span>R</span><p>Informação para decisões melhores.</p></div>
          <div className="article-share-row">
            <span>Este conteúdo foi útil?</span>
            <a href="#comentarios">Deixe sua opinião <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </article>

      <div className="container reading-comments-wrap">
        <CommentsSection articleSlug={article.slug} />
      </div>

      <section className="reading-back">
        <div className="container reading-back-inner">
          <div><span className="section-number">CONTINUE EXPLORANDO</span><h2>Mais ideias para <em>seguir em frente.</em></h2></div>
          <Link className="button button-primary" href="/#artigos">Voltar aos artigos <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="brand brand-footer" href="/"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
          <span>Informação para decisões melhores.</span>
          <span>© 2026 Rumo Blog</span>
        </div>
      </footer>
    </main>
  );
}
