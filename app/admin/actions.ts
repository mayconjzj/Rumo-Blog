"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  const userEmail = session?.user?.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!session?.user || !adminEmail || userEmail !== adminEmail) redirect("/login");
}

function makeSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 170);
}

function hasArticleBody(raw: string) {
  try {
    const value = JSON.parse(raw);
    if (value?.version === 1 && Array.isArray(value.sections)) {
      return Boolean(String(value.intro ?? "").trim() || value.sections.some((s: { heading?: string; text?: string; imageUrl?: string }) => String(s.heading ?? "").trim() || String(s.text ?? "").trim() || String(s.imageUrl ?? "").trim()));
    }
  } catch {}
  return Boolean(raw.trim());
}

function validStatus(raw: FormDataEntryValue | null) {
  return String(raw ?? "draft") === "published" ? "published" : "draft";
}

export async function createBlogAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 180);
  const category = String(formData.get("category") ?? "ARTIGOS").trim().slice(0, 80) || "ARTIGOS";
  const excerpt = String(formData.get("excerpt") ?? "").trim().slice(0, 320);
  const content = String(formData.get("content") ?? "").trim();
  const slug = makeSlug(String(formData.get("slug") ?? "")) || makeSlug(title);
  const status = validStatus(formData.get("status"));

  if (!title || !excerpt || !content || !slug || !hasArticleBody(content)) redirect("/admin?erro=campos");
  if (content.length > 50000) redirect("/admin?erro=tamanho");
  const url = process.env.DATABASE_URL;
  if (!url) redirect("/admin?erro=banco");
  const sql = neon(url);
  const result = await sql.query(
    "INSERT INTO public.blog_posts (slug, title, category, excerpt, content, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $7 = 'published' THEN NOW() ELSE NULL END) ON CONFLICT (slug) DO NOTHING RETURNING id",
    [slug, title, category, excerpt, content, status, status],
  );
  if (!result.length) redirect("/admin?erro=slug");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?sucesso=criado");
}

export async function updateBlogAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim().slice(0, 180);
  const category = String(formData.get("category") ?? "ARTIGOS").trim().slice(0, 80) || "ARTIGOS";
  const excerpt = String(formData.get("excerpt") ?? "").trim().slice(0, 320);
  const content = String(formData.get("content") ?? "").trim();
  const slug = makeSlug(String(formData.get("slug") ?? "")) || makeSlug(title);
  const status = validStatus(formData.get("status"));

  if (!Number.isSafeInteger(id) || id < 1 || !title || !excerpt || !content || !slug || !hasArticleBody(content)) redirect("/admin?erro=campos");
  if (content.length > 50000) redirect("/admin?erro=tamanho");
  const url = process.env.DATABASE_URL;
  if (!url) redirect("/admin?erro=banco");
  const sql = neon(url);
  const result = await sql.query(
    "UPDATE public.blog_posts AS post SET slug = $1, title = $2, category = $3, excerpt = $4, content = $5, status = $6, updated_at = NOW(), published_at = CASE WHEN $7 = 'published' THEN COALESCE(post.published_at, NOW()) ELSE NULL END WHERE post.id = $8 AND NOT EXISTS (SELECT 1 FROM public.blog_posts AS other WHERE other.slug = $1 AND other.id <> $8) RETURNING post.slug",
    [slug, title, category, excerpt, content, status, status, id],
  );
  if (!result.length) redirect("/admin?erro=slug");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/artigos/" + slug);
  redirect("/admin?sucesso=atualizado");
}

export async function changeBlogStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isSafeInteger(id) || id < 1 || (status !== "draft" && status !== "published")) redirect("/admin?erro=acao");
  const url = process.env.DATABASE_URL;
  if (!url) redirect("/admin?erro=banco");
  const sql = neon(url);
  await sql.query(
    "UPDATE public.blog_posts SET status = $1, updated_at = NOW(), published_at = CASE WHEN $3 = 'published' THEN COALESCE(published_at, NOW()) ELSE NULL END WHERE id = $2",
    [status, id, status],
  );
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?sucesso=atualizado");
}

export async function deleteBlogAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) redirect("/admin?erro=acao");
  const url = process.env.DATABASE_URL;
  if (!url) redirect("/admin?erro=banco");
  const sql = neon(url);
  const deleted = await sql.query("DELETE FROM public.blog_posts WHERE id = $1 RETURNING slug", [id]);
  if (deleted.length) revalidatePath("/artigos/" + String((deleted[0] as { slug: string }).slug));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?sucesso=excluido");
}
