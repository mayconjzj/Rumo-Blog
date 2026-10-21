import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getAdminPosts } from "@/lib/blogs";
import ArticleEditor from "../../ArticleEditor";
import { updateBlogAction } from "../../actions";
import LogoutButton from "../../LogoutButton";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { email } = await requireAdmin();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const posts = await getAdminPosts();
  const post = posts.find((item) => Number(item.id) === id);
  if (!post) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#f4f6f8", color: "#17283b" }}>
      <header style={{ background: "#05132A", color: "#fff", padding: "22px max(22px, calc((100vw - 1160px) / 2))", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <Link className="brand" href="/" style={{ color: "#fff" }}><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}><span style={{ color: "#c1ccda", fontSize: 12 }}>Conectado como {email}</span><LogoutButton /><Link href="/admin" style={{ fontSize: 12, color: "#87BAFF" }}>Voltar ao painel</Link></div>
      </header>
      <div style={{ maxWidth: 850, margin: "0 auto", padding: "38px 22px 70px" }}>
        <p style={{ marginBottom: 8, color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".15em" }}>RUMO / ESTÚDIO EDITORIAL</p>
        <h1 style={{ marginBottom: 8, color: "#05132A", fontFamily: "Manrope, sans-serif", fontSize: "clamp(30px, 4vw, 42px)", letterSpacing: "-.04em" }}>Editar artigo</h1>
        <p style={{ marginBottom: 26, color: "#687789", fontSize: 13, lineHeight: 1.8 }}>Altere o texto, organize as seções e atualize as imagens. As mudanças serão aplicadas ao artigo salvo.</p>
        <section style={{ background: "#fff", border: "1px solid #e1e6eb", padding: "26px clamp(18px, 3vw, 30px)" }}>
          <ArticleEditor action={updateBlogAction} submitLabel="Salvar alterações" initial={post} />
        </section>
      </div>
    </main>
  );
}
