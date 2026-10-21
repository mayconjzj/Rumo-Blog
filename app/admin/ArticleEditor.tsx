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
  const [intro, setIntro] = useState(firstDraft.intro);
  const [coverImage, setCoverImage] = useState(firstDraft.coverImage);
  const [sections, setSections] = useState<Section[]>(firstDraft.sections);
  const serialized = JSON.stringify({ version: 1, intro, coverImage, sections });
  const update = (id: string, field: keyof Section, value: string) => setSections((items) => items.map((s) => s.id === id ? { ...s, [field]: value } : s));
  const addSection = () => setSections((items) => [...items, { id: `s${Date.now()}`, heading: "", text: "", imageUrl: "", caption: "" }]);

  return (
    <form action={action} style={{ display: "grid", gap: 5 }}>
      <label style={labelStyle} htmlFor="title">Título do artigo</label>
      <input id="title" name="title" maxLength={180} required defaultValue={initial?.title ?? ""} placeholder="Ex.: Como analisar uma empresa" style={inputStyle} />
      <label style={labelStyle} htmlFor="slug">Endereço do artigo (slug)</label>
      <input id="slug" name="slug" maxLength={180} defaultValue={initial?.slug ?? ""} placeholder="como-analisar-uma-empresa" style={inputStyle} />
      <label style={labelStyle} htmlFor="category">Categoria</label>
      <input id="category" name="category" maxLength={80} required defaultValue={initial?.category ?? "EDUCAÇÃO FINANCEIRA"} style={inputStyle} />
      <label style={labelStyle} htmlFor="excerpt">Resumo para a página inicial</label>
      <textarea id="excerpt" name="excerpt" maxLength={320} required rows={3} defaultValue={initial?.excerpt ?? ""} placeholder="Uma apresentação breve do artigo." style={{ ...inputStyle, resize: "vertical" }} />

      <div style={{ marginTop: 18, padding: 16, background: "#f4f7fb", border: "1px solid #e1e6eb" }}>
        <p style={{ margin: "0 0 5px", color: "#195AB4", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>ESTRUTURA DO ARTIGO</p>
        <p style={{ margin: 0, color: "#687789", fontSize: 12, lineHeight: 1.6 }}>Monte o texto em blocos. Cada seção pode ter título, texto e imagem. Para imagens, cole o endereço direto da imagem (URL terminada em .jpg, .png ou .webp, por exemplo).</p>
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
      <label style={labelStyle} htmlFor="status">Status do artigo</label>
      <select id="status" name="status" defaultValue={initial?.status ?? "published"} style={inputStyle}>
        <option value="published">Publicado</option>
        <option value="draft">Rascunho</option>
      </select>
      <p style={{ margin: "8px 0", color: "#7a8795", fontSize: 11, lineHeight: 1.6 }}>Você pode salvar como rascunho e publicar depois. Revise as URLs das imagens antes de salvar.</p>
      <button type="submit" style={{ padding: "14px 16px", border: 0, color: "#fff", background: "#05132A", cursor: "pointer", fontSize: 12, fontWeight: 800 }}>{submitLabel} ↗</button>
    </form>
  );
}
