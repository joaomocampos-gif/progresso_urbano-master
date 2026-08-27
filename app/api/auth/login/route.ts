import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    const users: any = await query({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    // Compara a senha digitada com a criptografada no banco
    const senhaCorreta = await bcrypt.compare(senha, users[0].password);

    if (!senhaCorreta) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

// Retorna os dados do usuário, incluindo username, foto e ROLE
    return NextResponse.json({ 
      user: { 
        id: users[0].id, 
        nome: users[0].full_name, 
        username: users[0].username, 
        email: users[0].email,
        foto: users[0].foto, 
        role: users[0].role, // Aqui ele lerá 'super_admin'
        cidade: users[0].city
      } 
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}