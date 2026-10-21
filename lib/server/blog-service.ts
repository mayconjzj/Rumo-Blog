import "server-only";

import type { BlogPost } from "@/lib/blogs";
import {
  DatabaseNotConfiguredError,
  NeonBlogRepository,
  type BlogRepository,
  type BlogStatus,
  type NewBlogPost,
  type UpdateBlogPost,
} from "./blog-repository";

export type BlogFailure = "campos" | "tamanho" | "banco" | "slug" | "acao";
export type BlogResult<T = undefined> =
  | { ok: true; value: T }
  | { ok: false; reason: BlogFailure };

export type BlogInput = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  slug: string;
  status: BlogStatus;
};

const MAX_CONTENT_LENGTH = 50_000;

export function normalizeSlug(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 170);
}

export function hasArticleBody(raw: string): boolean {
  try {
    const value = JSON.parse(raw);
    if (value?.version === 1 && Array.isArray(value.sections)) {
      return Boolean(String(value.intro ?? "").trim() || value.sections.some(
        (section: { heading?: string; text?: string; imageUrl?: string }) =>
          String(section.heading ?? "").trim() || String(section.text ?? "").trim() || String(section.imageUrl ?? "").trim(),
      ));
    }
  } catch {
    // Existing plain-text articles remain supported.
  }
  return Boolean(raw.trim());
}

function prepareInput(input: BlogInput): BlogResult<BlogInput> {
  const title = input.title.trim().slice(0, 180);
  const category = input.category.trim().slice(0, 80) || "ARTIGOS";
  const excerpt = input.excerpt.trim().slice(0, 320);
  const content = input.content.trim();
  const slug = normalizeSlug(input.slug) || normalizeSlug(title);

  if (!title || !excerpt || !content || !slug || !hasArticleBody(content)) {
    return { ok: false, reason: "campos" };
  }
  if (content.length > MAX_CONTENT_LENGTH) return { ok: false, reason: "tamanho" };

  return { ok: true, value: { title, category, excerpt, content, slug, status: input.status } };
}

function normalizeStatus(value: string): BlogStatus {
  return value === "published" ? "published" : "draft";
}

export class BlogService {
  constructor(private readonly repository: BlogRepository) {}

  async getPublishedPosts(): Promise<BlogPost[]> {
    return this.repository.listPublished();
  }

  async getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.repository.findPublishedBySlug(slug);
  }

  async getAdminPosts(): Promise<BlogPost[]> {
    return this.repository.listAll();
  }

  async create(input: BlogInput): Promise<BlogResult<{ slug: string }>> {
    const prepared = prepareInput(input);
    if (!prepared.ok) return prepared;
    try {
      const created = await this.repository.create(prepared.value as NewBlogPost);
      return created ? { ok: true, value: { slug: prepared.value.slug } } : { ok: false, reason: "slug" };
    } catch (error) {
      if (error instanceof DatabaseNotConfiguredError) return { ok: false, reason: "banco" };
      throw error;
    }
  }

  async update(id: number, input: BlogInput): Promise<BlogResult<{ slug: string }>> {
    if (!Number.isSafeInteger(id) || id < 1) return { ok: false, reason: "acao" };
    const prepared = prepareInput(input);
    if (!prepared.ok) return prepared;
    try {
      const updated = await this.repository.update({ ...prepared.value, id } as UpdateBlogPost);
      return updated ? { ok: true, value: { slug: prepared.value.slug } } : { ok: false, reason: "slug" };
    } catch (error) {
      if (error instanceof DatabaseNotConfiguredError) return { ok: false, reason: "banco" };
      throw error;
    }
  }

  async changeStatus(id: number, rawStatus: string): Promise<BlogResult<{ slug: string }>> {
    if (!Number.isSafeInteger(id) || id < 1 || (rawStatus !== "draft" && rawStatus !== "published")) {
      return { ok: false, reason: "acao" };
    }
    try {
      const slug = await this.repository.setStatus(id, normalizeStatus(rawStatus));
      return slug ? { ok: true, value: { slug } } : { ok: false, reason: "acao" };
    } catch (error) {
      if (error instanceof DatabaseNotConfiguredError) return { ok: false, reason: "banco" };
      throw error;
    }
  }

  async delete(id: number): Promise<BlogResult<{ slug: string }>> {
    if (!Number.isSafeInteger(id) || id < 1) return { ok: false, reason: "acao" };
    try {
      const slug = await this.repository.delete(id);
      return slug ? { ok: true, value: { slug } } : { ok: false, reason: "acao" };
    } catch (error) {
      if (error instanceof DatabaseNotConfiguredError) return { ok: false, reason: "banco" };
      throw error;
    }
  }
}

export const blogService = new BlogService(new NeonBlogRepository());
