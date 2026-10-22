"use server";

import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";

export async function submitCommunityReview(formData: FormData) {
  const publicId = String(formData.get("publicId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(publicId)) redirect("/pesquisas");
  const { data: session } = await auth.getSession();
  const user = session?.user;
  const email = user?.email?.trim().toLowerCase();
  const accountId = user?.id ? String(user.id) : "";
  const name = user?.name?.trim().slice(0, 100) || email?.split("@")[0] || "Membro da comunidade";

  if (!email || !accountId) redirect(`/login?returnTo=${encodeURIComponent(`/pesquisas/${publicId}`)}`);

  const score = (field: string) => Number(formData.get(field));
  const methodology = score("methodology");
  const evidence = score("evidence");
  const clarity = score("clarity");
  const reproducibility = score("reproducibility");
  const recommendation = String(formData.get("recommendation") ?? "");
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 5000);
  if (![methodology, evidence, clarity, reproducibility].every((value) => Number.isInteger(value) && value >= 1 && value <= 5)
    || !["supports", "revision_needed", "concerns"].includes(recommendation)
    || comment.length < 30) {
    redirect(`/pesquisas/${publicId}?avaliacao=campos#avaliacao-comunidade`);
  }
  if (!process.env.DATABASE_URL) redirect(`/pesquisas/${publicId}?avaliacao=erro#avaliacao-comunidade`);

  const sql = neon(process.env.DATABASE_URL);
  try {
    const rows = await sql.query(
      `SELECT id, corresponding_author_email
       FROM public.journal_submissions
       WHERE public_id = $1::uuid AND status = 'published'
       LIMIT 1`,
      [publicId],
    ) as { id: number; corresponding_author_email: string }[];
    const submission = rows[0];
    if (!submission) redirect("/pesquisas");
    if (submission.corresponding_author_email.trim().toLowerCase() === email) {
      redirect(`/pesquisas/${publicId}?avaliacao=autor#avaliacao-comunidade`);
    }
    const authors = await sql.query(
      "SELECT 1 FROM public.submission_authors WHERE submission_id = $1 AND lower(email) = $2 LIMIT 1",
      [submission.id, email],
    );
    if (authors.length) redirect(`/pesquisas/${publicId}?avaliacao=autor#avaliacao-comunidade`);

    await sql.query(
      `INSERT INTO public.community_reviews (
         submission_id, reviewer_account_id, reviewer_email, reviewer_name,
         methodology_score, evidence_score, clarity_score, reproducibility_score,
         recommendation, comment
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (submission_id, reviewer_account_id) DO UPDATE SET
         reviewer_email = EXCLUDED.reviewer_email,
         reviewer_name = EXCLUDED.reviewer_name,
         methodology_score = EXCLUDED.methodology_score,
         evidence_score = EXCLUDED.evidence_score,
         clarity_score = EXCLUDED.clarity_score,
         reproducibility_score = EXCLUDED.reproducibility_score,
         recommendation = EXCLUDED.recommendation,
         comment = EXCLUDED.comment,
         updated_at = NOW()`,
      [submission.id, accountId, email, name, methodology, evidence, clarity, reproducibility, recommendation, comment],
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
    redirect(`/pesquisas/${publicId}?avaliacao=erro#avaliacao-comunidade`);
  }
  redirect(`/pesquisas/${publicId}?avaliacao=salva#avaliacao-comunidade`);
}
