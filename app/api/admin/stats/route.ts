import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Conta o total de casos
    const total: any = await query({ query: "SELECT COUNT(*) as count FROM issues" });
    // Conta apenas os resolvidos
    const resolvidos: any = await query({ query: "SELECT COUNT(*) as count FROM issues WHERE status = 'Resolvido'" });
    // Conta os em aberto
    const abertos: any = await query({ query: "SELECT COUNT(*) as count FROM issues WHERE status = 'Aberto'" });

    const totalCount = total[0].count;
    const resolvidosCount = resolvidos[0].count;
    const porcentagem = totalCount > 0 ? Math.round((resolvidosCount / totalCount) * 100) : 0;

    return NextResponse.json({
      total: totalCount,
      resolvidos: resolvidosCount,
      abertos: abertos[0].count,
      porcentagem: porcentagem
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar stats" }, { status: 500 });
  }
}