import Link from "next/link";
import type { Metadata } from "next";
import Button from "./components/ui/Button";
import TextLink from "./components/ui/TextLink";
import SectionHeading from "./components/ui/SectionHeading";
import HomeSiteHeader from "./components/HomeSiteHeader";
import SiteFooter from "./components/SiteFooter";
import { listLatestPublishedPapers } from "@/lib/server/publication-repository";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Revista científica multidisciplinar",
  description: "Pesquisas científicas multidisciplinares, leitura gratuita e submissão de manuscritos sem taxas na Revista Rumo.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Revista Rumo",
    title: "Revista Rumo | Revista científica multidisciplinar",
    description: "Pesquisas científicas multidisciplinares, leitura gratuita e transparência editorial.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Revista Rumo | Revista científica multidisciplinar",
    description: "Pesquisas científicas multidisciplinares, leitura gratuita e transparência editorial.",
  },
};

function HomeStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Revista Rumo",
        url: siteUrl,
        description: "Revista científica multidisciplinar com leitura e submissão gratuitas.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Revista Rumo",
        url: siteUrl,
        inLanguage: "pt-BR",
        publisher: { "@id": `${siteUrl}#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function HeroSection() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> REVISTA RUMO · ACESSO GRATUITO
          </div>
          <h1>
            Conhecimento científico sem <em>fronteiras.</em>
          </h1>
          <p className="hero-description">
            A Revista Rumo é um espaço multidisciplinar para a circulação de
            pesquisas científicas. Consulte artigos publicados gratuitamente ou
            envie seu manuscrito para avaliação editorial.
          </p>
          <div className="hero-actions">
            <Button href="/pesquisas" arrow="up-right">
              Explorar pesquisas
            </Button>
            <TextLink href="/submeter">Submeta sua pesquisa</TextLink>
          </div>
          <div className="hero-note">
            <span className="note-line" />
            <span>Leitura e submissão gratuitas.</span>
          </div>
        </div>

        <div
          className="hero-visual"
          aria-label="Composição gráfica abstrata sobre pesquisa e conhecimento"
        >
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-grid" />
          <div className="visual-label">PESQUISA ABERTA</div>
          <div className="visual-chart">
            <span className="chart-caption">CONHECIMENTO</span>
            <svg viewBox="0 0 460 220" role="img" aria-label="Ilustração abstrata">
              <defs>
                <linearGradient
                  id="areaFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#549CFF" stopOpacity=".28" />
                  <stop offset="100%" stopColor="#549CFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 190 C45 175 57 183 91 147 S151 159 183 119 S233 137 264 93 S318 111 347 61 S408 58 460 13 L460 220 L0 220 Z"
                fill="url(#areaFill)"
              />
              <path
                d="M0 190 C45 175 57 183 91 147 S151 159 183 119 S233 137 264 93 S318 111 347 61 S408 58 460 13"
                fill="none"
                stroke="#549CFF"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="460" cy="13" r="5" fill="#549CFF" />
            </svg>
            <div className="chart-footer">
              <span>CIÊNCIA</span>
              <span>EVIDÊNCIA</span>
              <span>CONHECIMENTO</span>
            </div>
          </div>
          <div className="visual-index">
            01 <span>—</span> 03
          </div>
        </div>
      </div>
    </section>
  );
}

function PublishedResearchSection({
  papers,
}: {
  papers: Awaited<ReturnType<typeof listLatestPublishedPapers>>;
}) {
  return (
    <section
      className="published-research-section"
      aria-labelledby="published-research-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="01 / ARQUIVO CIENTÍFICO"
          id="published-research-title"
          title={
            <>
              Pesquisas <em>publicadas.</em>
            </>
          }
          description="Artigos científicos aceitos, publicados e disponíveis gratuitamente para leitura."
        />

        {papers.length === 0 ? (
          <div className="published-research-empty">
            <h3>O arquivo científico está começando.</h3>
            <p>
              Ainda não há artigos científicos publicados. Quando um manuscrito
              for aprovado e publicado pela equipe editorial, ele aparecerá
              aqui. Submissões em avaliação não são públicas.
            </p>
            <TextLink href="/pesquisas" arrow="up-right">Acessar o arquivo científico</TextLink>
          </div>
        ) : (
          <div className="published-research-grid">
            {papers.map((paper) => (
              <article
                className="published-research-card"
                key={paper.public_id}
              >
                <p className="published-research-meta">
                  {paper.scientific_area} ·{" "}
                  {paper.published_at
                    ? new Date(paper.published_at).toLocaleDateString("pt-BR")
                    : "Data não informada"}
                </p>
                <h3>
                  <Link href={"/pesquisas/" + paper.public_id}>
                    {paper.title}
                  </Link>
                </h3>
                {paper.authors && (
                  <p className="published-research-authors">{paper.authors}</p>
                )}
                <p className="published-research-abstract">
                  {paper.abstract.length > 230
                    ? paper.abstract.slice(0, 230) + "…"
                    : paper.abstract}
                </p>
                <Link
                  className="published-research-link"
                  href={"/pesquisas/" + paper.public_id}
                >
                  Ler artigo e PDF ↗
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="published-research-footer">
          <TextLink href="/pesquisas" arrow="up-right">Ver todas as pesquisas publicadas</TextLink>
        </div>
      </div>
    </section>
  );
}

function EditorialProcessSection() {
  return (
    <section className="journal-process-section">
      <div className="container">
        <div className="section-number">COMO FUNCIONA</div>
        <h2>
          Da submissão à <em>publicação.</em>
        </h2>
        <p className="journal-process-intro">
          Entenda as etapas editoriais antes de enviar seu trabalho.
        </p>
        <div className="journal-process-grid">
          <article>
            <span>01</span>
            <h3>Submissão</h3>
            <p>
              Envie os dados do manuscrito, a autoria e o PDF pelo formulário. O
              envio é gratuito.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Triagem editorial</h3>
            <p>
              A equipe verifica o escopo, os requisitos técnicos, a integridade
              e a documentação.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Avaliação por pares</h3>
            <p>
              Quando adequado, o manuscrito pode ser encaminhado a avaliadores
              da área. Os pareceres orientam, mas não substituem, a decisão
              editorial.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Decisão e publicação</h3>
            <p>
              O editor pode solicitar revisões, aceitar ou rejeitar. Só
              trabalhos aceitos e efetivamente publicados ficam no arquivo
              aberto.
            </p>
          </article>
        </div>
        <TextLink className="journal-process-link" href="/avaliacao-por-pares">Leia como funciona a avaliação por pares</TextLink>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="sobre" className="about-section">
      <div className="container">
        <div className="section-number">03 / SOBRE A REVISTA</div>
        <h2>
          Pesquisa aberta. <em>Conhecimento compartilhado.</em>
        </h2>
        <p>
          A Revista Rumo recebe manuscritos de diferentes áreas do conhecimento.
          Cada envio passa por triagem editorial; trabalhos adequados ao escopo
          podem seguir para avaliação por pares. A decisão final é editorial, e
          somente artigos aprovados e preparados para publicação entram no
          arquivo público.
        </p>
        <p className="about-disclaimer">
          Não há taxa de submissão nem de leitura. A revista não promete prazo
          fixo para decisão; DOI, indexação, periodicidade e composição do
          conselho editorial só serão anunciados quando formalmente confirmados.
        </p>
        <div className="hero-actions">
          <Button href="/pesquisas" arrow="up-right">
            Ver arquivo científico
          </Button>
          <TextLink href="/submeter">Submeter pesquisa</TextLink>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const papers = await listLatestPublishedPapers();

  return (
    <main>
      <HomeStructuredData />
      <HomeSiteHeader />
      <HeroSection />
      <PublishedResearchSection papers={papers} />
      <EditorialProcessSection />
      <AboutSection />
      <SiteFooter />
    </main>
  );
}
