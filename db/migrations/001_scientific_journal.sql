-- Rumo scientific journal: additive schema proposal.
-- REVIEW BEFORE APPLYING. This file has NOT been executed against production.
-- Store manuscript binaries in private object storage; keep only opaque object keys here.

CREATE TABLE IF NOT EXISTS public.journal_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  slug TEXT UNIQUE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 300),
  abstract TEXT NOT NULL CHECK (char_length(abstract) BETWEEN 20 AND 10000),
  language_code VARCHAR(12) NOT NULL DEFAULT 'pt-BR',
  manuscript_type VARCHAR(40) NOT NULL DEFAULT 'research_article',
  scientific_area TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  references_text TEXT,
  author_account_id TEXT,
  corresponding_author_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft','submitted','technical_check','under_review','revisions_requested',
    'accepted','rejected','published','withdrawn'
  )),
  review_round INTEGER NOT NULL DEFAULT 0 CHECK (review_round >= 0),
  double_blind BOOLEAN NOT NULL DEFAULT TRUE,
  ethics_statement TEXT,
  funding_statement TEXT,
  conflict_of_interest_statement TEXT,
  data_availability_statement TEXT,
  ai_use_statement TEXT,
  editor_account_id TEXT,
  submitted_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_submissions_status_idx
  ON public.journal_submissions (status, updated_at DESC);
CREATE INDEX IF NOT EXISTS journal_submissions_area_idx
  ON public.journal_submissions (scientific_area, published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS journal_submissions_published_idx
  ON public.journal_submissions (published_at DESC)
  WHERE status = 'published';

CREATE TABLE IF NOT EXISTS public.submission_authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES public.journal_submissions(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  affiliation TEXT,
  orcid TEXT,
  author_order INTEGER NOT NULL CHECK (author_order > 0),
  is_corresponding BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id, author_order)
);
CREATE INDEX IF NOT EXISTS submission_authors_email_idx ON public.submission_authors (lower(email));

CREATE TABLE IF NOT EXISTS public.submission_files (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES public.journal_submissions(id) ON DELETE CASCADE,
  review_round INTEGER NOT NULL DEFAULT 0 CHECK (review_round >= 0),
  file_kind TEXT NOT NULL CHECK (file_kind IN ('manuscript','supplement','figure','cover_letter','review_copy')),
  object_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  media_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  sha256 TEXT,
  uploaded_by_account_id TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS submission_files_submission_idx
  ON public.submission_files (submission_id, review_round, created_at DESC);

CREATE TABLE IF NOT EXISTS public.review_assignments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES public.journal_submissions(id) ON DELETE CASCADE,
  review_round INTEGER NOT NULL CHECK (review_round > 0),
  reviewer_account_id TEXT,
  reviewer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','accepted','declined','submitted','cancelled')),
  conflict_declared BOOLEAN,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS review_assignments_reviewer_idx
  ON public.review_assignments (lower(reviewer_email), status);
CREATE INDEX IF NOT EXISTS review_assignments_submission_idx
  ON public.review_assignments (submission_id, review_round);

CREATE TABLE IF NOT EXISTS public.peer_reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  assignment_id BIGINT NOT NULL UNIQUE REFERENCES public.review_assignments(id) ON DELETE CASCADE,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('accept','minor_revision','major_revision','reject')),
  confidential_to_editor TEXT,
  comments_to_author TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.editorial_decisions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES public.journal_submissions(id) ON DELETE CASCADE,
  review_round INTEGER NOT NULL CHECK (review_round >= 0),
  editor_account_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('desk_reject','revise','accept','reject','withdrawn')),
  rationale_internal TEXT,
  message_to_author TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS editorial_decisions_submission_idx
  ON public.editorial_decisions (submission_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.submission_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES public.journal_submissions(id) ON DELETE CASCADE,
  actor_account_id TEXT,
  actor_role TEXT NOT NULL CHECK (actor_role IN ('author','reviewer','editor','admin','system')),
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS submission_events_submission_idx
  ON public.submission_events (submission_id, created_at DESC);
