import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, cpf, novaSenha } = await request.json();
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha apenas se e-mail e CPF baterem
    const result: any = await query({
      query: "UPDATE users SET password = ? WHERE email = ? AND cpf = ?",
      values: [senhaHash, email, cpf],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Dados incorretos" }, { status: 400 });
    }

    return NextResponse.json({ message: "Senha atualizada" });
  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}