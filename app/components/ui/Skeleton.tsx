import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

export type SkeletonProps = {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  variant?: "text" | "rect" | "circle";
};

export default function Skeleton({ className, width, height, variant = "rect" }: SkeletonProps) {
  const variantClass = variant === "text" ? styles.text : variant === "circle" ? styles.circle : "";
  return <span
    aria-hidden="true"
    className={[styles.skeleton, variantClass, className].filter(Boolean).join(" ")}
    style={{ width, height }}
  />;
}

export function SkeletonLines({ count = 3, lastLineWidth = "68%" }: { count?: number; lastLineWidth?: CSSProperties["width"] }) {
  return <span className={styles.lines} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <Skeleton key={index} variant="text" width={index === count - 1 ? lastLineWidth : "100%"} />)}
  </span>;
}
