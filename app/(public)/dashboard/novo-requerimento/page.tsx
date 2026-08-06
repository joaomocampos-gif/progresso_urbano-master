"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function NovoRequerimento() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoria: "",
    titulo: "",
    descricao: "",
  });
  const router = useRouter();

  const handleChange = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Busca o usuário logado (salvo no localStorage no login)
    let user_id = "";
    try {
      const stored = localStorage.getItem("user");
      if (stored) user_id = JSON.parse(stored).id;
    } catch (err) {
      console.error("Erro ao ler usuário logado");
    }

    if (!user_id) {
      alert("Você precisa estar logado para enviar um requerimento.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id }),
      });

      if (res.ok) {
        alert("Requerimento enviado com sucesso!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao enviar requerimento.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro ao enviar requerimento");
      alert("Erro de conexão com o servidor.");
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-2xl mx-auto mb-4">
        <BackButton to="/dashboard" />
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">Relatar Problema Urbano</h2>
          <p className="text-blue-100 text-sm">Preencha os detalhes abaixo para que o órgão responsável possa agir.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              required
              value={formData.categoria}
              onChange={e => handleChange("categoria", e.target.value)}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma opção</option>
              <option value="mato_alto">Mato alto em terreno/calçada</option>
              <option value="iluminacao">Iluminação falha ou inexistente</option>
              <option value="vias_publicas">Buraco ou problema na via</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Título Curto</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={e => handleChange("titulo", e.target.value)}
              placeholder="Ex: Buraco na Rua XV de Novembro"
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição Detalhada</label>
            <textarea
              rows={4}
              value={formData.descricao}
              onChange={e => handleChange("descricao", e.target.value)}
              placeholder="Descreva o problema com detalhes..."
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <p className="text-sm text-gray-500">📸 Em um sistema real, aqui você faria o upload da foto.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 py-2 border rounded-lg font-semibold hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
              {loading ? "Enviando..." : "Enviar Requerimento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
