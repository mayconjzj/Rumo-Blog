import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blogs";

const siteUrl = "https://rumo-blog.vercel.app";

const builtInArticles = [
  { slug: "investir-bem-comeca-por-entender", lastModified: new Date("2026-10-20") },
  { slug: "juros-compostos-o-tempo-como-aliado", lastModified: new Date("2026-10-16") },
  { slug: "como-ler-os-indicadores-de-uma-empresa", lastModified: new Date("2026-10-12") },
];

function toDate(value: string | Date | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...builtInArticles.map((article) => ({
      url: `${siteUrl}/artigos/${article.slug}`,
      lastModified: article.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  try {
    // Read published posts on each sitemap request, so new, edited, or unpublished
    // database articles are reflected automatically without editing this file.
    const posts = await getPublishedPosts();
    const dynamicEntries = posts.map((post) => ({
      url: `${siteUrl}/artigos/${encodeURIComponent(post.slug)}`,
      lastModified: toDate(post.updated_at) ?? toDate(post.published_at) ?? toDate(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const seen = new Set(entries.map((entry) => entry.url));
    for (const entry of dynamicEntries) {
      if (!seen.has(entry.url)) {
        entries.push(entry);
        seen.add(entry.url);
      }
    }
  } catch (error) {
    // Keep the sitemap available for built-in articles if the database is temporarily unavailable.
    console.error("Não foi possível carregar os artigos publicados para o sitemap.", error);
  }

  return entries;
}
