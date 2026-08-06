"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "", email: "", senha: "", cpf: "", telefone: "",
    cep: "", endereco: "", cidade: "", estado: "", numero: ""
  });
  const [status, setStatus] = useState({ tipo: "", msg: "" });
  const router = useRouter();

  const buscarCEP = async (valor: string) => {
    const cep = valor.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({ 
            ...prev, endereco: data.logradouro, cidade: data.localidade, estado: data.uf, cep: valor 
          }));
        }
      } catch (e) { console.error("Erro ao buscar CEP"); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ tipo: "loading", msg: "Processando seu registro..." });

    const response = await fetch("/api/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const resultado = await response.json();

    if (response.ok) {
      setStatus({ tipo: "sucesso", msg: "✅ Conta criada! Redirecionando para o portal..." });
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setStatus({ tipo: "erro", msg: `❌ ${resultado.error || "Erro ao cadastrar"}` });
    }
  };

  return (
<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Barra de destaque superior */}
      <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-yellow-400 to-blue-600"></div>

      <div className="w-full max-w-2xl mb-4">
        <BackButton to="/" />
      </div>

      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 mt-4">
        <div className="bg-[#004587] p-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tighter italic">PROGRESSO URBANO</h1>
            <p className="text-blue-100 font-medium opacity-90">Crie sua Identidade Digital Municipal</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-full border-b border-slate-100 pb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-green-500 rounded-full"></span> Dados de Acesso
            </h2>
          </div>

          <div className="col-span-full">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Nome Completo</label>
            <input type="text" required className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, nome: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">E-mail</label>
            <input type="email" required className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Senha de Acesso</label>
            <input type="password" required className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, senha: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">CPF</label>
            <input type="text" required placeholder="000.000.000-00" className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, cpf: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Telefone</label>
            <input type="text" required placeholder="(00) 00000-0000" className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, telefone: e.target.value})} />
          </div>

          <div className="col-span-full border-b border-slate-100 pb-2 mt-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-yellow-400 rounded-full"></span> Localização
            </h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">CEP</label>
            <input type="text" required className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onBlur={e => buscarCEP(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Cidade / UF</label>
            <input type="text" readOnly value={formData.cidade ? `${formData.cidade} - ${formData.estado}` : ""} className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none cursor-not-allowed" />
          </div>

          <div className="md:col-span-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Rua/Avenida</label>
            <input type="text" required value={formData.endereco} className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, endereco: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Número</label>
            <input type="text" required className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" 
              onChange={e => setFormData({...formData, numero: e.target.value})} />
          </div>

          {status.msg && (
            <div className={`col-span-full p-4 rounded-2xl text-sm font-bold text-center ${status.tipo === "erro" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
              {status.msg}
            </div>
          )}

          <div className="col-span-full pt-6">
            <button type="submit" className="w-full bg-[#004587] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-[#003366] hover:-translate-y-1 transition-all active:scale-95">
              CONFIRMAR E FINALIZAR
            </button>
            <p className="text-center mt-6 text-sm text-slate-500">
              Já possui acesso? <Link href="/login" className="text-[#004587] font-black hover:underline">Entre aqui</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}