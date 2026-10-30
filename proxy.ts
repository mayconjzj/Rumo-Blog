import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth/server";

export default function proxy(request: NextRequest) {
  return getAuth().middleware({ loginUrl: "/login" })(request);
}

export const config = {
  matcher: ["/auth/callback", "/login", "/admin", "/admin/((?!login).*)"],
};
