"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ to = "" }: { to?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (to ? router.push(to) : router.back())}
      className="inline-flex items-center gap-2 bg-white text-[#004587] border-2 border-slate-200 px-4 py-2 rounded-xl font-black text-sm shadow-sm hover:bg-slate-50 hover:border-[#004587] transition-all active:scale-95"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>
  );
}
