import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
 const {id:raw}=await params,id=Number(raw);if(!Number.isSafeInteger(id)||id<1||!process.env.DATABASE_URL)return NextResponse.json({error:"Não encontrado"},{status:404});
 const {data:session}=await auth.getSession(),email=session?.user?.email?.trim().toLowerCase(),adminEmail=process.env.ADMIN_EMAIL?.trim().toLowerCase();
 if(!email)return NextResponse.json({error:"Autenticação necessária"},{status:401});
 try{
  const sql=neon(process.env.DATABASE_URL);
  const rows=await sql.query(`SELECT encode(s.manuscript_pdf,'base64') pdf_base64 FROM public.journal_submissions s WHERE s.id=$1 AND s.manuscript_pdf IS NOT NULL AND ($2=$3 OR EXISTS(SELECT 1 FROM public.review_assignments r WHERE r.submission_id=s.id AND lower(r.reviewer_email)=$2 AND r.status IN ('invited','accepted')))`,[id,email,adminEmail??""]);
  const row=rows[0] as {pdf_base64:string}|undefined;if(!row?.pdf_base64)return NextResponse.json({error:"Não encontrado"},{status:404});
  return new Response(Buffer.from(row.pdf_base64,"base64"),{headers:{"Content-Type":"application/pdf", "Content-Disposition":`inline; filename="manuscrito-${id}.pdf"`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return NextResponse.json({error:"Falha ao recuperar arquivo"},{status:503});}
}
