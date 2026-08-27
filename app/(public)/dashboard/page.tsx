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
  mato_alto: "Mato Alto",
  iluminacao: "Iluminação",
  vias_publicas: "Vias Públicas",
  outros: "Outros",
};

const COR_STATUS: Record<string, { bg: string; text: string; dot: string }> = {
  Aguardando: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500 animate-pulse" },
  Visto: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  Concluido: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const CATEGORIA_COR: Record<string, string> = {
  geral: "bg-slate-100 text-slate-700 border-slate-200",
  obras: "bg-blue-50 text-blue-700 border-blue-200",
  saude: "bg-rose-50 text-rose-700 border-rose-200",
  educacao: "bg-amber-50 text-amber-700 border-amber-200",
  seguranca: "bg-emerald-50 text-emerald-700 border-emerald-200",
  infraestrutura: "bg-purple-50 text-purple-700 border-purple-200",
  eventos: "bg-orange-50 text-orange-700 border-orange-200",
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Navbar Superior */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton to="/" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#004587] rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-blue-900/10">
                P
              </div>
              <span className="font-black text-[#004587] text-xl tracking-tight italic">
                PROGRESSO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-sm font-medium text-slate-500">
              Olá, <strong className="font-black text-[#004587]">{userInfo?.nome || "Cidadão"}</strong>
            </span>
            <Link
              href="/perfil"
              className="flex items-center gap-2 transition hover:opacity-90 active:scale-95"
              title="Meu Perfil"
            >
              {userInfo?.foto ? (
                <img
                  src={userInfo.foto}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#004587]/20 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#004587] to-emerald-500 p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-[#004587] text-sm">
                    {(userInfo?.nome || "?").charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-12">
        {/* Header de Boas-Vindas */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#004587] border border-blue-100 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004587]"></span> Área Cidadã
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Painel de Transparência
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base mt-1">
              Acompanhe suas solicitações e verifique a prestação de contas do seu município.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link
              href="/dashboard/novo-requerimento"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-[#107038] hover:bg-[#0d5a2d] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 active:scale-98 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Novo Requerimento
            </Link>
            <Link
              href="/gastos"
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-[#004587] hover:bg-[#003566] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-98 transition-all"
            >
              <span>💰</span> Gastos Públicos
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <StatCard
            title="Aguardando"
            value={minhasIssues.filter(i => i.status === "Aguardando").length}
            badgeColor="bg-amber-100 text-amber-800"
            borderAccent="bg-amber-400"
            icon="🕒"
          />
          <StatCard
            title="Em Análise (Vistos)"
            value={minhasIssues.filter(i => i.status === "Visto").length}
            badgeColor="bg-blue-100 text-blue-800"
            borderAccent="bg-blue-500"
            icon="👀"
          />
          <StatCard
            title="Concluídos"
            value={minhasIssues.filter(i => i.status === "Concluido").length}
            badgeColor="bg-emerald-100 text-emerald-800"
            borderAccent="bg-emerald-500"
            icon="✅"
          />
        </div>

        {/* Meus Requerimentos */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#004587] rounded-full"></span>
              Meus Requerimentos
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {minhasIssues.length} {minhasIssues.length === 1 ? "Registro" : "Registros"}
            </span>
          </div>

          {minhasIssues.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-100 text-3xl flex items-center justify-center rounded-2xl mx-auto mb-4">
                📋
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Nenhum requerimento aberto</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                Sua lista de solicitações está vazia no momento.
              </p>
              <Link
                href="/dashboard/novo-requerimento"
                className="inline-flex items-center gap-2 mt-5 text-[#004587] font-extrabold text-sm hover:underline"
              >
                <span>+</span> Criar meu primeiro requerimento
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {minhasIssues.map(issue => {
                const statusStyle = COR_STATUS[issue.status] || {
                  bg: "bg-slate-50 border-slate-200",
                  text: "text-slate-600",
                  dot: "bg-slate-400",
                };

                return (
                  <div
                    key={issue.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200/60 uppercase tracking-wide">
                        {CATEGORIAS[issue.categoria] || issue.categoria}
                      </span>

                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                        {issue.status}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-[#004587] transition-colors mb-2">
                      {issue.titulo}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{issue.descricao}</p>

                    {/* Fotos enviadas pela gestão */}
                    {fotos[issue.id]?.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <span>📸</span> Anexos da Gestão Pública
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {fotos[issue.id].map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block overflow-hidden rounded-2xl border border-slate-200 hover:border-[#004587] transition-all group/img"
                            >
                              <img
                                src={url}
                                alt={`Anexo ${idx + 1}`}
                                className="w-full h-28 object-cover group-hover/img:scale-105 transition-transform duration-300"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mt-4 pt-3 border-t border-slate-50">
                      <span>ID: #{issue.id.slice(0, 8)}</span>
                      <span>
                        {issue.created_at
                          ? new Date(issue.created_at).toLocaleDateString("pt-BR")
                          : "Data não informada"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Notícias da Cidade */}
        <section className="mt-16 pt-10 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                📰 Comunicados Oficiais
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Notícias da sua Cidade
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                Fique atualizado sobre serviços, obras e novidades do município.
              </p>
            </div>
          </div>

          {noticias.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
              <div className="text-5xl mb-3">🗞️</div>
              <h3 className="font-extrabold text-slate-700 text-base">Nenhuma notícia disponível</h3>
              <p className="text-slate-400 text-sm mt-1">
                A gestão pública publicará novos informativos neste espaço em breve.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map(n => (
                <article
                  key={n.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                        CATEGORIA_COR[n.categoria] || CATEGORIA_COR.geral
                      }`}
                    >
                      {n.categoria}
                    </span>

                    <h3 className="text-lg font-black text-[#004587] mt-3 mb-2 leading-snug">
                      {n.titulo}
                    </h3>

                    <p className="text-slate-600 text-sm font-normal leading-relaxed line-clamp-4 mb-4">
                      {n.conteudo}
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 font-bold pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="truncate max-w-[150px]">{n.autor || "Gestor Público"}</span>
                    <span>
                      {n.created_at ? new Date(n.created_at).toLocaleDateString("pt-BR") : ""}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  badgeColor,
  borderAccent,
  icon,
}: {
  title: string;
  value: number;
  badgeColor: string;
  borderAccent: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${borderAccent}`}></div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeColor}`}>
          Status
        </span>
      </div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-2">{title}</h3>
      <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}