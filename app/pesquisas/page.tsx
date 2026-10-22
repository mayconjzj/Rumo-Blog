import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";

import { neon } from "@neondatabase/serverless";
import ResearchSiteHeader from "../components/ResearchSiteHeader";
import SiteFooter from "../components/SiteFooter";
import ResearchFilters, { type ResearchPaper } from "./ResearchFilters";
import PageIntro from "../components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Arquivo de pesquisas científicas",
  description: "Consulte pesquisas científicas publicadas na Revista Rumo, com acesso gratuito aos resumos, palavras-chave, referências e PDFs disponíveis.",
  alternates: { canonical: `${siteUrl}/pesquisas` },
  openGraph: {
    type: "website",
    title: "Arquivo de pesquisas científicas | Revista Rumo",
    description: "Pesquisas científicas publicadas com acesso gratuito na Revista Rumo.",
    url: `${siteUrl}/pesquisas`,
    siteName: "Revista Rumo",
    locale: "pt_BR",
  },
};

export const dynamic = "force-dynamic";

type PaperRow = Omit<ResearchPaper, "published_at"> & {
  published_at: string | Date;
};


export default async function ResearchArchive() {
  let papers: ResearchPaper[] = [];
  let unavailable = false;

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const sql = neon(process.env.DATABASE_URL);
    const rows = (await sql.query(
      `SELECT
         s.public_id,
         s.title,
         s.abstract,
         s.scientific_area,
         s.keywords,
         s.published_at,
         COALESCE(
           string_agg(a.display_name, ', ' ORDER BY a.author_order),
           ''
         ) AS authors
       FROM public.journal_submissions AS s
       LEFT JOIN public.submission_authors AS a
         ON a.submission_id = s.id
       WHERE s.status = 'published'
       GROUP BY s.id
       ORDER BY s.published_at DESC`,
      [],
    )) as unknown as PaperRow[];

    papers = rows.map((paper) => ({
      ...paper,
      published_at:
        paper.published_at instanceof Date
          ? paper.published_at.toISOString()
          : String(paper.published_at ?? ""),
      keywords: Array.isArray(paper.keywords) ? paper.keywords : [],
    }));
  } catch {
    unavailable = true;
  }

  return (
    <>
    <main className="research-archive">
      <ResearchSiteHeader />

      <div className="research-archive-content">
        <PageIntro backHref="/" backLabel="← Voltar para a página inicial" backClassName="research-back-link" eyebrow="REVISTA RUMO / ARQUIVO CIENTÍFICO" eyebrowClassName="research-eyebrow" title="Pesquisas publicadas" description="Leia e encontre artigos científicos aceitos e publicados pela revista. Pesquise por título, autor ou palavra-chave e filtre por área científica." descriptionClassName="research-intro" />

        {unavailable ? (
          <div className="research-empty">
            <h2>Arquivo temporariamente indisponível</h2>
            <p>
              O arquivo científico estará disponível após a configuração do banco
              editorial.
            </p>
          </div>
        ) : papers.length === 0 ? (
          <div className="research-empty">
            <h2>O primeiro número está em preparação</h2>
            <p>
              Ainda não há manuscritos publicados. A revista recebe submissões
              gratuitas de todas as áreas científicas.
            </p>
            <Link href="/submeter">Enviar uma pesquisa ↗</Link>
          </div>
        ) : (
          <ResearchFilters papers={papers} />
        )}
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
