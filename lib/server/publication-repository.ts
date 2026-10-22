import "server-only";

import { neon } from "@neondatabase/serverless";

export type PublishedPaper = {
  public_id: string;
  title: string;
  abstract: string;
  scientific_area: string;
  published_at: string | Date | null;
  authors: string;
};

const HOMEPAGE_PAPER_LIMIT = 6;

export async function listLatestPublishedPapers(): Promise<PublishedPaper[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  try {
    const sql = neon(databaseUrl);
    const rows = await sql.query(
      `SELECT
        submission.public_id,
        submission.title,
        submission.abstract,
        submission.scientific_area,
        submission.published_at,
        COALESCE(
          string_agg(author.display_name, ', ' ORDER BY author.author_order),
          ''
        ) AS authors
      FROM public.journal_submissions AS submission
      LEFT JOIN public.submission_authors AS author
        ON author.submission_id = submission.id
      WHERE submission.status = 'published'
        AND NULLIF(BTRIM(submission.title), '') IS NOT NULL
        AND submission.manuscript_pdf IS NOT NULL
      GROUP BY submission.id
      ORDER BY submission.published_at DESC NULLS LAST
      LIMIT $1`,
      [HOMEPAGE_PAPER_LIMIT],
    );

    return rows as unknown as PublishedPaper[];
  } catch (error) {
    console.error("Failed to load published papers for the homepage.", error);
    return [];
  }
}
