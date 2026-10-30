import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Revista Rumo",
      title: `${title} | Revista Rumo`,
      description,
      url,
    },
    twitter: {
      card: "summary",
      title: `${title} | Revista Rumo`,
      description,
    },
  };
}
