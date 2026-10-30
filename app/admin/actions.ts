"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/server/admin-auth";
import { blogService, type BlogInput } from "@/lib/server/blog-service";

function readInput(formData: FormData): BlogInput {
  const intent = String(formData.get("intent") ?? "draft");
  return {
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? "ARTIGOS"),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    status: intent === "publish" ? "published" : "draft",
  };
}

function fail(reason: string): never {
  redirect("/admin?erro=" + encodeURIComponent(reason));
}

function refreshArticlePages(slug?: string) {
  updateTag("published-blog-posts");
  if (slug) updateTag(`published-blog-post:${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  if (slug) revalidatePath("/artigos/" + slug);
}

export async function createBlogAction(formData: FormData) {
  await requireAdmin();
  const result = await blogService.create(readInput(formData));
  if (!result.ok) fail(result.reason);
  refreshArticlePages(result.value.slug);
  redirect("/admin?sucesso=criado");
}

export async function updateBlogAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const result = await blogService.update(id, readInput(formData));
  if (!result.ok) fail(result.reason);
  refreshArticlePages(originalSlug);
  refreshArticlePages(result.value.slug);
  redirect("/admin?sucesso=atualizado");
}

export async function changeBlogStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const result = await blogService.changeStatus(id, status);
  if (!result.ok) fail(result.reason);
  refreshArticlePages(result.value.slug);
  redirect("/admin?sucesso=atualizado");
}

export async function deleteBlogAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const result = await blogService.delete(id);
  if (!result.ok) fail(result.reason);
  refreshArticlePages(result.value.slug);
  redirect("/admin?sucesso=excluido");
}
