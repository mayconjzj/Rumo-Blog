"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ResearchPaper = {
  public_id: string;
  title: string;
  abstract: string;
  scientific_area: string;
  keywords: string[];
  published_at: string;
  authors: string;
};

export default function ResearchFilters({ papers }: { papers: ResearchPaper[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Todas as áreas");
  const areas = useMemo(
    () => ["Todas as áreas", ...Array.from(new Set(papers.map((p) => p.scientific_area).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"))],
    [papers],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return papers.filter((paper) => {
      const matchesArea = area === "Todas as áreas" || paper.scientific_area === area;
      const haystack = [paper.title, paper.abstract, paper.authors, paper.scientific_area, ...(paper.keywords ?? [])].join(" ").toLocaleLowerCase("pt-BR");
      return matchesArea && (!normalized || haystack.includes(normalized));
    });
  }, [papers, query, area]);

  return <>
    <section className="research-tools" aria-label="Buscar e filtrar pesquisas">
      <label className="research-search">
        <span aria-hidden="true">⌕</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por título, autor, palavra-chave..." aria-label="Buscar pesquisas" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca">×</button>}
      </label>
      <label className="research-area-filter">
        <span>Área científica</span>
        <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Filtrar por área científica">
          {areas.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <p className="research-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "pesquisa encontrada" : "pesquisas encontradas"}</p>
    </section>
    {filtered.length === 0 ? <div className="research-no-results"><h2>Nenhuma pesquisa encontrada</h2><p>Tente outro termo ou remova o filtro de área científica.</p><button type="button" onClick={() => { setQuery(""); setArea("Todas as áreas"); }}>Limpar filtros</button></div> :
      <div className="research-results">{filtered.map((p) => <article className="research-card" key={p.public_id}>
        <p className="research-card-meta">{p.scientific_area || "Pesquisa científica"} · {p.published_at ? new Date(p.published_at).toLocaleDateString("pt-BR") : "Data não informada"}</p>
        <h2><Link href={"/pesquisas/" + p.public_id}>{p.title}</Link></h2>
        {p.authors && <p className="research-card-authors">{p.authors}</p>}
        <p className="research-card-abstract">{p.abstract.length > 360 ? p.abstract.slice(0, 360) + "…" : p.abstract}</p>
        {!!p.keywords?.length && <p className="research-card-keywords">{p.keywords.join(" · ")}</p>}
        <Link className="research-card-link" href={"/pesquisas/" + p.public_id}>Ler artigo e PDF <span aria-hidden="true">↗</span></Link>
      </article>)}</div>
    }
  </>;
}
