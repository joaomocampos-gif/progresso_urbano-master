"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function NovoRequerimento() {
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string>("");
  const [formData, setFormData] = useState({
    categoria: "",
    titulo: "",
    descricao: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const router = useRouter();

  const handleChange = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  // Processa o upload restrito a PNG, JPG e JPEG
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        alert("Formato inválido! Por favor, selecione apenas imagens nos formatos PNG, JPG ou JPEG.");
        e.target.value = "";
        return;
      }

      setNomeArquivo(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação basica no client para formato de texto
    const regexTexto = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
    if (!regexTexto.test(formData.bairro.trim())) {
      alert("Por favor, digite um nome de bairro válido (somente letras e no mínimo 2 caracteres).");
      return;
    }

    if (!regexTexto.test(formData.cidade.trim())) {
      alert("Por favor, digite um nome de cidade válido (somente letras).");
      return;
    }

    if (!/^[a-zA-Z]{2}$/.test(formData.estado.trim())) {
      alert("Por favor, informe a sigla do estado (UF) com apenas 2 letras. Ex: SP");
      return;
    }

    setLoading(true);

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
        body: JSON.stringify({ ...formData, user_id, foto }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Requerimento enviado com sucesso!");
        router.push("/dashboard");
      } else {
        // Exibe a mensagem exata trazida pela API de backend
        alert(data.error || "Erro ao enviar requerimento.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro ao enviar requerimento");
      alert("Erro de conexão com o servidor.");
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-3 bg-[#F0F2F5] border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none focus:bg-white focus:border-[#004587] focus:ring-4 focus:ring-blue-100 transition-all";

  const labelStyle = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton to="/dashboard" />
            <div className="w-8 h-8 bg-[#004587] rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-black text-[#004587] text-xl tracking-tighter italic">
              PROGRESSO
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-6 md:p-10">
        {/* Card Principal */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header Interno */}
          <div className="bg-[#004587] p-8 text-white">
            <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 inline-block mb-3">
              📝 Novo Protocolo
            </span>
            <h2 className="text-3xl font-black tracking-tight">Relatar Problema Urbano</h2>
            <p className="text-blue-100 font-medium text-sm mt-1">
              Preencha os detalhes abaixo para encaminharmos a solução ao órgão responsável.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Categoria */}
            <div>
              <label className={labelStyle}>Categoria do Problema</label>
              <select
                required
                value={formData.categoria}
                onChange={e => handleChange("categoria", e.target.value)}
                className={inputStyle}
              >
                <option value="">Selecione uma opção</option>
                <option value="mato_alto">🌱 Mato alto em terreno/calçada</option>
                <option value="iluminacao">💡 Iluminação falha ou inexistente</option>
                <option value="vias_publicas">🕳️ Buraco ou problema na via</option>
                <option value="outros">📦 Outros</option>
              </select>
            </div>

            {/* Título */}
            <div>
              <label className={labelStyle}>Título Curto</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={e => handleChange("titulo", e.target.value)}
                placeholder="Ex: Buraco na Rua XV de Novembro"
                required
                className={inputStyle}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className={labelStyle}>Descrição Detalhada</label>
              <textarea
                rows={4}
                value={formData.descricao}
                onChange={e => handleChange("descricao", e.target.value)}
                placeholder="Descreva o problema com detalhes..."
                required
                className={`${inputStyle} resize-none`}
              ></textarea>
            </div>

            {/* Divisor de Seção */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                <span className="w-2 h-6 bg-[#004587] rounded-full"></span>
                Localização da Ocorrência
              </h3>
            </div>

            {/* Endereço */}
            <div>
              <label className={labelStyle}>Endereço / Rua</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={e => handleChange("endereco", e.target.value)}
                placeholder="Ex: Rua XV de Novembro, 123"
                required
                className={inputStyle}
              />
            </div>

            {/* Grid para Bairro, Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Bairro</label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={e => handleChange("bairro", e.target.value)}
                  placeholder="Ex: Centro"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Cidade</label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={e => handleChange("cidade", e.target.value)}
                  placeholder="Ex: São Paulo"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>UF (Estado)</label>
                <input
                  type="text"
                  value={formData.estado}
                  onChange={e => handleChange("estado", e.target.value)}
                  placeholder="Ex: SP"
                  maxLength={2}
                  required
                  className={`${inputStyle} uppercase`}
                />
              </div>
            </div>

            {/* Upload de Fotos Funcional (.PNG, .JPG, .JPEG) */}
            <div>
              <label className={labelStyle}>Anexar Foto da Ocorrência (PNG ou JPG)</label>
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-[#F0F2F5]/50 text-center cursor-pointer hover:bg-slate-100 transition-all">
                <div className="text-3xl mb-2">📸</div>
                <span className="text-sm font-bold text-slate-700">
                  {nomeArquivo ? nomeArquivo : "Clique para selecionar uma foto"}
                </span>
                <span className="text-xs text-slate-400 mt-1">Formato suportado: apenas .png, .jpg ou .jpeg</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Ações */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-center"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#107038] text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-green-100 hover:bg-[#0d5a2d] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Validando e Enviando..." : "Enviar Requerimento"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}