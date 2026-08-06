import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    await query({
      query: "UPDATE users SET role = ? WHERE id = ?",
      values: [role, id],
    });

    return NextResponse.json({ message: "Cargo atualizado com sucesso" });
  } catch (error) {
    console.error("Erro na API de Alterar Cargo:", error);
    return NextResponse.json({ error: "Erro ao processar atualização" }, { status: 500 });
  }
}