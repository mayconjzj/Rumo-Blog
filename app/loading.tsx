import Skeleton, { SkeletonLines } from "./components/ui/Skeleton";

export default function Loading() {
  return <main className="loading-page" aria-busy="true" aria-label="Carregando página">
    <div className="loading-topbar"><div className="container loading-topbar-inner"><Skeleton width={170} height={9} /><Skeleton width={210} height={9} /></div></div>
    <header className="loading-header"><div className="container loading-header-inner">
      <div className="loading-brand"><Skeleton width={36} height={36} /><Skeleton width={86} height={23} /></div>
      <div className="loading-nav"><Skeleton width={48} height={12} /><Skeleton width={54} height={12} /><Skeleton width={70} height={12} /></div>
      <Skeleton width={142} height={42} />
    </div></header>
    <section className="loading-hero"><div className="container loading-hero-grid">
      <div className="loading-copy"><Skeleton width={190} height={10} /><Skeleton width="92%" height={54} /><Skeleton width="76%" height={54} /><SkeletonLines count={3} /><div className="loading-actions"><Skeleton width={164} height={46} /><Skeleton width={132} height={14} /></div></div>
      <Skeleton className="loading-visual" height={300} />
    </div></section>
    <section className="container loading-content"><Skeleton width={180} height={10} /><Skeleton width={300} height={34} />
      <div className="loading-card-grid">{Array.from({ length: 3 }, (_, index) => <div className="loading-card" key={index}><Skeleton width="42%" height={10} /><Skeleton width="88%" height={22} /><SkeletonLines count={3} /><Skeleton width={112} height={12} /></div>)}</div>
    </section>
  </main>;
}
