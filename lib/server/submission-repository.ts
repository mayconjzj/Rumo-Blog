import "server-only";

import { neon } from "@neondatabase/serverless";
import type { NewSubmission } from "@/lib/server/submission-validation";

export class SubmissionDatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "SubmissionDatabaseNotConfiguredError";
  }
}

type CreatedSubmission = { public_id: string };

function getDatabaseClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new SubmissionDatabaseNotConfiguredError();

  return neon(databaseUrl);
}

export async function createSubmission(
  submission: NewSubmission,
): Promise<string | null> {
  const sql = getDatabaseClient();
  const result = (await sql.query(
    `WITH created AS (
      INSERT INTO public.journal_submissions (
        title,
        abstract,
        language_code,
        manuscript_type,
        scientific_area,
        keywords,
        references_text,
        corresponding_author_email,
        status,
        ethics_statement,
        funding_statement,
        conflict_of_interest_statement,
        ai_use_statement,
        manuscript_pdf,
        manuscript_file_name,
        submitted_at
      )
      VALUES (
        $1, $2, 'pt-BR', $3, $4,
        ARRAY(SELECT jsonb_array_elements_text($5::jsonb)),
        $6, $7, 'submitted', $8, $9, $10, $11,
        decode($12, 'base64'), $13, NOW()
      )
      RETURNING id, public_id
    ),
    authors_added AS (
      INSERT INTO public.submission_authors (
        submission_id,
        display_name,
        email,
        affiliation,
        author_order,
        is_corresponding
      )
      SELECT
        created.id,
        author.name,
        CASE WHEN author.author_order = 1 THEN $7 ELSE NULL END,
        author.affiliation,
        author.author_order,
        author.is_corresponding
      FROM created
      CROSS JOIN LATERAL jsonb_to_recordset($14::jsonb) AS author(
        name text,
        affiliation text,
        author_order integer,
        is_corresponding boolean
      )
      RETURNING id
    )
    SELECT created.public_id
    FROM created
    WHERE EXISTS (SELECT 1 FROM authors_added)`,
    [
      submission.title,
      submission.abstract,
      submission.manuscriptType,
      submission.scientificArea,
      JSON.stringify(submission.keywords),
      submission.references,
      submission.correspondingEmail,
      submission.ethicsStatement,
      submission.fundingStatement,
      submission.conflictStatement,
      submission.aiStatement,
      submission.pdfBase64,
      submission.fileName,
      JSON.stringify(submission.authors),
    ],
  )) as unknown as CreatedSubmission[];

  return result[0]?.public_id ?? null;
}
