import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH /api/issues/[id] - Atualiza o status do requerimento
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validos = ["Aguardando", "Visto", "Concluido"];
    if (!validos.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    await query({
      query: "UPDATE issues SET status = ? WHERE id = ?",
      values: [status, id],
    });

    return NextResponse.json({ message: "Status atualizado" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}

// GET /api/issues/[id] - Busca um requerimento com suas fotos
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const issue: any = await query({
      query: `
        SELECT i.id, i.user_id, i.categoria, i.titulo, i.descricao, i.endereco,
               i.bairro, i.cidade, i.estado, i.status, i.created_at,
               u.full_name AS solicitante
        FROM issues i
        JOIN users u ON u.id = i.user_id
        WHERE i.id = ?
      `,
      values: [id],
    });

    if (issue.length === 0) {
      return NextResponse.json({ error: "Requerimento não encontrado" }, { status: 404 });
    }

    const fotos: any = await query({
      query: "SELECT id, url, created_at FROM issue_photos WHERE issue_id = ? ORDER BY created_at DESC",
      values: [id],
    });

    return NextResponse.json({ ...issue[0], fotos });
  } catch (error) {
    console.error("Erro ao buscar issue:", error);
    return NextResponse.json({ error: "Erro ao buscar requerimento" }, { status: 500 });
  }
}
