import "server-only";

export type SubmissionAuthor = {
  name: string;
  affiliation: string;
  author_order: number;
  is_corresponding: boolean;
};

export type NewSubmission = {
  title: string;
  abstract: string;
  manuscriptType: string;
  scientificArea: string;
  keywords: string[];
  references: string;
  correspondingEmail: string;
  ethicsStatement: string;
  fundingStatement: string;
  conflictStatement: string;
  aiStatement: string;
  pdfBase64: string;
  fileName: string;
  authors: SubmissionAuthor[];
};

export type SubmissionValidationResult =
  | { ok: true; value: NewSubmission }
  | { ok: false; message: string };

const MAX_PDF_BYTES = 4 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_MANUSCRIPT_TYPES = new Set([
  "research_article",
  "review",
  "case_study",
  "methodology",
  "short_communication",
]);

const ALLOWED_SCIENTIFIC_AREAS = new Set([
  "Ciências Exatas e da Terra",
  "Ciências Biológicas",
  "Engenharias",
  "Ciências da Saúde",
  "Ciências Agrárias",
  "Ciências Sociais Aplicadas",
  "Ciências Humanas",
  "Linguística, Letras e Artes",
  "Multidisciplinar",
]);

function readText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseAuthors(raw: string): SubmissionAuthor[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const authors = parsed
      .filter(
        (author): author is { name: string; affiliation?: unknown } =>
          Boolean(author) &&
          typeof author === "object" &&
          typeof author.name === "string" &&
          author.name.trim().length > 0,
      )
      .slice(0, 20)
      .map((author, index) => ({
        name: author.name.trim().slice(0, 200),
        affiliation: String(author.affiliation ?? "").trim().slice(0, 300),
        author_order: index + 1,
        is_corresponding: index === 0,
      }));

    return authors.length > 0 ? authors : null;
  } catch {
    return null;
  }
}

export async function validateSubmissionForm(
  data: FormData,
): Promise<SubmissionValidationResult> {
  if (readText(data, "website")) {
    return { ok: false, message: "Não foi possível validar o envio." };
  }

  if (!data.get("confirmOriginal")) {
    return {
      ok: false,
      message: "Confirme a declaração de autoria.",
    };
  }

  const title = readText(data, "title");
  const abstract = readText(data, "abstract");
  const scientificArea = readText(data, "scientificArea");
  const manuscriptType = readText(data, "manuscriptType") || "research_article";
  const correspondingEmail = readText(data, "correspondingEmail").toLowerCase();
  const keywords = readText(data, "keywords")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 20);

  const references = readText(data, "references").slice(0, 30_000);
  const ethicsStatement = readText(data, "ethicsStatement").slice(0, 5_000);
  const fundingStatement = readText(data, "fundingStatement").slice(0, 2_000);
  const conflictStatement = readText(data, "conflictStatement").slice(0, 3_000);
  const aiStatement = readText(data, "aiStatement").slice(0, 3_000);

  const validMetadata =
    title.length >= 5 &&
    title.length <= 300 &&
    abstract.length >= 20 &&
    abstract.length <= 10_000 &&
    ALLOWED_SCIENTIFIC_AREAS.has(scientificArea) &&
    ALLOWED_MANUSCRIPT_TYPES.has(manuscriptType) &&
    EMAIL_PATTERN.test(correspondingEmail) &&
    correspondingEmail.length <= 254 &&
    conflictStatement.length >= 3;

  if (!validMetadata) {
    return {
      ok: false,
      message:
        "Confira título, resumo, área, tipo, e-mail e declaração de conflito de interesses.",
    };
  }

  const file = data.get("manuscript");
  if (
    !(file instanceof File) ||
    file.size < 10 ||
    file.size > MAX_PDF_BYTES ||
    (file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf"))
  ) {
    return {
      ok: false,
      message: "Envie um PDF válido de até 4 MB.",
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return {
      ok: false,
      message: "O arquivo enviado não parece ser um PDF válido.",
    };
  }

  const authors = parseAuthors(readText(data, "authors"));
  if (!authors) {
    return { ok: false, message: "Informe ao menos um autor válido." };
  }

  return {
    ok: true,
    value: {
      title,
      abstract,
      manuscriptType,
      scientificArea,
      keywords,
      references,
      correspondingEmail,
      ethicsStatement,
      fundingStatement,
      conflictStatement,
      aiStatement,
      pdfBase64: bytes.toString("base64"),
      fileName: file.name.slice(0, 255),
      authors,
    },
  };
}
