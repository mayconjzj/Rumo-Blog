import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const { data: session } = await auth.getSession();
  const email = session?.user?.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  // If an authorized admin is already authenticated, skip the login screen.
  if (session?.user && adminEmail && email === adminEmail) {
    redirect("/admin");
  }

  return <LoginForm />;
}
