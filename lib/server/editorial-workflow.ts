import "server-only";

import { neon } from "@neondatabase/serverless";

export type EditorialStatus =
  | "technical_check"
  | "under_review"
  | "revisions_requested"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "published";

export type ReviewRecommendation =
  | "accept"
  | "minor_revision"
  | "major_revision"
  | "reject";

export type WorkflowResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid" | "not_found" | "must_accept" | "database";
    };

const ALLOWED_STATUSES = new Set<EditorialStatus>([
  "technical_check",
  "under_review",
  "revisions_requested",
  "accepted",
  "rejected",
  "withdrawn",
  "published",
]);

const ALLOWED_RECOMMENDATIONS = new Set<ReviewRecommendation>([
  "accept",
  "minor_revision",
  "major_revision",
  "reject",
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDatabaseClient() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}

export async function changeSubmissionStatus(input: {
  submissionId: number;
  status: string;
  actorEmail: string;
  note: string;
}): Promise<WorkflowResult> {
  const { submissionId, status, actorEmail, note } = input;

  if (
    !Number.isSafeInteger(submissionId) ||
    submissionId < 1 ||
    !ALLOWED_STATUSES.has(status as EditorialStatus)
  ) {
    return { ok: false, reason: "invalid" };
  }

  const sql = getDatabaseClient();
  if (!sql) return { ok: false, reason: "database" };

  try {
    const updated = await sql.query(
      `WITH current_submission AS (
        SELECT id, status
        FROM public.journal_submissions
        WHERE id = $3
        FOR UPDATE
      ),
      updated_submission AS (
        UPDATE public.journal_submissions AS submission
        SET
          status = $1,
          editor_account_id = $2,
          updated_at = NOW(),
          published_at = CASE
            WHEN $1 = 'published' THEN COALESCE(submission.published_at, NOW())
            ELSE submission.published_at
          END
        FROM current_submission AS current
        WHERE submission.id = current.id
          AND ($1 <> 'published' OR current.status = 'accepted')
        RETURNING submission.id, current.status AS previous_status
      ),
      event_record AS (
        INSERT INTO public.submission_events (
          submission_id,
          actor_account_id,
          actor_role,
          event_type,
          from_status,
          to_status,
          note
        )
        SELECT id, $2, 'editor', 'status_changed', previous_status, $1, $4
        FROM updated_submission
        RETURNING id
      )
      SELECT updated_submission.id
      FROM updated_submission
      WHERE EXISTS (SELECT 1 FROM event_record)`,
      [status, actorEmail, submissionId, note || null],
    );

    if (updated.length > 0) return { ok: true };

    const current = await sql.query(
      "SELECT status FROM public.journal_submissions WHERE id = $1 LIMIT 1",
      [submissionId],
    );

    if (current.length === 0) return { ok: false, reason: "not_found" };

    if (
      status === "published" &&
      String((current[0] as { status: string }).status) !== "accepted"
    ) {
      return { ok: false, reason: "must_accept" };
    }

    return { ok: false, reason: "invalid" };
  } catch {
    return { ok: false, reason: "database" };
  }
}

export async function assignReviewer(input: {
  submissionId: number;
  reviewerEmail: string;
  dueAt: string;
  actorEmail: string;
}): Promise<WorkflowResult> {
  const { submissionId, reviewerEmail, dueAt, actorEmail } = input;

  if (
    !Number.isSafeInteger(submissionId) ||
    submissionId < 1 ||
    !EMAIL_PATTERN.test(reviewerEmail)
  ) {
    return { ok: false, reason: "invalid" };
  }

  const dueDate = dueAt ? new Date(dueAt) : null;
  if (dueDate && Number.isNaN(dueDate.getTime())) {
    return { ok: false, reason: "invalid" };
  }

  const sql = getDatabaseClient();
  if (!sql) return { ok: false, reason: "database" };

  try {
    const rows = await sql.query(
      `WITH target_submission AS (
        SELECT id, review_round, status
        FROM public.journal_submissions
        WHERE id = $1
          AND status NOT IN ('published', 'rejected', 'withdrawn')
        FOR UPDATE
      ),
      new_assignment AS (
        INSERT INTO public.review_assignments (
          submission_id,
          review_round,
          reviewer_email,
          status,
          due_at
        )
        SELECT id, GREATEST(1, review_round), $2, 'invited', $3
        FROM target_submission
        RETURNING submission_id
      ),
      updated_submission AS (
        UPDATE public.journal_submissions AS submission
        SET
          status = 'under_review',
          updated_at = NOW(),
          editor_account_id = $4
        FROM new_assignment
        WHERE submission.id = new_assignment.submission_id
        RETURNING submission.id
      ),
      event_record AS (
        INSERT INTO public.submission_events (
          submission_id,
          actor_account_id,
          actor_role,
          event_type,
          to_status,
          note
        )
        SELECT id, $4, 'editor', 'reviewer_invited', 'under_review', $2
        FROM updated_submission
        RETURNING id
      )
      SELECT updated_submission.id
      FROM updated_submission
      WHERE EXISTS (SELECT 1 FROM event_record)`,
      [submissionId, reviewerEmail, dueDate, actorEmail],
    );

    return rows.length > 0
      ? { ok: true }
      : { ok: false, reason: "not_found" };
  } catch {
    return { ok: false, reason: "database" };
  }
}

export async function submitPeerReview(input: {
  assignmentId: number;
  reviewerEmail: string;
  recommendation: string;
  commentsToAuthor: string;
  confidentialToEditor: string;
}): Promise<WorkflowResult> {
  const {
    assignmentId,
    reviewerEmail,
    recommendation,
    commentsToAuthor,
    confidentialToEditor,
  } = input;

  if (
    !Number.isSafeInteger(assignmentId) ||
    assignmentId < 1 ||
    !ALLOWED_RECOMMENDATIONS.has(recommendation as ReviewRecommendation) ||
    commentsToAuthor.length < 20
  ) {
    return { ok: false, reason: "invalid" };
  }

  const sql = getDatabaseClient();
  if (!sql) return { ok: false, reason: "database" };

  try {
    const rows = await sql.query(
      `WITH eligible_assignment AS (
        SELECT id, submission_id
        FROM public.review_assignments
        WHERE id = $1
          AND lower(reviewer_email) = $2
          AND status IN ('invited', 'accepted')
        FOR UPDATE
      ),
      saved_review AS (
        INSERT INTO public.peer_reviews (
          assignment_id,
          recommendation,
          confidential_to_editor,
          comments_to_author
        )
        SELECT id, $3, NULLIF($4, ''), $5
        FROM eligible_assignment
        WHERE TRUE
        ON CONFLICT (assignment_id) DO UPDATE
        SET
          recommendation = EXCLUDED.recommendation,
          confidential_to_editor = EXCLUDED.confidential_to_editor,
          comments_to_author = EXCLUDED.comments_to_author,
          updated_at = NOW()
        RETURNING assignment_id
      ),
      updated_assignment AS (
        UPDATE public.review_assignments AS assignment
        SET status = 'submitted', completed_at = NOW()
        FROM saved_review
        WHERE assignment.id = saved_review.assignment_id
        RETURNING assignment.submission_id
      ),
      event_record AS (
        INSERT INTO public.submission_events (
          submission_id,
          actor_account_id,
          actor_role,
          event_type,
          note
        )
        SELECT
          submission_id,
          $2,
          'reviewer',
          'review_submitted',
          'Parecer enviado; recomendação: ' || $3
        FROM updated_assignment
        RETURNING id
      )
      SELECT updated_assignment.submission_id
      FROM updated_assignment
      WHERE EXISTS (SELECT 1 FROM event_record)`,
      [
        assignmentId,
        reviewerEmail,
        recommendation,
        confidentialToEditor,
        commentsToAuthor,
      ],
    );

    return rows.length > 0
      ? { ok: true }
      : { ok: false, reason: "not_found" };
  } catch {
    return { ok: false, reason: "database" };
  }
}
