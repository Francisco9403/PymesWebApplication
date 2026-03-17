"use client";

import { useToast } from "@/layout/ToastProvider";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBranchAction } from "@/app/actions/branch";

export default function CreateBranchForm() {
  const [state, action, pending] = useActionState(createBranchAction, null);
  const { show } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.error) show(state.error, "error");
    if (state.success) {
      show(state.success, "success");
      router.refresh();
    }
  }, [state, show, router]);

  return (
    <form
    action={action}
    className="p-6 rounded-xl flex flex-col gap-6 transition-colors
      bg-white border border-slate-200
      dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
  >
    {/* Form header */}
    <div
      className="flex items-center gap-3 pb-5
        border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
          bg-[rgba(255,107,53,0.1)]"
        style={{ border: "1px solid rgba(255,107,53,0.25)" }}
      >
        🏢
      </div>
      <div>
        <h2 className="text-lg font-extrabold tracking-[-0.01em]
          text-slate-900 dark:text-[#F0EDE8]">
          Nueva Sucursal / Depósito
        </h2>
        <p className="text-xs mt-0.5 text-slate-400 dark:text-[#555]">
          Completá los datos del nuevo punto de operación
        </p>
      </div>
    </div>

    {/* Fields */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">Nombre</label>
        <input
          name="name"
          placeholder="Ej: Depósito Central"
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] font-bold"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">Dirección</label>
        <input
          name="address"
          placeholder="Av. Benito de Miguel 456"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] font-bold"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">Teléfono</label>
        <input
          name="phone"
          placeholder="+54 236 4..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] font-bold font-mono"
        />
      </div>
    </div>

    {/* Footer: checkbox + submit */}
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2
        border-t border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
    >
      {/* Checkbox */}
      <label
        htmlFor="isPointOfSale"
        className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors
          bg-slate-50 border border-slate-200
          hover:border-[rgba(255,107,53,0.3)] hover:bg-[rgba(255,107,53,0.03)]
          dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]
          dark:hover:border-[rgba(255,107,53,0.3)] dark:hover:bg-[rgba(255,107,53,0.05)]"
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            name="isPointOfSale"
            id="isPointOfSale"
            defaultChecked
            className="
              w-5 h-5 rounded-md cursor-pointer appearance-none
              border-2 border-slate-300 bg-white
              checked:bg-[#FF6B35] checked:border-[#FF6B35]
              focus:ring-2 focus:ring-[rgba(255,107,53,0.2)] outline-none
              transition-all
              dark:border-[rgba(255,255,255,0.2)] dark:bg-transparent
              dark:checked:bg-[#FF6B35] dark:checked:border-[#FF6B35]
            "
          />
          {/* Custom checkmark overlay */}
          <svg
            className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block"
            viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-[#AAA]">
          Habilitar como Punto de Venta al público
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 px-10 py-3 rounded-xl font-bold text-sm tracking-[0.02em] shrink-0
          border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
          bg-[#FF6B35] text-white
          hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(255,107,53,0.3)]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {pending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="animate-pulse">Registrando...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Sucursal
          </>
        )}
      </button>
    </div>
  </form>
  );
}
