import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, cpf } = await request.json();

    if (!email || !cpf) {
      return NextResponse.json({ error: "E-mail e CPF são obrigatórios" }, { status: 400 });
    }

    // Verifica se existe um usuário com esse e-mail E CPF
    const users: any = await query({
      query: "SELECT id FROM users WHERE email = ? AND cpf = ?",
      values: [email, cpf],
    });

    if (users.length === 0) {
      return NextResponse.json({ error: "E-mail ou CPF não conferem." }, { status: 401 });
    }

    return NextResponse.json({ message: "Identidade confirmada" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao validar identidade:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
