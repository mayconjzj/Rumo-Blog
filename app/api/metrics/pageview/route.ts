import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const MAX_BODY_BYTES = 2_048;

const isPrivatePath = (path: string) =>
  path === "/admin" ||
  path.startsWith("/admin/") ||
  path === "/api" ||
  path.startsWith("/api/");

function classifyReferrer(value: unknown, request: Request) {
  if (typeof value !== "string" || !value) {
    return { host: null as string | null, source: "direct" };
  }

  try {
    const referrer = new URL(value);
    const currentHostname = new URL(request.url).hostname.toLowerCase().replace(/^www\./, "");
    const hostname = referrer.hostname.toLowerCase().replace(/^www\./, "");

    if (referrer.protocol !== "https:" && referrer.protocol !== "http:") {
      return { host: null, source: "direct" };
    }
    if (hostname === currentHostname || hostname === "rumo-blog.vercel.app") {
      return { host: null, source: "direct" };
    }

    const isDomain = (domain: string) =>
      hostname === domain || hostname.endsWith("." + domain);

    const source = hostname.startsWith("google.") || isDomain("google.com")
      ? "google"
      : isDomain("bing.com")
        ? "bing"
        : isDomain("facebook.com") || isDomain("fb.com")
          ? "facebook"
          : isDomain("instagram.com")
            ? "instagram"
            : isDomain("whatsapp.com") || hostname === "wa.me"
              ? "whatsapp"
              : "other";

    return { host: hostname.slice(0, 255), source };
  } catch {
    return { host: null, source: "direct" };
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = body as { path?: unknown; referrer?: unknown };
  const path = typeof payload.path === "string" ? payload.path : "";

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.length > 500 ||
    /[\u0000-\u001f]/.test(path) ||
    isPrivatePath(path)
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const { host, source } = classifyReferrer(payload.referrer, request);

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql.query(
      "INSERT INTO public.site_page_views (path, referrer_host, source) VALUES ($1, $2, $3)",
      [path, host, source],
    );

    return NextResponse.json(
      { ok: true },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to record page view.", error);
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
