import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blogs";
import { neon } from "@neondatabase/serverless";

const siteUrl = "https://rumo-blog.vercel.app";

// Rebuild the sitemap on each request so database changes appear without a redeploy.
export const dynamic = "force-dynamic";

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
  ];

  // The database is the source of truth: only posts marked as published
  // by the repository are eligible for inclusion in the sitemap.
  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      entries.push({
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
    // If the database is temporarily unavailable, expose only the homepage.
    console.error("Não foi possível carregar artigos publicados para o sitemap.", error);
  }

  try {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const papers = await sql.query("SELECT public_id, published_at FROM public.journal_submissions WHERE status=$1", ["published"]);
      for (const paper of papers as unknown as { public_id: string; published_at: string | Date }[]) entries.push({ url: `${siteUrl}/pesquisas/${paper.public_id}`, lastModified: toDate(paper.published_at), changeFrequency: "monthly", priority: 0.8 });
    }
  } catch (error) { console.error("Não foi possível carregar publicações científicas para o sitemap.", error); }
  entries.push({ url: `${siteUrl}/pesquisas`, changeFrequency: "weekly", priority: 0.8 });
  for (const path of ["/submeter", "/politica-editorial", "/avaliacao-por-pares", "/etica-publicacao", "/privacidade"]) entries.push({ url: `${siteUrl}${path}`, changeFrequency: "monthly", priority: path === "/submeter" ? 0.6 : 0.4 });
  return entries;
}
