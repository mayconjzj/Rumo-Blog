import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsSection from "../../components/CommentsSection";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blogs";
import { siteUrl } from "@/lib/site";

type ArticleSource = { title: string; url: string };

type ArticleContent = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  datePublished: string;
  updatedAt?: string;
  dateModified?: string;
  readTime: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  sources?: ArticleSource[];
};

function sectionId(heading: string) {
  return heading.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

function ArticleExtras({ toc }: { toc: { heading: string; id: string }[] }) {
  if (!toc.length) return null;
  return <nav className="article-toc" aria-label="Sumário deste artigo"><p>SUMÁRIO DO ARTIGO</p><ol>{toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.heading}</a></li>)}</ol></nav>;
}

function ArticleFooterExtras({ sources, related }: { sources: ArticleSource[]; related: { slug: string; title: string; category: string; excerpt: string }[] }) {
  return <>
    {sources.length > 0 && <section className="article-sources" aria-labelledby="article-sources-title"><span className="article-kicker">LEITURA E REFERÊNCIAS</span><h2 id="article-sources-title">Fontes consultadas</h2><ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span aria-hidden="true">↗</span></a></li>)}</ul></section>}
    {related.length > 0 && <section className="related-articles" aria-labelledby="related-articles-title"><span className="article-kicker">CONTINUE EXPLORANDO</span><h2 id="related-articles-title">Artigos relacionados</h2><div className="related-article-grid">{related.map((item) => <article className="related-article-card" key={item.slug}><span className="category">{item.category}</span><h3><Link href={`/artigos/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><Link className="related-read-link" href={`/artigos/${item.slug}`}>Ler artigo <span aria-hidden="true">↗</span></Link></article>)}</div></section>}
  </>;
}

function articleMetadata(title: string, description: string, slug: string, publishedTime?: string, modifiedTime?: string, image?: string): Metadata {
  const url = `${siteUrl}/artigos/${encodeURIComponent(slug)}`;
  const images = image ? [{ url: image, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "Rumo",
      url,
      title: `${title} | Rumo`,
      description,
      publishedTime,
      modifiedTime,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} | Rumo`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function jsonLd(data: Record<string, unknown>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (post) {
    let coverImage: string | undefined;
    try {
      const parsed = JSON.parse(post.content);
      if (parsed?.version === 1 && typeof parsed.coverImage === "string") coverImage = parsed.coverImage;
    } catch {}
    const published = post.published_at ?? post.created_at;
    return articleMetadata(
      post.title,
      post.excerpt,
      post.slug,
      published ? new Date(published).toISOString() : undefined,
      post.updated_at ? new Date(post.updated_at).toISOString() : undefined,
      coverImage && (coverImage.startsWith("https://") || coverImage.startsWith("http://")) ? coverImage : undefined,
    );
  }
  return { title: "Artigo não encontrado", robots: { index: false, follow: false } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (post) {
    const allPosts = await getPublishedPosts();
    const related = allPosts.filter((item) => item.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
    let structured: { version?: number; intro?: string; coverImage?: string; sources?: ArticleSource[]; sections?: { heading?: string; text?: string; imageUrl?: string; caption?: string }[] } | null = null;
    try {
      const parsed = JSON.parse(post.content);
      if (parsed?.version === 1 && Array.isArray(parsed.sections)) structured = parsed;
    } catch {}
    const paragraphs = structured ? [] : post.content.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    const contentSections = structured?.sections ?? [];
    const toc = contentSections.filter((section) => section.heading?.trim()).map((section) => ({ heading: section.heading!.trim(), id: sectionId(section.heading!.trim()) }));
    const postPublished = post.published_at ?? post.created_at;
    const postModified = post.updated_at ?? postPublished;
    const postImage = structured?.coverImage && (structured.coverImage.startsWith("https://") || structured.coverImage.startsWith("http://")) ? structured.coverImage : undefined;
    const postJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      mainEntityOfPage: `${siteUrl}/artigos/${encodeURIComponent(post.slug)}`,
      author: { "@type": "Organization", name: "Redação Rumo", url: siteUrl },
      publisher: { "@type": "Organization", name: "Rumo", url: siteUrl },
      datePublished: postPublished ? new Date(postPublished).toISOString() : undefined,
      dateModified: postModified ? new Date(postModified).toISOString() : undefined,
      image: postImage ? [postImage] : undefined,
      inLanguage: "pt-BR",
    };
    return (
      <main className="reading-page">
        {jsonLd(postJsonLd)}
        <div className="top-strip"><div className="container top-strip-inner"><span>INFORMAÇÃO PARA DECISÕES MELHORES</span><span>Conhecimento. Estratégia. Longo prazo.</span></div></div>
        <header className="site-header"><div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Rumo, página inicial"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
          <nav className="main-nav" aria-label="Navegação principal"><Link href="/">Início</Link><Link className="nav-active" href="/#artigos">Artigos</Link><Link href="/#sobre">Sobre</Link></nav>
          <Link className="admin-link" href="/login">Área administrativa <span aria-hidden="true">↗</span></Link><Link className="mobile-admin" href="/login" aria-label="Área administrativa">↗</Link>
        </div></header>
        <div className="article-breadcrumb container"><Link href="/">Início</Link><span>/</span><Link href="/#artigos">Artigos</Link><span>/</span><span>{post.category}</span></div>
        <article className="reading-article"><header className="reading-header"><span className="category">{post.category}</span><h1>{post.title}</h1><p className="reading-excerpt">{post.excerpt}</p><div className="reading-byline"><div className="author-mark">R</div><div><strong>Redação Rumo</strong><span>Conteúdo independente</span></div><span className="byline-divider" /><span>Publicado em {formatDate(post.published_at ?? post.created_at)}</span>{formatDate(post.updated_at) && formatDate(post.updated_at) !== formatDate(post.published_at ?? post.created_at) && <><span className="byline-divider" /><span className="article-updated">Atualizado em {formatDate(post.updated_at)}</span></>}</div></header>
          {structured?.coverImage ? <img src={structured.coverImage} alt={post.title} style={{ display: "block", width: "min(1000px, calc(100% - 48px))", maxHeight: 520, objectFit: "cover", margin: "0 auto 45px" }} /> : <div className="reading-cover" aria-hidden="true"><div className="cover-grid" /><div className="cover-copy"><span>RUMO / ARTIGO</span><strong>Conhecimento<br />em perspectiva.</strong><i>PUBLICAÇÃO</i></div></div>}
          <div className="reading-body">
            {structured?.intro && <p className="reading-intro" style={{ whiteSpace: "pre-line" }}>{structured.intro}</p>}
            <ArticleExtras toc={toc} />
            {structured ? contentSections.map((section, index) => (
              <section key={index} id={section.heading?.trim() ? sectionId(section.heading.trim()) : undefined}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.text?.split(/\n\s*\n/).map((paragraph, paragraphIndex) => paragraph.trim() && <p key={paragraphIndex}>{paragraph.trim()}</p>)}
                {section.imageUrl && <figure style={{ margin: "24px 0 28px" }}><img src={section.imageUrl} alt={section.caption || section.heading || post.title} style={{ display: "block", width: "100%", maxHeight: 520, objectFit: "cover" }} />{section.caption && <figcaption style={{ marginTop: 8, color: "#7b8999", fontSize: 11, lineHeight: 1.6 }}>{section.caption}</figcaption>}</figure>}
              </section>
            )) : paragraphs.map((paragraph, index) => <p key={index} style={{ whiteSpace: "pre-line" }}>{paragraph}</p>)}
            <ArticleFooterExtras sources={Array.isArray(structured?.sources) ? structured.sources.filter((source) => source?.title && /^https:\/\//.test(source.url)) : []} related={related.map((item) => ({ slug: item.slug, title: item.title, category: item.category, excerpt: item.excerpt }))} />
          <div className="article-end-note"><span>R</span><p>Informação para decisões melhores.</p></div><div className="article-share-row"><span>Este conteúdo foi útil?</span><a href="#comentarios">Deixe sua opinião <span aria-hidden="true">↓</span></a></div></div>
        </article>
        <div className="container reading-comments-wrap"><CommentsSection articleSlug={post.slug} /></div>
        <section className="reading-back"><div className="container reading-back-inner"><div><span className="section-number">CONTINUE EXPLORANDO</span><h2>Mais ideias para <em>seguir em frente.</em></h2></div><Link className="button button-primary" href="/#artigos">Voltar aos artigos <span aria-hidden="true">↗</span></Link></div></section>
        <footer className="site-footer"><div className="container footer-inner"><Link className="brand brand-footer" href="/"><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link><span>Informação para decisões melhores.</span><span>© 2026 Rumo Blog</span></div></footer>
      </main>
    );
  }
  notFound();
}
