import { auth } from "@/lib/auth/server";

// Forward every method supported by Neon Auth. In particular, password-reset
// requests must reach the managed auth service instead of being blocked here.
const handlers = auth.handler();

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const PATCH = handlers.PATCH;
