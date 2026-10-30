import Skeleton, { SkeletonLines } from "../../components/ui/Skeleton";

export default function LoadingArticle() {
  return <main className="loading-article" aria-busy="true" aria-label="Carregando artigo">
    <article className="loading-article-content">
      <Skeleton width={95} height={12} />
      <Skeleton width="88%" height={44} />
      <Skeleton width="62%" height={44} />
      <SkeletonLines count={2} />
      <Skeleton width="100%" height={310} />
      <Skeleton width={150} height={22} />
      <SkeletonLines count={7} />
    </article>
  </main>;
}
