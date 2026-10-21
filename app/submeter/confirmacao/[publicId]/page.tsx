import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
export const dynamic="force-dynamic";
const labels:Record<string,string>={submitted:"Recebida",technical_check:"Em triagem técnica",under_review:"Em avaliação por pares",revisions_requested:"Revisões solicitadas",accepted:"Aceita",rejected:"Rejeitada",published:"Publicada",withdrawn:"Retirada"};
export default async function SubmissionReceipt({params}:{params:Promise<{publicId:string}>}) {
 const {publicId}=await params;if(!/^[0-9a-f-]{36}$/i.test(publicId)||!process.env.DATABASE_URL)notFound();
 let submission:{title:string;status:string;created_at:string|Date}|undefined;
 try{const sql=neon(process.env.DATABASE_URL);const rows=await sql.query("SELECT title,status,created_at FROM public.journal_submissions WHERE public_id=$1::uuid LIMIT 1",[publicId]);submission=rows[0] as typeof submission;}catch{notFound();}
 if(!submission)notFound();
 return <main style={{minHeight:"100vh",background:"#f4f6f8",padding:"70px 22px",color:"#17283b"}}><div style={{maxWidth:680,margin:"0 auto",background:"#fff",border:"1px solid #e1e6eb",padding:"clamp(24px,5vw,44px)"}}>
  <div style={{fontSize:11,color:"#195AB4",fontWeight:800,letterSpacing:".14em",marginBottom:18}}>REVISTA RUMO / RECIBO</div><div style={{fontSize:42,color:"#16804a",marginBottom:10}} aria-hidden="true">✓</div><h1 style={{fontSize:34,color:"#05132A",letterSpacing:"-.04em",marginBottom:12}}>Submissão registrada</h1><p style={{color:"#687789",lineHeight:1.8}}>O manuscrito foi recebido pelo sistema. Isso confirma o recebimento, não o aceite para publicação. A equipe editorial ainda precisa realizar a triagem.</p>
  <div style={{background:"#f4f6f8",padding:18,marginBlock:24}}><p style={{fontSize:11,color:"#687789",marginBottom:7}}>MANUSCRITO</p><strong>{submission.title}</strong><p style={{fontSize:12,color:"#687789",margin:"15px 0 5px"}}>Número de acompanhamento</p><code style={{fontSize:12,overflowWrap:"anywhere"}}>{publicId}</code><p style={{fontSize:12,color:"#687789",margin:"15px 0 0"}}>Estado atual: <strong>{labels[submission.status]??"Recebida"}</strong></p></div>
  <p style={{fontSize:12,color:"#687789",lineHeight:1.7}}>Guarde o número de acompanhamento e confira se o e-mail informado está correto. A equipe editorial poderá usar esse endereço para tratar da submissão. Este recibo não confirma aceite e não garante notificações automáticas.</p><Link href="/" style={{display:"inline-block",marginTop:14,background:"#05132A",color:"#fff",padding:"13px 16px",fontSize:12,fontWeight:800}}>Voltar à revista ↗</Link>
 </div></main>;
}
