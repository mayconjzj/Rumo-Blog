import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/server/admin-auth";
import AdminHeader from "@/app/components/AdminHeader";
import { disableCommunityProfile, enableCommunityProfile } from "./actions";
import ProfileActionButton from "./ProfileActionButton";

export const dynamic = "force-dynamic";
type UserRow = { id: string; name: string; email: string; createdAt: string | Date; community_enabled: boolean | null };
const panel = { background: "#fff", border: "1px solid #e1e6eb", padding: 20 } as const;
const muted = { color: "#687789", fontSize: 12, lineHeight: 1.7 } as const;

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ erro?: string; sucesso?: string }> }) {
  const { email: adminEmail } = await requireAdmin();
  const params = await searchParams;
  let users: UserRow[] = [];
  let unavailable = false;
  try {
    if (!process.env.DATABASE_URL) throw new Error("missing database");
    const sql = neon(process.env.DATABASE_URL);
    users = await sql.query(
      'SELECT u.id::text AS id, u.name, u.email, u."createdAt", p.community_enabled FROM neon_auth."user" u LEFT JOIN public.community_user_profiles p ON p.auth_user_id = u.id ORDER BY u."createdAt" DESC',
      [],
    ) as unknown as UserRow[];
  } catch { unavailable = true; }
  return <main style={{ minHeight: "100vh", background: "#f4f6f8", color: "#17283b" }}>
    <AdminHeader email={adminEmail} />
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "38px 22px 70px" }}>
      <p style={{ marginBottom: 8, color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".15em" }}>RUMO / COMUNIDADE</p>
      <h1 style={{ margin: "0 0 8px", color: "#05132A", fontSize: "clamp(30px,4vw,42px)", letterSpacing: "-.04em" }}>Gerenciar usuários</h1>
      <p style={{ ...muted, marginBottom: 24 }}>Desativar um perfil remove seu acesso comunitário, mas preserva o login, a senha e a identidade administrativa. A exclusão é reversível nesta tela.</p>
      {params.erro && <p role="alert" style={{ ...panel, borderColor: "#e5b7b2", color: "#8c1d18", marginBottom: 16 }}>{params.erro === "banco" ? "Não foi possível acessar os usuários. Confirme se a migração community_user_profiles foi aplicada." : "Não foi possível localizar a conta selecionada."}</p>}
      {params.sucesso && <p role="status" style={{ ...panel, borderColor: "#b6dfc5", color: "#17633a", marginBottom: 16 }}>{params.sucesso === "reativado" ? "Perfil comunitário reativado." : "Perfil comunitário desativado. A identidade de login foi preservada."}</p>}
      {unavailable ? <section style={panel}><h2>Lista indisponível</h2><p style={muted}>Confira a conexão com o banco e aplique a migração SQL antes de usar esta seção.</p></section> :
        <><p style={{ ...muted, marginBottom: 12 }}>{users.length} conta(s) cadastrada(s)</p>
        <div style={{ display: "grid", gap: 12 }}>{users.map(user => {
          const enabled = user.community_enabled !== false;
          const isAdmin = user.email.trim().toLowerCase() === adminEmail.toLowerCase();
          return <article key={user.id} style={{ ...panel, display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ minWidth: 220, flex: "1 1 360px" }}>
              <h2 style={{ color: "#05132A", fontSize: 17, margin: "0 0 5px" }}>{user.name || "Sem nome público"} {isAdmin && <span style={{ fontSize: 10, background: "#eaf1fb", padding: "4px 6px", marginLeft: 5 }}>ADMINISTRADOR</span>}</h2>
              <p style={{ margin: "0 0 5px", fontSize: 13 }}>{user.email}</p>
              <p style={muted}>Cadastro: {new Date(user.createdAt).toLocaleDateString("pt-BR")} · Perfil comunitário: {enabled ? "Ativo" : "Desativado"}</p>
            </div>
            {enabled ? <form action={disableCommunityProfile}><input type="hidden" name="userId" value={user.id}/><ProfileActionButton label="Desativar perfil" confirmMessage={`Desativar o perfil comunitário de ${user.email}? A identidade de login e o acesso administrativo serão preservados.`} /></form> :
            <form action={enableCommunityProfile}><input type="hidden" name="userId" value={user.id}/><button type="submit" style={{ border: "1px solid #b6dfc5", color: "#17633a", background: "#fff", padding: "10px 12px", fontWeight: 700, cursor: "pointer" }}>Reativar perfil</button></form>}
          </article>;
        })}</div></>}
    </div>
  </main>;
}
