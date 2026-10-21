import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{publicId:string}>}){
 const {publicId}=await params;if(!/^[0-9a-f-]{36}$/i.test(publicId)||!process.env.DATABASE_URL)return NextResponse.json({error:"Não encontrado"},{status:404});
 try{const sql=neon(process.env.DATABASE_URL);const rows=await sql.query("SELECT encode(manuscript_pdf,'base64') AS pdf_base64 FROM public.journal_submissions WHERE public_id=$1::uuid AND status='published' AND manuscript_pdf IS NOT NULL LIMIT 1",[publicId]);const row=rows[0] as {pdf_base64:string}|undefined;if(!row?.pdf_base64)return NextResponse.json({error:"Não encontrado"},{status:404});return new Response(Buffer.from(row.pdf_base64,"base64"),{headers:{"Content-Type":"application/pdf","Content-Disposition":'inline; filename="artigo-cientifico.pdf"',"Cache-Control":"public, max-age=300","X-Content-Type-Options":"nosniff"}});}catch{return NextResponse.json({error:"Falha ao carregar PDF"},{status:503});}
}
