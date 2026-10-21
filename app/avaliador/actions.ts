"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";
export async function submitReviewAction(formData:FormData){
 const assignmentId=Number(formData.get("assignmentId")),recommendation=String(formData.get("recommendation")??""),authorComments=String(formData.get("commentsToAuthor")??"").trim().slice(0,20000),editorComments=String(formData.get("confidentialToEditor")??"").trim().slice(0,10000);
 const {data:session}=await auth.getSession(),email=session?.user?.email?.trim().toLowerCase();if(!email)redirect("/login");
 if(!Number.isSafeInteger(assignmentId)||assignmentId<1||!["accept","minor_revision","major_revision","reject"].includes(recommendation)||authorComments.length<20)redirect("/avaliador?erro=campos");
 if(!process.env.DATABASE_URL)redirect("/avaliador?erro=banco");
 const sql=neon(process.env.DATABASE_URL);let assigned:{id:number;submission_id:number}|undefined;
 try{const rows=await sql.query("SELECT id,submission_id FROM public.review_assignments WHERE id=$1 AND lower(reviewer_email)=$2 AND status IN ('invited','accepted')",[assignmentId,email]);assigned=rows[0] as typeof assigned;}catch{redirect("/avaliador?erro=banco");}
 if(!assigned)redirect("/avaliador?erro=permissao");
 try{
  await sql.query("INSERT INTO public.peer_reviews (assignment_id,recommendation,confidential_to_editor,comments_to_author) VALUES ($1,$2,$3,$4) ON CONFLICT (assignment_id) DO UPDATE SET recommendation=EXCLUDED.recommendation,confidential_to_editor=EXCLUDED.confidential_to_editor,comments_to_author=EXCLUDED.comments_to_author,updated_at=NOW()",[assignmentId,recommendation,editorComments||null,authorComments]);
  await sql.query("UPDATE public.review_assignments SET status='submitted',completed_at=NOW() WHERE id=$1",[assignmentId]);
  await sql.query("INSERT INTO public.submission_events (submission_id,actor_account_id,actor_role,event_type,note) VALUES ($1,$2,'reviewer','review_submitted',$3)",[assigned.submission_id,email,"Parecer enviado; recomendação: "+recommendation]);
 }catch{redirect("/avaliador?erro=banco");}
 revalidatePath("/avaliador");revalidatePath("/admin/submissoes");redirect("/avaliador?sucesso=parecer");
}
