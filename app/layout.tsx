import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Manrope } from "next/font/google";
import { Suspense } from "react";
import PageViewTracker from "./components/PageViewTracker";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./loading.css";

const adsensePublisherId = "ca-pub-3534989499820933";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Revista Rumo | Revista científica multidisciplinar",
    template: "%s | Revista Rumo",
  },
  description:
    "A Revista Rumo publica pesquisas científicas multidisciplinares e oferece leitura gratuita, submissão de manuscritos e informações sobre seu processo editorial.",
  applicationName: "Revista Rumo",
  authors: [{ name: "Redação Rumo", url: siteUrl }],
  creator: "Redação Rumo",
  publisher: "Revista Rumo",
  category: "science",
  verification: {
    google: "TxSfWovss5wRRrEt5OcWFHccbCtavJrUE9BnnYbOPzw",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Revista Rumo",
    title: "Revista Rumo | Revista científica multidisciplinar",
    description:
      "Pesquisas científicas multidisciplinares, leitura gratuita e transparência editorial.",
  },
  twitter: {
    card: "summary",
    title: "Revista Rumo | Revista científica multidisciplinar",
    description:
      "Pesquisas científicas multidisciplinares, leitura gratuita e transparência editorial.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "google-adsense-account": adsensePublisherId,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${manrope.variable}`}>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
        <Script
          id="google-adsense"
          async
          strategy="lazyOnload"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
