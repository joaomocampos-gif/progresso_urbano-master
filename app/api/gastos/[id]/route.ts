import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT /api/gastos/[id] - Atualiza um gasto
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titulo, descricao, valor, categoria, data_gasto } = body;

    if (!titulo || !valor || !data_gasto) {
      return NextResponse.json({ error: "Dados obrigatórios faltando" }, { status: 400 });
    }

    const valorNum = parseFloat(valor);
    const descVal = descricao || null;
    const catVal = categoria || "outros";

    await query({
      query: `
        UPDATE gastos SET titulo = ?, descricao = ?, valor = ?, categoria = ?, data_gasto = ?
        WHERE id = ?
      `,
      values: [titulo, descVal, valorNum, catVal, data_gasto, id],
    });

    return NextResponse.json({ message: "Gasto atualizado" });
  } catch (error) {
    console.error("Erro ao atualizar gasto:", error);
    return NextResponse.json({ error: "Erro ao atualizar gasto" }, { status: 500 });
  }
}

// DELETE /api/gastos/[id] - Exclui um gasto
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await query({
      query: "DELETE FROM gastos WHERE id = ?",
      values: [id],
    });

    return NextResponse.json({ message: "Gasto excluído" });
  } catch (error) {
    console.error("Erro ao excluir gasto:", error);
    return NextResponse.json({ error: "Erro ao excluir gasto" }, { status: 500 });
  }
}
