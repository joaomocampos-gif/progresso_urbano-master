"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function MasterAdmin() {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const carregarDados = async () => {
        try {
            const [resU, resS] = await Promise.all([
                fetch("/api/admin/usuarios"),
                fetch("/api/admin/stats"),
            ]);
            const data = await resU.json();
            const dataStats = await resS.json();
            setUsuarios(data);
            setStats(dataStats);
        } catch (e) {
            console.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarDados(); }, []);

    const alterarCargo = async (id: string, novoRole: string) => {
        try {
            const res = await fetch("/api/admin/alterar-cargo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, role: novoRole }),
            });

            if (res.ok) {
                setUsuarios(prev => prev.map(u => u.id === id ? { ...u, role: novoRole } : u));
            } else {
                alert("Erro ao atualizar cargo no servidor.");
            }
        } catch (e) {
            console.error("Erro na requisição");
        }
    };

    const excluirUsuario = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
        try {
            const stored = localStorage.getItem("user");
            const meuIdAdmin = stored ? JSON.parse(stored).id : null;

            const res = await fetch("/api/admin/usuarios", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIdParaApagar: id, meuIdAdmin }),
            });

            if (res.ok) {
                setUsuarios(prev => prev.filter(u => u.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao excluir usuário.");
            }
        } catch (e) {
            console.error("Erro na requisição");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-[#004587]">
            Sincronizando com o Banco de Dados...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
<div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <BackButton to="/dashboard" />
                </div>

                <header className="flex justify-between items-end mb-10 border-b-2 border-slate-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#004587] italic tracking-tighter uppercase">Master Root</h1>
                        <p className="text-slate-500 font-bold text-sm">GESTÃO DE INFRAESTRUTURA HUMANA</p>
                    </div>
<div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100 text-right">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Cidadãos Ativos</span>
                        <span className="text-2xl font-black text-[#004587]">{usuarios.length}</span>
                    </div>
                </header>

<div className="flex justify-end gap-3 mb-6">
                    <Link href="/gastos" className="bg-yellow-400 text-blue-900 px-5 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-yellow-300 transition">
                        💰 Transparência de Gastos
                    </Link>
                    <Link href="/perfil" className="bg-[#004587] text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-[#003566] transition">
                        👤 Meu Perfil
                    </Link>
                </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#004587] p-6 rounded-[2rem] text-white shadow-xl shadow-blue-200">
                        <p className="text-[10px] font-black opacity-60 uppercase">Total de Relatórios</p>
                        <p className="text-4xl font-black italic">{stats?.total ?? 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Problemas Resolvidos</p>
                        <p className="text-4xl font-black text-green-600 italic">{stats?.porcentagem ?? 0}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Concluídos</p>
                        <p className="text-4xl font-black text-[#004587] italic">{stats?.resolvidos ?? 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Aguardando</p>
                        <p className="text-4xl font-black text-yellow-500 italic">{stats?.aguardando ?? 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Em Análise (Vistos)</p>
                        <p className="text-4xl font-black text-blue-600 italic">{stats?.visto ?? 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Gastos Registrados</p>
                        <p className="text-4xl font-black text-[#004587] italic">{stats?.totalGastos ?? 0}</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {usuarios.map((u) => (
                        <div key={u.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row justify-between items-center transition-all hover:scale-[1.01]">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004587] text-xl font-black shadow-inner">
                                    {u.full_name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{u.full_name}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{u.email} • <span className="text-[#004587]">{u.cpf}</span></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Nível de Acesso</label>
                                    <select
                                        value={u.role}
                                        onChange={(e) => alterarCargo(u.id, e.target.value)}
                                        className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-[#004587] outline-none focus:border-[#004587] transition-all"
                                    >
                                        <option value="citizen">Cidadão</option>
                                        <option value="admin">Administrador / Político</option>
                                        <option value="super_admin">Master Root</option>
                                    </select>
                                </div>

                                <button onClick={() => excluirUsuario(u.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
