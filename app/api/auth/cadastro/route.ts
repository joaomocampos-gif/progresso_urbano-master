import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, cpf, telefone, cep, endereco, cidade, estado, numero } = body;

    // 1. Validação mínima
    if (!email || !senha || !cpf) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    // 2. Criptografar a senha
    const id = uuidv4();
    const senhaHash = await bcrypt.hash(senha, 10);

    // 3. Salvar no banco (Note que usamos 'password' e 'address_number' conforme o ajuste do HeidiSQL)
    await query({
      query: `
        INSERT INTO users (
          id, email, cpf, password, full_name, phone, 
          cep, address, city, state, address_number, role
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'citizen')
      `,
      values: [id, email, cpf, senhaHash, nome, telefone, cep, endereco, cidade, estado, numero],
    });

    return NextResponse.json({ message: "Sucesso" }, { status: 201 });

  } catch (error: any) {
    console.error("ERRO NO BANCO:", error);
    if (error.message.includes("Duplicate entry")) {
      return NextResponse.json({ error: "Este E-mail ou CPF já está cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno no servidor de dados." }, { status: 500 });
  }
}