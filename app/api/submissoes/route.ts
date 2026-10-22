import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getCommunityAccess } from "@/lib/server/community-access";
export const runtime="nodejs"; export const dynamic="force-dynamic";
const MAX_PDF_BYTES = 4 * 1024 * 1024;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedManuscriptTypes = new Set(["research_article", "review", "case_study", "methodology", "short_communication"]);
const allowedScientificAreas = new Set(["Ciências Exatas e da Terra", "Ciências Biológicas", "Engenharias", "Ciências da Saúde", "Ciências Agrárias", "Ciências Sociais Aplicadas", "Ciências Humanas", "Linguística, Letras e Artes", "Multidisciplinar"]);
export async function POST(request:Request) {
 try {
  const access = await getCommunityAccess();
  if (access.status === "anonymous") return NextResponse.json({ error: "Entre na sua conta para submeter um artigo.", loginUrl: "/login?returnTo=%2Fsubmeter" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  if (access.status === "disabled") return NextResponse.json({ error: "Seu perfil comunitário está desativado. Entre em contato com a equipe editorial." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const data=await request.formData();
  if(String(data.get("website")??"").trim())return NextResponse.json({error:"Não foi possível validar o envio."},{status:400});
  if(!data.get("confirmOriginal"))return NextResponse.json({error:"Confirme a declaração de autoria."},{status:400});
  const title=String(data.get("title")??"").trim(), abstract=String(data.get("abstract")??"").trim(), area=String(data.get("scientificArea")??"").trim();
  const type=String(data.get("manuscriptType")??"research_article").trim(), email=String(data.get("correspondingEmail")??"").trim().toLowerCase();
  const keywords=String(data.get("keywords")??"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,20);
  const references=String(data.get("references")??"").slice(0,30000), ethics=String(data.get("ethicsStatement")??"").slice(0,5000);
  const funding=String(data.get("fundingStatement")??"").slice(0,2000), conflicts=String(data.get("conflictStatement")??"").slice(0,3000), aiUse=String(data.get("aiStatement")??"").slice(0,3000);
  if (title.length < 5 || title.length > 300 || abstract.length < 20 || abstract.length > 10000 || !allowedScientificAreas.has(area) || !allowedManuscriptTypes.has(type) || !emailPattern.test(email) || email.length > 254 || conflicts.length < 3) return NextResponse.json({ error: "Confira título, resumo, área, tipo, e-mail e declaração de conflito de interesses." }, { status: 400 });
  const file=data.get("manuscript");
  if(!(file instanceof File)||file.size<10||file.size>MAX_PDF_BYTES||(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf")))return NextResponse.json({error:"Envie um PDF válido de até 4 MB."},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer());
  if(bytes.subarray(0,5).toString("ascii")!=="%PDF-")return NextResponse.json({error:"O arquivo enviado não parece ser um PDF válido."},{status:400});
  let authors:Array<{name:string;affiliation:string}>;
  try {
    const parsed: unknown = JSON.parse(String(data.get("authors") ?? "[]"));
    if (!Array.isArray(parsed)) return NextResponse.json({ error: "Confira os dados dos autores." }, { status: 400 });
    authors = parsed.filter((author): author is { name: string; affiliation?: unknown } => Boolean(author) && typeof author === "object" && typeof author.name === "string" && author.name.trim().length > 0).slice(0, 20).map(author => ({ name: author.name.trim().slice(0, 200), affiliation: String(author.affiliation ?? "").trim().slice(0, 300) }));
  } catch {
    return NextResponse.json({ error: "Confira os dados dos autores." }, { status: 400 });
  }
  if(!authors.length)return NextResponse.json({error:"Informe ao menos um autor."},{status:400});
  if(!process.env.DATABASE_URL)return NextResponse.json({error:"O banco de dados ainda não está configurado."},{status:503});
  const sql=neon(process.env.DATABASE_URL), authorPayload=authors.map((a,i)=>({...a,author_order:i+1,is_corresponding:i===0}));
  const result=await sql.query(`WITH created AS (
    INSERT INTO public.journal_submissions (title,abstract,language_code,manuscript_type,scientific_area,keywords,references_text,corresponding_author_email,status,ethics_statement,funding_statement,conflict_of_interest_statement,ai_use_statement,manuscript_pdf,manuscript_file_name,submitted_at)
    VALUES ($1,$2,'pt-BR',$3,$4,ARRAY(SELECT jsonb_array_elements_text($5::jsonb)),$6,$7,'submitted',$8,$9,$10,$11,decode($12,'base64'),$13,NOW()) RETURNING id,public_id
  ), authors_added AS (
    INSERT INTO public.submission_authors (submission_id,display_name,email,affiliation,author_order,is_corresponding)
    SELECT created.id,a.name,CASE WHEN a.author_order=1 THEN $7 ELSE NULL END,a.affiliation,a.author_order,a.author_order=1
    FROM created CROSS JOIN LATERAL jsonb_to_recordset($14::jsonb) AS a(name text,affiliation text,author_order integer,is_corresponding boolean) RETURNING id
  ) SELECT created.public_id FROM created`,
  [title,abstract,type,area,JSON.stringify(keywords),references,email,ethics,funding,conflicts,aiUse,bytes.toString("base64"),file.name.slice(0,255),JSON.stringify(authorPayload)]);
  const row=result[0] as {public_id?:string}|undefined;
  if(!row?.public_id)return NextResponse.json({error:"Não foi possível registrar a submissão."},{status:500});
  return NextResponse.json({publicId:row.public_id},{status:201,headers:{"Cache-Control":"no-store"}});
 }catch(error){console.error("Falha ao registrar submissão científica",error);return NextResponse.json({error:"Falha ao salvar a submissão. Confirme que as migrações SQL foram aplicadas e tente novamente."},{status:503});}
}
