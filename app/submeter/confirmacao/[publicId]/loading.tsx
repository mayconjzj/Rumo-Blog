import Skeleton, { SkeletonLines } from "../../../components/ui/Skeleton";

export default function LoadingSubmissionReceipt() {
  return <main className="loading-reviewer" aria-busy="true" aria-label="Carregando recibo da submissão">
    <section className="loading-reviewer-content">
      <Skeleton width={180} height={11} />
      <Skeleton width={280} height={38} />
      <SkeletonLines count={3} />
      <div className="loading-card">
        <Skeleton width={100} height={10} />
        <Skeleton width="82%" height={22} />
        <Skeleton width={190} height={12} />
        <Skeleton width="100%" height={14} />
      </div>
      <Skeleton width={160} height={44} />
    </section>
  </main>;
}
