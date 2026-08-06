import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// POST /api/issues/[id]/photos - Adiciona fotos/resposta ao requerimento
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Nenhuma foto fornecida" }, { status: 400 });
    }

    // Verifica se o requerimento existe
    const existe: any = await query({
      query: "SELECT id FROM issues WHERE id = ?",
      values: [id],
    });

    if (existe.length === 0) {
      return NextResponse.json({ error: "Requerimento não encontrado" }, { status: 404 });
    }

    // Insere cada foto
    for (const url of urls) {
      await query({
        query: "INSERT INTO issue_photos (id, issue_id, url) VALUES (?, ?, ?)",
        values: [uuidv4(), id, url],
      });
    }

    return NextResponse.json({ message: "Fotos enviadas com sucesso" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao enviar fotos:", error);
    return NextResponse.json({ error: "Erro ao enviar fotos" }, { status: 500 });
  }
}
