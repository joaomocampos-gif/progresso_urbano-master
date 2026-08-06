"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => { carregarIssues(); }, []);

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
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-[#004587]">Demandas da População</h2>
          <p className="text-slate-500 font-medium">Gestão de melhorias e obras públicas.</p>
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
                      <p className="text-sm text-slate-500">
                        {issue.bairro ? `Bairro: ${issue.bairro} | ` : ""}Solicitado por: <span className="font-bold text-[#004587]">{issue.solicitante}</span>
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
      </main>
    </div>
  );
}
