import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// Busca os dados do usuário logado (simulando via ID por enquanto)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const user: any = await query({
      query: "SELECT full_name, email, phone, cpf, cep, address, address_number, city, state FROM users WHERE id = ?",
      values: [id],
    });
    return NextResponse.json(user[0]);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}

// Atualiza os dados
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, phone, cep, address, address_number } = body;

    await query({
      query: "UPDATE users SET phone = ?, cep = ?, address = ?, address_number = ? WHERE id = ?",
      values: [phone, cep, address, address_number, id],
    });

    return NextResponse.json({ message: "Perfil atualizado!" });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}