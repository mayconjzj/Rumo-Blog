"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Props = { areas: string[] };
export default function SubmissionForm({areas}:Props) {
 const router = useRouter();
 const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [authors,setAuthors]=useState([{name:"",affiliation:""}]);
 async function submit(event:React.FormEvent<HTMLFormElement>) {
  event.preventDefault();setBusy(true);setError("");const form=event.currentTarget;const data=new FormData(form);data.set("authors",JSON.stringify(authors));
  try {const response=await fetch("/api/submissoes",{method:"POST",body:data});const result=await response.json();if(!response.ok||!result.publicId)throw new Error(result.error||"Não foi possível enviar. Tente novamente.");router.push("/submeter/confirmacao/"+result.publicId);}
  catch(e){setError(e instanceof Error?e.message:"Falha de conexão. Tente novamente.");setBusy(false);}
 }
 const field:React.CSSProperties={display:"grid",gap:7,marginBottom:18,fontSize:13,fontWeight:700,color:"#24374b"};
 const input:React.CSSProperties={width:"100%",border:"1px solid #d6dee7",padding:"12px 13px",background:"#fff",color:"#17283b",borderRadius:4,fontSize:14,fontWeight:400};
 return <form onSubmit={submit} style={{maxWidth:760}}>
  <label style={field}>Título do manuscrito<input name="title" required minLength={5} maxLength={300} style={input} placeholder="Título completo da pesquisa"/></label>
  <label style={field}>Resumo<textarea name="abstract" required minLength={20} maxLength={10000} rows={6} style={input} placeholder="Contexto, objetivo, método, resultados e conclusão"/></label>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
   <label style={field}>Área científica<select name="scientificArea" required style={input}><option value="">Selecione uma área</option>{areas.map(a=><option key={a}>{a}</option>)}</select></label>
   <label style={field}>Tipo de manuscrito<select name="manuscriptType" required style={input}><option value="research_article">Artigo original</option><option value="review">Artigo de revisão</option><option value="case_study">Estudo de caso</option><option value="methodology">Nota metodológica</option><option value="short_communication">Comunicação breve</option></select></label>
  </div>
  <label style={field}>Palavras-chave (separadas por vírgula)<input name="keywords" required style={input} placeholder="Ex.: modelagem, educação, políticas públicas"/></label>
  <label style={field}>Referências bibliográficas<textarea name="references" rows={4} style={input} placeholder="Referências utilizadas no manuscrito"/></label>
  <div style={{borderTop:"1px solid #e1e6eb",paddingTop:22,marginTop:8}}><h2 style={{fontSize:20,color:"#05132A",marginBottom:5}}>Autoria</h2><p style={{fontSize:12,color:"#687789",lineHeight:1.7}}>Informe todos os autores na ordem correta. Nesta versão do sistema, o primeiro nome informado é associado ao e-mail do autor correspondente. Confira a grafia dos nomes e das afiliações antes de enviar.</p>
   {authors.map((author,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,alignItems:"end",marginBottom:12}}>
    <label style={field}>Nome completo<input value={author.name} required onChange={e=>setAuthors(old=>old.map((a,j)=>j===i?{...a,name:e.target.value}:a))} style={input}/></label>
    <label style={field}>Instituição / afiliação<input value={author.affiliation} onChange={e=>setAuthors(old=>old.map((a,j)=>j===i?{...a,affiliation:e.target.value}:a))} style={input} placeholder="Universidade, instituto ou independente"/></label>
    {authors.length>1&&<button type="button" onClick={()=>setAuthors(old=>old.filter((_,j)=>j!==i))} style={{padding:12,marginBottom:18,border:"1px solid #d6dee7",background:"#fff",color:"#8c1d18"}}>Remover autor</button>}
   </div>)}
   <button type="button" onClick={()=>setAuthors(old=>[...old,{name:"",affiliation:""}])} style={{border:"1px solid #cbd5e1",background:"#fff",padding:"10px 13px",fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Adicionar coautor</button>
  </div>
  <label style={{...field,marginTop:22}}>E-mail do autor correspondente<input name="correspondingEmail" type="email" required style={input} placeholder="voce@instituicao.edu.br"/></label>
  <label style={field}>Ética e aprovação (quando aplicável)<textarea name="ethicsStatement" rows={2} style={input} placeholder="Informe o comitê, o número de aprovação, o consentimento ou por que não se aplica"/></label>
  <label style={field}>Financiamento<input name="fundingStatement" style={input} placeholder="Agência, edital ou 'Não houve financiamento'"/></label>
  <label style={field}>Conflito de interesses<input name="conflictStatement" required style={input} placeholder="Declare os conflitos ou informe expressamente que não há"/></label>
  <label style={field}>Uso de ferramentas de IA<input name="aiStatement" style={input} placeholder="Informe se ferramentas de IA foram utilizadas"/></label>
  <label style={field}>Arquivo principal em PDF (máximo 4 MB)<input name="manuscript" type="file" accept="application/pdf,.pdf" required style={input}/></label>
  <label style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:12,lineHeight:1.7,color:"#536273",marginBottom:18}}><input name="confirmOriginal" type="checkbox" required style={{marginTop:3}}/>Confirmo que o trabalho é original, que todos os autores concordam com a submissão e que as informações fornecidas são verdadeiras.</label>
  <div aria-hidden="true" style={{position:"absolute",left:"-10000px",width:1,height:1,overflow:"hidden"}}><label>Deixe vazio<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  {error&&<p role="alert" style={{background:"#fff0ee",color:"#8c1d18",padding:12,fontSize:13}}>{error}</p>}
  <button disabled={busy} type="submit" style={{background:busy?"#7892b0":"#05132A",color:"#fff",border:0,padding:"15px 20px",fontWeight:800,fontSize:13,cursor:busy?"wait":"pointer"}}>{busy?"Enviando manuscrito…":"Enviar para avaliação ↗"}</button>
  <p style={{fontSize:11,color:"#687789",marginTop:12}}>Não há taxa de submissão nem cobrança pela avaliação ou leitura. O envio não garante aceite. Ao enviar, confira se os dados de contato estão corretos e guarde o número de acompanhamento da confirmação.</p>
 </form>;
}
