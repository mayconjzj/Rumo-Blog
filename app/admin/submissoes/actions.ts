"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/server/admin-auth";
const allowed=new Set(["technical_check","under_review","revisions_requested","accepted","rejected","withdrawn","published"]);
function fail(message:string):never{redirect("/admin/submissoes?erro="+encodeURIComponent(message));}
export async function updateSubmissionAction(formData:FormData){
 const {email}=await requireAdmin(),id=Number(formData.get("id")),status=String(formData.get("status")??""),note=String(formData.get("note")??"").trim().slice(0,2000);
 if(!Number.isSafeInteger(id)||id<1||!allowed.has(status))fail("acao");if(!process.env.DATABASE_URL)fail("banco");
 const sql=neon(process.env.DATABASE_URL);let previous:string;
 try{const rows=await sql.query("SELECT status FROM public.journal_submissions WHERE id=$1",[id]);previous=rows.length?String((rows[0] as {status:string}).status):"";}catch{fail("banco");}if(!previous)fail("acao");
 if(status==="published"&&previous!=="accepted")fail("precisa_aceite");
 try{
  await sql.query("UPDATE public.journal_submissions SET status=$1,editor_account_id=$2,updated_at=NOW(),published_at=CASE WHEN $1='published' THEN COALESCE(published_at,NOW()) ELSE published_at END WHERE id=$3",[status,email,id]);
  await sql.query("INSERT INTO public.submission_events (submission_id,actor_account_id,actor_role,event_type,from_status,to_status,note) VALUES ($1,$2,'editor','status_changed',$3,$4,$5)",[id,email,previous,status,note||null]);
 }catch{fail("banco");}
 revalidatePath("/admin/submissoes");revalidatePath("/pesquisas");redirect("/admin/submissoes?sucesso=atualizado");
}
export async function assignReviewerAction(formData:FormData){
 const {email}=await requireAdmin(),id=Number(formData.get("id")),reviewer=String(formData.get("reviewerEmail")??"").trim().toLowerCase(),due=String(formData.get("dueAt")??"").trim();
 if(!Number.isSafeInteger(id)||id<1||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewer))fail("campos");if(!process.env.DATABASE_URL)fail("banco");
 const sql=neon(process.env.DATABASE_URL);let row:{review_round:number;status:string}|undefined;
 try{const rows=await sql.query("SELECT review_round,status FROM public.journal_submissions WHERE id=$1",[id]);row=rows[0] as typeof row;}catch{fail("banco");}
 if(!row)fail("acao");if(["published","rejected","withdrawn"].includes(row.status))fail("acao");
 try{
  await sql.query("INSERT INTO public.review_assignments (submission_id,review_round,reviewer_email,status,due_at) VALUES ($1,$2,$3,'invited',$4)",[id,Math.max(1,Number(row.review_round)||1),reviewer,due?new Date(due):null]);
  await sql.query("UPDATE public.journal_submissions SET status='under_review',updated_at=NOW(),editor_account_id=$1 WHERE id=$2",[email,id]);
  await sql.query("INSERT INTO public.submission_events (submission_id,actor_account_id,actor_role,event_type,to_status,note) VALUES ($1,$2,'editor','reviewer_invited','under_review',$3)",[id,email,reviewer]);
 }catch{fail("banco");}
 revalidatePath("/admin/submissoes");redirect("/admin/submissoes?sucesso=avaliador");
}
