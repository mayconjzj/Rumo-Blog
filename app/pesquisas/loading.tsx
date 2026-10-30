import Skeleton from "../components/ui/Skeleton";

export default function LoadingResearchArchive() {
  return <main className="loading-research" aria-busy="true">
    <div className="container">
      <Skeleton width="60%" height={40} />
      {Array.from({ length: 5 }, (_, index) => <article className="loading-research-card" key={index}><Skeleton width="70%" height={22} /><Skeleton width="100%" height={12} /><Skeleton width="90%" height={12} /></article>)}
    </div>
  </main>;
}
