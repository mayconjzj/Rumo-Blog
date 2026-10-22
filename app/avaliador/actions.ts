"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { submitPeerReview } from "@/lib/server/editorial-workflow";

export async function submitReviewAction(formData: FormData) {
  const { data: session } = await auth.getSession();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) redirect("/login");

  const assignmentId = Number(formData.get("assignmentId"));
  const recommendation = String(formData.get("recommendation") ?? "");
  const commentsToAuthor = String(formData.get("commentsToAuthor") ?? "")
    .trim()
    .slice(0, 20_000);
  const confidentialToEditor = String(
    formData.get("confidentialToEditor") ?? "",
  )
    .trim()
    .slice(0, 10_000);

  const result = await submitPeerReview({
    assignmentId,
    reviewerEmail: email,
    recommendation,
    commentsToAuthor,
    confidentialToEditor,
  });

  if (!result.ok) {
    if (result.reason === "database") redirect("/avaliador?erro=banco");
    if (result.reason === "invalid") redirect("/avaliador?erro=campos");
    redirect("/avaliador?erro=permissao");
  }

  revalidatePath("/avaliador");
  revalidatePath("/admin/submissoes");
  redirect("/avaliador?sucesso=parecer");
}
