import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/gastos - Lista todos os gastos públicos
export async function GET() {
  try {
    const gastos: any = await query({
      query: `
        SELECT g.id, g.titulo, g.descricao, g.valor, g.categoria, g.data_gasto,
               u.full_name AS registrado_por
        FROM gastos g
        LEFT JOIN users u ON u.id = g.registrado_por
        ORDER BY g.data_gasto DESC
      `,
    });

    return NextResponse.json(gastos);
  } catch (error) {
    console.error("Erro ao listar gastos:", error);
    return NextResponse.json({ error: "Erro ao buscar gastos" }, { status: 500 });
  }
}

// POST /api/gastos - Cria um novo gasto (apenas políticos/admins)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, descricao, valor, categoria, data_gasto, registrado_por } = body;

    if (!titulo || !valor || !data_gasto) {
      return NextResponse.json({ error: "Dados obrigatórios faltando" }, { status: 400 });
    }

    const id = uuidv4();
    const valorNum = parseFloat(valor);
    const descVal = descricao || null;
    const catVal = categoria || "outros";
    const regPor = registrado_por || null;

    await query({
      query: `
        INSERT INTO gastos (id, titulo, descricao, valor, categoria, data_gasto, registrado_por)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      values: [id, titulo, descVal, valorNum, catVal, data_gasto, regPor],
    });

    return NextResponse.json({ message: "Gasto registrado", id }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar gasto:", error);
    return NextResponse.json({ error: "Erro ao criar gasto" }, { status: 500 });
  }
}
