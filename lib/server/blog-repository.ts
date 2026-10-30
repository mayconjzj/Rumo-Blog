import "server-only";

import { neon } from "@neondatabase/serverless";
import type { BlogPost } from "@/lib/blog-types";

export type NewBlogPost = Pick<BlogPost, "slug" | "title" | "category" | "excerpt" | "content" | "status">;
export type UpdateBlogPost = NewBlogPost & { id: number };
export type RelatedBlogPost = Pick<BlogPost, "slug" | "title" | "category" | "excerpt">;
export type PublishedBlogSummary = Pick<BlogPost, "slug" | "created_at" | "updated_at" | "published_at">;
export type BlogStatus = BlogPost["status"];

export interface BlogRepository {
  listPublished(): Promise<BlogPost[]>;
  listPublishedSummaries(): Promise<PublishedBlogSummary[]>;
  findPublishedBySlug(slug: string): Promise<BlogPost | null>;
  listRelated(slug: string, category: string, limit: number): Promise<RelatedBlogPost[]>;
  listAll(): Promise<BlogPost[]>;
  create(post: NewBlogPost): Promise<boolean>;
  update(post: UpdateBlogPost): Promise<boolean>;
  setStatus(id: number, status: BlogStatus): Promise<string | null>;
  delete(id: number): Promise<string | null>;
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export class NeonBlogRepository implements BlogRepository {
  private getSql() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new DatabaseNotConfiguredError();
    return neon(url);
  }

  async listPublished(): Promise<BlogPost[]> {
    const sql = this.getSql();
    const rows = await sql.query(
      "SELECT id, slug, title, category, excerpt, content, status, created_at, updated_at, published_at FROM public.blog_posts WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC",
      [],
    );
    return rows as unknown as BlogPost[];
  }

  async listPublishedSummaries(): Promise<PublishedBlogSummary[]> {
    const sql = this.getSql();
    const rows = await sql.query(
      "SELECT slug, created_at, updated_at, published_at FROM public.blog_posts WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC",
      [],
    );
    return rows as unknown as PublishedBlogSummary[];
  }

  async findPublishedBySlug(slug: string): Promise<BlogPost | null> {
    const sql = this.getSql();
    const rows = await sql.query(
      "SELECT id, slug, title, category, excerpt, content, status, created_at, updated_at, published_at FROM public.blog_posts WHERE status = 'published' AND slug = $1 LIMIT 1",
      [slug],
    );
    return ((rows as unknown as BlogPost[])[0] ?? null);
  }

  async listRelated(slug: string, category: string, limit: number): Promise<RelatedBlogPost[]> {
    const sql = this.getSql();
    const rows = await sql.query(
      "SELECT slug, title, category, excerpt FROM public.blog_posts WHERE status = 'published' AND slug <> $1 ORDER BY (category = $2) DESC, COALESCE(published_at, created_at) DESC LIMIT $3",
      [slug, category, Math.max(1, Math.min(limit, 6))],
    );
    return rows as unknown as RelatedBlogPost[];
  }

  async listAll(): Promise<BlogPost[]> {
    const sql = this.getSql();
    const rows = await sql.query(
      "SELECT id, slug, title, category, excerpt, content, status, created_at, updated_at, published_at FROM public.blog_posts ORDER BY created_at DESC",
      [],
    );
    return rows as unknown as BlogPost[];
  }

  async create(post: NewBlogPost): Promise<boolean> {
    const sql = this.getSql();
    const result = await sql.query(
      "INSERT INTO public.blog_posts (slug, title, category, excerpt, content, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $7 = 'published' THEN NOW() ELSE NULL END) ON CONFLICT (slug) DO NOTHING RETURNING id",
      [post.slug, post.title, post.category, post.excerpt, post.content, post.status, post.status],
    );
    return result.length > 0;
  }

  async update(post: UpdateBlogPost): Promise<boolean> {
    const sql = this.getSql();
    const result = await sql.query(
      "UPDATE public.blog_posts AS post SET slug = $1, title = $2, category = $3, excerpt = $4, content = $5, status = $6, updated_at = NOW(), published_at = CASE WHEN $7 = 'published' THEN COALESCE(post.published_at, NOW()) ELSE NULL END WHERE post.id = $8 AND NOT EXISTS (SELECT 1 FROM public.blog_posts AS other WHERE other.slug = $1 AND other.id <> $8) RETURNING post.id",
      [post.slug, post.title, post.category, post.excerpt, post.content, post.status, post.status, post.id],
    );
    return result.length > 0;
  }

  async setStatus(id: number, status: BlogStatus): Promise<string | null> {
    const sql = this.getSql();
    const rows = await sql.query(
      "UPDATE public.blog_posts SET status = $1, updated_at = NOW(), published_at = CASE WHEN $3 = 'published' THEN COALESCE(published_at, NOW()) ELSE NULL END WHERE id = $2 RETURNING slug",
      [status, id, status],
    );
    return rows.length ? String((rows[0] as { slug: string }).slug) : null;
  }

  async delete(id: number): Promise<string | null> {
    const sql = this.getSql();
    const rows = await sql.query("DELETE FROM public.blog_posts WHERE id = $1 RETURNING slug", [id]);
    return rows.length ? String((rows[0] as { slug: string }).slug) : null;
  }
}
