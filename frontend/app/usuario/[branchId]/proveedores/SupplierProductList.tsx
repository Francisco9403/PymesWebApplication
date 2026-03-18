"use client";

import { Product } from "@/types/Product";

export default function SupplierProductList({
  products,
  onClose,
  supplierName,
}: {
  products: Product[];
  onClose: () => void;
  supplierName: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex justify-between items-center p-5 rounded-xl
          border border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.05)]
          dark:border-[rgba(255,107,53,0.2)] dark:bg-[rgba(255,107,53,0.06)]"
      >
        <div>
          <h3 className="text-sm font-extrabold tracking-[-0.01em] text-slate-900 dark:text-[#F0EDE8]">
            Catálogo de {supplierName}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-slate-400 dark:text-[#555]">
            Precios de lista vigentes
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all
            bg-white border border-slate-200 text-slate-500 hover:border-[rgba(255,107,53,0.4)] hover:text-[#FF6B35] hover:bg-[rgba(255,107,53,0.05)]
            dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#666] dark:hover:border-[rgba(255,107,53,0.4)] dark:hover:text-[#FF6B35] dark:hover:bg-[rgba(255,107,53,0.08)]"
        >
          ✕
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden
          bg-white border border-slate-200
          dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className="text-[9px] font-extrabold uppercase tracking-widest
                border-b bg-slate-50 border-slate-200 text-slate-400
                dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)] dark:text-[#444]"
            >
              <tr>
                <th className="p-4">Producto / Código</th>
                <th className="p-4 text-right">Costo Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="p-10 text-center text-xs italic text-slate-400 dark:text-[#444]"
                  >
                    Este proveedor no tiene productos vinculados.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="group transition-colors
                      hover:bg-[rgba(255,107,53,0.03)]
                      dark:hover:bg-[rgba(255,107,53,0.04)]"
                  >
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F0EDE8]">
                          {p.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-[#FF6B35] opacity-70">
                          ID: {p.sku || p.ean13 || "S/C"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono font-extrabold text-xs text-slate-900 dark:text-[#F0EDE8]">
                        ${Number(p.baseCostPrice).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
