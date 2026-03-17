import { ProductStock } from "@/types/Product";

export default function StockTable({ stockList }: { stockList: ProductStock[]; }) {
  return (
    <div
    className="rounded-xl overflow-hidden transition-colors
      bg-white border border-slate-200
      dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
  >
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead
          className="text-[10px] font-extrabold uppercase tracking-widest border-b
            bg-slate-50 border-slate-200 text-slate-400
            dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)] dark:text-[#444]"
        >
          <tr>
            <th className="p-4">Artículo / SKU</th>
            <th className="p-4">Código Universal</th>
            <th className="p-4 text-center">Disponible</th>
            <th className="p-4">Estado de Alerta</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">

          {/* Empty state */}
          {(!stockList || stockList.length === 0) && (
            <tr>
              <td colSpan={4} className="p-16 text-center">
                <div className="flex flex-col items-center gap-3 opacity-30">
                  <span className="text-5xl">📦</span>
                  <p className="font-bold italic text-slate-900 dark:text-[#F0EDE8]">
                    No hay mercadería en esta sucursal.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {stockList?.map((stock) => {
            const isLowStock = stock.quantity <= (stock.criticalThreshold ?? 5);

            return (
              <tr
                key={stock.id}
                className="group transition-colors
                  hover:bg-slate-50/80
                  dark:hover:bg-[rgba(255,107,53,0.03)]"
              >
                {/* Article / SKU */}
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold transition-colors
                      text-slate-900 group-hover:text-[#FF6B35]
                      dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]">
                      {stock.product.sku}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter
                      text-slate-400 dark:text-[#444]">
                      Inventario ID: {stock.id}
                    </span>
                  </div>
                </td>

                {/* EAN13 */}
                <td className="p-4 font-mono text-xs text-slate-500 dark:text-[#555]">
                  {stock.product.ean13 || "— SIN ASIGNAR —"}
                </td>

                {/* Quantity */}
                <td className="p-4">
                  <div className="flex items-center justify-center">
                    <span
                      className={`text-xl font-extrabold tabular-nums
                        ${isLowStock
                          ? "text-red-500 dark:text-red-400"
                          : "text-slate-900 dark:text-[#F0EDE8]"
                        }`}
                    >
                      {stock.quantity}
                    </span>
                  </div>
                </td>

                {/* Alert badge */}
                <td className="p-4">
                  {isLowStock ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        border border-red-200 bg-red-50 text-red-600
                        dark:border-[rgba(239,68,68,0.25)] dark:bg-[rgba(239,68,68,0.08)] dark:text-red-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                      Stock Crítico
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        border border-[rgba(0,201,167,0.25)] bg-[rgba(0,201,167,0.07)] text-[#00C9A7]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00C9A7]" />
                      Nivel Óptimo
                    </span>
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