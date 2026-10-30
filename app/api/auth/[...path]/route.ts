import { getAuth } from "@/lib/auth/server";

type AuthHandlers = ReturnType<ReturnType<typeof getAuth>["handler"]>;

export const GET: AuthHandlers["GET"] = (...args) => getAuth().handler().GET(...args);
export const POST: AuthHandlers["POST"] = (...args) => getAuth().handler().POST(...args);
export const PUT: AuthHandlers["PUT"] = (...args) => getAuth().handler().PUT(...args);
export const DELETE: AuthHandlers["DELETE"] = (...args) => getAuth().handler().DELETE(...args);
export const PATCH: AuthHandlers["PATCH"] = (...args) => getAuth().handler().PATCH(...args);
