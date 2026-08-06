import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { userIdParaApagar, meuIdAdmin } = await request.json();

    // BUSCA NO BANCO SE QUEM ESTÁ TENTANDO APAGAR É O SUPER_ADMIN
    const verificação: any = await query({
      query: "SELECT role FROM users WHERE id = ?",
      values: [meuIdAdmin],
    });

    // SE NÃO FOR SUPER_ADMIN, BLOQUEIA NA HORA
    if (!verificação || verificação[0]?.role !== 'super_admin') {
      return NextResponse.json(
        { error: "🚫 ACESSO BLOQUEADO: Tentativa de invasão detectada." },
        { status: 403 }
      );
    }

    // SE PASSAR, EXECUTA O DELETE
    await query({
      query: "DELETE FROM users WHERE id = ?",
      values: [userIdParaApagar],
    });

    return NextResponse.json({ message: "Usuário removido com sucesso!" });

  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}


export async function GET() {
  try {
    // Buscamos os usuários para listar no painel ADM
    const usuarios = await query({
      query: "SELECT id, full_name, email, role, city, cpf FROM users ORDER BY full_name ASC",
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}
