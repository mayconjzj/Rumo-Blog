import Link from "next/link";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";
import { connection } from "next/server";
type Assignment={id:number;submission_id:number;title:string;scientific_area:string;abstract:string;status:string;due_at:string|Date|null;review_round:number};
export default async function ReviewerPortal(){
 await connection();
 const {data:session}=await auth.getSession(),email=session?.user?.email?.trim().toLowerCase();if(!email)redirect("/login");
 let rows:Assignment[]=[];let unavailable=false;
 try{if(!process.env.DATABASE_URL)throw new Error("db");const sql=neon(process.env.DATABASE_URL);rows=await sql.query(`SELECT r.id,r.submission_id,s.title,s.scientific_area,s.abstract,r.status,r.due_at,r.review_round FROM public.review_assignments r JOIN public.journal_submissions s ON s.id=r.submission_id WHERE lower(r.reviewer_email)=$1 AND r.status IN ('invited','accepted') ORDER BY r.due_at NULLS LAST,r.invited_at DESC`,[email]) as unknown as Assignment[];}catch{unavailable=true;}
 return <main style={{minHeight:"100vh",background:"#f4f6f8",color:"#17283b",padding:"38px 22px"}}><div style={{maxWidth:900,margin:"0 auto"}}><Link href="/" style={{fontWeight:800,color:"#05132A"}}>RUMO / REVISTA CIENTÍFICA</Link><p style={{fontSize:11,color:"#195AB4",fontWeight:800,letterSpacing:".14em",marginTop:34}}>PORTAL DO AVALIADOR</p><h1 style={{fontSize:38,color:"#05132A",letterSpacing:"-.04em"}}>Avaliações atribuídas</h1><p style={{fontSize:13,color:"#687789",lineHeight:1.8}}>Sessão: {email}. Os manuscritos e pareceres são confidenciais. Não compartilhe arquivos nem utilize conteúdo não publicado fora do processo editorial.</p>
 {unavailable?<p style={{background:"#fff",padding:20}}>O portal ainda não está conectado ao banco. Verifique as migrações.</p>:rows.length===0?<p style={{background:"#fff",border:"1px solid #e1e6eb",padding:22,color:"#687789"}}>Não há convites pendentes para este e-mail.</p>:<div style={{display:"grid",gap:16,marginTop:24}}>{rows.map(r=><article key={r.id} style={{background:"#fff",border:"1px solid #e1e6eb",padding:22}}><p style={{fontSize:11,color:"#195AB4",fontWeight:800}}>{r.scientific_area} · Rodada {r.review_round}</p><h2 style={{fontSize:21,color:"#05132A"}}>{r.title}</h2><p style={{fontSize:13,lineHeight:1.8,color:"#526274"}}>{r.abstract}</p><p style={{fontSize:12,color:"#687789"}}>Prazo: {r.due_at?new Date(r.due_at).toLocaleDateString("pt-BR"):"não definido"}</p><Link href={"/avaliador/pareceres/"+r.id} style={{display:"inline-block",background:"#05132A",color:"#fff",padding:"12px 15px",fontSize:12,fontWeight:800}}>Abrir avaliação ↗</Link></article>)}</div>}
 </div></main>;
}
