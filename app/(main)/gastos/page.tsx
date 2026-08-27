"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

interface Gasto {
  id: string;
  titulo: string;
  descricao: string | null;
  valor: number;
  categoria: string;
  data_gasto: string;
  registrado_por: string | null;
}

const CATEGORIAS: Record<string, { label: string; cor: string }> = {
  obras: { label: "Obras", cor: "bg-blue-50 text-blue-600" },
  infraestrutura: { label: "Infraestrutura", cor: "bg-purple-50 text-purple-600" },
  saude: { label: "Saúde", cor: "bg-red-50 text-red-600" },
  educacao: { label: "Educação", cor: "bg-yellow-50 text-yellow-600" },
  seguranca: { label: "Segurança", cor: "bg-green-50 text-green-600" },
  outros: { label: "Outros", cor: "bg-slate-100 text-slate-600" },
};

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function TransparenciaGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Gasto | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    valor: "",
    categoria: "obras",
    data_gasto: "",
  });

const carregarGastos = async () => {
    try {
      const res = await fetch("/api/gastos");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setGastos(data);
      } else {
        console.error("Erro ao carregar gastos:", data?.error);
        setGastos([]);
      }
    } catch (e) {
      console.error("Erro ao carregar gastos");
      setGastos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setRole(JSON.parse(stored).role || "");
      } catch (e) {
        /* ignore */
      }
    }
    carregarGastos();
  }, []);

  const podeGerenciar = role === "admin" || role === "super_admin";

  const total = gastos.reduce((acc, g) => acc + Number(g.valor), 0);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("user");
    const registrado_por = stored ? JSON.parse(stored).id : null;

    const payload = { ...form, registrado_por };

    if (editando) {
      const res = await fetch(`/api/gastos/${editando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Gasto atualizado com sucesso!");
      }
    } else {
      const res = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Gasto registrado com sucesso!");
      }
    }

    setEditando(null);
    setShowForm(false);
    setForm({ titulo: "", descricao: "", valor: "", categoria: "obras", data_gasto: "" });
    carregarGastos();
  };

  const excluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este gasto?")) return;
    const res = await fetch(`/api/gastos/${id}`, { method: "DELETE" });
    if (res.ok) {
      carregarGastos();
    } else {
      alert("Erro ao excluir gasto.");
    }
  };

  const editar = (g: Gasto) => {
    setEditando(g);
    setForm({
      titulo: g.titulo,
      descricao: g.descricao || "",
      valor: String(g.valor),
      categoria: g.categoria,
      data_gasto: g.data_gasto ? g.data_gasto.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-[#004587]">
        Carregando dados de transparência...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-[#004587] p-4 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <BackButton to="/dashboard" />
          <div className="bg-white/20 text-white font-black p-2 rounded">💰</div>
          <h1 className="font-bold tracking-tighter">TRANSPARÊNCIA DE GASTOS</h1>
        </div>
        {podeGerenciar && (
          <button
            onClick={() => { setEditando(null); setShowForm(!showForm); }}
            className="text-xs bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-black hover:bg-yellow-300 transition"
          >
            {showForm ? "FECHAR FORMULÁRIO" : "+ REGISTRAR GASTO"}
          </button>
        )}
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total de Gastos</p>
            <p className="text-4xl font-black text-[#004587] italic">{formatter.format(total)}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase">Lançamentos</p>
            <p className="text-4xl font-black text-slate-800 italic">{gastos.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase">Média por Lançamento</p>
            <p className="text-4xl font-black text-green-600 italic">{gastos.length > 0 ? formatter.format(total / gastos.length) : formatter.format(0)}</p>
          </div>
        </div>

        {/* Formulário de registro (apenas políticos) */}
        {podeGerenciar && showForm && (
          <form onSubmit={salvar} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10">
            <h3 className="font-black text-[#004587] text-lg mb-4">{editando ? "EDITAR GASTO" : "REGISTRAR NOVO GASTO"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Título</label>
                <input
                  type="text" required value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Pavimentação da Rua XV"
                  className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Descrição</label>
                <textarea
                  rows={2} value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Detalhes do gasto..."
                  className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Valor (R$)</label>
                <input
                  type="number" step="0.01" required value={form.valor}
                  onChange={e => setForm({ ...form, valor: e.target.value })}
                  placeholder="0,00"
                  className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Data</label>
                <input
                  type="date" required value={form.data_gasto}
                  onChange={e => setForm({ ...form, data_gasto: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none focus:border-[#004587] font-medium"
                >
                  <option value="obras">Obras</option>
                  <option value="infraestrutura">Infraestrutura</option>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="seguranca">Segurança</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="bg-[#004587] text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-[#003566] transition">
                {editando ? "SALVAR ALTERAÇÕES" : "REGISTRAR GASTO"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditando(null); }} className="px-6 py-3 rounded-xl border-2 border-slate-200 font-black text-sm hover:bg-slate-50 transition">
                CANCELAR
              </button>
            </div>
          </form>
        )}

        {/* Lista de gastos */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-[#004587] rounded-full"></span>
            Lançamentos Públicos
          </h3>

          {gastos.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="text-5xl mb-4">💰</div>
              <p className="font-bold text-slate-500">Nenhum gasto registrado ainda.</p>
            </div>
          ) : (
            gastos.map(g => {
              const cat = CATEGORIAS[g.categoria] || CATEGORIAS.outros;
              return (
                <div key={g.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">🏗️</div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-black text-lg">{g.titulo}</h4>
                          <span className={`px-3 py-1 text-xs font-black rounded-full uppercase ${cat.cor}`}>{cat.label}</span>
                        </div>
                        {g.descricao && <p className="text-sm text-slate-500 mt-1">{g.descricao}</p>}
                        <p className="text-xs text-slate-400 mt-2">
                          Registrado em {g.data_gasto ? new Date(g.data_gasto).toLocaleDateString("pt-BR") : "-"}
                          {g.registrado_por ? ` por ${g.registrado_por}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-[#004587]">{formatter.format(Number(g.valor))}</span>
                      {podeGerenciar && (
                        <div className="flex gap-2">
                          <button onClick={() => editar(g)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Editar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => excluir(g.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition" title="Excluir">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
