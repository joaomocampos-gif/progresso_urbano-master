"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

interface Problema {
  id: string;
  titulo: string;
  descricao: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  status: string;
  categoria: string;
  created_at: string;
  solicitante: string;
}

const ICONES: Record<string, string> = {
  mato_alto: "🌿",
  iluminacao: "💡",
  vias_publicas: "🚧",
  outros: "📌",
};

const COR_STATUS: Record<string, string> = {
  Aguardando: "bg-red-100 text-red-600",
  Visto: "bg-yellow-100 text-yellow-700",
  Concluido: "bg-green-100 text-green-700",
};

export default function FeedCidade() {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/issues")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProblemas(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton to="/dashboard" />
        </div>

        <h1 className="text-3xl font-black text-[#004587] mb-2 italic tracking-tighter">PANORAMA URBANO</h1>
        <p className="text-slate-500 font-medium mb-8">Acompanhe os problemas relatados pela população da sua cidade.</p>

        {loading ? (
          <div className="bg-white p-16 rounded-[2rem] text-center font-bold text-[#004587] shadow-xl border border-slate-100">
            Carregando panorama urbano...
          </div>
        ) : problemas.length === 0 ? (
          <div className="bg-white p-16 rounded-[2rem] text-center shadow-xl border border-slate-100">
            <div className="text-6xl mb-4">🏙️</div>
            <p className="font-black text-slate-400 text-xl">Nenhum problema relatado ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {problemas.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{ICONES[p.categoria] || "📌"}</span>
                  <div>
                    <h3 className="font-black text-slate-800">{p.titulo}</h3>
                    <p className="text-sm text-slate-500 font-bold">
                      {[p.endereco, p.bairro, p.cidade, p.estado].filter(Boolean).join(" • ") || "Localização não informada"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Por {p.solicitante}</p>
                  </div>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${COR_STATUS[p.status] || "bg-slate-100 text-slate-600"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
