import { auth } from "@/lib/auth/server";

const handlers = auth.handler();

export const GET = handlers.GET;

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const pathname = new URL(request.url).pathname;
  const blockedEndpoints = ["/request-password-reset", "/reset-password"];

  if (blockedEndpoints.some((endpoint) => pathname.endsWith(endpoint))) {
    return Response.json(
      { message: "Password reset is disabled for this application." },
      { status: 404 },
    );
  }

  return handlers.POST(request, context);
}
