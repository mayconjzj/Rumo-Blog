"use client";

import { useMemo, useState } from "react";

type Section = { id: string; heading: string; text: string; imageUrl: string; caption: string };
type ArticleDraft = { intro: string; coverImage: string; sections: Section[] };
type Props = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initial?: { id?: number; title?: string; slug?: string; category?: string; excerpt?: string; content?: string; status?: string };
};

const inputStyle = { width: "100%", minWidth: 0, padding: "12px 13px", border: "1px solid #dbe2e9", color: "#17283b", background: "#fff", font: "inherit", fontSize: 13 } as const;
const labelStyle = { display: "block", margin: "12px 0 6px", fontSize: 12, fontWeight: 700 as const, color: "#21364d" };

function parseContent(raw?: string): ArticleDraft {
  if (!raw) return { intro: "", coverImage: "", sections: [{ id: "s1", heading: "", text: "", imageUrl: "", caption: "" }] };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && Array.isArray(parsed.sections)) {
      return { intro: String(parsed.intro ?? ""), coverImage: String(parsed.coverImage ?? ""), sections: parsed.sections.map((s: Partial<Section>, i: number) => ({ id: s.id || `s${i + 1}`, heading: s.heading || "", text: s.text || "", imageUrl: s.imageUrl || "", caption: s.caption || "" })) };
    }
  } catch {}
  return { intro: raw, coverImage: "", sections: [{ id: "s1", heading: "", text: "", imageUrl: "", caption: "" }] };
}

