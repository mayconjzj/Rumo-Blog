import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
export async function requireAdmin(): Promise<{ email: string }> {
 const { data: session } = await auth.getSession();
 const email = session?.user?.email?.trim().toLowerCase();
 const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
 if (!session?.user || !adminEmail || email !== adminEmail) redirect("/admin/login");
 return { email: email ?? "" };
}
