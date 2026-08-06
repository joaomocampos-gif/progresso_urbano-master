"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function RecuperarSenha() {
  const [step, setStep] = useState(1); // 1: Validar dados, 2: Nova Senha
  const [form, setForm] = useState({ email: "", cpf: "", novaSenha: "" });
  const [status, setStatus] = useState({ tipo: "", msg: "" });
  const router = useRouter();

  const validarDados = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ tipo: "info", msg: "Validando identidade..." });

    const res = await fetch("/api/auth/recuperar/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, cpf: form.cpf }),
    });

    if (res.ok) {
      setStep(2);
      setStatus({ tipo: "sucesso", msg: "Identidade confirmada! Defina sua nova senha." });
    } else {
      setStatus({ tipo: "erro", msg: "E-mail ou CPF não conferem." });
    }
  };

  const atualizarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/recuperar/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus({ tipo: "sucesso", msg: "Senha atualizada! Voltando ao login..." });
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
<div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <BackButton to="/login" />
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-slate-200">
        <h2 className="text-2xl font-black text-[#004587] mb-2">Recuperar Acesso</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">Siga os passos para redefinir sua senha institucional.</p>

        {status.msg && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-black border ${status.tipo === "erro" ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-700 border-green-100"}`}>
            {status.msg.toUpperCase()}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={validarDados} className="space-y-4">
            <input 
              type="email" placeholder="E-mail Cadastrado" required
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
              onChange={e => setForm({...form, email: e.target.value})}
            />
            <input 
              type="text" placeholder="CPF (Somente números)" required
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
              onChange={e => setForm({...form, cpf: e.target.value})}
            />
            <button type="submit" className="w-full bg-[#004587] text-white py-4 rounded-2xl font-black shadow-lg">VERIFICAR DADOS</button>
          </form>
        ) : (
          <form onSubmit={atualizarSenha} className="space-y-4">
            <input 
              type="password" placeholder="Sua Nova Senha" required
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
              onChange={e => setForm({...form, novaSenha: e.target.value})}
            />
            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg">DEFINIR NOVA SENHA</button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-[#004587]">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
}