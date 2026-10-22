import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import LoginForm from "../../login/LoginForm";
export const metadata = { title: "Login administrativo | Revista Rumo", robots: { index: false, follow: false } };
export default async function AdminLoginPage() {
 const { data: session } = await auth.getSession();
 const email = session?.user?.email?.trim().toLowerCase();
 const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
 if (session?.user && adminEmail && email === adminEmail) redirect("/admin");
 return <LoginForm />;
}
