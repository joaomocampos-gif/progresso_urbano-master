"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

export default function Perfil() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pega o ID do usuário salvo no localStorage pelo login
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`/api/auth/perfil?id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/auth/perfil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, id: userId }),
    });
    if (res.ok) alert("Perfil atualizado com sucesso!");
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center font-bold text-[#004587]">Carregando seu perfil...</div>;

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <p className="text-2xl font-black text-[#004587] mb-4">Nenhum usuário logado</p>
      <p className="text-slate-500 font-medium">Faça login para acessar seu perfil.</p>
    </div>
  );

return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto mb-4">
        <BackButton to="/dashboard" />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-[#004587] p-10 text-white flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-inner">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">{user.full_name}</h1>
            <p className="text-blue-200 font-bold uppercase text-xs tracking-widest">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full border-b border-slate-100 pb-2">
            <h2 className="text-lg font-black text-slate-800">DADOS DE CONTATO</h2>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Telefone</label>
            <input 
              type="text" 
              value={user.phone} 
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]" 
              onChange={e => setUser({...user, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">CEP</label>
            <input 
              type="text" 
              value={user.cep} 
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]" 
              onChange={e => setUser({...user, cep: e.target.value})}
            />
          </div>

          <div className="md:col-span-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Endereço</label>
            <input 
              type="text" 
              value={user.address} 
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]" 
              onChange={e => setUser({...user, address: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Número</label>
            <input 
              type="text" 
              value={user.address_number} 
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]" 
              onChange={e => setUser({...user, address_number: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="col-span-full bg-[#004587] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "SALVANDO ALTERAÇÕES..." : "ATUALIZAR PERFIL"}
          </button>
        </form>
      </div>
    </div>
  );
}
