import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import EditorialDocumentNavigation from "../components/EditorialDocumentNavigation";
import SiteFooter from "../components/SiteFooter";

export const metadata = createPageMetadata({ title: "Ética e integridade", description: "Diretrizes de autoria, originalidade, ética em pesquisa, conflitos de interesse e uso de IA.", path: "/etica-publicacao" });

export default function PublicationEthics() {
  return (
    <>
    <main className="editorial-document">
      <Link href="/" className="editorial-back-link">← Revista Rumo</Link>
      <p className="editorial-eyebrow">DOCUMENTOS EDITORIAIS</p>
      <h1>Ética e integridade em publicação</h1>
      <p className="editorial-lead">A integridade científica é responsabilidade compartilhada entre autores, avaliadores e equipe editorial. Todas as declarações devem ser completas e verdadeiras.</p>
      <section><h2>Autoria e responsabilidade</h2><p>Todos os autores devem ter contribuído de forma relevante, aprovar a versão submetida e concordar com a ordem de autoria. Cada autor permanece responsável pela integridade do trabalho. Alterações de autoria após o envio precisam ser justificadas e acordadas entre as pessoas envolvidas.</p></section>
      <section><h2>Originalidade e publicação simultânea</h2><p>Os autores devem informar trabalhos relacionados, preprints e sobreposição substancial com publicações anteriores. Plágio, fabricação ou falsificação de dados e manipulação indevida de citações podem levar à rejeição. Os autores devem observar as regras aplicáveis sobre submissão simultânea.</p></section>
      <section><h2>Ética em pesquisa</h2><p>Pesquisas com participantes humanos, animais ou dados sensíveis devem informar aprovações, consentimentos e salvaguardas aplicáveis, conforme a legislação e as normas da área. Quando uma aprovação não se aplicar, explique o motivo; não declare aprovações que não existam.</p></section>
      <section><h2>Financiamento e conflitos de interesse</h2><p>Informe as fontes de financiamento e, quando pertinente, o papel dos financiadores. Autores e avaliadores devem declarar relações financeiras, profissionais ou pessoais que possam influenciar o estudo ou sua avaliação.</p></section>
      <section><h2>Uso de inteligência artificial</h2><p>Declare o uso relevante de ferramentas de IA na elaboração, análise, tradução ou produção de conteúdo, conforme aplicável. Ferramentas de IA não podem ser listadas como autoras. Os autores humanos permanecem responsáveis pela exatidão, originalidade, referências e integridade do conteúdo.</p></section>
      <section><h2>Avaliação e confidencialidade</h2><p>Manuscritos não publicados e pareceres devem ser tratados como confidenciais. Avaliadores não devem compartilhar arquivos nem usar informações não publicadas fora do processo editorial. Conflitos de interesse devem ser informados antes de aceitar a avaliação.</p></section>
      <section><h2>Denúncias, correções e retratações</h2><p>Suspeitas de má conduta devem ser comunicadas à equipe editorial com informações verificáveis. Os casos devem ser examinados com imparcialidade e confidencialidade, permitindo resposta das partes envolvidas. Quando justificado, podem ser necessárias correções, avisos ou retratações.</p></section>
      <EditorialDocumentNavigation />
    </main>
    <SiteFooter />
    </>
  );
}
