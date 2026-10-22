import { redirect } from "next/navigation";
export default async function LegacyCommunitySignIn({ searchParams }: { searchParams: Promise<{ erro?: string; cadastro?: string; returnTo?: string }> }) {
 const query = await searchParams; const params = new URLSearchParams();
 if (query.erro) params.set("erro", query.erro); if (query.cadastro) params.set("cadastro", query.cadastro); if (query.returnTo) params.set("returnTo", query.returnTo);
 redirect(`/login${params.size ? `?${params.toString()}` : ""}`);
}
