import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  arrow?: "right" | "up-right";
  className?: string;
  ariaLabel?: string;
};

export default function TextLink({
  href,
  children,
  arrow = "right",
  className,
  ariaLabel,
}: TextLinkProps) {
  const classes = ["ui-text-link", className].filter(Boolean).join(" ");

  return (
    <Link className={classes} href={href} aria-label={ariaLabel}>
      {children}
      <span aria-hidden="true">{arrow === "up-right" ? "↗" : "→"}</span>
    </Link>
  );
}
