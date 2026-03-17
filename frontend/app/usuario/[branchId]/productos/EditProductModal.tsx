"use client";

import { updateProduct } from "@/app/actions/product";
import { useToast } from "@/layout/ToastProvider";
import { ProductResponse } from "@/types/Product";
import { useActionState, useEffect } from "react";

export default function EditProductModal({
  product,
  onClose,
}: {
  product: ProductResponse;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateProduct, null);
  const { show } = useToast();

  useEffect(() => {
    if (state?.error) show(state.error, "error");
    if (state?.success) show(state.success, "success");
  }, [state, show]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/40 dark:bg-black/60 backdrop-blur-sm">
 
      <div
        className="w-full max-w-md rounded-2xl p-7 transition-colors
          bg-white border border-slate-200 shadow-2xl
          dark:bg-[rgba(18,18,24,0.98)] dark:border-[rgba(255,255,255,0.08)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between mb-6 pb-5
            border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base
                bg-[rgba(255,107,53,0.1)]"
              style={{ border: "1px solid rgba(255,107,53,0.25)" }}
            >
              📦
            </div>
            <h2 className="text-lg font-extrabold tracking-[-0.01em]
              text-slate-900 dark:text-[#F0EDE8]">
              Editar Producto
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all
              bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600
              dark:bg-[rgba(255,255,255,0.05)] dark:text-[#555] dark:hover:bg-[rgba(255,255,255,0.1)] dark:hover:text-[#AAA]"
          >
            ✕
          </button>
        </div>
 
        {/* Form */}
        <form action={formAction} className="flex flex-col gap-3.5">
          <input type="hidden" name="id" defaultValue={product.id} />
 
          {[
            { name: "name",             label: "Nombre",        placeholder: "Ej: Yerba Mate 500g",   defaultValue: product.name },
            { name: "ean13",            label: "EAN13",         placeholder: "Código de barras",       defaultValue: product.ean13 ?? "" },
            { name: "baseCostPrice",    label: "Costo",         placeholder: "0.00",                   defaultValue: product.baseCostPrice },
            { name: "currentSalePrice", label: "Precio venta",  placeholder: "0.00",                   defaultValue: product.currentSalePrice },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5
                text-slate-400 dark:text-[#555]">
                {field.label}
              </label>
              <input
                name={field.name}
                defaultValue={field.defaultValue}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)]"
              />
            </div>
          ))}
 
          {/* Feedback messages */}
          {state?.error && (
            <p className="text-xs font-semibold px-3 py-2 rounded-lg
              text-red-600 bg-red-50 border border-red-100
              dark:text-red-400 dark:bg-[rgba(239,68,68,0.08)] dark:border-[rgba(239,68,68,0.2)]">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="text-xs font-semibold px-3 py-2 rounded-lg
              text-[#00C9A7] bg-[rgba(0,201,167,0.06)] border border-[rgba(0,201,167,0.2)]">
              {state.success}
            </p>
          )}
 
          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50
                dark:border-[rgba(255,255,255,0.08)] dark:text-[#666] dark:hover:border-[rgba(255,255,255,0.15)] dark:hover:bg-[rgba(255,255,255,0.05)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold tracking-[0.02em]
                border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
                bg-[#FF6B35] text-white
                hover:bg-[#FF8555] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(255,107,53,0.35)]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {pending ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="animate-pulse">Guardando...</span>
                </>
              ) : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
