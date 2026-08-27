import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, categoria, titulo, descricao, endereco, bairro, cidade, estado, foto } = body;

    // 1. Campos obrigatórios básicos
    if (!user_id || !categoria || !titulo) {
      return NextResponse.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
    }

    if (!endereco || !bairro || !cidade || !estado) {
      return NextResponse.json({ error: "Localização completa é obrigatória." }, { status: 400 });
    }

    // 2. Validação do formato do Bairro e Cidade (Apenas letras e caracteres válidos)
    const regexTexto = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
    if (!regexTexto.test(bairro.trim())) {
      return NextResponse.json({ error: "Bairro inválido. Insira apenas letras." }, { status: 400 });
    }
    if (!regexTexto.test(cidade.trim())) {
      return NextResponse.json({ error: "Cidade inválida. Insira apenas letras." }, { status: 400 });
    }

    // 3. Validação de UF (Apenas 2 letras da sigla do Estado)
    const regexUF = /^[a-zA-Z]{2}$/;
    if (!regexUF.test(estado.trim())) {
      return NextResponse.json({ error: "UF inválida. Use a sigla do estado (Ex: SP, RJ)." }, { status: 400 });
    }

    // 4. Validação da Foto (PNG ou JPG)
    if (foto && !foto.startsWith("data:image/png") && !foto.startsWith("data:image/jpeg") && !foto.startsWith("data:image/jpg")) {
      return NextResponse.json({ error: "Formato de foto inválido. Envie apenas imagens PNG ou JPG." }, { status: 400 });
    }

    // 5. Validação Real da Localização (Geocoding via OpenStreetMap)
    const queryEndereco = encodeURIComponent(`${endereco}, ${bairro}, ${cidade}, ${estado}, Brasil`);
    const responseGeo = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${queryEndereco}&limit=1`,
      {
        headers: {
          "User-Agent": "ProgressoApp/1.0"
        }
      }
    );
    const geoData = await responseGeo.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json(
        { error: "Endereço não localizado! Verifique se a Rua, Bairro, Cidade e UF existem realmente." },
        { status: 400 }
      );
    }

    // Salva no Banco se tudo estiver correto
    const id = uuidv4();
    await query({
      query: `
        INSERT INTO issues (id, user_id, categoria, titulo, descricao, endereco, bairro, cidade, estado, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aguardando')
      `,
      values: [id, user_id, categoria, titulo, descricao, endereco, bairro, cidade, estado],
    });

    return NextResponse.json({ message: "Requerimento criado com sucesso!", id }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar issue:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao cadastrar." }, { status: 500 });
  }
}