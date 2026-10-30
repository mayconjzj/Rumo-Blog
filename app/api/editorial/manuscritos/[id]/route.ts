import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import {
  manuscriptRepository,
  ManuscriptDatabaseNotConfiguredError,
} from "@/lib/server/manuscript-repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id: rawId } = await params;
  const submissionId = Number(rawId);

  if (!Number.isSafeInteger(submissionId) || submissionId < 1) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const { data: session } = await auth.getSession();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Autenticação necessária" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";

  try {
    const pdf = await manuscriptRepository.findEditorialPdf(
      submissionId,
      email,
      adminEmail,
    );

    if (!pdf) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="manuscrito-${submissionId}.pdf"`,
        "Cache-Control": "private, no-store",
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

    console.error("Failed to retrieve editorial manuscript PDF.", error);
    return NextResponse.json(
      { error: "Falha ao recuperar arquivo" },
      { status: 503 },
    );
  }
}
