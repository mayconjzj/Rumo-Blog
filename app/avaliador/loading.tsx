import Skeleton, { SkeletonLines } from "../components/ui/Skeleton";

export default function LoadingReviewerPortal() {
  return <main className="loading-reviewer" aria-busy="true" aria-label="Carregando portal do avaliador">
    <section className="loading-reviewer-content">
      <Skeleton width={210} height={12} />
      <Skeleton width={310} height={40} />
      <SkeletonLines count={2} />
      {Array.from({ length: 3 }, (_, index) => <article className="loading-review-card" key={index}>
        <Skeleton width={180} height={10} />
        <Skeleton width="75%" height={23} />
        <SkeletonLines count={3} />
        <Skeleton width={120} height={40} />
      </article>)}
    </section>
  </main>;
}
