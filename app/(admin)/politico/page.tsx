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
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
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

const STATUS_OPCOES = [
  { valor: "Aguardando", cor: "bg-yellow-100 text-yellow-700" },
  { valor: "Visto", cor: "bg-blue-100 text-blue-700" },
  { valor: "Concluido", cor: "bg-green-100 text-green-700" },
];

export default function PainelPolitico() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");
  const [foto, setFoto] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState<Record<string, boolean>>({});
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [showNoticiaForm, setShowNoticiaForm] = useState(false);
  const [noticiaForm, setNoticiaForm] = useState({ titulo: "", conteudo: "", categoria: "geral" });
  const [publicandoNoticia, setPublicandoNoticia] = useState(false);

  const carregarIssues = async () => {
    try {
      const res = await fetch("/api/issues");
      const data = await res.json();
      setIssues(data);
    } catch (e) {
      console.error("Erro ao carregar requerimentos");
    } finally {
      setLoading(false);
    }
  };

  const carregarNoticias = async () => {
    try {
      const res = await fetch("/api/noticias");
      const data = await res.json();
      setNoticias(data);
    } catch (e) {
      console.error("Erro ao carregar notícias");
    }
  };

  useEffect(() => {
    carregarIssues();
    carregarNoticias();
  }, []);

  const publicarNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublicandoNoticia(true);
    try {
      const stored = localStorage.getItem("user");
      const autor_id = stored ? JSON.parse(stored).id : null;

      const res = await fetch("/api/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...noticiaForm, autor_id }),
      });

      if (res.ok) {
        alert("Notícia publicada com sucesso!");
        setNoticiaForm({ titulo: "", conteudo: "", categoria: "geral" });
        setShowNoticiaForm(false);
        carregarNoticias();
      } else {
        alert("Erro ao publicar notícia.");
      }
    } catch (e) {
      console.error("Erro ao publicar notícia");
    } finally {
      setPublicandoNoticia(false);
    }
  };

  const excluirNoticia = async (id: string) => {
    if (!confirm("Excluir esta notícia?")) return;
    try {
      const res = await fetch(`/api/noticias/${id}`, { method: "DELETE" });
      if (res.ok) carregarNoticias();
    } catch (e) {
      console.error("Erro ao excluir notícia");
    }
  };

  const alterarStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      } else {
        alert("Erro ao atualizar status.");
      }
    } catch (e) {
      console.error("Erro ao atualizar status");
    }
  };

  const enviarFoto = async (id: string) => {
    const url = foto[id]?.trim();
    if (!url) {
      alert("Informe a URL da foto antes de enviar.");
      return;
    }

    setEnviando(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/issues/${id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url] }),
      });

      if (res.ok) {
        alert("Foto enviada! O cliente poderá visualizá-la.");
        setFoto(prev => ({ ...prev, [id]: "" }));
      } else {
        alert("Erro ao enviar foto.");
      }
    } catch (e) {
      console.error("Erro ao enviar foto");
    } finally {
      setEnviando(prev => ({ ...prev, [id]: false }));
    }
  };

  const issuesFiltradas = filtro === "Todos"
    ? issues
    : issues.filter(i => i.status === filtro);

  const corStatus = (status: string) => {
    const op = STATUS_OPCOES.find(o => o.valor === status);
    return op ? op.cor : "bg-slate-100 text-slate-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-[#004587]">
        Carregando demandas da população...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Estilo Gabinete */}
<nav className="bg-[#004587] p-4 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <BackButton to="/dashboard" />
          <div className="bg-yellow-400 text-blue-900 font-black p-2 rounded">PU</div>
          <h1 className="font-bold tracking-tighter">GABINETE DIGITAL</h1>
        </div>
