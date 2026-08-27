"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function Perfil() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tipo: string; texto: string }>({ tipo: "", texto: "" });
  const [userId, setUserId] = useState<string | null>(null);

  // Estados específicos para alteração de credenciais
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed.id);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/auth/perfil?id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMsg({ tipo: "erro", texto: data.error });
        } else {
          setUser(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev: any) => ({ ...prev, foto: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ tipo: "", texto: "" });

    // Validação local de senha se o usuário preencheu campos de nova senha
    if (novaSenha || senhaAtual) {
      if (!senhaAtual) {
        setMsg({ tipo: "erro", texto: "Informe sua senha atual para realizar alterações de segurança." });
        setSaving(false);
        return;
      }
      if (novaSenha && novaSenha.length < 8) {
        setMsg({ tipo: "erro", texto: "A nova senha deve ter no mínimo 8 caracteres." });
        setSaving(false);
        return;
      }
      if (novaSenha !== confirmarNovaSenha) {
        setMsg({ tipo: "erro", texto: "A confirmação da nova senha não confere." });
        setSaving(false);
        return;
      }
    }

    const payload = {
      ...user,
      id: userId,
      senhaAtual,
      novaSenha,
    };

    const res = await fetch("/api/auth/perfil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg({ tipo: "sucesso", texto: "Perfil e credenciais atualizados com sucesso!" });

      // Limpa os campos de senha
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");

      // Atualiza o localStorage com novo nome, e-mail e foto
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.nome = user.full_name;
        parsed.email = user.email;
        parsed.username = user.username;
        parsed.foto = user.foto;
        localStorage.setItem("user", JSON.stringify(parsed));
      }
    } else {
      setMsg({ tipo: "erro", texto: data.error || "Erro ao atualizar perfil." });
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center font-bold text-[#004587]">Carregando seu perfil...</div>;

  if (!user)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <p className="text-2xl font-black text-[#004587] mb-4">Nenhum usuário logado</p>
        <p className="text-slate-500 font-medium">Faça login para acessar seu perfil.</p>
        <button onClick={() => router.push("/login")} className="mt-6 bg-[#004587] text-white px-6 py-3 rounded-2xl font-bold">
          IR PARA LOGIN
        </button>
      </div>
    );

  const roleLabel: Record<string, string> = {
    super_admin: "Master Root",
    admin: "Administrador",
    citizen: "Cidadão",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto mb-4">
        <BackButton to="/dashboard" />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Cabeçalho */}
        <div className="bg-[#004587] p-10 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            {user.foto ? (
              <img src={user.foto} alt="Foto do perfil" className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white/30 shadow-xl" />
            ) : (
              <div className="w-28 h-28 bg-white/20 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-inner">
                {(user.full_name || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 bg-yellow-400 text-blue-900 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tighter italic">{user.full_name || "Sem nome"}</h1>
            <p className="text-blue-200 font-bold uppercase text-xs tracking-widest">{user.email}</p>
            {user.username && <p className="text-yellow-300 font-black text-sm mt-1">@{user.username}</p>}
            <span className="inline-block mt-3 px-4 py-1 bg-white/15 rounded-full text-xs font-black uppercase tracking-widest">
              {roleLabel[user.role] || user.role}
            </span>
          </div>
        </div>

        {msg.texto && (
          <div className={`px-10 pt-6 ${msg.tipo === "erro" ? "text-red-600" : "text-green-700"}`}>
            <div className={`p-4 rounded-2xl text-sm font-bold border ${msg.tipo === "erro" ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
              {msg.texto}
            </div>
          </div>
        )}

        <form onSubmit={handleUpdate} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DADOS PESSOAIS */}
          <div className="col-span-full border-b border-slate-100 pb-2">
            <h2 className="text-lg font-black text-slate-800">DADOS PESSOAIS</h2>
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome Completo</label>
            <input
              type="text"
              value={user.full_name || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, full_name: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome de Usuário</label>
            <input
              type="text"
              value={user.username || ""}
              placeholder="ex: joaosilva"
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>

          {/* DADOS DE SEGURANÇA E ACESSO */}
          <div className="col-span-full border-b border-slate-100 pb-2 mt-4">
            <h2 className="text-lg font-black text-slate-800">SEGURANÇA E CONTA</h2>
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">E-mail Cadastrado</label>
            <input
              type="email"
              value={user.email || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className="col-span-full bg-slate-50 p-6 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="col-span-full text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Alterar Senha (Opcional)
            </p>

            <div className="col-span-full">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Senha Atual (Obrigatória para alterar e-mail ou senha)</label>
              <input
                type="password"
                placeholder="Sua senha atual"
                value={senhaAtual}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-[#004587] bg-white"
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nova Senha</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={novaSenha}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-[#004587] bg-white"
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Confirmar Nova Senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmarNovaSenha}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-[#004587] bg-white"
                onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              />
            </div>
          </div>

          {/* DADOS DE CONTATO E ENDEREÇO */}
          <div className="md:col-span-2 border-b border-slate-100 pb-2 mt-4">
            <h2 className="text-lg font-black text-slate-800">DADOS DE CONTATO E ENDEREÇO</h2>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Telefone</label>
            <input
              type="text"
              value={user.phone || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">CEP</label>
            <input
              type="text"
              value={user.cep || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, cep: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Endereço</label>
            <input
              type="text"
              value={user.address || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Número</label>
            <input
              type="text"
              value={user.address_number || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, address_number: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cidade</label>
            <input
              type="text"
              value={user.city || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, city: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Estado / UF</label>
            <input
              type="text"
              value={user.state || ""}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold outline-none focus:border-[#004587]"
              onChange={(e) => setUser({ ...user, state: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="col-span-full bg-[#004587] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all disabled:opacity-50 mt-4"
            disabled={saving}
          >
            {saving ? "SALVANDO ALTERAÇÕES..." : "ATUALIZAR PERFIL"}
          </button>
        </form>
      </div>
    </div>
  );
}