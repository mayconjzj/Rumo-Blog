import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumo | Ideias que movem o patrimônio",
  description:
    "Análises, educação financeira e perspectivas para decisões mais conscientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
