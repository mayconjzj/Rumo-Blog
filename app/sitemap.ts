import type { MetadataRoute } from "next";
import { neon } from "@neondatabase/serverless";
import { getPublishedPosts } from "@/lib/blogs";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

function toDate(value: string | Date | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = new Map<string, SitemapEntry>();
  const add = (entry: SitemapEntry) => entries.set(entry.url, entry);

  add({ url: siteUrl, changeFrequency: "weekly", priority: 1 });
  add({ url: `${siteUrl}/pesquisas`, changeFrequency: "weekly", priority: 0.8 });
  add({ url: `${siteUrl}/submeter`, changeFrequency: "monthly", priority: 0.6 });

  for (const path of [
    "/politica-editorial",
    "/avaliacao-por-pares",
    "/etica-publicacao",
    "/privacidade",
  ]) {
    add({ url: `${siteUrl}${path}`, changeFrequency: "monthly", priority: 0.4 });
  }

  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      add({
        url: `${siteUrl}/artigos/${encodeURIComponent(post.slug)}`,
        lastModified:
          toDate(post.updated_at) ??
          toDate(post.published_at) ??
          toDate(post.created_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Não foi possível carregar artigos publicados para o sitemap.", error);
  }

  try {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const papers = await sql.query(
        `SELECT public_id, published_at
         FROM public.journal_submissions
         WHERE status = $1
           AND NULLIF(BTRIM(title), '') IS NOT NULL`,
        ["published"],
      );

      for (const paper of papers as unknown as {
        public_id: string;
        published_at: string | Date | null;
      }[]) {
        if (!paper.public_id) continue;
        add({
          url: `${siteUrl}/pesquisas/${encodeURIComponent(paper.public_id)}`,
          lastModified: toDate(paper.published_at),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error(
      "Não foi possível carregar pesquisas publicadas para o sitemap.",
      error,
    );
  }

  return Array.from(entries.values());
}
