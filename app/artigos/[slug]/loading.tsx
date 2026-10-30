import Skeleton, { SkeletonLines } from "../../components/ui/Skeleton";

export default function LoadingArticle() {
  return (
    <main className="reading-page" aria-busy="true" aria-label="Carregando artigo">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <Skeleton width={190} height={9} />
          <Skeleton width={220} height={9} />
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <div className="brand"><Skeleton width={35} height={35} /><Skeleton width={86} height={22} /></div>
          <nav className="main-nav" aria-hidden="true">
            <Skeleton width={48} height={11} />
            <Skeleton width={55} height={11} />
            <Skeleton width={48} height={11} />
          </nav>
          <Skeleton width={88} height={40} />
        </div>
      </header>
      <div className="article-breadcrumb container">
        <Skeleton width={44} height={10} />
        <Skeleton width={8} height={10} />
        <Skeleton width={58} height={10} />
        <Skeleton width={8} height={10} />
        <Skeleton width={90} height={10} />
      </div>
      <article className="reading-article">
        <header className="reading-header">
          <Skeleton width={105} height={10} />
          <Skeleton width="88%" height={46} />
          <Skeleton width="67%" height={46} />
          <SkeletonLines count={2} lastLineWidth="74%" />
          <div className="reading-byline">
            <Skeleton variant="circle" width={38} height={38} />
            <Skeleton width={118} height={12} />
            <Skeleton width={130} height={11} />
          </div>
        </header>
        <div style={{ width: "min(1000px, calc(100% - 48px))", margin: "0 auto 45px" }}>
          <Skeleton width="100%" height={320} />
        </div>
        <div className="reading-body">
          <SkeletonLines count={5} lastLineWidth="82%" />
          <Skeleton width="62%" height={25} />
          <SkeletonLines count={7} lastLineWidth="70%" />
          <Skeleton width="48%" height={25} />
          <SkeletonLines count={6} lastLineWidth="78%" />
        </div>
      </article>
      <div className="container reading-comments-wrap">
        <section className="comments-section">
          <Skeleton width={130} height={10} />
          <Skeleton width={190} height={28} />
          <SkeletonLines count={2} />
          <Skeleton width="100%" height={120} />
        </section>
      </div>
      <section className="reading-back">
        <div className="container reading-back-inner">
          <div><Skeleton width={150} height={10} /><Skeleton width={270} height={28} /></div>
          <Skeleton width={145} height={44} />
        </div>
      </section>
    </main>
  );
}
