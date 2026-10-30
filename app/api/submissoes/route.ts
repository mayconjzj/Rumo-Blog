import { NextResponse } from "next/server";
import { getCommunityAccess } from "@/lib/server/community-access";
import {
  createSubmission,
  SubmissionDatabaseNotConfiguredError,
} from "@/lib/server/submission-repository";
import { validateSubmissionForm } from "@/lib/server/submission-validation";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  try {
    const access = await getCommunityAccess();

    if (access.status === "anonymous") {
      return NextResponse.json(
        {
          error: "Entre na sua conta para submeter um artigo.",
          loginUrl: "/login?returnTo=%2Fsubmeter",
        },
        { status: 401, headers: NO_STORE_HEADERS },
      );
    }

    if (access.status === "disabled") {
      return NextResponse.json(
        {
          error:
            "Seu perfil comunitário está desativado. Entre em contato com a equipe editorial.",
        },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const validation = await validateSubmissionForm(await request.formData());
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }

    const publicId = await createSubmission(validation.value);
    if (!publicId) {
      return NextResponse.json(
        { error: "Não foi possível registrar a submissão." },
        { status: 500, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(
      { publicId },
      { status: 201, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    if (error instanceof SubmissionDatabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "O banco de dados ainda não está configurado." },
        { status: 503, headers: NO_STORE_HEADERS },
      );
    }

    console.error("Falha ao registrar submissão científica", error);
    return NextResponse.json(
      {
        error:
          "Falha ao salvar a submissão. Confirme que as migrações SQL foram aplicadas e tente novamente.",
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}
