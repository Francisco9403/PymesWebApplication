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
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center bg-indigo-50 p-5 rounded-3xl border border-indigo-100 shadow-sm">
        <div>
          <h3 className="text-sm font-black text-indigo-900 uppercase tracking-tight">
            Catálogo de {supplierName}
          </h3>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
            Precios de lista vigentes
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
        >
          ✕
        </button>
      </div>

      <div className="card-container overflow-hidden border-indigo-50 shadow-xl shadow-indigo-100/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-black text-slate-400 uppercase text-[9px] tracking-widest">
                  Producto / Código
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[9px] tracking-widest text-right">
                  Costo Actual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="p-10 text-center text-slate-400 italic text-xs"
                  >
                    Este proveedor no tiene productos vinculados.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">
                          {p.name}
                        </span>
                        <span className="text-[8px] font-mono text-indigo-500 font-bold mt-0.5">
                          ID: {p.sku || p.ean13 || "S/C"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono font-black text-slate-900 text-xs">
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
