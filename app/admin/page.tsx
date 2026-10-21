import Link from "next/link";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getAdminPosts } from "@/lib/blogs";
import { changeBlogStatusAction, createBlogAction } from "./actions";
import ArticleEditor from "./ArticleEditor";
import DeleteArticleButton from "./DeleteArticleButton";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  campos: "Preencha título, resumo e pelo menos um bloco de conteúdo.",
  tamanho: "O conteúdo ultrapassou o limite de 50 mil caracteres.",
  banco: "O banco de dados não está configurado. Verifique DATABASE_URL na Vercel.",
  slug: "Já existe um artigo com esse endereço. Altere o slug.",
  acao: "Não foi possível executar essa ação.",
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ erro?: string; sucesso?: string }> }) {
  const { email } = await requireAdmin();
  const params = await searchParams;
  const posts = await getAdminPosts();

  return (
    <main style={{ minHeight: "100vh", background: "#f4f6f8", color: "#17283b" }}>
      <header style={{ background: "#05132A", color: "#fff", padding: "22px max(22px, calc((100vw - 1160px) / 2))", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <Link className="brand" href="/" style={{ color: "#fff" }}><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}><span style={{ color: "#c1ccda", fontSize: 12 }}>Conectado como {email}</span><LogoutButton /><Link href="/admin/submissoes" style={{ fontSize: 12, color: "#87BAFF", fontWeight: 700 }}>Submissões científicas ↗</Link><Link href="/admin/metricas" style={{ fontSize: 12, color: "#87BAFF", fontWeight: 700 }}>Métricas ↗</Link><Link href="/" style={{ fontSize: 12, color: "#87BAFF" }}>Ver site ↗</Link></div>
      </header>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "42px 22px 70px" }}>
        <div style={{ marginBottom: 30 }}>
          <p style={{ marginBottom: 9, color: "#195AB4", fontSize: 10, fontWeight: 700, letterSpacing: ".15em" }}>RUMO / EDITORIA CIENTÍFICA</p>
          <h1 style={{ marginBottom: 10, color: "#05132A", fontFamily: "Manrope, sans-serif", fontSize: "clamp(30px, 4vw, 42px)", letterSpacing: "-.04em" }}>Painel administrativo</h1>
          <p style={{ color: "#687789", fontSize: 14, lineHeight: 1.8, maxWidth: 650 }}>Gerencie o conteúdo editorial existente e acompanhe as submissões científicas no fluxo de avaliação por pares.</p>
        </div>
        {params.erro && <p role="alert" style={{ padding: 14, borderLeft: "3px solid #b42318", background: "#fff0ee", color: "#8c1d18", fontSize: 13 }}>{errorMessages[params.erro] ?? "Ocorreu um erro ao salvar o artigo."}</p>}
        {params.sucesso && <p role="status" style={{ padding: 14, borderLeft: "3px solid #16804a", background: "#eaf8ef", color: "#17633a", fontSize: 13 }}>{params.sucesso === "criado" ? "Artigo salvo com sucesso." : params.sucesso === "excluido" ? "Artigo apagado definitivamente." : "Artigo atualizado com sucesso."}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 430px), 1fr))", gap: 22, alignItems: "start" }}>
          <section style={{ background: "#fff", border: "1px solid #e1e6eb", padding: "26px clamp(18px, 3vw, 30px)" }}>
            <p style={{ marginBottom: 8, color: "#195AB4", fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>NOVO CONTEÚDO</p>
            <h2 style={{ marginBottom: 8, color: "#05132A", fontSize: 24 }}>Criar artigo</h2>
            <p style={{ marginBottom: 20, color: "#687789", fontSize: 12, lineHeight: 1.7 }}>Monte uma introdução e adicione quantas seções precisar. Cada seção aceita título, texto e imagem.</p>
            <ArticleEditor action={createBlogAction} submitLabel="Salvar artigo" />
          </section>
          <section style={{ background: "#fff", border: "1px solid #e1e6eb", padding: "26px clamp(18px, 3vw, 30px)" }}>
            <p style={{ marginBottom: 8, color: "#195AB4", fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>BIBLIOTECA</p>
            <h2 style={{ marginBottom: 7, color: "#05132A", fontSize: 24 }}>Seus artigos</h2>
            <p style={{ marginBottom: 22, color: "#687789", fontSize: 12 }}>{posts.length} artigo(s) salvo(s) no banco de dados.</p>
            {posts.length === 0 ? <div style={{ padding: 22, border: "1px dashed #cbd5df", color: "#687789", fontSize: 13, lineHeight: 1.7 }}>Seus artigos aparecerão aqui depois que você salvar o primeiro.</div> : (
              <div style={{ display: "grid", gap: 12 }}>
                {posts.map((post) => (
                  <article key={post.id} style={{ padding: 17, border: "1px solid #e1e6eb" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      <span style={{ color: "#195AB4", fontSize: 9, fontWeight: 700, letterSpacing: ".1em" }}>{post.category}</span>
                      <span style={{ padding: "5px 7px", background: post.status === "published" ? "#eaf8ef" : "#f1f3f5", color: post.status === "published" ? "#17633a" : "#596777", fontSize: 10 }}>{post.status === "published" ? "PUBLICADO" : "RASCUNHO"}</span>
                    </div>
                    <h3 style={{ marginBottom: 7, color: "#05132A", fontSize: 17 }}>{post.title}</h3>
                    <p style={{ marginBottom: 12, color: "#687789", fontSize: 12, lineHeight: 1.7 }}>{post.excerpt}</p>
                    <p style={{ marginBottom: 14, color: "#8a96a3", fontSize: 10 }}>Criado em {formatDate(post.created_at)} · /artigos/{post.slug}</p>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                      <Link href={"/admin/editar/" + post.id} style={{ color: "#195AB4", fontSize: 11, fontWeight: 800 }}>Editar artigo</Link>
                      {post.status === "published" && <Link href={"/artigos/" + post.slug} target="_blank" style={{ color: "#195AB4", fontSize: 11, fontWeight: 700 }}>Abrir ↗</Link>}
                      <form action={changeBlogStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="status" value={post.status === "published" ? "draft" : "published"} />
                        <button type="submit" style={textButton}>{post.status === "published" ? "Retirar do ar" : "Publicar agora"}</button>
                      </form>
                      <DeleteArticleButton id={Number(post.id)} title={post.title} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

const textButton = { padding: 0, border: 0, color: "#195AB4", background: "transparent", cursor: "pointer", font: "inherit", fontSize: 11, fontWeight: 700 };
