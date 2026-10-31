import Link from "next/link";
import Button from "./components/ui/Button";
import SiteFooter from "./components/SiteFooter";
import HomeSiteHeader from "./components/HomeSiteHeader";

export default function NotFound() {
  return (
    <>
      <main className="about-section not-found-page">
        <HomeSiteHeader />
        <section className="container" aria-labelledby="not-found-title">
          <p className="section-number">ERRO 404 / PÁGINA NÃO ENCONTRADA</p>
          <h1 id="not-found-title">
            Este caminho não leva a <em>uma pesquisa.</em>
          </h1>
          <p>
            O endereço pode estar incorreto ou a página pode ter sido movida.
            Você pode voltar ao início ou consultar o arquivo científico.
          </p>
          <div className="hero-actions">
            <Button href="/" arrow="right">
              Voltar ao início
            </Button>
            <Link href="/pesquisas" className="ui-button ui-button--outline">
              Explorar pesquisas
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
