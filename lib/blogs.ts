import { neon } from "@neondatabase/serverless";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  created_at: string | Date;
  updated_at: string | Date;
  published_at: string | Date | null;
};

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT id, slug, title, category, excerpt, content, status, created_at, updated_at, published_at FROM public.blog_posts WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC",
    [],
  );
  return rows as unknown as BlogPost[];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query(
    "SELECT id, slug, title, category, excerpt, content, status, created_at, updated_at, published_at FROM public.blog_posts WHERE status = 'published' AND slug = $1 LIMIT 1",
    [slug],
  );
  const posts = rows as unknown as BlogPost[];
  return posts[0] ?? null;
}

export async function getAdminPosts(): Promise<BlogPost[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT id, slug, title, category, excerpt, content, status, created_at, updated_at, published_at FROM public.blog_posts ORDER BY created_at DESC",
    [],
  );
  return rows as unknown as BlogPost[];
}
