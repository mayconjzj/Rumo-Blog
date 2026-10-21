import type { Metadata } from "next";
import Link from "next/link";
import InstitutionalShell from "../components/InstitutionalShell";

export const metadata: Metadata = {
  title: "Sobre o Rumo | Ideias que movem o patrimônio",
  description: "Conheça a proposta editorial do Rumo Blog: educação financeira, investimentos e análise com clareza e responsabilidade.",
};

export default function AboutPage() {
  return (
    <InstitutionalShell>
      <main className="institutional-page">
        <div className="container institutional-container">
          <span className="section-number">SOBRE O PROJETO</span>
          <h1>Conhecimento para encontrar o seu <em>rumo.</em></h1>
          <p className="institutional-lead">Um espaço independente para compreender melhor dinheiro, economia e investimentos — com menos ruído e mais contexto.</p>
          <section className="policy-section">
            <h2>Por que existimos</h2>
            <p>Decisões financeiras são mais sólidas quando partem de informação compreensível, perguntas bem formuladas e uma visão realista dos riscos. O Rumo nasceu com a proposta de organizar ideias e explicar conceitos que podem parecer complexos sem simplificar demais o que realmente importa.</p>
          </section>
          <section className="policy-section">
            <h2>O que você encontra aqui</h2>
            <ul>
              <li><strong>Educação financeira:</strong> conceitos, planejamento e ferramentas para entender melhor as próprias decisões.</li>
              <li><strong>Investimentos:</strong> fundamentos, indicadores, riscos e critérios para analisar ativos.</li>
              <li><strong>Economia e mercado:</strong> explicações e perspectivas para interpretar acontecimentos e seus possíveis efeitos.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2>Como tratamos o conteúdo</h2>
            <p>Buscamos apresentar explicações claras, separar fatos de interpretações e reconhecer as limitações de estimativas e cenários. Quando aplicável, conteúdos podem ser atualizados para corrigir erros, esclarecer conceitos ou incorporar informações relevantes.</p>
            <p>O Rumo é um projeto editorial e educacional. Os textos têm finalidade informativa, não representam consultoria financeira individual nem recomendação personalizada de compra ou venda de ativos. Investimentos envolvem riscos, e decisões devem considerar objetivos, prazo e situação de cada pessoa.</p>
          </section>
          <section className="policy-section">
            <h2>Independência e transparência</h2>
            <p>O site pode exibir anúncios por meio do Google AdSense. A publicidade ajuda a apoiar a operação do projeto, mas não deve ser interpretada como endosso editorial a um produto ou serviço anunciado. Anúncios podem ser selecionados por sistemas de terceiros, de acordo com suas configurações e políticas.</p>
          </section>
          <section className="policy-section">
            <h2>Fale com o Rumo</h2>
            <p>Encontrou um erro, quer sugerir um tema ou tem uma dúvida sobre o conteúdo? Acesse nossa página de contato e envie sua solicitação.</p>
            <Link className="button button-primary institutional-button" href="/contato">Entrar em contato <span className="arrow">↗</span></Link>
          </section>
        </div>
      </main>
    </InstitutionalShell>
  );
}
