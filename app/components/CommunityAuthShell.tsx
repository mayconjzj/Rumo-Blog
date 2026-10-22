import Link from "next/link";
import type { ReactNode } from "react";

type CommunityAuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function CommunityAuthShell({
  eyebrow,
  title,
  description,
  children,
}: CommunityAuthShellProps) {
  return (
    <main className="community-auth-page">
      <section className="community-auth-panel" aria-labelledby="community-auth-title">
        <Link href="/" className="community-auth-brand" aria-label="Revista Rumo, página inicial">
          RUMO<span>.</span>
        </Link>
        <p className="community-auth-eyebrow">{eyebrow}</p>
        <h1 id="community-auth-title">{title}</h1>
        <p className="community-auth-copy">{description}</p>
        {children}
      </section>
    </main>
  );
}
