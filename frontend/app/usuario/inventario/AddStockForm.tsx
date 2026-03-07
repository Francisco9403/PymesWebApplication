"use client";
import { addStockAction } from "@/app/actions/stock";
import { useToast } from "@/layout/ToastProvider";
import { ProductResponse } from "@/types/Product";
import { useActionState, useEffect } from "react";

export default function AddStockForm({ branchId, products }: { branchId: number; products: ProductResponse[]; }) {
  const [state, action, pending] = useActionState(addStockAction, null);
  const { show } = useToast();

  useEffect(() => {
    if (!state) return;
    if (state.error) show(state.error, "error");
    if (state.success) show(state.success, "success");
  }, [state, show]);

  return (
      <form action={action} className="card-container p-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">📥</div>
          <h2 className="text-xl font-black text-slate-900">Ingreso de Mercadería</h2>
        </div>

        <input type="hidden" name="branchId" value={branchId} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Producto</label>
            <select name="productId" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 bg-white">
              <option value="">Seleccionar SKU...</option>
              {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — ${Number(p.currentSalePrice ?? 0).toFixed(2)}
                  </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Cantidad</label>
            <input name="quantity" type="number" min="1" placeholder="0" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-black" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Límite Crítico</label>
            <input name="criticalThreshold" type="number" min="0" placeholder="Ej: 5" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium" />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-slate-50">
          <button type="submit" disabled={pending} className="btn-primary px-8 py-3 flex items-center gap-2">
            {pending ? <span className="animate-pulse">Guardando...</span> : "Cargar al Stock"}
          </button>
        </div>
      </form>
  );
}