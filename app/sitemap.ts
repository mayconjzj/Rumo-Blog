import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blogs";

const siteUrl = "https://rumo-blog.vercel.app";

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

  return entries;
}
