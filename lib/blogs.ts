import "server-only";

import { blogService } from "@/lib/server/blog-service";
export type { BlogPost } from "@/lib/blog-types";

export const getPublishedPosts = () => blogService.getPublishedPosts();
export const getPublishedPostBySlug = (slug: string) => blogService.getPublishedPostBySlug(slug);
export const getAdminPosts = () => blogService.getAdminPosts();
