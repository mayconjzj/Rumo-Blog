"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="about-section" role="alert">
      <div className="container">
        <p className="section-number">ERRO / FALHA INESPERADA</p>
        <h1>
          Não foi possível carregar esta <em>página.</em>
        </h1>
        <p>
          Ocorreu um problema ao exibir o conteúdo. Tente novamente; se a falha
          continuar, volte ao início ou acesse o arquivo científico.
        </p>
        <div className="hero-actions">
          <button
            className="ui-button ui-button--primary"
            type="button"
            onClick={reset}
          >
            Tentar novamente
          </button>
          <Link className="ui-button ui-button--outline" href="/">
            Voltar ao início
          </Link>
          <Link className="ui-button ui-button--outline" href="/pesquisas">
            Pesquisas publicadas
          </Link>
        </div>
      </div>
    </main>
  );
}
