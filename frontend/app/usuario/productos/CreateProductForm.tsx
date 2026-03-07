"use client";
import { create } from "@/app/actions/product";
import { useToast } from "@/layout/ToastProvider";
import { useActionState, useEffect } from "react";

export default function CreateProductForm() {
  const [state, action, pending] = useActionState(create, null);
  const { show } = useToast();

  useEffect(() => {
    if (!state) return;
    if (state.error) show(state.error, "error");
    if (state.success) show(state.success, "success");
  }, [state, show]);

  return (
      <form action={action} className="card-container p-6 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">📦</div>
          <h2 className="text-xl font-black text-slate-900">Nuevo Producto</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Identificación</label>
            <input name="sku" placeholder="SKU (Ej: NIK-42-BL)" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold" />
            <input name="ean13" placeholder="Código EAN13" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-sm" />
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Estructura de Precios</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-bold">$</span>
                <input name="baseCostPrice" placeholder="Costo" type="number" step="0.01" className="w-full p-3 pl-7 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-indigo-600 font-bold">$</span>
                <input name="currentSalePrice" placeholder="Venta" type="number" step="0.01" className="w-full p-3 pl-7 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono font-bold text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn-primary w-full py-4 mt-2 flex items-center justify-center gap-2">
          {pending ? <span className="animate-pulse">Procesando...</span> : "Guardar Producto"}
        </button>
      </form>
  );
}