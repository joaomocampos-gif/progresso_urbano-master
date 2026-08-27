import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total de requerimentos
    const total: any = await query({ query: "SELECT COUNT(*) as count FROM issues" });
    // Concluídos
    const resolvidos: any = await query({ query: "SELECT COUNT(*) as count FROM issues WHERE status = 'Concluido'" });
    // Em aguardando
    const aguardando: any = await query({ query: "SELECT COUNT(*) as count FROM issues WHERE status = 'Aguardando'" });
    // Em visto
    const visto: any = await query({ query: "SELECT COUNT(*) as count FROM issues WHERE status = 'Visto'" });
    // Total de cidadãos (usuários)
    const cidadaos: any = await query({ query: "SELECT COUNT(*) as count FROM users" });
    // Total de gastos registrados
    const gastos: any = await query({ query: "SELECT COUNT(*) as count FROM gastos" });

    const totalCount = total[0].count;
    const resolvidosCount = resolvidos[0].count;
    const porcentagem = totalCount > 0 ? Math.round((resolvidosCount / totalCount) * 100) : 0;

    return NextResponse.json({
      total: totalCount,
      resolvidos: resolvidosCount,
      aguardando: aguardando[0].count,
      visto: visto[0].count,
      porcentagem: porcentagem,
      cidadaos: cidadaos[0].count,
      totalGastos: gastos[0].count,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar stats" }, { status: 500 });
  }
}
