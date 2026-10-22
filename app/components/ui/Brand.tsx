import Link from "next/link";

type BrandProps = {
  className?: string;
  label?: string;
};

export default function Brand({
  className,
  label = "Revista Rumo — página inicial",
}: BrandProps) {
  const classes = ["brand", className].filter(Boolean).join(" ");

  return (
    <Link className={classes} href="/" aria-label={label}>
      <span className="brand-mark">R</span>
      <span>
        rumo<span className="brand-period">.</span>
      </span>
    </Link>
  );
}
