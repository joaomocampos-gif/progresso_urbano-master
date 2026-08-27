import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/noticias - Lista todas as notícias (públicas na landing page)
export async function GET() {
  try {
    const noticias: any = await query({
      query: `
        SELECT n.id, n.titulo, n.conteudo, n.categoria, n.created_at,
               u.full_name AS autor
        FROM noticias n
        LEFT JOIN users u ON u.id = n.autor_id
        ORDER BY n.created_at DESC
      `,
    });

    return NextResponse.json(noticias);
  } catch (error) {
    console.error("Erro ao listar notícias:", error);
    return NextResponse.json({ error: "Erro ao buscar notícias" }, { status: 500 });
  }
}

// POST /api/noticias - Cria uma nova notícia (apenas políticos/admins)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, conteudo, categoria, autor_id } = body;

    if (!titulo || !conteudo) {
      return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
    }

    const id = uuidv4();
    const catVal = categoria || "geral";
    const autor = autor_id || null;

    await query({
      query: `
        INSERT INTO noticias (id, titulo, conteudo, categoria, autor_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [id, titulo, conteudo, catVal, autor],
    });

    return NextResponse.json({ message: "Notícia publicada", id }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar notícia:", error);
    return NextResponse.json({ error: "Erro ao criar notícia" }, { status: 500 });
  }
}
