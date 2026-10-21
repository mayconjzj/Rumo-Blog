import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const path = typeof body?.path === "string" ? body.path : "";
    if (!path.startsWith("/") || path.startsWith("//") || path.length > 500 || path.startsWith("/admin") || path.startsWith("/api")) return NextResponse.json({ ok: false }, { status: 400 });
    let host: string | null = null, source = "direct";
    if (typeof body.referrer === "string" && body.referrer) {
      try {
        const hostname = new URL(body.referrer).hostname.toLowerCase().replace(/^www\./, "");
        if (hostname && hostname !== "rumo-blog.vercel.app") {
          host = hostname.slice(0, 255);
          source = hostname.includes("google.") ? "google" : hostname.includes("bing.com") ? "bing" : hostname.includes("facebook.com") ? "facebook" : hostname.includes("instagram.com") ? "instagram" : hostname.includes("whatsapp.com") || hostname === "wa.me" ? "whatsapp" : "other";
        }
      } catch {}
    }
    if (!process.env.DATABASE_URL) return NextResponse.json({ ok: false }, { status: 503 });
    const sql = neon(process.env.DATABASE_URL);
    await sql.query("INSERT INTO public.site_page_views (path, referrer_host, source) VALUES ($1, $2, $3)", [path, host, source]);
    return NextResponse.json({ ok: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ ok: false }, { status: 503 }); }
}