import Skeleton from "../components/ui/Skeleton";

export default function LoadingSubmission() {
  return <main className="loading-submission" aria-busy="true" aria-label="Carregando formulário de submissão">
    <div className="loading-form-panel">
      <Skeleton width={170} height={10} />
      <Skeleton width="72%" height={42} />
      {Array.from({ length: 8 }, (_, index) => <div className="loading-form-field" key={index}><Skeleton width={130} height={11} /><Skeleton height={44} /></div>)}
      <Skeleton width={160} height={46} />
    </div>
  </main>;
}
