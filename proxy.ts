import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/login" });

export const config = {
  // The OAuth landing route must pass through Neon Auth middleware so it can
  // exchange the verifier and attach the session cookie before rendering.
  matcher: ["/auth/callback", "/login", "/admin", "/admin/((?!login).*)"],
};
