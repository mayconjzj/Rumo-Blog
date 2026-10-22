import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/login" });

export const config = {
  // Keep the dedicated admin login reachable; all other admin routes
  // are protected again by requireAdmin() at the page/action/API boundary.
  matcher: ["/admin", "/admin/((?!login).*)"],
};