export default function ArticleEditor({ action, submitLabel, initial }: Props) {
  const firstDraft = useMemo(() => parseContent(initial?.content), [initial?.content]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "EDUCAÇÃO FINANCEIRA");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [intro, setIntro] = useState(firstDraft.intro);
  const [coverImage, setCoverImage] = useState(firstDraft.coverImage);
  const [sections, setSections] = useState<Section[]>(firstDraft.sections);
  const [showPreview, setShowPreview] = useState(true);
  const serialized = JSON.stringify({ version: 1, intro, coverImage, sections });
  const update = (id: string, field: keyof Section, value: string) => setSections((items) => items.map((s) => s.id === id ? { ...s, [field]: value } : s));
  const addSection = () => setSections((items) => [...items, { id: `s${Date.now()}`, heading: "", text: "", imageUrl: "", caption: "" }]);
  const hasPreviewBody = Boolean(intro.trim() || sections.some((section) => section.heading.trim() || section.text.trim() || section.imageUrl.trim()));

  return (
    <form action={action} style={{ display: "grid", gap: 5 }}>
      <label style={labelStyle} htmlFor="title">Título do artigo</label>
      <input id="title" name="title" maxLength={180} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Como analisar uma empresa" style={inputStyle} />
      <label style={labelStyle} htmlFor="slug">Endereço do artigo (slug)</label>
      <input id="slug" name="slug" maxLength={180} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="como-analisar-uma-empresa" style={inputStyle} />
      <label style={labelStyle} htmlFor="category">Categoria</label>
      <input id="category" name="category" maxLength={80} required value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} />
      <label style={labelStyle} htmlFor="excerpt">Resumo para a página inicial</label>
      <textarea id="excerpt" name="excerpt" maxLength={320} required rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Uma apresentação breve do artigo." style={{ ...inputStyle, resize: "vertical" }} />

      <div style={{ marginTop: 18, padding: 16, background: "#f4f7fb", border: "1px solid #e1e6eb" }}>
        <p style={{ margin: "0 0 5px", color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>ESTRUTURA DO ARTIGO</p>
        <p style={{ margin: 0, color: "#687789", fontSize: 12, lineHeight: 1.6 }}>Monte o texto em blocos. A pré-visualização ao vivo abaixo acompanha o título, o resumo, os textos e as imagens enquanto você edita.</p>
      </div>

      <label style={labelStyle} htmlFor="coverImage">Imagem de capa (URL opcional)</label>
      <input id="coverImage" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://site.com/imagem.jpg" style={inputStyle} />
      {coverImage.trim() && <img src={coverImage} alt="Prévia da capa" style={{ display: "block", width: "100%", maxHeight: 260, objectFit: "cover", marginTop: 8, border: "1px solid #dbe2e9" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}

      <label style={labelStyle} htmlFor="intro">Introdução</label>
      <textarea id="intro" value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} maxLength={10000} placeholder="Apresente a ideia principal do artigo." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }} />

      <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
        {sections.map((section, index) => (
          <section key={section.id} style={{ padding: 16, border: "1px solid #dbe2e9", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <strong style={{ color: "#05132A", fontSize: 14 }}>Seção {index + 1}</strong>
              {sections.length > 1 && <button type="button" onClick={() => setSections((items) => items.filter((s) => s.id !== section.id))} style={{ border: 0, background: "transparent", color: "#b42318", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Remover seção</button>}
            </div>
            <label style={labelStyle} htmlFor={section.id + "-heading"}>Título da seção</label>
            <input id={section.id + "-heading"} value={section.heading} onChange={(e) => update(section.id, "heading", e.target.value)} maxLength={180} placeholder="Ex.: Como funciona na prática" style={inputStyle} />
            <label style={labelStyle} htmlFor={section.id + "-text"}>Texto</label>
            <textarea id={section.id + "-text"} value={section.text} onChange={(e) => update(section.id, "text", e.target.value)} rows={6} maxLength={15000} placeholder="Escreva aqui. Separe os parágrafos com uma linha em branco." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }} />
            <label style={labelStyle} htmlFor={section.id + "-image"}>Imagem da seção (URL opcional)</label>
            <input id={section.id + "-image"} value={section.imageUrl} onChange={(e) => update(section.id, "imageUrl", e.target.value)} placeholder="https://site.com/foto.jpg" style={inputStyle} />
            {section.imageUrl.trim() && <img src={section.imageUrl} alt={section.caption || section.heading || `Imagem da seção ${index + 1}`} style={{ display: "block", width: "100%", maxHeight: 280, objectFit: "cover", marginTop: 9, border: "1px solid #dbe2e9" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
            <label style={labelStyle} htmlFor={section.id + "-caption"}>Legenda da imagem (opcional)</label>
            <input id={section.id + "-caption"} value={section.caption} onChange={(e) => update(section.id, "caption", e.target.value)} maxLength={240} placeholder="Uma breve descrição da imagem" style={inputStyle} />
          </section>
        ))}
      </div>

      <button type="button" onClick={addSection} style={{ marginTop: 12, padding: "13px 15px", border: "1px dashed #8ea4bc", color: "#195AB4", background: "#f8fbff", cursor: "pointer", fontSize: 12, fontWeight: 800 }}>+ Adicionar seção</button>
      <input type="hidden" name="content" value={serialized} />
      {initial?.id !== undefined && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="originalSlug" value={initial?.slug ?? ""} />

      <section style={{ marginTop: 24, border: "1px solid #cbd7e4", background: "#f7f9fc", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div><p style={{ margin: "0 0 4px", color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>REVISÃO</p><h3 style={{ margin: 0, color: "#05132A", fontSize: 18 }}>Pré-visualização do artigo</h3></div>
          <button type="button" onClick={() => setShowPreview((value) => !value)} style={{ padding: "9px 12px", border: "1px solid #cbd7e4", background: "#fff", color: "#195AB4", cursor: "pointer", fontSize: 11, fontWeight: 800 }}>{showPreview ? "Ocultar prévia" : "Mostrar prévia"}</button>
        </div>
        {showPreview && <article style={{ marginTop: 16, background: "#fff", border: "1px solid #e1e6eb", padding: "clamp(16px, 3vw, 28px)", overflowWrap: "anywhere" }}>
          <p style={{ margin: "0 0 10px", color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>{category.trim() || "CATEGORIA"}</p>
          <h2 style={{ margin: "0 0 12px", color: "#05132A", fontFamily: "Georgia, serif", fontSize: "clamp(25px, 4vw, 36px)", lineHeight: 1.15 }}>{title.trim() || "Título do artigo"}</h2>
          <p style={{ margin: "0 0 22px", color: "#687789", fontSize: 15, lineHeight: 1.7 }}>{excerpt.trim() || "O resumo do artigo aparecerá aqui."}</p>
          {coverImage.trim() && <img src={coverImage} alt="" style={{ display: "block", width: "100%", maxHeight: 320, objectFit: "cover", marginBottom: 22 }} />}
          <div style={{ color: "#26384c", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-line" }}>{intro.trim() && <p style={{ margin: "0 0 22px", fontWeight: 600 }}>{intro}</p>}
            {sections.map((section, index) => <section key={section.id} style={{ marginTop: 24 }}>
              {section.heading.trim() && <h3 style={{ margin: "0 0 10px", color: "#05132A", fontFamily: "Georgia, serif", fontSize: 22, lineHeight: 1.35 }}>{section.heading}</h3>}
              {section.text.trim().split(/\n\s*\n/).map((paragraph, paragraphIndex) => paragraph.trim() && <p key={paragraphIndex} style={{ margin: "0 0 14px" }}>{paragraph.trim()}</p>)}
              {section.imageUrl.trim() && <figure style={{ margin: "16px 0" }}><img src={section.imageUrl} alt={section.caption || section.heading || `Imagem da seção ${index + 1}`} style={{ display: "block", width: "100%", maxHeight: 340, objectFit: "cover" }} />{section.caption.trim() && <figcaption style={{ marginTop: 6, color: "#7a8795", fontSize: 11 }}>{section.caption}</figcaption>}</figure>}
            </section>)}
            {!hasPreviewBody && <p style={{ color: "#7a8795", fontStyle: "italic" }}>A introdução e as seções preenchidas aparecerão nesta área.</p>}
          </div>
          <p style={{ margin: "26px 0 0", paddingTop: 14, borderTop: "1px solid #e1e6eb", color: "#8a96a3", fontSize: 10 }}>Prévia de edição — ainda não publicada.</p>
        </article>}
      </section>

      <div style={{ marginTop: 18, padding: 14, background: "#fff8e7", border: "1px solid #f0d99d", color: "#6b4c00", fontSize: 12, lineHeight: 1.7 }}>
        <strong>Publicação protegida.</strong> Salvar rascunho não publica o conteúdo. Se você estiver editando um artigo já publicado, salvar como rascunho o retirará do ar; para manter a versão atual publicada, não salve como rascunho.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 10 }}>
        <button type="submit" name="intent" value="draft" style={{ padding: "14px 16px", border: "1px solid #cbd7e4", color: "#05132A", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 800 }}>Salvar como rascunho</button>
        <button type="submit" name="intent" value="publish" onClick={(event) => { if (!window.confirm("Publicar este artigo agora? O conteúdo ficará visível no site.")) event.preventDefault(); }} style={{ padding: "14px 16px", border: 0, color: "#fff", background: "#195AB4", cursor: "pointer", fontSize: 12, fontWeight: 800 }}>Publicar artigo ↗</button>
      </div>
      <p style={{ margin: "6px 0 0", color: "#7a8795", fontSize: 11, lineHeight: 1.6 }}>O botão principal de salvamento mantém o artigo como rascunho. A publicação exige uma ação separada e confirmação.</p>
    </form>
  );
}
