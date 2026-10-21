import type { Metadata } from "next";
import InstitutionalShell from "../components/InstitutionalShell";

export const metadata: Metadata = {
  title: "Política de Privacidade | Rumo",
  description: "Saiba como o Rumo trata informações, utiliza cookies e exibe anúncios do Google AdSense.",
};

export default function PrivacyPage() {
  return (
    <InstitutionalShell>
      <main className="institutional-page">
        <div className="container institutional-container">
          <span className="section-number">INFORMAÇÕES LEGAIS</span>
          <h1>Política de <em>Privacidade.</em></h1>
          <p className="institutional-lead">Esta política explica quais informações podem ser tratadas quando você visita o Rumo Blog, como funcionam os cookies e como o Google pode utilizar dados para exibir anúncios.</p>
          <p className="policy-updated">Última atualização: 21 de outubro de 2026</p>

          <section className="policy-section">
            <h2>1. Sobre o Rumo</h2>
            <p>O Rumo Blog é um site de conteúdo editorial sobre educação financeira, economia e investimentos. Esta política descreve as práticas relacionadas a este site e deve ser lida em conjunto com as informações apresentadas pelos serviços de terceiros nele integrados.</p>
          </section>
          <section className="policy-section">
            <h2>2. Informações que podem ser tratadas</h2>
            <p>Ao navegar pelo site, informações técnicas podem ser processadas pelo provedor de hospedagem e pelos serviços integrados, como endereço IP, tipo de navegador e dispositivo, páginas acessadas, data e hora de acesso, URL de origem e identificadores associados a cookies.</p>
            <p>Se você escrever um comentário em um artigo, o nome e o texto digitados são armazenados no armazenamento local do navegador utilizado. Na versão atual, esses comentários não são enviados ao servidor nem ficam automaticamente disponíveis para outros visitantes. Limpar os dados do navegador pode apagá-los.</p>
            <p>Não insira informações financeiras, documentos, senhas ou outros dados sensíveis em comentários ou mensagens públicas.</p>
          </section>
          <section className="policy-section">
            <h2>3. Cookies e tecnologias semelhantes</h2>
            <p>Cookies são pequenos arquivos que um site ou serviço pode armazenar no navegador. Eles podem ser usados para funções técnicas, lembrar preferências, medir o desempenho e apoiar a veiculação ou medição de publicidade. Tecnologias semelhantes também podem registrar informações sobre o navegador e a interação com páginas ou anúncios.</p>
            <p>O Rumo integra o Google AdSense para carregar recursos de publicidade. A presença do código de anúncios pode permitir que o Google e seus parceiros definam ou leiam cookies e processem informações relacionadas à visita, inclusive quando um anúncio não chega a ser exibido. O funcionamento efetivo depende das configurações do serviço, do navegador e das opções de privacidade aplicáveis.</p>
            <p>Você pode limitar ou apagar cookies nas configurações do navegador. Bloqueá-los pode afetar algumas funções e não significa necessariamente que todas as tecnologias de publicidade deixarão de funcionar.</p>
          </section>
          <section className="policy-section">
            <h2>4. Google AdSense e anúncios</h2>
            <p>O Google e seus parceiros podem usar informações como endereço IP, identificadores de cookies, endereço da página visitada, dados do navegador e interações com anúncios para entregar e medir publicidade, limitar a repetição de anúncios, detectar fraude e, conforme as configurações e permissões aplicáveis, personalizar anúncios.</p>
            <p>Os anúncios podem ser personalizados ou não personalizados. Desativar a personalização não significa necessariamente deixar de ver anúncios: eles ainda podem ser exibidos com base em fatores contextuais, como o conteúdo da página ou a localização aproximada.</p>
            <p>O Google trata essas informações de acordo com as próprias políticas e configurações. Consulte <a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR" target="_blank" rel="noreferrer">Como o Google usa informações de sites que utilizam seus serviços</a>, a <a href="https://policies.google.com/technologies/ads?hl=pt-BR" target="_blank" rel="noreferrer">informação sobre publicidade e cookies</a> e as <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer">Configurações de anúncios do Google</a> para entender e ajustar as opções disponíveis.</p>
          </section>
          <section className="policy-section">
            <h2>5. Finalidades do tratamento</h2>
            <p>As informações podem ser utilizadas para disponibilizar e proteger o site, manter seu funcionamento, compreender problemas técnicos, medir a eficácia dos anúncios, prevenir fraude e cumprir obrigações legais. O Google e outros prestadores podem tratar dados conforme suas próprias finalidades e políticas, descritas nos respectivos avisos de privacidade.</p>
          </section>
          <section className="policy-section">
            <h2>6. Compartilhamento e serviços externos</h2>
            <p>O site utiliza serviços de terceiros, incluindo hospedagem e publicidade. Esses prestadores podem receber informações técnicas necessárias para fornecer seus serviços e tratá-las de acordo com seus termos. Links para sites externos seguem as políticas dos próprios destinos; o Rumo não controla suas práticas de privacidade.</p>
          </section>
          <section className="policy-section">
            <h2>7. Retenção e segurança</h2>
            <p>O tempo de retenção varia conforme o tipo de informação e o serviço responsável por tratá-la. O Rumo não controla os prazos de retenção definidos pelo Google ou por outros prestadores. Adotamos os recursos disponíveis na plataforma para manter o site, mas nenhum sistema conectado à internet pode garantir segurança absoluta.</p>
          </section>
          <section className="policy-section">
            <h2>8. Suas escolhas e direitos</h2>
            <p>Você pode gerenciar cookies no navegador e revisar as opções de personalização de anúncios nas ferramentas do Google. Quando a legislação aplicável conceder direitos sobre dados pessoais, você poderá solicitar informações, correção ou outras providências cabíveis pelo canal de contato indicado nesta página.</p>
            <p>O site deve apresentar mecanismos adicionais de consentimento quando exigidos pela legislação ou pelas regras dos serviços utilizados. Esta página informativa, por si só, não representa um painel de consentimento nem substitui a configuração técnica desses mecanismos.</p>
          </section>
          <section className="policy-section">
            <h2>9. Privacidade de crianças e adolescentes</h2>
            <p>O conteúdo do Rumo é informativo e não foi criado para solicitar dados pessoais de crianças. Não solicitamos deliberadamente informações pessoais além do que é necessário para o funcionamento do site. Responsáveis podem entrar em contato se tiverem dúvidas sobre informações enviadas ao site.</p>
          </section>
          <section className="policy-section">
            <h2>10. Alterações nesta política</h2>
            <p>Esta política pode ser atualizada para refletir mudanças no site, nos serviços utilizados ou nas exigências legais. A data no início da página indica a revisão mais recente. Recomendamos consultar esta página periodicamente.</p>
          </section>
          <section className="policy-section">
            <h2>11. Contato</h2>
            <p>Para dúvidas sobre privacidade ou para enviar uma solicitação, visite a página <a href="/contato">Contato</a>.</p>
          </section>
          <p className="policy-note">Esta política é uma descrição informativa das práticas previstas para o site e não constitui aconselhamento jurídico. Ela deve ser revisada se forem adicionados novos serviços, formulários, ferramentas de análise ou mecanismos de consentimento.</p>
        </div>
      </main>
    </InstitutionalShell>
  );
}
