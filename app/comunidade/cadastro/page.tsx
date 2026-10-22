import { redirect } from "next/navigation";
export default async function LegacyCommunitySignUp({ searchParams }: { searchParams: Promise<{ erro?: string; returnTo?: string }> }) {
 const query = await searchParams; const params = new URLSearchParams();
 if (query.erro) params.set("erro", query.erro); if (query.returnTo) params.set("returnTo", query.returnTo);
 redirect(`/sign-up${params.size ? `?${params.toString()}` : ""}`);
}
