"use client";

import { useMemo, useState } from "react";

export type ArticleSummary = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="article-card">
      <div className="article-meta">
        <span className="category">{article.category}</span>
        <span>{article.readTime}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <div className="article-bottom">
        <time>{article.date}</time>
        <a href={`/artigos/${article.slug}`} aria-label={`Ler: ${article.title}`}>
          Ler artigo <ArrowIcon />
        </a>
      </div>
    </article>
  );
}

export default function ArticleBrowser({ articles }: { articles: ArticleSummary[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const categories = useMemo(
    () => Array.from(new Set(articles.map((article) => article.category.trim()).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, "pt-BR")),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const query = normalize(search);
    return articles.filter((article) => {
      const matchesCategory = activeCategory === "Todas" || article.category === activeCategory;
      const searchableText = normalize(`${article.title} ${article.excerpt} ${article.category}`);
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [articles, search, activeCategory]);

  function clearFilters() {
    setSearch("");
    setActiveCategory("Todas");
  }

  return (
    <div className="article-browser">
      <div className="article-tools">
        <label className="article-search">
          <span className="article-search-icon" aria-hidden="true">⌕</span>
          <span className="sr-only">Buscar artigos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por título, assunto ou palavra-chave..."
            autoComplete="off"
          />
          {search && (
            <button className="search-clear" type="button" onClick={() => setSearch("")} aria-label="Limpar busca">
              ×
            </button>
          )}
        </label>
        <span className="article-result-count" aria-live="polite">
          {filteredArticles.length} {filteredArticles.length === 1 ? "artigo encontrado" : "artigos encontrados"}
        </span>
      </div>

      <div className="category-filters" aria-label="Filtrar artigos por categoria">
        <button
          type="button"
          className={activeCategory === "Todas" ? "category-filter is-active" : "category-filter"}
          onClick={() => setActiveCategory("Todas")}
          aria-pressed={activeCategory === "Todas"}
        >
          Todas <span>{articles.length}</span>
        </button>
        {categories.map((category) => {
          const count = articles.filter((article) => article.category === category).length;
          return (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "category-filter is-active" : "category-filter"}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category} <span>{count}</span>
            </button>
          );
        })}
      </div>

      {filteredArticles.length > 0 ? (
        <div className="article-grid">
          {filteredArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      ) : (
        <div className="article-empty-state">
          <span className="empty-search-mark" aria-hidden="true">⌕</span>
          <h3>Nenhum artigo encontrado</h3>
          <p>
            {articles.length === 0
              ? "Ainda não há artigos publicados. Volte em breve para conferir as novidades."
              : "Tente outra palavra-chave ou escolha uma categoria diferente."}
          </p>
          {(search || activeCategory !== "Todas") && (
            <button type="button" className="clear-filters-button" onClick={clearFilters}>
              Limpar busca e filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
