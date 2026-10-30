import Skeleton from "../components/ui/Skeleton";

export default function LoadingAdmin() {
  return <main className="loading-admin" aria-busy="true" aria-label="Carregando painel administrativo">
    <div className="loading-admin-content">
      <Skeleton width={160} height={10} />
      <Skeleton width={280} height={38} />
      <div className="loading-admin-grid">
        {Array.from({ length: 3 }, (_, index) => <section className="loading-admin-card" key={index}><Skeleton width="38%" height={10} /><Skeleton width="74%" height={24} /><Skeleton width="100%" height={12} /><Skeleton width="82%" height={12} /></section>)}
      </div>
    </div>
  </main>;
}
