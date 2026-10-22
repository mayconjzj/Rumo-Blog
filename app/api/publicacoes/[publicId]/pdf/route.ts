import { NextResponse } from "next/server";
import {
  manuscriptRepository,
  ManuscriptDatabaseNotConfiguredError,
} from "@/lib/server/manuscript-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { publicId } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(publicId)) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  try {
    const pdf = await manuscriptRepository.findPublishedPdf(publicId);
    if (!pdf) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="artigo-cientifico.pdf"',
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof ManuscriptDatabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "Serviço temporariamente indisponível" },
        { status: 503 },
      );
    }

    console.error("Failed to retrieve published manuscript PDF.", error);
    return NextResponse.json(
      { error: "Falha ao carregar PDF" },
      { status: 503 },
    );
  }
}
