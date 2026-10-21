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
    sessionDataTtl: 300,
  },
});
