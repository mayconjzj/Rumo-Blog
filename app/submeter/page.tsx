import Link from "next/link";
import SubmissionForm from "./submission-form";
export const metadata = { title: "Submeter artigo | Revista Rumo", description: "Envie gratuitamente um manuscrito científico para avaliação editorial da Revista Rumo." };
const areas = ["Ciências Exatas e da Terra","Ciências Biológicas","Engenharias","Ciências da Saúde","Ciências Agrárias","Ciências Sociais Aplicadas","Ciências Humanas","Linguística, Letras e Artes","Multidisciplinar"];
export default function SubmitPage() {
 return <main style={{minHeight:"100vh",background:"#f4f6f8",color:"#17283b"}}>
  <header style={{background:"#05132A",color:"#fff",padding:"20px max(22px, calc((100vw - 1040px) / 2))",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
   <Link href="/" className="brand" style={{color:"#fff"}}><span className="brand-mark">R</span><span>rumo<span className="brand-period">.</span></span></Link><Link href="/" style={{fontSize:13,color:"#b8c8dc"}}>Voltar à revista ↗</Link>
  </header>
  <div style={{maxWidth:900,margin:"0 auto",padding:"42px 22px 80px"}}>
   <p style={{color:"#195AB4",fontSize:11,fontWeight:800,letterSpacing:".14em",marginBottom:10}}>REVISTA RUMO / SUBMISSÕES</p>
   <h1 style={{fontSize:"clamp(32px,5vw,48px)",lineHeight:1.1,letterSpacing:"-.045em",color:"#05132A",marginBottom:14}}>Submeta sua pesquisa.</h1>
   <p style={{maxWidth:700,color:"#687789",fontSize:15,lineHeight:1.8,marginBottom:28}}>A submissão é gratuita e aberta a trabalhos científicos de todas as áreas. Os manuscritos passam por triagem editorial e, se adequados ao escopo, podem ser encaminhados à avaliação por pares.</p>
   <div style={{background:"#fff",border:"1px solid #e1e6eb",padding:"clamp(20px,4vw,34px)"}}><SubmissionForm areas={areas}/></div>
   <p style={{fontSize:12,color:"#687789",lineHeight:1.7,marginTop:20}}>Remova nomes, afiliações e agradecimentos identificadores do PDF para apoiar a avaliação duplo-cega. Informe os dados de autoria apenas no formulário.</p>
  </div>
 </main>;
}
