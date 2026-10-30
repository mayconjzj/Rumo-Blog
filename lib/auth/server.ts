import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

type NeonAuth = ReturnType<typeof createNeonAuth>;

let authInstance: NeonAuth | undefined;

export function getAuth(): NeonAuth {
  if (authInstance) return authInstance;

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret) {
    throw new Error("Missing NEON_AUTH_BASE_URL or NEON_AUTH_COOKIE_SECRET environment variable.");
  }

  authInstance = createNeonAuth({
    baseUrl,
    cookies: {
      secret: cookieSecret,
      sameSite: "lax",
      sessionDataTtl: 300,
    },
  });
  return authInstance;
}

export const auth = new Proxy({} as NeonAuth, {
  get(_target, property) {
    const instance = getAuth();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
