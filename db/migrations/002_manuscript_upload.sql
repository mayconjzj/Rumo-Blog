-- Add private PDF storage for the first functional submission workflow.
-- Apply after 001_scientific_journal.sql. This migration is additive.
ALTER TABLE public.journal_submissions
  ADD COLUMN IF NOT EXISTS manuscript_pdf BYTEA,
  ADD COLUMN IF NOT EXISTS manuscript_file_name TEXT,
  ADD COLUMN IF NOT EXISTS submission_source TEXT NOT NULL DEFAULT 'web';
CREATE INDEX IF NOT EXISTS journal_submissions_corresponding_email_idx
  ON public.journal_submissions (lower(corresponding_author_email));
-- Manuscripts remain private until an editor records publication.
