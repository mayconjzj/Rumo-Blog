"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    fetch("/api/metrics/pageview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: pathname, referrer: document.referrer || "" }), keepalive: true, credentials: "same-origin" }).catch(() => {});
  }, [pathname]);
  return null;
}