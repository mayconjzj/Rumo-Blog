import Link from "next/link";
import EditorialDocumentNavigation from "../components/EditorialDocumentNavigation";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Privacidade e dados pessoais | Revista Rumo",
  description:
    "Saiba quais dados a Revista Rumo trata, por que são utilizados, por quanto tempo são mantidos e como exercer seus direitos previstos na LGPD.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <main className="editorial-document">
        <Link href="/" className="editorial-back-link">
          ← Revista Rumo
        </Link>
        <p className="editorial-eyebrow">DOCUMENTOS EDITORIAIS</p>
        <h1>Privacidade e dados pessoais</h1>
        <p className="editorial-lead">
          A Revista Rumo respeita a privacidade de autores, avaliadores e
          visitantes. Esta política explica quais dados podem ser tratados no
          site e durante o processo editorial, para quais finalidades e como
          solicitar informações ou exercer os direitos previstos na Lei Geral
          de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
        </p>

        <section>
          <h2>1. Responsável e contato</h2>
          <p>
            A Revista Rumo é um projeto editorial independente administrado por
            Maycon Douglas Alves Moraes. Para assuntos relacionados a dados
            pessoais, utilize o canal de contato{" "}
            <a href="mailto:rumorevista@gmail.com">rumorevista@gmail.com</a>.
            Esse endereço é o canal de privacidade da revista; não representa,
            por si só, a indicação de um encarregado formal de proteção de
            dados.
          </p>
          <p>
            A referência à formação acadêmica de seu administrador não significa
            que a Universidade Federal de Roraima administre, patrocine ou
            responda pela Revista Rumo. O projeto não declara representação
            institucional da Universidade.
          </p>
        </section>

        <section>
          <h2>2. Dados que podem ser tratados</h2>
          <p>Conforme a interação com o site, podem ser tratados:</p>
          <ul>
            <li>
              <strong>Submissões:</strong> nome dos autores, afiliação
              institucional informada, e-mail do autor correspondente, título,
              resumo, área científica, palavras-chave, referências, declarações
              editoriais e arquivo enviado.
            </li>
            <li>
              <strong>Processo editorial:</strong> comunicações, decisões,
              pareceres e registros necessários para acompanhar a submissão,
              quando esses recursos forem utilizados.
            </li>
            <li>
              <strong>Conta e participação comunitária:</strong> nome público,
              e-mail da conta, identificador técnico da conta, notas por critério,
              avaliação geral e comentários publicados pelos membros sobre artigos.
            </li>
            <li>
              <strong>Dados técnicos:</strong> informações de acesso,
              dispositivo, navegador, endereço IP e registros de segurança que
              possam ser tratados pelo site ou por seus provedores técnicos.
            </li>
            <li>
              <strong>Mensagens:</strong> nome, endereço de e-mail e conteúdo
              fornecidos voluntariamente quando alguém entra em contato.
            </li>
          </ul>
          <p>
            Não envie documentos pessoais, informações sensíveis ou dados de
            terceiros que não sejam necessários à avaliação do trabalho. Os
            autores devem remover do manuscrito informações que possam
            identificá-los quando as regras de avaliação duplo-cega assim
            exigirem.
          </p>
        </section>

        <section>
          <h2>3. Finalidades e bases legais</h2>
          <p>Os dados são utilizados, conforme o caso, para:</p>
          <ul>
            <li>receber, registrar e administrar submissões;</li>
            <li>comunicar-se com autores e solicitar ajustes;</li>
            <li>organizar a avaliação, registrar decisões e preservar a integridade editorial;</li>
            <li>preparar a publicação de artigos aceitos e exibir seus metadados bibliográficos;</li>
            <li>proteger o site, prevenir abuso e investigar falhas técnicas;</li>
            <li>responder a solicitações dos titulares e cumprir obrigações legais aplicáveis.</li>
          </ul>
          <p>
            O tratamento deve se limitar ao necessário para cada finalidade.
            Conforme a operação concreta, poderão ser aplicáveis as bases legais
            previstas na LGPD, como procedimentos solicitados pelo titular,
            legítimo interesse após avaliação dos direitos e expectativas dos
            titulares, cumprimento de obrigação legal ou regulatória e
            consentimento quando exigido. A base adequada deve ser considerada
            para cada atividade; o envio de um artigo não autoriza usos
            incompatíveis com o processo editorial.
          </p>
        </section>

        <section>
          <h2>4. Publicação, acesso e compartilhamento</h2>
          <p>
            Se um artigo for publicado, o nome dos autores, as afiliações e os
            metadados bibliográficos incluídos na publicação poderão ficar
            disponíveis publicamente. Nas avaliações comunitárias, o nome público
            do perfil, as notas por critério e o comentário enviado serão exibidos
            na página do artigo. Não publique dados pessoais ou informações
            confidenciais no comentário. O e-mail da conta não é exibido na avaliação.
            Os arquivos e dados de submissões não publicadas, os contatos privados
            e os pareceres editoriais confidenciais devem permanecer restritos às
            pessoas que necessitem deles para suas funções.
          </p>
          <p>
            Dados podem ser processados por fornecedores de hospedagem, banco
            de dados, segurança e infraestrutura necessários ao funcionamento
            do site. Esses fornecedores podem operar sistemas em outras
            localidades e estar sujeitos a suas próprias condições de serviço.
            A revista não deve vender dados pessoais nem compartilhá-los para
            finalidades alheias às descritas nesta política.
          </p>
          <p>
            Quando recursos de análise de audiência, publicidade ou cookies não
            essenciais forem ativados, as informações e escolhas pertinentes
            deverão ser apresentadas de forma clara e os consentimentos obtidos
            quando a legislação exigir.
          </p>
        </section>

        <section>
          <h2>5. Retenção e descarte</h2>
          <p>
            A revista propõe os seguintes prazos de referência, contados a
            partir da decisão editorial final, salvo necessidade justificada de
            conservação por obrigação legal, exercício regular de direitos,
            segurança ou preservação do registro acadêmico:
          </p>
          <ul>
            <li>
              <strong>Submissões recusadas e dados associados:</strong> até 2
              anos.
            </li>
            <li>
              <strong>Pareceres e histórico editorial:</strong> até 5 anos.
            </li>
            <li>
              <strong>Avaliações e comentários comunitários:</strong> enquanto
              o artigo estiver disponível ou pelo período necessário à integridade
              do registro público, com revisão de pedidos de correção ou remoção
              conforme a legislação e o contexto.
            <li>
              <strong>Artigos publicados e metadados bibliográficos:</strong>{" "}
              enquanto a publicação permanecer disponível, para preservar o
              registro acadêmico.
            </li>
            <li>
              <strong>Mensagens e dados de contato:</strong> pelo tempo
              necessário para responder e acompanhar a solicitação e, depois,
              pelo período justificável para documentar seu atendimento.
            </li>
            <li>
              <strong>Registros técnicos de segurança:</strong> pelo período
              necessário à segurança e conforme as configurações e obrigações
              aplicáveis aos provedores técnicos.
            </li>
          </ul>
          <p>
            Encerrados os prazos, os dados deverão ser eliminados ou
            anonimizados quando não houver fundamento legítimo para mantê-los.
            Esses prazos são uma política de referência e não significam que o
            site já execute a exclusão automaticamente. A administração deve
            revisar os registros e aplicar o descarte de forma compatível com
            as ferramentas efetivamente utilizadas.
          </p>
        </section>

        <section>
          <h2>6. Segurança e confidencialidade</h2>
          <p>
            A revista deve adotar medidas técnicas e administrativas
            proporcionais para reduzir o risco de acesso não autorizado, perda,
            alteração ou divulgação indevida. O acesso a submissões e pareceres
            deve ser limitado às pessoas autorizadas. Nenhum serviço digital,
            porém, pode garantir segurança absoluta.
          </p>
        </section>

        <section>
          <h2>7. Direitos dos titulares</h2>
          <p>
            Nos termos e limites da LGPD, o titular pode solicitar confirmação
            da existência de tratamento, acesso aos dados, correção de dados
            incompletos ou inexatos, informações sobre compartilhamento,
            eliminação ou anonimização quando cabível e revisão de situações
            previstas em lei. Alguns registros podem precisar ser preservados
            para cumprir obrigações legais, proteger direitos ou manter a
            integridade editorial.
          </p>
          <p>
            Para fazer uma solicitação, escreva para{" "}
            <a href="mailto:rumorevista@gmail.com">rumorevista@gmail.com</a>,
            descrevendo o pedido e informando dados suficientes para que a
            revista localize o registro. Poderão ser solicitadas informações
            proporcionais para confirmar a identidade e evitar divulgação
            indevida. Não envie senhas nem documentos excessivos por e-mail.
          </p>
        </section>

        <section>
          <h2>8. Atualizações desta política</h2>
          <p>
            Esta política poderá ser atualizada para refletir mudanças no site,
            no processo editorial ou na legislação. A versão vigente será
            publicada nesta página, com a data da última atualização.
          </p>
          <p>
            <strong>Última atualização:</strong> 21 de outubro de 2026.
          </p>
        </section>

        <p className="editorial-note">
          Esta política descreve a abordagem pretendida para o tratamento de
          dados da Revista Rumo. A administração deve manter os procedimentos
          reais do site, os prazos de retenção e as configurações de fornecedores
          alinhados ao que está informado aqui. Este texto é informativo e não
          substitui aconselhamento jurídico específico.
        </p>
        <EditorialDocumentNavigation />
      </main>
      <SiteFooter />
    </>
  );
}
