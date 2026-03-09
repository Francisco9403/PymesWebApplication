"use client";

import { useToast } from "@/layout/ToastProvider";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importamos para refrescar la lista
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
      router.refresh(); // Sincronización inmediata con la tabla
    }
  }, [state, show, router]);

  return (
    <form
      action={action}
      className="card-container p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
          🏢
        </div>
        <h2 className="text-xl font-black text-slate-900">
          Nueva Sucursal / Depósito
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-500 uppercase ml-1">
            Nombre
          </label>
          <input
            name="name"
            placeholder="Ej: Depósito Central"
            required
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black text-slate-500 uppercase ml-1">
            Dirección
          </label>
          <input
            name="address"
            placeholder="Av. Benito de Miguel 456"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black text-slate-500 uppercase ml-1">
            Teléfono
          </label>
          <input
            name="phone"
            placeholder="+54 236 4..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
          <input
            type="checkbox"
            name="isPointOfSale"
            id="isPointOfSale"
            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500/20 border-slate-300 rounded-lg transition-all cursor-pointer"
            defaultChecked
          />
          <label
            htmlFor="isPointOfSale"
            className="text-sm font-bold text-slate-700 cursor-pointer"
          >
            Habilitar como Punto de Venta al público
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-primary px-10 py-3 shadow-lg shadow-indigo-200/50"
        >
          {pending ? (
            <span className="animate-pulse">Registrando...</span>
          ) : (
            "Crear Sucursal"
          )}
        </button>
      </div>
    </form>
  );
}
