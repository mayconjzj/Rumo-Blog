import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import EditorialDocumentNavigation from "../components/EditorialDocumentNavigation";
import SiteFooter from "../components/SiteFooter";
export const metadata = createPageMetadata({ title: "Política editorial", description: "Escopo, avaliação, custos e decisões editoriais da Revista Rumo.", path: "/politica-editorial" });
export default function EditorialPolicy() {
  return <><main className="editorial-document">
    <Link href="/" className="editorial-back-link">← Revista Rumo</Link>
    <p className="editorial-eyebrow">DOCUMENTOS EDITORIAIS</p><h1>Política editorial</h1>
    <p className="editorial-lead">A Revista Rumo recebe trabalhos científicos de diferentes áreas do conhecimento. A submissão e a leitura são gratuitas, mas o envio não garante aceite ou publicação.</p>
    <section><h2>Escopo e tipos de manuscrito</h2><p>São considerados artigos originais, artigos de revisão, estudos de caso, notas metodológicas e comunicações breves. A adequação ao escopo e a contribuição científica são examinadas na triagem editorial.</p></section>
    <section><h2>Triagem e avaliação</h2><p>A equipe verifica o escopo, a completude dos dados, a legibilidade do PDF e as declarações editoriais. Manuscritos elegíveis podem ser enviados a avaliadores com conhecimento pertinente à área. Os pareceres são consultivos; a decisão final cabe ao editor.</p></section>
    <section><h2>Decisões possíveis</h2><p>O manuscrito pode ser devolvido para ajustes técnicos, recusado na triagem, encaminhado para avaliação, receber solicitação de revisões, ser aceito ou rejeitado após análise. O aceite não significa publicação imediata: a versão final ainda precisa ser conferida e preparada.</p></section>
    <section><h2>Prazos e comunicação</h2><p>Não há prazo fixo anunciado para triagem, parecer ou decisão. O autor correspondente deve manter o e-mail atualizado e guardar o número de acompanhamento. As comunicações dependem da atuação da equipe editorial; não presuma notificações automáticas.</p></section>
    <section><h2>Autoria, originalidade e conflitos</h2><p>Os autores são responsáveis pela originalidade, exatidão, referências e concordância de todos os coautores. Plágio, fabricação ou falsificação de dados, conflitos não declarados e problemas de ética podem levar à rejeição. Financiamento e uso relevante de IA devem ser informados.</p></section>
    <section><h2>Correções e transparência</h2><p>Erros relevantes ou suspeitas de má conduta devem ser comunicados à equipe editorial. DOI, indexação, fator de impacto, periodicidade e composição do conselho editorial só serão anunciados quando formalmente definidos e verificáveis.</p></section>
    <EditorialDocumentNavigation />
  </main><SiteFooter /></>;
}