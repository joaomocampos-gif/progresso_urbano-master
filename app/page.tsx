"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  created_at: string;
  autor: string;
}

const colaboradores = [
  {
    nome: "Equipe de Tecnologia",
    cargo: "Desenvolvimento do Portal",
    desc: "Mantem o sistema no ar, seguro e de fácil acesso para todos os moradores.",
  },
  {
    nome: "Secretarias Municipais",
    cargo: "Atendimento & Obras",
    desc: "Servidores públicos responsáveis por receber e executar as solicitações.",
  },
  {
    nome: "Cidadãos e Moradores",
    cargo: "Fiscalização Popular",
    desc: "Moradores que apontam as melhorias necessárias no seu bairro.",
  },
];

const CATEGORIA_COR: Record<string, string> = {
  geral: "bg-slate-100 text-slate-700",
  obras: "bg-blue-100 text-blue-800",
  saude: "bg-red-100 text-red-800",
  educacao: "bg-amber-100 text-amber-800",
  seguranca: "bg-emerald-100 text-emerald-800",
  infraestrutura: "bg-indigo-100 text-indigo-800",
  eventos: "bg-orange-100 text-orange-800",
};

export default function LandingPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    fetch("/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNoticias(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* Barra de Acessibilidade / Cabeçalho Superior */}
      <div className="bg-[#002b52] text-white text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Portal Oficial de Solicitações e Atendimento Urbano</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:underline">Área do Servidor</Link>
          </div>
        </div>
      </div>

      {/* Navbar Principal */}
      <header className="bg-white border-b border-slate-300">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#004587] text-white font-black text-xl px-3 py-1.5 rounded">
              PU
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#004587] block leading-none">
                PROGRESSO URBANO
              </span>
              <span className="text-xs text-slate-500 font-medium">Atendimento ao Cidadão</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="#servicos" className="hover:text-[#004587]">Serviços</Link>
            <Link href="#noticias" className="hover:text-[#004587]">Notícias</Link>
            <Link href="#sobre" className="hover:text-[#004587]">Sobre o Portal</Link>
            <Link href="#colaboradores" className="hover:text-[#004587]">Equipe</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-slate-700 px-4 py-2 hover:bg-slate-100 rounded">
              Entrar
            </Link>
            <Link href="/cadastro" className="text-sm font-bold bg-[#004587] text-white px-5 py-2.5 rounded shadow-sm hover:bg-[#003366]">
              Fazer Solicitação
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section - Direta ao Ponto */}
      <section className="bg-[#004587] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <span className="inline-block bg-white/10 text-blue-100 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider mb-4">
              Canal Direto da Cidade
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
              Encontrou algum problema no seu bairro?
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-xl">
              Registre a sua solicitação diretamente para a equipe responsável da cidade e acompanhe o andamento da solução passo a passo.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/cadastro" className="bg-emerald-600 text-white font-bold px-6 py-3.5 rounded hover:bg-emerald-700 transition shadow">
                + Nova Solicitação
              </Link>
              <Link href="#noticias" className="bg-white/10 text-white font-semibold px-6 py-3.5 rounded hover:bg-white/20 transition">
                Ver Notícias da Cidade
              </Link>
            </div>
          </div>

          {/* Atagora Atalhos de Serviços Principais */}
          <div className="md:col-span-5 bg-white text-slate-900 rounded-lg p-6 shadow-md border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 pb-2">
              Principais Chamados
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { nome: "Tapa-Buraco", icon: "🛣️" },
                { nome: "Iluminação Pública", icon: "💡" },
                { nome: "Limpeza de Lixo", icon: "🧹" },
                { nome: "Poda de Árvores", icon: "🌳" },
                { nome: "Sinalização de Trânsito", icon: "🚦" },
                { nome: "Outros Serviços", icon: "📋" },
              ].map((s, i) => (
                <Link key={i} href="/cadastro" className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded transition text-left group">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-[#004587]">{s.nome}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="servicos" className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Como funciona o atendimento?</h2>
          <p className="text-slate-600 text-sm mt-1">Três passos simples para resolver demandas do seu dia a dia.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "1", t: "Envie o Relato", d: "Cadastre o pedido informando a localização do local e anexando uma foto da ocorrência." },
            { num: "2", t: "Encaminhamento", d: "A solicitação é enviada automaticamente para a equipe ou secretaria responsável." },
            { num: "3", t: "Resolução", d: "Você recebe notificações do status até que o serviço seja concluído na rua." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded border border-slate-300 relative">
              <div className="w-8 h-8 bg-[#004587] text-white font-bold rounded flex items-center justify-center mb-4 text-sm">
                {item.num}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{item.t}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notícias / Comunicados Oficiais */}
      <section id="noticias" className="bg-white py-16 border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Comunicados da Cidade</h2>
              <p className="text-slate-600 text-sm mt-1">Acompanhe avisos oficiais e novidades municipais.</p>
            </div>
          </div>

          {noticias.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded p-8 text-center text-slate-500 text-sm">
              Nenhuma notícia publicada até o momento.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {noticias.map((n) => (
                <article key={n.id} className="bg-slate-50 rounded border border-slate-200 p-5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${CATEGORIA_COR[n.categoria] || CATEGORIA_COR.geral}`}>
                    {n.categoria}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{n.titulo}</h3>
                  <p className="text-slate-600 text-xs line-clamp-3 mb-4">{n.conteudo}</p>
                  <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-3 flex justify-between">
                    <span>{n.autor || "Gestão Pública"}</span>
                    <span>{n.created_at ? new Date(n.created_at).toLocaleDateString("pt-BR") : ""}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sobre e Transparência */}
      <section id="sobre" className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-white border border-slate-300 rounded p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sobre o Progresso Urbano</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              O portal foi criado para organizar, simplificar e dar transparência aos atendimentos solicitados pela população.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Com o sistema, é possível acompanhar os prazos de atendimento, verificar o histórico de solicitações por bairro e colaborar diretamente com a gestão municipal.
            </p>
            <div className="flex gap-6 border-t border-slate-200 pt-4">
              <div>
                <p className="text-xl font-bold text-[#004587]">100%</p>
                <p className="text-xs text-slate-500">Acesso Público</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#004587]">Digital</p>
                <p className="text-xs text-slate-500">Sem Burocracia</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-6 border border-slate-200 rounded">
            <h3 className="text-sm font-bold uppercase text-slate-700 mb-2">Compromisso com o Cidadão</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Toda demanda cadastrada gera um número de protocolo para acompanhamento direto no site.
            </p>
          </div>
        </div>
      </section>

      {/* Colaboradores / Equipe */}
      <section id="colaboradores" className="bg-white py-16 border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Responsáveis pelo Serviço</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {colaboradores.map((c, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">{c.nome}</h3>
                <p className="text-xs font-bold text-[#004587] mb-2">{c.cargo}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Público */}
      <footer className="bg-[#002b52] text-white py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-300">
          <div>
            <p className="font-bold text-sm text-white">PROGRESSO URBANO</p>
            <p>© {new Date().getFullYear()} Plataforma de Atendimento ao Morador.</p>
          </div>
          <div className="flex gap-6 font-medium">
            <Link href="#servicos" className="hover:underline">Serviços</Link>
            <Link href="#noticias" className="hover:underline">Comunicados</Link>
            <Link href="#sobre" className="hover:underline">Sobre</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}