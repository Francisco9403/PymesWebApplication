"use client";
import { addStockAction } from "@/app/actions/stock";
import { useToast } from "@/layout/ToastProvider";
import { ProductResponse } from "@/types/Product";
import { useActionState, useEffect } from "react";

export default function AddStockForm({
  branchId,
  products,
}: {
  branchId: number;
  products: ProductResponse[];
}) {
  const [state, action, pending] = useActionState(addStockAction, null);
  const { show } = useToast();

  useEffect(() => {
    if (!state) return;
    if (state.error) show(state.error, "error");
    if (state.success) show(state.success, "success");
  }, [state, show]);

  return (
    <form
      action={action}
      className="p-6 rounded-xl transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      {/* Form header */}
      <div
        className="flex items-center gap-3 pb-5 mb-6
          border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
            bg-[rgba(255,107,53,0.1)]"
          style={{ border: "1px solid rgba(255,107,53,0.25)" }}
        >
          📥
        </div>
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.01em]
            text-slate-900 dark:text-[#F0EDE8]">
            Ingreso de Mercadería
          </h2>
          <p className="text-xs mt-0.5 text-slate-400 dark:text-[#555]">
            Registrá nuevas unidades al stock de la sucursal
          </p>
        </div>
      </div>
 
      <input type="hidden" name="branchId" value={branchId} />
 
      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
 
        {/* Product select */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">Producto</label>
          <div className="relative">
            <select
              name="productId"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] font-bold appearance-none pr-9 cursor-pointer"
            >
              <option value="" className="text-black">Seleccionar SKU...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="text-black">
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none
                text-slate-400 dark:text-[#555]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
 
        {/* Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">Cantidad</label>
          <input
            name="quantity"
            type="number"
            min="1"
            placeholder="0"
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] font-bold"
          />
        </div>
 
        {/* Critical threshold */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">Límite Crítico</label>
          <input
            name="criticalThreshold"
            type="number"
            min="0"
            placeholder="Ej: 5"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)] font-bold"
          />
        </div>
      </div>
 
      {/* Footer */}
      <div
        className="flex justify-end mt-6 pt-5
          border-t border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
      >
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-[0.02em]
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
              <span className="animate-pulse">Guardando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 4v16m8-8H4" />
              </svg>
              Cargar al Stock
            </>
          )}
        </button>
      </div>
    </form>
  );
}
