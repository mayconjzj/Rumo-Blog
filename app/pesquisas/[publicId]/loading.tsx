import Skeleton, { SkeletonLines } from "../../components/ui/Skeleton";

export default function LoadingPublishedPaper() {
  return <main className="loading-article" aria-busy="true" aria-label="Carregando pesquisa científica">
    <article className="loading-article-content">
      <Skeleton width={120} height={12} />
      <Skeleton width="88%" height={42} />
      <Skeleton width="58%" height={42} />
      <Skeleton width="42%" height={13} />
      <Skeleton width="100%" height={1} />
      <Skeleton width={110} height={22} />
      <SkeletonLines count={6} />
      <Skeleton width={145} height={44} />
    </article>
  </main>;
}
