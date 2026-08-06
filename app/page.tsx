"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-[#004587] italic tracking-tighter">PROGRESSO URBANO</h1>
        <div className="space-x-4">
          <Link href="/login" className="font-bold text-slate-600 hover:text-[#004587] transition">Entrar</Link>
          <Link href="/cadastro" className="bg-[#004587] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition">Começar Agora</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-blue-50 text-[#004587] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">Governança Digital 2.0</span>
          <h2 className="text-6xl font-black text-slate-900 leading-[0.9] mt-6 mb-8 tracking-tighter">
            Sua cidade na palma da <span className="text-[#004587]">sua mão.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed">
            Conectamos cidadãos e gestores públicos para resolver problemas reais. Relate buracos, iluminação e segurança de forma rápida e transparente.
          </p>
          <div className="flex gap-4">
            <Link href="/cadastro" className="bg-[#004587] text-white px-8 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-300 hover:-translate-y-1 transition">CRIAR MINHA CONTA</Link>
          </div>
        </div>
        <div className="bg-slate-100 h-[500px] rounded-[3rem] shadow-inner flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl">
           <div className="p-12 text-center">
              <div className="text-8xl mb-4">🏙️</div>
              <p className="font-black text-[#004587] text-2xl italic">Transformando Cidades</p>
           </div>
        </div>
      </header>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { t: "Relato Inteligente", d: "Envie fotos e localização exata de problemas urbanos.", i: "📍" },
            { t: "Acompanhamento", d: "Veja o status da sua solicitação em tempo real.", i: "📊" },
            { t: "Voz Direta", d: "Canal direto com os secretários e prefeitura.", i: "📢" }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="text-4xl mb-6">{f.i}</div>
              <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{f.t}</h3>
              <p className="text-slate-500 font-medium">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}