<span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">Versão Legislativa 1.0</span>
        <div className="flex items-center gap-3">
          <Link href="/gastos" className="text-xs bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-black hover:bg-yellow-300 transition">
            💰 Transparência de Gastos
          </Link>
          <Link href="/perfil" className="text-xs bg-white/20 text-white px-4 py-2 rounded-full font-black hover:bg-white/30 transition">
            👤 Meu Perfil
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
<div className="mb-10">
          <h2 className="text-3xl font-black text-[#004587]">Demandas da População</h2>
          <p className="text-slate-500 font-medium">Gestão de melhorias e obras públicas.</p>
        </div>

        {/* Estatísticas dinâmicas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#004587] p-6 rounded-[2rem] text-white shadow-xl shadow-blue-200">
            <p className="text-[10px] font-black opacity-60 uppercase">Total de Demandas</p>
            <p className="text-4xl font-black italic">{issues.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase italic">Aguardando</p>
            <p className="text-4xl font-black text-yellow-500 italic">{issues.filter(i => i.status === "Aguardando").length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase italic">Em Análise</p>
            <p className="text-4xl font-black text-blue-600 italic">{issues.filter(i => i.status === "Visto").length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase italic">Concluídos</p>
            <p className="text-4xl font-black text-green-600 italic">{issues.filter(i => i.status === "Concluido").length}</p>
          </div>
        </div>

        {/* Filtros de Região */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase">Status da Obra</label>
            <select
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="w-full font-bold text-sm outline-none"
            >
              <option>Todos</option>
              <option>Aguardando</option>
              <option>Visto</option>
              <option>Concluido</option>
            </select>
          </div>
        </div>

        {/* Lista de Problemas reais do banco */}
        <div className="space-y-4">
          {issuesFiltradas.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-black text-slate-400">Nenhuma demanda encontrada.</p>
            </div>
          ) : (
            issuesFiltradas.map(issue => (
              <div key={issue.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">🚧</div>
                    <div>
                      <h4 className="font-black text-lg">{issue.titulo}</h4>
<p className="text-sm text-slate-500 italic">{CATEGORIAS[issue.categoria] || issue.categoria}</p>
                      {/* Localização completa do problema */}
                      <p className="text-sm font-bold text-[#004587] mt-1">
                        📍 {issue.endereco || ""}{issue.endereco && issue.bairro ? ", " : ""}{issue.bairro || ""}
                        {issue.cidade ? ` - ${issue.cidade}` : ""}{issue.estado ? `/${issue.estado}` : ""}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Solicitado por: <span className="font-bold text-[#004587]">{issue.solicitante}</span>
                      </p>
                      {issue.descricao && (
                        <p className="text-sm text-slate-600 mt-2">{issue.descricao}</p>
                      )}
                    </div>
                  </div>

                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${corStatus(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>

                {/* Controles do político */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Atualizar Status</label>
                    <select
                      value={issue.status}
                      onChange={e => alterarStatus(issue.id, e.target.value)}
                      className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-[#004587] outline-none focus:border-[#004587]"
                    >
                      {STATUS_OPCOES.map(s => (
                        <option key={s.valor} value={s.valor}>{s.valor}</option>
                      ))}
                    </select>
                  </div>

<div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Enviar Foto para o Cliente (URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={foto[issue.id] || ""}
                        onChange={e => setFoto(prev => ({ ...prev, [issue.id]: e.target.value }))}
                        placeholder="https://exemplo.com/foto.jpg"
                        className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-[#004587]"
                      />
                      <button
                        onClick={() => enviarFoto(issue.id)}
                        disabled={enviando[issue.id]}
                        className="bg-[#004587] text-white px-5 py-2 rounded-xl font-black text-xs hover:bg-[#003566] transition disabled:opacity-50"
                      >
                        {enviando[issue.id] ? "ENVIANDO..." : "ENVIAR FOTO"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ====== SEÇÃO DE NOTÍCIAS ====== */}
        <div className="mt-16 pt-10 border-t-2 border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#004587]">Publicar Notícias</h2>
              <p className="text-slate-500 font-medium">As notícias aqui publicadas aparecem na landing page para todos os cidadãos.</p>
            </div>
            <button
              onClick={() => setShowNoticiaForm(!showNoticiaForm)}
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-yellow-300 transition"
            >
              {showNoticiaForm ? "FECHAR FORMULÁRIO" : "+ PUBLICAR NOTÍCIA"}
            </button>
          </div>

          {showNoticiaForm && (
            <form onSubmit={publicarNoticia} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Título da Notícia</label>
                  <input
                    type="text" required value={noticiaForm.titulo}
                    onChange={e => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })}
                    placeholder="Ex: Inauguração da nova praça central"
                    className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Conteúdo</label>
                  <textarea
                    rows={4} required value={noticiaForm.conteudo}
                    onChange={e => setNoticiaForm({ ...noticiaForm, conteudo: e.target.value })}
                    placeholder="Escreva o conteúdo da notícia para os cidadãos..."
                    className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Categoria</label>
                  <select
                    value={noticiaForm.categoria}
                    onChange={e => setNoticiaForm({ ...noticiaForm, categoria: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                  >
                    <option value="geral">Geral</option>
                    <option value="obras">Obras</option>
                    <option value="saude">Saúde</option>
                    <option value="educacao">Educação</option>
                    <option value="seguranca">Segurança</option>
                    <option value="infraestrutura">Infraestrutura</option>
                    <option value="eventos">Eventos</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={publicandoNoticia} className="bg-[#004587] text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-[#003566] transition disabled:opacity-50">
                  {publicandoNoticia ? "PUBLICANDO..." : "PUBLICAR NOTÍCIA"}
                </button>
                <button type="button" onClick={() => setShowNoticiaForm(false)} className="px-6 py-3 rounded-xl border-2 border-slate-200 font-black text-sm hover:bg-slate-50 transition">
                  CANCELAR
                </button>
              </div>
            </form>
          )}

          {/* Lista de notícias publicadas */}
          <div className="space-y-4">
            {noticias.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="text-5xl mb-4">📰</div>
                <p className="font-black text-slate-400">Nenhuma notícia publicada ainda.</p>
                <p className="text-slate-500 text-sm mt-1">Publique a primeira notícia para os cidadãos.</p>
              </div>
            ) : (
              noticias.map(n => (
                <div key={n.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-black text-lg text-[#004587]">{n.titulo}</h4>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full uppercase">{n.categoria}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">{n.conteudo}</p>
                      <p className="text-xs text-slate-400 mt-3">
                        Por <span className="font-bold">{n.autor || "Político"}</span> • {n.created_at ? new Date(n.created_at).toLocaleDateString("pt-BR") : ""}
                      </p>
                    </div>
                    <button onClick={() => excluirNoticia(n.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition shrink-0" title="Excluir">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
