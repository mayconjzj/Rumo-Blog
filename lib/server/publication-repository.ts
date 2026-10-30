import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { neon } from "@neondatabase/serverless";

export type PublishedPaper = {
  public_id: string; title: string; abstract: string; scientific_area: string;
  published_at: string | Date | null; authors: string; keywords?: string[] | null;
};

export type PublishedPaperDetail = PublishedPaper & {
  id: number; references_text: string | null; affiliations: string;
};

const LIMIT = 6;

export async function listLatestPublishedPapers(): Promise<PublishedPaper[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("published-papers");
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql.query(
      `SELECT s.public_id,s.title,s.abstract,s.scientific_area,s.published_at,
        COALESCE(string_agg(a.display_name, ', ' ORDER BY a.author_order),'') AS authors
       FROM public.journal_submissions s
       LEFT JOIN public.submission_authors a ON a.submission_id=s.id
       WHERE s.status='published' AND NULLIF(BTRIM(s.title),'') IS NOT NULL
         AND s.manuscript_pdf IS NOT NULL
       GROUP BY s.id ORDER BY s.published_at DESC NULLS LAST LIMIT $1`,
      [LIMIT],
    );
    return rows as unknown as PublishedPaper[];
  } catch (error) {
    console.error("Failed to load published papers for the homepage.", error);
    return [];
  }
}

export async function listPublishedPapers(): Promise<PublishedPaper[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("published-papers");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  const sql = neon(url);
  const rows = await sql.query(
    `SELECT s.public_id,s.title,s.abstract,s.scientific_area,s.keywords,s.published_at,
      COALESCE(string_agg(a.display_name, ', ' ORDER BY a.author_order),'') AS authors
     FROM public.journal_submissions s
     LEFT JOIN public.submission_authors a ON a.submission_id=s.id
     WHERE s.status='published' AND NULLIF(BTRIM(s.title),'') IS NOT NULL
       AND s.manuscript_pdf IS NOT NULL
     GROUP BY s.id ORDER BY s.published_at DESC NULLS LAST`,
    [],
  );
  return rows as unknown as PublishedPaper[];
}


export async function getPublishedPaperById(publicId: string): Promise<PublishedPaperDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("published-papers", `published-paper:${publicId}`);
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  try {
    const sql = neon(url);
    const rows = await sql.query(
      `SELECT s.id,s.public_id,s.title,s.abstract,s.scientific_area,s.keywords,
        s.references_text,s.published_at,
        COALESCE(string_agg(a.display_name, ', ' ORDER BY a.author_order),'') AS authors,
        COALESCE(string_agg(DISTINCT NULLIF(a.affiliation,''),'; '),'') AS affiliations
       FROM public.journal_submissions s
       LEFT JOIN public.submission_authors a ON a.submission_id=s.id
       WHERE s.public_id=$1::uuid AND s.status='published'
         AND NULLIF(BTRIM(s.title),'') IS NOT NULL
       GROUP BY s.id LIMIT 1`,
      [publicId],
    );
    return (rows[0] as unknown as PublishedPaperDetail | undefined) ?? null;
  } catch (error) {
    console.error("Failed to load published paper.", error);
    return null;
  }
}
