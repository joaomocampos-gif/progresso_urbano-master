"use client";

import BackButton from "@/components/BackButton";

export default function FeedCidade() {
  const problemas = [
    { id: 1, titulo: "Vazamento de Água", bairro: "Centro", status: "Aberto", icone: "💧" },
    { id: 2, titulo: "Poste Queimado", bairro: "Vila Nova", status: "Em Análise", icone: "💡" }
  ];

  return (
<div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton to="/dashboard" />
        </div>

        <h1 className="text-3xl font-black text-[#004587] mb-8 italic tracking-tighter">PANORAMA URBANO</h1>
        
        <div className="grid gap-4">
          {problemas.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{p.icone}</span>
                <div>
                  <h3 className="font-black text-slate-800">{p.titulo}</h3>
                  <p className="text-sm text-slate-500 font-bold">{p.bairro}</p>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${p.status === 'Aberto' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}