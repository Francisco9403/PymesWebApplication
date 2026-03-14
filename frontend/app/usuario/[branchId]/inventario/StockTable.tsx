import { ProductStock } from "@/types/Product";

export default function StockTable({ stockList }: { stockList: ProductStock[]; }) {
  return (
      <div className="card-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400">
            <tr>
              <th className="p-4 font-black uppercase text-[10px] tracking-widest">Artículo / SKU</th>
              <th className="p-4 font-black uppercase text-[10px] tracking-widest">Código Universal</th>
              <th className="p-4 font-black uppercase text-[10px] tracking-widest text-center">Disponible</th>
              <th className="p-4 font-black uppercase text-[10px] tracking-widest">Estado de Alerta</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
            {(!stockList || stockList.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <span className="text-5xl">📦</span>
                      <p className="text-slate-900 font-bold italic">No hay mercadería en esta sucursal.</p>
                    </div>
                  </td>
                </tr>
            )}

            {stockList?.map((stock) => {
              const isLowStock = stock.quantity <= (stock.criticalThreshold ?? 5);

              return (
                  <tr key={stock.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {stock.product.sku}
                      </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Inventario ID: {stock.id}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {stock.product.ean13 || "— SIN ASIGNAR —"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                      <span className={`text-xl font-black ${isLowStock ? "text-red-600" : "text-slate-900"}`}>
                        {stock.quantity}
                      </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {isLowStock ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-bold border border-red-100 uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                            Stock Crítico
                          </div>
                      ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100 uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Nivel Óptimo
                          </div>
                      )}
                    </td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
  );
}