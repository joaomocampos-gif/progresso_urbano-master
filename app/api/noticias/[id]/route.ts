import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT /api/noticias/[id] - Atualiza uma notícia
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titulo, conteudo, categoria } = body;

    if (!titulo || !conteudo) {
      return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
    }

    const catVal = categoria || "geral";

    await query({
      query: "UPDATE noticias SET titulo = ?, conteudo = ?, categoria = ? WHERE id = ?",
      values: [titulo, conteudo, catVal, id],
    });

    return NextResponse.json({ message: "Notícia atualizada" });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    return NextResponse.json({ error: "Erro ao atualizar notícia" }, { status: 500 });
  }
}

// DELETE /api/noticias/[id] - Exclui uma notícia
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await query({
      query: "DELETE FROM noticias WHERE id = ?",
      values: [id],
    });

    return NextResponse.json({ message: "Notícia excluída" });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json({ error: "Erro ao excluir notícia" }, { status: 500 });
  }
}
