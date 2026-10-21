import type { Metadata } from "next";
import InstitutionalShell from "../components/InstitutionalShell";

export const metadata: Metadata = {
  title: "Contato | Rumo",
  description: "Entre em contato com o Rumo Blog para enviar sugestões, apontar correções ou tratar de questões de privacidade.",
};

export default function ContactPage() {
  return (
    <InstitutionalShell>
      <main className="institutional-page">
        <div className="container institutional-container contact-container">
          <span className="section-number">FALE CONOSCO</span>
          <h1>Vamos conversar sobre o <em>Rumo.</em></h1>
          <p className="institutional-lead">Sugestões de pauta, correções editoriais e dúvidas sobre privacidade são bem-vindas.</p>
          <section className="contact-card">
            <span className="contact-card-label">CANAL DE CONTATO ATUAL</span>
            <h2>Solicitações e sugestões</h2>
            <p>Enquanto um endereço de e-mail institucional não é definido, use o canal público do projeto no GitHub para relatar um problema técnico ou registrar uma sugestão. Não publique informações pessoais, dados financeiros ou conteúdo confidencial em uma solicitação pública.</p>
            <a className="button button-primary institutional-button" href="https://github.com/mayconjzj/Rumo-Blog/issues/new" target="_blank" rel="noreferrer">Abrir solicitação <span className="arrow">↗</span></a>
          </section>
          <section className="policy-section">
            <h2>Correções e conteúdo</h2>
            <p>Se encontrar uma informação incorreta, informe o endereço do artigo e descreva, sempre que possível, qual trecho precisa ser revisto e qual fonte sustenta a correção.</p>
          </section>
          <section className="policy-section">
            <h2>Privacidade</h2>
            <p>Para entender como funcionam os cookies e os anúncios, consulte a <a href="/privacidade">Política de Privacidade</a>. Para enviar uma solicitação sobre dados pessoais, use o canal acima e evite incluir dados sensíveis na mensagem pública.</p>
          </section>
        </div>
      </main>
    </InstitutionalShell>
  );
}
