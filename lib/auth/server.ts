import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl || !cookieSecret) {
  throw new Error("Missing NEON_AUTH_BASE_URL or NEON_AUTH_COOKIE_SECRET environment variable.");
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
    // OAuth returns to the app through a cross-site top-level navigation.
    // Lax allows the session cookie on that return so the login page sees it.
    sameSite: "lax",
    sessionDataTtl: 300,
  },
});
