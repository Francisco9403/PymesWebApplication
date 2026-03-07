import { PageResponse } from "@/types/Page";
import { ProductResponse } from "@/types/Product";
import Link from "next/link";

export default function ProductTable({ pageData }: { pageData: PageResponse<ProductResponse>; }) {
  const { content, page, totalPages } = pageData;

  return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="card-container">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Producto / SKU</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">EAN13</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Costo</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Venta</th>
              </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
              {content.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 font-medium italic">
                      No hay productos registrados en el catálogo.
                    </td>
                  </tr>
              )}

              {content.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.sku}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {product.id}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {product.ean13 || "—"}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400">
                      ${Number(product.baseCostPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                    <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                      ${Number(product.currentSalePrice ?? 0).toFixed(2)}
                    </span>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación Estilo Botonera Profesional */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Página <span className="text-slate-900">{page + 1}</span> de <span className="text-slate-900">{totalPages}</span>
          </div>

          <div className="flex gap-2">
            <Link
                href={`?page=${Math.max(0, page - 1)}`}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                    page === 0
                        ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                }`}
            >
              ← Anterior
            </Link>

            <Link
                href={`?page=${Math.min(totalPages - 1, page + 1)}`}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                    page >= totalPages - 1
                        ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                }`}
            >
              Siguiente →
            </Link>
          </div>
        </div>
      </div>
  );
}