import Skeleton, { SkeletonLines } from "../../components/ui/Skeleton";

export default function LoadingPublishedPaper() {
  return (
    <main
      className="loading-published-paper"
      aria-busy="true"
      aria-label="Carregando pesquisa científica"
      style={{ minHeight: "100vh", background: "#f4f6f8", padding: "38px 22px 80px", color: "#17283b" }}
    >
      <article style={{ maxWidth: 850, margin: "0 auto" }}>
        <Skeleton width={150} height={12} />
        <div style={{ marginTop: 30, display: "grid", gap: 14 }}>
          <Skeleton width={125} height={11} />
          <Skeleton width="92%" height={44} />
          <Skeleton width="68%" height={44} />
          <Skeleton width="48%" height={13} />
          <Skeleton width="36%" height={12} />
        </div>
        <section
          style={{
            background: "#fff",
            border: "1px solid #e1e6eb",
            padding: "clamp(22px,4vw,34px)",
            marginTop: 28,
            display: "grid",
            gap: 18,
          }}
        >
          <Skeleton width={90} height={20} />
          <SkeletonLines count={6} lastLineWidth="78%" />
          <Skeleton width={125} height={15} />
          <Skeleton width="72%" height={13} />
          <Skeleton width={110} height={15} />
          <SkeletonLines count={3} lastLineWidth="64%" />
          <Skeleton width={160} height={48} />
        </section>
        <Skeleton width="85%" height={12} />
      </article>
    </main>
  );
}
