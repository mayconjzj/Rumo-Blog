import Skeleton, { SkeletonLines } from "../components/ui/Skeleton";
import ResearchSiteHeader from "../components/ResearchSiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageIntro from "../components/ui/PageIntro";

export function ResearchResultsSkeleton() {
  return (
    <div className="research-results-loading" aria-busy="true" aria-label="Carregando pesquisas científicas">
      <div className="research-tools">
        <div className="research-search" aria-hidden="true">
          <Skeleton width={18} height={18} />
          <Skeleton width="100%" height={13} />
        </div>
        <div className="research-area-filter" aria-hidden="true">
          <Skeleton width={92} height={9} />
          <Skeleton width="100%" height={13} />
        </div>
        <p className="research-count"><Skeleton width={118} height={10} /></p>
      </div>
      <div className="research-results">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="research-card" key={index}>
            <Skeleton width="38%" height={10} />
            <Skeleton width="82%" height={24} />
            <Skeleton width="54%" height={11} />
            <SkeletonLines count={3} lastLineWidth="76%" />
            <Skeleton width="42%" height={10} />
            <Skeleton width={132} height={12} />
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ResearchArchiveSkeleton() {
  return (
    <>
      <main className="research-archive" aria-busy="true">
        <ResearchSiteHeader />
        <div className="research-archive-content">
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
          <ResearchResultsSkeleton />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
