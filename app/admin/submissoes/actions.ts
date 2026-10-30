"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/server/admin-auth";
import {
  assignReviewer,
  changeSubmissionStatus,
} from "@/lib/server/editorial-workflow";

function fail(reason: string): never {
  redirect("/admin/submissoes?erro=" + encodeURIComponent(reason));
}

export async function updateSubmissionAction(formData: FormData) {
  const { email } = await requireAdmin();
  const submissionId = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 2_000);

  const result = await changeSubmissionStatus({
    submissionId,
    status,
    actorEmail: email,
    note,
  });

  if (!result.ok) {
    if (result.reason === "must_accept") fail("precisa_aceite");
    fail(result.reason === "database" ? "banco" : "acao");
  }

  revalidatePath("/admin/submissoes");
  revalidateTag("published-papers", "max");
  revalidatePath("/pesquisas");
  revalidatePath("/sitemap.xml");
  redirect("/admin/submissoes?sucesso=atualizado");
}

export async function assignReviewerAction(formData: FormData) {
  const { email } = await requireAdmin();
  const submissionId = Number(formData.get("id"));
  const reviewerEmail = String(formData.get("reviewerEmail") ?? "")
    .trim()
    .toLowerCase();
  const dueAt = String(formData.get("dueAt") ?? "").trim();

  const result = await assignReviewer({
    submissionId,
    reviewerEmail,
    dueAt,
    actorEmail: email,
  });

  if (!result.ok) {
    fail(result.reason === "database" ? "banco" : "acao");
  }

  revalidatePath("/admin/submissoes");
  redirect("/admin/submissoes?sucesso=avaliador");
}
