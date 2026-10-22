import Link from "next/link";
import { redirect } from "next/navigation";
import { getCommunityAccess } from "@/lib/server/community-access";
import ResearchSiteHeader from "../components/ResearchSiteHeader";
import SiteFooter from "../components/SiteFooter";
import SubmissionForm from "./submission-form";
import PageIntro from "../components/ui/PageIntro";

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

export default async function SubmitPage() {
  const access = await getCommunityAccess();
  if (access.status === "anonymous") redirect("/login?returnTo=%2Fsubmeter");
  if (access.status === "disabled") redirect("/pesquisas?perfil=desativado");

  return (
    <>
    <main className="research-archive submission-page">
      <ResearchSiteHeader />

      <div className="research-archive-content submission-content">
        <PageIntro backHref="/" backLabel="← Voltar para a página inicial" backClassName="research-back-link" eyebrow="REVISTA RUMO / SUBMISSÕES" eyebrowClassName="research-eyebrow" title="Submeta sua pesquisa." description="Recebemos artigos originais, revisões, estudos de caso, notas metodológicas e comunicações breves de diferentes áreas do conhecimento. O envio não garante aceite: cada manuscrito passa por triagem e, quando pertinente, pode seguir para avaliação por pares. Não há taxa de submissão ou leitura." descriptionClassName="research-intro submission-intro" />

        <section className="submission-steps"><h2>O que acontece depois do envio?</h2><ol><li><strong>Recebimento:</strong> o sistema registra o envio e mostra um número de acompanhamento.</li><li><strong>Triagem técnica e editorial:</strong> a equipe verifica escopo, arquivo, metadados e declarações.</li><li><strong>Avaliação por pares:</strong> quando pertinente e havendo avaliadores adequados, o manuscrito segue para pareceres.</li><li><strong>Decisão editorial:</strong> o editor pode solicitar revisões, aceitar ou rejeitar. O parecer não decide automaticamente.</li><li><strong>Publicação:</strong> apenas artigos aceitos e preparados para publicação entram no arquivo público.</li></ol><p>Não há prazo fixo anunciado. A comunicação depende da equipe editorial; este sistema não garante notificações automáticas.</p></section><section className="submission-checklist"><h2>Antes de enviar, confira</h2><ul><li>O PDF tem até 4 MB e corresponde aos metadados preenchidos.</li><li>O arquivo não contém nomes, afiliações ou agradecimentos que identifiquem os autores.</li><li>Todos os autores aprovaram o manuscrito e a ordem de autoria.</li><li>As declarações de ética, financiamento, conflitos de interesse e uso de IA são verdadeiras.</li><li>O primeiro autor informado será associado ao e-mail do autor correspondente nesta versão do sistema.</li></ul><p>Consulte a <a href="/politica-editorial">política editorial</a>, a <a href="/avaliacao-por-pares">avaliação por pares</a>, as <a href="/etica-publicacao">diretrizes de ética</a> e a <a href="/privacidade">política de privacidade</a>.</p></section><section className="submission-form-panel" aria-label="Formulário de submissão"><h2>Formulário de submissão</h2><p>Preencha os campos obrigatórios e revise os dados antes de enviar.</p>
          <SubmissionForm areas={scientificAreas} />
        </section>

        <p className="submission-guidance">A submissão não equivale a aceite, não garante publicação e não estabelece prazo de resposta. Guarde o número de acompanhamento exibido após o envio.</p>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
