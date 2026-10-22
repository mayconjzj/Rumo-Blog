-- Community-authored article evaluations.
-- This migration is additive and does not alter existing editorial peer-review tables.
CREATE TABLE IF NOT EXISTS public.community_reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES public.journal_submissions(id) ON DELETE CASCADE,
  reviewer_account_id TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  methodology_score SMALLINT NOT NULL CHECK (methodology_score BETWEEN 1 AND 5),
  evidence_score SMALLINT NOT NULL CHECK (evidence_score BETWEEN 1 AND 5),
  clarity_score SMALLINT NOT NULL CHECK (clarity_score BETWEEN 1 AND 5),
  reproducibility_score SMALLINT NOT NULL CHECK (reproducibility_score BETWEEN 1 AND 5),
  recommendation TEXT NOT NULL CHECK (recommendation IN ('supports','revision_needed','concerns')),
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 30 AND 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id, reviewer_account_id)
);

CREATE INDEX IF NOT EXISTS community_reviews_submission_idx
  ON public.community_reviews (submission_id, created_at DESC);

CREATE INDEX IF NOT EXISTS community_reviews_reviewer_idx
  ON public.community_reviews (reviewer_account_id, created_at DESC);
