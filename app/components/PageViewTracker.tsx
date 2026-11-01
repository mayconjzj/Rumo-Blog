"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const isExcludedPath = (path: string) =>
  path === "/admin" ||
  path.startsWith("/admin/") ||
  path === "/api" ||
  path.startsWith("/api/");

export default function PageViewTracker() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || isExcludedPath(pathname) || previousPath.current === pathname) {
      return;
    }

    // Preserve the real external referrer only on the initial page load.
    // Subsequent client navigations use an internal referrer, avoiding false
    // attribution of every route to the same external source.
    const referrer =
      previousPath.current === null
        ? document.referrer
        : new URL(previousPath.current, window.location.origin).toString();

    previousPath.current = pathname;

    void fetch("/api/metrics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      // Analytics must never interfere with navigation or page rendering.
    });
  }, [pathname]);

  return null;
}
