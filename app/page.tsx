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

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  created_at: string;
  autor: string;
}

const CATEGORIAS: Record<string, string> = {
  mato_alto: "🌱 Mato Alto",
  iluminacao: "💡 Iluminação",
  vias_publicas: "🕳️ Vias Públicas",
  outros: "📦 Outros",
};

const COR_STATUS: Record<string, string> = {
  Aguardando: "text-amber-600 bg-amber-50 border-amber-200",
  Visto: "text-[#004587] bg-blue-50 border-blue-200",
  Concluido: "text-[#107038] bg-green-50 border-green-200",
};

const CATEGORIA_COR: Record<string, string> = {
  geral: "bg-slate-100 text-slate-600",
  obras: "bg-blue-50 text-[#004587]",
  saude: "bg-red-50 text-red-600",
  educacao: "bg-amber-50 text-amber-600",
  seguranca: "bg-green-50 text-[#107038]",
  infraestrutura: "bg-purple-50 text-purple-600",
  eventos: "bg-orange-50 text-orange-600",
};

export default function DashboardCidadao() {
  const [minhasIssues, setMinhasIssues] = useState<Issue[]>([]);
  const [fotos, setFotos] = useState<Record<string, string[]>>({});
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUserInfo(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const carregarNoticias = () => {
      fetch("/api/noticias")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNoticias(data);
        })
        .catch(() => {});
    };

    const carregar = async () => {
      try {
        let userId = "";
        const stored = localStorage.getItem("user");
        if (stored) userId = JSON.parse(stored).id;

        const res = await fetch("/api/issues");
        const data: Issue[] = await res.json();

        const minhas = data.filter(i => i.user_id === userId);
        setMinhasIssues(minhas);

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
    carregarNoticias();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton to="/" />
            <div className="w-8 h-8 bg-[#004587] rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-black text-[#004587] text-xl tracking-tighter italic">
              PROGRESSO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-medium text-slate-500">
              Bem-vindo, <span className="font-black text-[#004587]">{userInfo?.nome || "Cidadão"}</span>
            </span>
            <Link href="/perfil" className="flex items-center gap-2 hover:scale-105 transition" title="Meu Perfil">
              {userInfo?.foto ? (
                <img
                  src={userInfo.foto}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#004587]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-green-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-xs">
                    {(userInfo?.nome || "?").charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        {/* Card Header de Boas Vindas no Estilo da Primeira Tela */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-[#004587] p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 inline-block mb-3">
                🏛️ Painel do Cidadão
              </span>
              <h2 className="text-3xl font-black tracking-tight">Painel de Transparência</h2>
              <p className="text-blue-100 font-medium text-sm mt-1">
                Acompanhe o andamento dos seus requerimentos e a gestão do município.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/dashboard/novo-requerimento"
                className="bg-[#107038] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-[#0d5a2d] transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                Novo Requerimento
              </Link>
              <Link
                href="/gastos"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                💰 Gastos Públicos
              </Link>
            </div>
          </div>
        </div>

        {/* Estatísticas com Bordas e Ícones Originais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Aguardando"
            value={minhasIssues.filter(i => i.status === "Aguardando").length}
            borderColor="border-amber-400"
            icon="🕒"
          />
          <StatCard
            title="Vistos"
            value={minhasIssues.filter(i => i.status === "Visto").length}
            borderColor="border-[#004587]"
            icon="👀"
          />
          <StatCard
            title="Concluídos"
            value={minhasIssues.filter(i => i.status === "Concluido").length}
            borderColor="border-[#107038]"
            icon="✅"
          />
        </div>

        {/* Meus Requerimentos */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
          <div className="pt-2 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-6 bg-[#004587] rounded-full"></span>
              Meus Requerimentos
            </h3>
          </div>

          {minhasIssues.length === 0 ? (
            <div className="p-10 rounded-2xl border-2 border-dashed border-slate-200 bg-[#F0F2F5]/50 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="font-bold text-slate-500">Você ainda não possui requerimentos cadastrados.</p>
              <Link
                href="/dashboard/novo-requerimento"
                className="inline-block mt-4 text-[#004587] font-black hover:underline"
              >
                Clique aqui para registrar a primeira ocorrência
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {minhasIssues.map(issue => (
                <div
                  key={issue.id}
                  className="p-6 bg-[#F0F2F5]/60 border border-slate-200/80 rounded-2xl transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-xl uppercase tracking-wider">
                      {CATEGORIAS[issue.categoria] || issue.categoria}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-black uppercase rounded-xl border ${
                        COR_STATUS[issue.status] || "text-slate-500 border-slate-200"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-lg mb-1">{issue.titulo}</h4>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">{issue.descricao}</p>

                  {/* Fotos enviadas pela gestão */}
                  {fotos[issue.id]?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                        📸 Retorno da Gestão Pública
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {fotos[issue.id].map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noreferrer">
                            <img
                              src={url}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-28 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-4 pt-3 border-t border-slate-200/40">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        issue.status === "Concluido" ? "bg-[#107038]" : "bg-amber-500 animate-pulse"
                      }`}
                    ></span>
                    Status Atual: <span className="text-slate-700 uppercase">{issue.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notícias da Cidade */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
          <div className="mb-6 pt-2 border-b border-slate-100 pb-4">
            <span className="bg-emerald-50 text-[#107038] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 inline-block mb-2">
              📰 Fique por dentro
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notícias da sua Cidade</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Acompanhe as novidades e ações publicadas pelos gestores públicos.
            </p>
          </div>

          {noticias.length === 0 ? (
            <div className="p-10 rounded-2xl border-2 border-dashed border-slate-200 bg-[#F0F2F5]/50 text-center">
              <div className="text-5xl mb-3">🗞️</div>
              <p className="font-black text-slate-400">Nenhuma notícia publicada ainda.</p>
              <p className="text-xs text-slate-500 mt-1">Em breve novos comunicados serão exibidos aqui.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map(n => (
                <article
                  key={n.id}
                  className="bg-[#F0F2F5]/40 border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        CATEGORIA_COR[n.categoria] || CATEGORIA_COR.geral
                      }`}
                    >
                      {n.categoria}
                    </span>
                    <h4 className="text-base font-black text-[#004587] mt-3 mb-2 leading-snug">{n.titulo}</h4>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm line-clamp-4">{n.conteudo}</p>
                  </div>
                  <p className="text-xs text-slate-400 font-bold mt-4 pt-3 border-t border-slate-200/50">
                    Por {n.autor || "Gestor Público"} •{" "}
                    {n.created_at ? new Date(n.created_at).toLocaleDateString("pt-BR") : ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, borderColor, icon }: { title: string; value: number; borderColor: string; icon: string }) {
  return (
    <div className={`bg-white p-6 rounded-[2rem] border-l-8 ${borderColor} shadow-xl shadow-slate-200/50 border border-slate-100 transition-transform hover:-translate-y-1`}>
      <div className="text-2xl mb-1">{icon}</div>
      <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</h3>
      <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}