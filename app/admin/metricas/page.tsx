import { neon } from "@neondatabase/serverless";
import { requireAdminPage } from "@/lib/server/admin-auth";
import AdminHeader from "@/app/components/AdminHeader";
type MetricRow = { label: string; total: number | string };
const number = (value: number) => new Intl.NumberFormat("pt-BR").format(value);
export default async function MetricsPage() {
  const { email } = await requireAdminPage();
  let total = 0, today = 0, pages: MetricRow[] = [], sources: MetricRow[] = [], days: MetricRow[] = [];
  let unavailable = false;
  try {
    if (!process.env.DATABASE_URL) throw new Error("missing database");
    const sql = neon(process.env.DATABASE_URL);
    const result = await Promise.all([
      sql.query("SELECT COUNT(*)::int total, COUNT(*) FILTER (WHERE created_at >= date_trunc('day', NOW()))::int today FROM public.site_page_views", []),
      sql.query("SELECT path label, COUNT(*)::int total FROM public.site_page_views WHERE created_at >= NOW()-INTERVAL '30 days' GROUP BY path ORDER BY total DESC LIMIT 10", []),
      sql.query("SELECT CASE source WHEN 'direct' THEN 'Acesso direto' WHEN 'google' THEN 'Google' WHEN 'bing' THEN 'Bing' WHEN 'facebook' THEN 'Facebook' WHEN 'instagram' THEN 'Instagram' WHEN 'whatsapp' THEN 'WhatsApp' ELSE 'Outros sites' END label, COUNT(*)::int total FROM public.site_page_views WHERE created_at >= NOW()-INTERVAL '30 days' GROUP BY source ORDER BY total DESC", []),
      sql.query("SELECT to_char(d.day,'DD/MM') label, COUNT(v.id)::int total FROM generate_series(current_date-6,current_date,interval '1 day') d(day) LEFT JOIN public.site_page_views v ON v.created_at >= d.day AND v.created_at < d.day+interval '1 day' GROUP BY d.day ORDER BY d.day", [])
    ]);
    total=Number((result[0][0] as {total:number}).total); today=Number((result[0][0] as {today:number}).today);
    pages=result[1] as unknown as MetricRow[]; sources=result[2] as unknown as MetricRow[]; days=result[3] as unknown as MetricRow[];
  } catch { unavailable=true; }
  const panel={background:"#fff",border:"1px solid #e1e6eb",padding:22}; const muted={color:"#687789",fontSize:12} as const;
  const maxPages=Math.max(1,...pages.map(x=>Number(x.total))), maxSources=Math.max(1,...sources.map(x=>Number(x.total))), maxDays=Math.max(1,...days.map(x=>Number(x.total)));
  const bars=(items:MetricRow[],max:number,color:string)=><>{items.length?items.map(x=><div key={x.label} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12,marginBottom:6,overflowWrap:"anywhere"}}><span>{x.label}</span><strong>{number(Number(x.total))}</strong></div><div style={{height:6,background:"#edf1f5"}}><div style={{height:6,width:`${Number(x.total)/max*100}%`,background:color}}/></div></div>):<p style={muted}>Ainda não há visitas registradas.</p>}</>;
  return <main style={{minHeight:"100vh",background:"#f4f6f8",color:"#17283b"}}>
    <AdminHeader email={email} />
    <div style={{maxWidth:1160,margin:"0 auto",padding:"38px 22px 70px"}}><p style={{marginBottom:8,color:"#195AB4",fontSize:10,fontWeight:800,letterSpacing:".15em"}}>RUMO / DESEMPENHO</p><h1 style={{margin:"0 0 8px",color:"#05132A",fontSize:"clamp(30px,4vw,42px)",letterSpacing:"-.04em"}}>Métricas do site</h1><p style={{...muted,marginBottom:26,lineHeight:1.8}}>Visitas, páginas mais lidas e canais de origem. O contador começa a registrar após o deploy e a ativação da tabela.</p>
    {unavailable&&<div role="alert" style={{...panel,marginBottom:18,borderColor:"#e5c46a",background:"#fff8e7",color:"#6b4c00",fontSize:13,lineHeight:1.7}}>Métricas indisponíveis. Confirme se a tabela de visitas foi ativada no banco e se esta versão já foi publicada.</div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14,marginBottom:18}}><section style={panel}><p style={{...muted,margin:"0 0 8px"}}>Visitas registradas</p><strong style={{fontSize:34,color:"#05132A"}}>{number(total)}</strong><p style={{...muted,margin:"6px 0 0"}}>Desde a ativação</p></section><section style={panel}><p style={{...muted,margin:"0 0 8px"}}>Visitas hoje</p><strong style={{fontSize:34,color:"#05132A"}}>{number(today)}</strong><p style={{...muted,margin:"6px 0 0"}}>Desde meia-noite</p></section></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,390px),1fr))",gap:18,alignItems:"start"}}><section style={panel}><h2 style={{margin:"0 0 6px",fontSize:18}}>Páginas mais lidas</h2><p style={{...muted,marginBottom:20}}>Últimos 30 dias</p>{bars(pages,maxPages,"#195AB4")}</section><section style={panel}><h2 style={{margin:"0 0 6px",fontSize:18}}>Origem do tráfego</h2><p style={{...muted,marginBottom:20}}>Últimos 30 dias</p>{bars(sources,maxSources,"#247b58")}</section>
    <section style={{...panel,gridColumn:"1 / -1"}}><h2 style={{margin:"0 0 6px",fontSize:18}}>Visitas nos últimos 7 dias</h2><p style={{...muted,marginBottom:22}}>Quantidade por dia</p><div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:10,alignItems:"end",minHeight:160}}>{days.map(d=><div key={d.label} style={{display:"grid",gap:8,justifyItems:"center",alignContent:"end",height:150}}><span style={{fontSize:10,color:"#687789"}}>{number(Number(d.total))}</span><div title={`${d.label}: ${d.total} visitas`} style={{width:"min(100%,46px)",height:`${Math.max(4,Number(d.total)/maxDays*100)}%`,background:"#195AB4",minHeight:4}}/><span style={{fontSize:10,color:"#687789"}}>{d.label}</span></div>)}</div></section></div><p style={{...muted,marginTop:18,lineHeight:1.7}}>O contador não armazena endereços IP. Robôs podem gerar algumas visitas; os números são indicativos.</p></div></main>;
}