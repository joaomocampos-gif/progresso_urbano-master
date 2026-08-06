"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      // Salva os dados do usuário no localStorage para uso nas demais páginas
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redireciona baseado no cargo vindo do banco
      if (data.user.role === 'super_admin') router.push("/master");
      else if (data.user.role === 'admin') router.push("/politico");
      else router.push("/dashboard");
    } else {
      setErro(data.error || "Credenciais inválidas");
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-green-600 via-yellow-400 to-blue-700"></div>

      <div className="w-full max-w-md mb-4">
        <BackButton to="/" />
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-3xl bg-blue-50 mb-4">
            <svg className="w-12 h-12 text-[#004587]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-[#004587] tracking-tighter italic">Progresso Urbano</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">Portal de Identidade Digital</p>
        </div>

        {erro && <p className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm font-bold mb-4 border border-red-100">{erro}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-1 tracking-wider">E-mail Institucional</label>
            <input 
              type="email" 
              required
              placeholder="exemplo@email.com"
              className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-1 tracking-wider">Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#004587] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="text-right">
            <Link href="/recuperar" className="text-xs font-bold text-[#004587] hover:underline">Esqueceu a senha?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#004587] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#003566] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "VALIDANDO ACESSO..." : "ENTRAR NO PORTAL"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 pt-8">
          <p className="text-slate-500 text-sm font-medium">
            Novo por aqui? 
            <Link href="/cadastro" className="text-[#004587] font-black ml-2 hover:underline tracking-tight">Criar conta municipal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
