import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/server/admin-auth";
import AdminHeader from "@/app/components/AdminHeader";
import {
  deleteUserAccount,
  disableCommunityProfile,
  enableCommunityProfile,
} from "./actions";
import DeleteUserButton from "./DeleteUserButton";
import ProfileActionButton from "./ProfileActionButton";

export const dynamic = "force-dynamic";

type UserRow = {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
  community_enabled: boolean | null;
};

type CommunityProfileRow = {
  auth_user_id: string;
  community_enabled: boolean;
};

type SearchParams = {
  erro?: string;
  sucesso?: string;
  q?: string;
  status?: string;
  tipo?: string;
};

const panel = {
  background: "#fff",
  border: "1px solid #e1e6eb",
  padding: 20,
  borderRadius: 10,
} as const;
const muted = { color: "#687789", fontSize: 12, lineHeight: 1.7 } as const;
const fieldStyle = {
  width: "100%",
  minWidth: 0,
  padding: "11px 12px",
  border: "1px solid #d5dce5",
  borderRadius: 7,
  background: "#fff",
  color: "#17283b",
  fontSize: 14,
} as const;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { email: adminEmail } = await requireAdmin();
  const params = await searchParams;
  const query = params.q?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const statusFilter = ["ativo", "desativado"].includes(params.status ?? "")
    ? params.status
    : "todos";
  const typeFilter = ["admin", "usuario"].includes(params.tipo ?? "")
    ? params.tipo
    : "todos";

  let users: UserRow[] = [];
  let unavailable = false;
  let profileTableMissing = false;

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);

    users = (await sql.query(
      'SELECT id::text AS id, name, email, "createdAt" FROM neon_auth."user" ORDER BY "createdAt" DESC',
      [],
    )) as unknown as UserRow[];

    try {
      const profiles = (await sql.query(
        "SELECT auth_user_id::text AS auth_user_id, community_enabled FROM public.community_user_profiles",
        [],
      )) as unknown as CommunityProfileRow[];

      const profileByUserId = new Map(
        profiles.map((profile) => [profile.auth_user_id, profile.community_enabled]),
      );
      users = users.map((user) => ({
        ...user,
        community_enabled: profileByUserId.get(user.id) ?? true,
      }));
    } catch (error) {
      const databaseError = error as { code?: string };
      if (databaseError.code === "42P01") {
        profileTableMissing = true;
        users = users.map((user) => ({ ...user, community_enabled: true }));
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Failed to load community users", error);
    unavailable = true;
  }

  const filteredUsers = users.filter((user) => {
    const isAdmin = user.email.trim().toLowerCase() === adminEmail.toLowerCase();
    const enabled = user.community_enabled !== false;
    const matchesQuery =
      !query ||
      user.name.toLocaleLowerCase("pt-BR").includes(query) ||
      user.email.toLocaleLowerCase("pt-BR").includes(query);
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativo" && enabled) ||
      (statusFilter === "desativado" && !enabled);
    const matchesType =
      typeFilter === "todos" ||
      (typeFilter === "admin" && isAdmin) ||
      (typeFilter === "usuario" && !isAdmin);
    return matchesQuery && matchesStatus && matchesType;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f4f6f8", color: "#17283b" }}>
      <AdminHeader email={adminEmail} />
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "38px 22px 70px" }}>
        <p style={{ marginBottom: 8, color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".15em" }}>
          RUMO / COMUNIDADE
        </p>
        <h1 style={{ margin: "0 0 8px", color: "#05132A", fontSize: "clamp(30px,4vw,42px)", letterSpacing: "-.04em" }}>
          Gerenciar usuários
        </h1>
        <p style={{ ...muted, marginBottom: 24 }}>
          Pesquise e filtre contas. Desativar o perfil comunitário bloqueia a participação na comunidade; excluir uma conta remove permanentemente o login.
        </p>

        {params.erro && (
          <p role="alert" style={{ ...panel, borderColor: "#e5b7b2", color: "#8c1d18", marginBottom: 16 }}>
            {params.erro === "banco"
              ? "Não foi possível acessar o banco ou concluir a operação."
              : params.erro === "nao-pode-excluir-admin"
                ? "A conta administrativa não pode ser excluída por este painel."
                : "Não foi possível localizar a conta selecionada."}
          </p>
        )}
        {params.sucesso && (
          <p role="status" style={{ ...panel, borderColor: "#b6dfc5", color: "#17633a", marginBottom: 16 }}>
            {params.sucesso === "reativado"
              ? "Perfil comunitário reativado."
              : params.sucesso === "excluido"
                ? "Conta excluída. As pesquisas já submetidas foram preservadas."
                : "Perfil comunitário desativado. A identidade de login foi preservada."}
          </p>
        )}

        {profileTableMissing && !unavailable && (
          <p role="status" style={{ ...panel, marginBottom: 16, ...muted }}>
            A lista de contas funciona, mas a tabela de moderação ainda não foi criada. Os perfis são exibidos como ativos; os controles de ativação e desativação ficam indisponíveis até a migração.
          </p>
        )}

        {!unavailable && (
          <section style={{ ...panel, marginBottom: 18 }}>
            <form method="GET" action="/admin/usuarios" style={{ display: "grid", gridTemplateColumns: "minmax(220px, 2fr) repeat(2, minmax(150px, 1fr)) auto auto", gap: 10, alignItems: "end" }}>
              <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 700 }}>
                Buscar por nome ou e-mail
                <input name="q" type="search" defaultValue={params.q ?? ""} placeholder="Ex.: Maria ou email@exemplo.com" style={fieldStyle} />
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 700 }}>
                Perfil comunitário
                <select name="status" defaultValue={statusFilter} style={fieldStyle}>
                  <option value="todos">Todos os status</option>
                  <option value="ativo">Ativos</option>
                  <option value="desativado">Desativados</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 700 }}>
                Tipo de conta
                <select name="tipo" defaultValue={typeFilter} style={fieldStyle}>
                  <option value="todos">Todas as contas</option>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuários</option>
                </select>
              </label>
              <button type="submit" style={{ padding: "11px 15px", border: 0, borderRadius: 7, background: "#1459b8", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                Filtrar
              </button>
              <a href="/admin/usuarios" style={{ padding: "11px 12px", border: "1px solid #d5dce5", borderRadius: 7, color: "#31445a", textDecoration: "none", textAlign: "center", fontSize: 13 }}>
                Limpar
              </a>
            </form>
          </section>
        )}

        {unavailable ? (
          <section style={panel}>
            <h2>Lista indisponível</h2>
            <p style={muted}>Não foi possível consultar as contas do Neon Auth. Confira a conexão do banco e os logs do servidor.</p>
          </section>
        ) : (
          <>
            <p style={{ ...muted, marginBottom: 12 }}>
              Exibindo {filteredUsers.length} de {users.length} conta(s) cadastrada(s)
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {filteredUsers.length === 0 ? (
                <section style={panel}>
                  <h2>Nenhum usuário encontrado</h2>
                  <p style={muted}>Tente alterar a busca ou remover algum filtro.</p>
                </section>
              ) : (
                filteredUsers.map((user) => {
                  const enabled = user.community_enabled !== false;
                  const isAdmin = user.email.trim().toLowerCase() === adminEmail.toLowerCase();
                  return (
                    <article key={user.id} style={{ ...panel, display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ minWidth: 220, flex: "1 1 360px" }}>
                        <h2 style={{ color: "#05132A", fontSize: 17, margin: "0 0 5px" }}>
                          {user.name || "Sem nome público"}{" "}
                          {isAdmin && <span style={{ fontSize: 10, background: "#eaf1fb", padding: "4px 6px", marginLeft: 5 }}>ADMINISTRADOR</span>}
                        </h2>
                        <p style={{ margin: "0 0 5px", fontSize: 13 }}>{user.email}</p>
                        <p style={muted}>
                          Cadastro: {new Date(user.createdAt).toLocaleDateString("pt-BR")} · Perfil comunitário: {enabled ? "Ativo" : "Desativado"}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {!profileTableMissing && (
                          enabled ? (
                            <form action={disableCommunityProfile}>
                              <input type="hidden" name="userId" value={user.id} />
                              <ProfileActionButton label="Desativar perfil" confirmMessage={`Desativar o perfil comunitário de ${user.email}? A identidade de login será preservada.`} />
                            </form>
                          ) : (
                            <form action={enableCommunityProfile}>
                              <input type="hidden" name="userId" value={user.id} />
                              <button type="submit" style={{ border: "1px solid #b6dfc5", color: "#17633a", background: "#fff", padding: "10px 12px", fontWeight: 700, cursor: "pointer", borderRadius: 6 }}>
                                Reativar perfil
                              </button>
                            </form>
                          )
                        )}
                        {!isAdmin && (
                          <form action={deleteUserAccount}>
                            <input type="hidden" name="userId" value={user.id} />
                            <DeleteUserButton userName={user.name || "Sem nome público"} userEmail={user.email} />
                          </form>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 850px) {
          form[action="/admin/usuarios"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
