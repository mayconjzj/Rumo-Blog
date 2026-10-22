import Link from "next/link";
import type { ReactNode } from "react";
type PageIntroProps = { eyebrow: string; title: ReactNode; description: ReactNode; backHref?: string; backLabel?: string; eyebrowClassName?: string; titleClassName?: string; descriptionClassName?: string; backClassName?: string };
export default function PageIntro({ eyebrow, title, description, backHref, backLabel = "Voltar", eyebrowClassName, titleClassName, descriptionClassName, backClassName }: PageIntroProps) {
  return <header className="ui-page-intro">{backHref && <Link className={backClassName} href={backHref}>{backLabel}</Link>}<p className={eyebrowClassName}>{eyebrow}</p><h1 className={titleClassName}>{title}</h1><p className={descriptionClassName}>{description}</p></header>;
}
