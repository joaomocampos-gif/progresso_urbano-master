"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";

interface Issue {
  id: string;
  user_id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  status: string;
  created_at: string;
  solicitante: string;
}

const CATEGORIAS: Record<string, string> = {
  mato_alto: "Mato Alto",
  iluminacao: "Iluminação",
  vias_publicas: "Vias Públicas",
  outros: "Outros",
};

const COR_STATUS: Record<string, string> = {
  Aguardando: "text-yellow-600",
  Visto: "text-blue-600",
  Concluido: "text-green-600",
};

export default function DashboardCidadao() {
  const [minhasIssues, setMinhasIssues] = useState<Issue[]>([]);
  const [fotos, setFotos] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const carregar = async () => {
      try {
        // Usuário logado (salvo no login)
        let userId = "";
        const stored = localStorage.getItem("user");
        if (stored) userId = JSON.parse(stored).id;

        const res = await fetch("/api/issues");
        const data: Issue[] = await res.json();

        // Filtra apenas as do usuário logado
        const minhas = data.filter(i => i.user_id === userId);
        setMinhasIssues(minhas);

        // Busca as fotos de cada requerimento
        const fotosMap: Record<string, string[]> = {};
        for (const issue of minhas) {
          const r = await fetch(`/api/issues/${issue.id}`);
          const detalhe = await r.json();
          if (detalhe.fotos?.length) {
            fotosMap[issue.id] = detalhe.fotos.map((f: any) => f.url);
          }
        }
        setFotos(fotosMap);
      } catch (e) {
        console.error("Erro ao carregar meus requerimentos");
      }
    };
    carregar();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans">
      {/* Navbar Superior */}
<nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton to="/" />
            <div className="w-8 h-8 bg-[#004587] rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-black text-[#004587] text-xl tracking-tighter italic">PROGRESSO</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-medium text-slate-500">Bem-vindo, Cidadão</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-green-400 p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-xs">CS</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Header de Boas Vindas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Transparência</h2>
            <p className="text-slate-500 font-medium">Acompanhe o andamento dos seus requerimentos.</p>
          </div>
          <Link href="/dashboard/novo-requerimento"
            className="bg-[#107038] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-green-100 hover:bg-[#0d5a2d] transition-all hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            Novo Requerimento
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Aguardando" value={minhasIssues.filter(i => i.status === "Aguardando").length} color="border-yellow-400" icon="🕒" />
          <StatCard title="Vistos" value={minhasIssues.filter(i => i.status === "Visto").length} color="border-blue-500" icon="👀" />
          <StatCard title="Concluídos" value={minhasIssues.filter(i => i.status === "Concluido").length} color="border-green-500" icon="✅" />
        </div>

        {/* Meus Requerimentos */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
            Meus Requerimentos
          </h3>

          {minhasIssues.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-bold text-slate-500">Você ainda não possui requerimentos.</p>
              <Link href="/dashboard/novo-requerimento" className="inline-block mt-4 text-[#004587] font-black hover:underline">
                Criar meu primeiro requerimento
              </Link>
            </div>
          ) : (
            minhasIssues.map(issue => (
              <div key={issue.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full uppercase">
                    {CATEGORIAS[issue.categoria] || issue.categoria}
                  </span>
                  <span className={`text-sm font-black uppercase ${COR_STATUS[issue.status] || "text-slate-500"}`}>
                    {issue.status}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2">{issue.titulo}</h4>
                <p className="text-slate-600 text-sm mb-4">{issue.descricao}</p>

                {/* Fotos enviadas pelo político/gestão */}
                {fotos[issue.id]?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-black text-slate-400 uppercase mb-2">📸 Fotos da gestão</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {fotos[issue.id].map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-32 object-cover rounded-xl border border-slate-100" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm font-bold mt-4">
                  <span className={`w-2 h-2 rounded-full ${issue.status === "Concluido" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}></span>
                  Status: {issue.status}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border-b-8 ${color} transition-transform hover:-translate-y-1`}>
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest">{title}</h3>
      <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}
