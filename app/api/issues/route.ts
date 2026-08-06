import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/issues - Lista todos os requerimentos com o nome do usuário
export async function GET() {
  try {
    const issues: any = await query({
      query: `
        SELECT i.id, i.user_id, i.categoria, i.titulo, i.descricao, i.endereco,
               i.bairro, i.cidade, i.estado, i.status, i.created_at,
               u.full_name AS solicitante
        FROM issues i
        JOIN users u ON u.id = i.user_id
        ORDER BY i.created_at DESC
      `,
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Erro ao listar issues:", error);
    return NextResponse.json({ error: "Erro ao buscar requerimentos" }, { status: 500 });
  }
}

// POST /api/issues - Cria um novo requerimento
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, categoria, titulo, descricao, endereco, bairro, cidade, estado } = body;

    if (!user_id || !categoria || !titulo) {
      return NextResponse.json({ error: "Dados obrigatórios faltando" }, { status: 400 });
    }

    const id = uuidv4();

    // Garante que campos opcionais fiquem como NULL (não undefined) no banco
    const descVal = descricao || null;
    const endVal = endereco || null;
    const bairroVal = bairro || null;
    const cidadeVal = cidade || null;
    const estadoVal = estado || null;

    await query({
      query: `
        INSERT INTO issues (id, user_id, categoria, titulo, descricao, endereco, bairro, cidade, estado, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aguardando')
      `,
      values: [id, user_id, categoria, titulo, descVal, endVal, bairroVal, cidadeVal, estadoVal],
    });

    return NextResponse.json({ message: "Requerimento criado", id }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar issue:", error);
    return NextResponse.json({ error: "Erro ao criar requerimento" }, { status: 500 });
  }
}
