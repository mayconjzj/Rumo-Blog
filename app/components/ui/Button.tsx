"use client";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
type ButtonVariant = "primary" | "navy" | "outline" | "subtle";
type ArrowStyle = "right" | "up-right";
type CommonProps = { children: ReactNode; variant?: ButtonVariant; arrow?: ArrowStyle; className?: string };
type LinkButtonProps = CommonProps & { href: string; disabled?: never; type?: never; onClick?: never };
type NativeButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: never };
export type ButtonProps = LinkButtonProps | NativeButtonProps;
function Arrow({ direction }: { direction: ArrowStyle }) {
  return <span className="ui-button__arrow" aria-hidden="true">{direction === "up-right" ? "↗" : "→"}</span>;
}
export default function Button(props: ButtonProps) {
  const { children, variant = "primary", arrow, className, ...rest } = props;
  const classes = ["ui-button", `ui-button--${variant}`, className].filter(Boolean).join(" ");
  if ("href" in props && props.href) {
    return <Link className={classes} href={props.href}>{children}{arrow && <Arrow direction={arrow} />}</Link>;
  }
  return <button className={classes} {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">)}>{children}{arrow && <Arrow direction={arrow} />}</button>;
}
