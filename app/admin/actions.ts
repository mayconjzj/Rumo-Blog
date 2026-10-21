"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  const userEmail = session?.user?.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!session?.user || !adminEmail || userEmail !== adminEmail) {
    redirect("/login");
  }
}

function makeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 170);
}

export async function createBlogAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 180);
  const category = String(formData.get("category") ?? "ARTIGOS").trim().slice(0, 80) || "ARTIGOS";
  const excerpt = String(formData.get("excerpt") ?? "").trim().slice(0, 320);
  const content = String(formData.get("content") ?? "").trim();
  const requestedSlug = makeSlug(String(formData.get("slug") ?? ""));
  const slug = requestedSlug || makeSlug(title);
  const status = String(formData.get("status") ?? "draft") === "published" ? "published" : "draft";

  if (!title || !excerpt || !content || !slug) {
    redirect("/admin?erro=campos");
  }
  if (content.length > 50000) {
    redirect("/admin?erro=tamanho");
  }

  const url = process.env.DATABASE_URL;
  if (!url) redirect("/admin?erro=banco");
  const sql = neon(url);
  const result = await sql.query(
    "INSERT INTO public.blog_posts (slug, title, category, excerpt, content, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $6 = 'published' THEN NOW() ELSE NULL END) ON CONFLICT (slug) DO NOTHING RETURNING id",
    [slug, title, category, excerpt, content, status],
  );

  if (!result.length) redirect("/admin?erro=slug");
  redirect("/admin?sucesso=criado");
}

export async function changeBlogStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isSafeInteger(id) || id < 1 || (status !== "draft" && status !== "published")) {
    redirect("/admin?erro=acao");
  }

  const url = process.env.DATABASE_URL;
  if (!url) redirect("/admin?erro=banco");
  const sql = neon(url);
  await sql.query(
    "UPDATE public.blog_posts SET status = $1, updated_at = NOW(), published_at = CASE WHEN $1 = 'published' THEN COALESCE(published_at, NOW()) ELSE NULL END WHERE id = $2",
    [status, id],
  );
  redirect("/admin?sucesso=atualizado");
}
