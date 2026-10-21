"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Página inicial" },
  { href: "/pesquisas", label: "Pesquisas publicadas" },
  { href: "/submeter", label: "Submeter artigo" },
];

export default function ResearchSiteHeader() {
  const pathname = usePathname();

  return (
    <header className="research-header">
      <Link
        href="/"
        className="brand research-brand"
        aria-label="Rumo, página inicial"
      >
        <span className="brand-mark">R</span>
        <span>
          rumo<span className="brand-period">.</span>
        </span>
      </Link>

      <nav className="research-desktop-links" aria-label="Navegação principal">
        {navigation
          .filter((item) => item.href !== pathname)
          .map((item) => (
            <Link href={item.href} key={item.href}>
              {item.href === "/submeter" ? "Submeter artigo ↗" : item.label}
            </Link>
          ))}
      </nav>

      <details className="mobile-nav-menu research-mobile-menu">
        <summary aria-label="Abrir menu de navegação">
          <span className="hamburger-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </summary>
        <nav className="mobile-nav-panel" aria-label="Navegação móvel">
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={item.href === pathname ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
