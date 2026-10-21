import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const adsensePublisherId = "ca-pub-3534989499820933";

export const metadata: Metadata = {
  title: "Rumo | Ideias que movem o patrimônio",
  description:
    "Análises, educação financeira e perspectivas para decisões mais conscientes.",
  verification: {
    google: "TxSfWovss5wRRrEt5OcWFHccbCtavJrUE9BnnYbOPzw",
  },
  other: {
    "google-adsense-account": adsensePublisherId,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
