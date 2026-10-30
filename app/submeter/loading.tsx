import Skeleton, { SkeletonLines } from "../components/ui/Skeleton";
import ResearchSiteHeader from "../components/ResearchSiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageIntro from "../components/ui/PageIntro";

export default function LoadingSubmission() {
  return (
    <>
      <main className="research-archive submission-page" aria-busy="true" aria-label="Carregando formulário de submissão">
        <ResearchSiteHeader />
        <div className="research-archive-content submission-content">
          <PageIntro
            backHref="/"
            backLabel="← Voltar para a página inicial"
            backClassName="research-back-link"
            eyebrow="REVISTA RUMO / SUBMISSÕES"
            eyebrowClassName="research-eyebrow"
            title="Submeta sua pesquisa."
            description="Recebemos artigos originais, revisões, estudos de caso, notas metodológicas e comunicações breves de diferentes áreas do conhecimento."
            descriptionClassName="research-intro submission-intro"
          />

          <section className="submission-steps">
            <h2>O que acontece depois do envio?</h2>
            <ol>
              {Array.from({ length: 5 }, (_, index) => (
                <li key={index}><SkeletonLines count={2} lastLineWidth="72%" /></li>
              ))}
            </ol>
            <SkeletonLines count={2} />
          </section>

          <section className="submission-checklist">
            <h2>Antes de enviar, confira</h2>
            <ul>
              {Array.from({ length: 5 }, (_, index) => (
                <li key={index}><Skeleton width="96%" height={12} /></li>
              ))}
            </ul>
          </section>

          <section className="submission-form-panel">
            <h2>Formulário de submissão</h2>
            <Skeleton width="76%" height={12} />
            <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
              <div className="loading-form-field"><Skeleton width={140} height={11} /><Skeleton height={46} /></div>
              <div className="loading-form-field"><Skeleton width={90} height={11} /><Skeleton height={132} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                <div className="loading-form-field"><Skeleton width={130} height={11} /><Skeleton height={46} /></div>
                <div className="loading-form-field"><Skeleton width={130} height={11} /><Skeleton height={46} /></div>
              </div>
              {Array.from({ length: 6 }, (_, index) => (
                <div className="loading-form-field" key={index}><Skeleton width="32%" height={11} /><Skeleton height={46} /></div>
              ))}
              <Skeleton width={190} height={46} />
            </div>
          </section>
          <Skeleton width="90%" height={12} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
