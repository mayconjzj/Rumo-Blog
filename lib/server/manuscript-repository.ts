import "server-only";

import { neon } from "@neondatabase/serverless";

export class ManuscriptDatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "ManuscriptDatabaseNotConfiguredError";
  }
}

export class NeonManuscriptRepository {
  private getSql() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new ManuscriptDatabaseNotConfiguredError();

    return neon(databaseUrl);
  }

  async findPublishedPdf(publicId: string): Promise<Buffer | null> {
    const sql = this.getSql();
    const rows = (await sql.query(
      `SELECT encode(manuscript_pdf, 'base64') AS pdf_base64
      FROM public.journal_submissions
      WHERE public_id = $1::uuid
        AND status = 'published'
        AND manuscript_pdf IS NOT NULL
      LIMIT 1`,
      [publicId],
    )) as unknown as Array<{ pdf_base64: string }>;

    const encodedPdf = rows[0]?.pdf_base64;
    return encodedPdf ? Buffer.from(encodedPdf, "base64") : null;
  }

  async findEditorialPdf(
    submissionId: number,
    reviewerEmail: string,
    adminEmail: string,
  ): Promise<Buffer | null> {
    const sql = this.getSql();
    const rows = (await sql.query(
      `SELECT encode(submission.manuscript_pdf, 'base64') AS pdf_base64
      FROM public.journal_submissions AS submission
      WHERE submission.id = $1
        AND submission.manuscript_pdf IS NOT NULL
        AND (
          $2 = $3
          OR EXISTS (
            SELECT 1
            FROM public.review_assignments AS assignment
            WHERE assignment.submission_id = submission.id
              AND lower(assignment.reviewer_email) = $2
              AND assignment.status IN ('invited', 'accepted', 'submitted')
          )
        )`,
      [submissionId, reviewerEmail, adminEmail],
    )) as unknown as Array<{ pdf_base64: string }>;

    const encodedPdf = rows[0]?.pdf_base64;
    return encodedPdf ? Buffer.from(encodedPdf, "base64") : null;
  }
}

export const manuscriptRepository = new NeonManuscriptRepository();
