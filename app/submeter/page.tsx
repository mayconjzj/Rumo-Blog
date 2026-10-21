import Link from "next/link";
import ResearchSiteHeader from "../components/ResearchSiteHeader";
import SubmissionForm from "./submission-form";

export const metadata = {
  title: "Submeter artigo | Revista Rumo",
  description:
    "Envie gratuitamente um manuscrito científico para avaliação editorial da Revista Rumo.",
};

const scientificAreas = [
  "Ciências Exatas e da Terra",
  "Ciências Biológicas",
  "Engenharias",
  "Ciências da Saúde",
  "Ciências Agrárias",
  "Ciências Sociais Aplicadas",
  "Ciências Humanas",
  "Linguística, Letras e Artes",
  "Multidisciplinar",
];

export default function SubmitPage() {
  return (
    <main className="research-archive submission-page">
      <ResearchSiteHeader />

      <div className="research-archive-content submission-content">
        <Link href="/" className="research-back-link">
          ← Voltar para a página inicial
        </Link>
        <p className="research-eyebrow">REVISTA RUMO / SUBMISSÕES</p>
        <h1>Submeta sua pesquisa.</h1>
        <p className="research-intro submission-intro">
          A submissão é gratuita e aberta a trabalhos científicos de todas as
          áreas. Os manuscritos passam por triagem editorial e, se adequados ao
          escopo, podem ser encaminhados à avaliação por pares.
        </p>

        <section className="submission-form-panel" aria-label="Formulário de submissão">
          <SubmissionForm areas={scientificAreas} />
        </section>

        <p className="submission-guidance">
          Remova nomes, afiliações e agradecimentos identificadores do PDF para
          apoiar a avaliação duplo-cega. Informe os dados de autoria apenas no
          formulário.
        </p>
      </div>
    </main>
  );
}
