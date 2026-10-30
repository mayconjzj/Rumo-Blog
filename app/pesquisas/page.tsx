import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import { listPublishedPapers } from "@/lib/server/publication-repository";
import ResearchSiteHeader from "../components/ResearchSiteHeader";
import SiteFooter from "../components/SiteFooter";
import ResearchFilters from "./ResearchFilters";
import PageIntro from "../components/ui/PageIntro";
import Skeleton, { SkeletonLines } from "../components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Arquivo de pesquisas científicas",
  description:
    "Consulte pesquisas científicas publicadas na Revista Rumo, com acesso gratuito aos resumos, palavras-chave, referências e PDFs disponíveis.",
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

function ResearchArchiveIntro() {
  return (
    <PageIntro
      backHref="/"
      backLabel="← Voltar para a página inicial"
      backClassName="research-back-link"
      eyebrow="REVISTA RUMO / ARQUIVO CIENTÍFICO"
      eyebrowClassName="research-eyebrow"
      title="Pesquisas publicadas"
      description="Leia e encontre artigos científicos aceitos e publicados pela revista. Pesquise por título, autor ou palavra-chave e filtre por área científica."
      descriptionClassName="research-intro"
    />
  );
}

function ResearchResultsSkeleton() {
  return (
    <div className="research-results-loading" aria-busy="true" aria-label="Carregando pesquisas">
      <div className="loading-filter-row">
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
      </div>
      <Skeleton width={150} height={12} />
      <div className="loading-research-list">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="loading-research-card" key={index}>
            <Skeleton width="34%" height={10} />
            <Skeleton width="82%" height={24} />
            <SkeletonLines count={3} />
            <Skeleton width="25%" height={12} />
          </article>
        ))}
      </div>
    </div>
  );
}

async function ResearchArchiveResults() {
  await connection();

  let papers;
  let failed = false;

  try {
    papers = await listPublishedPapers();
  } catch (error) {
    console.error("Não foi possível carregar o arquivo científico.", error);
    papers = [];
    failed = true;
  }

  if (failed) {
    return (
      <div className="research-empty" role="status">
        <h2>Arquivo temporariamente indisponível</h2>
        <p>Não foi possível consultar o arquivo científico neste momento. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="research-empty">
        <h2>O primeiro número está em preparação</h2>
        <p>
          Ainda não há manuscritos publicados. A revista recebe submissões gratuitas de todas as áreas científicas.
        </p>
        <Link href="/submeter">Enviar uma pesquisa ↗</Link>
      </div>
    );
  }

  return (
    <ResearchFilters
      papers={papers.map((paper) => ({
        ...paper,
        published_at:
          paper.published_at && !Number.isNaN(new Date(paper.published_at).getTime())
            ? new Date(paper.published_at).toISOString()
            : "",
        keywords: Array.isArray(paper.keywords) ? paper.keywords : [],
      }))}
    />
  );
}

export default function ResearchArchive() {
  return (
    <>
      <main className="research-archive">
        <ResearchSiteHeader />
        <div className="research-archive-content">
          <ResearchArchiveIntro />
          <Suspense fallback={<ResearchResultsSkeleton />}>
            <ResearchArchiveResults />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
