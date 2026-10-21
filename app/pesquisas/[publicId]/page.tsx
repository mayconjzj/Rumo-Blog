import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type PublishedPaper = {
  id: number;
  public_id: string;
  title: string;
  abstract: string;
  scientific_area: string;
  keywords: string[] | null;
  references_text: string | null;
  published_at: string | Date;
  authors: string;
  affiliations: string;
};

async function getPublishedPaper(publicId: string): Promise<PublishedPaper | undefined> {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql.query(
      `SELECT s.id, s.public_id, s.title, s.abstract, s.scientific_area,
              s.keywords, s.references_text, s.published_at,
              COALESCE(string_agg(a.display_name, ', ' ORDER BY a.author_order), '') AS authors,
              COALESCE(string_agg(DISTINCT NULLIF(a.affiliation, ''), '; '), '') AS affiliations
       FROM public.journal_submissions s
       LEFT JOIN public.submission_authors a ON a.submission_id = s.id
       WHERE s.public_id = $1::uuid
         AND s.status = 'published'
         AND NULLIF(BTRIM(s.title), '') IS NOT NULL
       GROUP BY s.id
       LIMIT 1`,
      [publicId],
    );
    return rows[0] as PublishedPaper | undefined;
  } catch {
    return undefined;
  }
}

function plainDescription(value: string | null | undefined): string {
  const normalized = value?.replace(/\s+/g, " ").trim();
  if (!normalized) return "Leia gratuitamente esta pesquisa científica publicada na Revista Rumo.";
  return normalized.length > 160 ? `${normalized.slice(0, 157).trimEnd()}...` : normalized;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(publicId)) {
    return { title: "Pesquisa não encontrada", robots: { index: false, follow: false } };
  }

  const paper = await getPublishedPaper(publicId);
  if (!paper) {
    return { title: "Pesquisa não encontrada", robots: { index: false, follow: false } };
  }

  const url = `${siteUrl}/pesquisas/${encodeURIComponent(paper.public_id)}`;
  const description = plainDescription(paper.abstract);
  return {
    title: paper.title,
    description,
    keywords: paper.keywords ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "Revista Rumo",
      url,
      title: paper.title,
      description,
      publishedTime: new Date(paper.published_at).toISOString(),
    },
    twitter: { card: "summary", title: paper.title, description },
  };
}

export default async function PublishedPaper({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(publicId)) notFound();
  const paper = await getPublishedPaper(publicId);
  if (!paper) notFound();

  const canonicalUrl = `${siteUrl}/pesquisas/${encodeURIComponent(paper.public_id)}`;
  const keywords = paper.keywords ?? [];
  const authors = paper.authors
    ? paper.authors.split(", ").map((name) => ({ "@type": "Person", name }))
    : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    description: plainDescription(paper.abstract),
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    datePublished: new Date(paper.published_at).toISOString(),
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    keywords,
    author: authors,
    publisher: { "@type": "Organization", name: "Revista Rumo", url: siteUrl },
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f4f6f8", padding: "38px 22px 80px", color: "#17283b" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <Link href="/pesquisas" style={{ fontSize: 12, color: "#195AB4" }}>← Arquivo científico</Link>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "#195AB4", marginTop: 30 }}>
          {paper.scientific_area.toUpperCase()} · ARTIGO CIENTÍFICO
        </p>
        <h1 style={{ fontSize: "clamp(32px,5vw,48px)", lineHeight: 1.15, letterSpacing: "-.045em", color: "#05132A", marginBottom: 18 }}>
          {paper.title}
        </h1>
        {paper.authors && <p style={{ fontSize: 14, color: "#34485d", marginBottom: 5 }}>{paper.authors}</p>}
        {paper.affiliations && <p style={{ fontSize: 12, color: "#687789", marginBottom: 20 }}>{paper.affiliations}</p>}
        <p style={{ fontSize: 12, color: "#687789", marginBottom: 28 }}>
          Publicado em {new Date(paper.published_at).toLocaleDateString("pt-BR")} · Acesso gratuito
        </p>
        <section style={{ background: "#fff", border: "1px solid #e1e6eb", padding: "clamp(22px,4vw,34px)" }}>
          <h2 style={{ fontSize: 19, color: "#05132A" }}>Resumo</h2>
          <p style={{ fontSize: 15, lineHeight: 1.95, whiteSpace: "pre-wrap" }}>{paper.abstract}</p>
          <h3 style={{ fontSize: 14, color: "#05132A", marginTop: 24 }}>Palavras-chave</h3>
          <p style={{ fontSize: 13, color: "#687789" }}>{keywords.join("; ") || "—"}</p>
          {paper.references_text && (
            <>
              <h3 style={{ fontSize: 14, color: "#05132A", marginTop: 24 }}>Referências</h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{paper.references_text}</p>
            </>
          )}
          <a href={`/api/publicacoes/${paper.public_id}/pdf`} target="_blank" rel="noreferrer"
            style={{ display: "inline-block", background: "#05132A", color: "#fff", padding: "14px 18px", marginTop: 20, fontSize: 12, fontWeight: 800 }}>
            Ler PDF completo ↗
          </a>
        </section>
        <p style={{ fontSize: 11, color: "#687789", lineHeight: 1.7, marginTop: 18 }}>
          Informações de DOI, indexação e licença só serão exibidas quando efetivamente configuradas.
        </p>
      </div>
    </main>
  );
}
