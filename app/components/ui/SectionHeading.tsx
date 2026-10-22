import type { ReactNode } from "react";
type SectionHeadingProps = { eyebrow: string; title: ReactNode; description?: ReactNode; id?: string; className?: string };
export default function SectionHeading({ eyebrow, title, description, id, className }: SectionHeadingProps) {
  const classes = ["section-heading", className].filter(Boolean).join(" ");
  return <div className={classes}><div><div className="section-number">{eyebrow}</div><h2 id={id}>{title}</h2></div>{description && <p>{description}</p>}</div>;
}
