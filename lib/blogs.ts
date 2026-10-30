import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { blogService } from "@/lib/server/blog-service";
import type { RelatedBlogPost, PublishedBlogSummary } from "@/lib/server/blog-repository";
export type { BlogPost } from "@/lib/blog-types";

export async function getPublishedPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("published-blog-posts");
  return blogService.getPublishedPosts();
}

export async function getPublishedPostBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("published-blog-posts", `published-blog-post:${slug}`);
  return blogService.getPublishedPostBySlug(slug);
}

export const getAdminPosts = () => blogService.getAdminPosts();

export async function getRelatedPublishedPosts(slug: string, category: string): Promise<RelatedBlogPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("published-blog-posts", `related-blog-posts:${slug}`);
  return blogService.getRelatedPublishedPosts(slug, category, 3);
}

export async function getPublishedPostSummaries(): Promise<PublishedBlogSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("published-blog-posts");
  return blogService.getPublishedPostSummaries();
}
