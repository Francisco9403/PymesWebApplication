"use client";

import { EditableOCRData } from "@/types/OCR";

export default function SupplierDataReview({
  currentData,
  setData,
  importAction,
  importing,
  branchId,
}: {
  currentData: EditableOCRData;
  setData: React.Dispatch<React.SetStateAction<EditableOCRData | null>>;
  importAction: (formData: FormData) => void;
  importing: boolean;
  branchId: number;
}) {
  return (
    <form
      action={importAction}
      className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div className="card-container p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
            ✅
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Revisión de Datos
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Verificá y editá la información antes de importar
            </p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-black uppercase tracking-wide border border-indigo-100">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {currentData.products.length} Productos detectados
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
            Razón Social del Proveedor
          </label>
          <input
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 bg-white transition-all placeholder:font-normal placeholder:text-slate-300"
            placeholder="Ej: Distribuidora SA"
            name="businessName"
            value={currentData.businessName ?? ""}
            onChange={(e) =>
              setData({ ...currentData, businessName: e.target.value })
            }
          />
        </div>
      </div>

      <div className="card-container overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
            Lista de Productos
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {currentData.products.length} ítems
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest w-8">
                  #
                </th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">
                  Nombre del Producto
                </th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest w-36">
                  EAN13
                </th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest text-right w-24">
                  Cantidad
                </th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest text-right w-40">
                  Precio de Costo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.products.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="p-4">
                    <span className="text-xs font-black text-slate-300 tabular-nums">
                      {i + 1}
                    </span>
                  </td>
                  <td className="p-4">
                    <input
                      className="w-full bg-transparent font-bold text-slate-900 group-hover:text-indigo-600 transition-colors outline-none border-b border-transparent focus:border-indigo-300 focus:bg-white focus:px-2 focus:rounded-lg py-0.5 placeholder:text-slate-300 placeholder:font-normal"
                      placeholder="Nombre del producto"
                      value={p.name ?? ""}
                      onChange={(e) => {
                        const newProducts = [...currentData.products];
                        newProducts[i] = {
                          ...newProducts[i],
                          name: e.target.value,
                        };
                        setData({ ...currentData, products: newProducts });
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      className="w-40 bg-transparent font-mono text-slate-700 outline-none border-b border-transparent focus:border-indigo-300 focus:bg-white focus:px-2 focus:rounded-lg py-0.5"
                      placeholder="EAN13"
                      value={p.ean13 ?? ""}
                      onChange={(e) => {
                        const newProducts = [...currentData.products];
                        newProducts[i] = {
                          ...newProducts[i],
                          ean13: e.target.value,
                        };
                        setData({ ...currentData, products: newProducts });
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="w-20 text-right bg-transparent font-mono font-bold text-slate-900 outline-none border-b border-transparent focus:border-indigo-300 focus:bg-white focus:px-2 focus:rounded-lg py-0.5"
                      value={p.quantity ?? 1}
                      onChange={(e) => {
                        const newProducts = [...currentData.products];
                        newProducts[i] = {
                          ...newProducts[i],
                          quantity: parseInt(e.target.value) || 1,
                        };
                        setData({ ...currentData, products: newProducts });
                      }}
                    />
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-xs font-black text-slate-400">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="w-28 text-right bg-transparent font-mono font-black text-slate-900 outline-none border-b border-transparent focus:border-indigo-300 focus:bg-white focus:px-2 focus:rounded-lg py-0.5 tabular-nums"
                          value={p.baseCostPrice ?? 0}
                          onChange={(e) => {
                            const newProducts = [...currentData.products];
                            newProducts[i] = {
                              ...newProducts[i],
                              baseCostPrice: parseFloat(e.target.value) || 0,
                            };
                            setData({ ...currentData, products: newProducts });
                          }}
                        />
                      </div>

                      {p.lastCostPrice !== undefined && (
                        <div className="mt-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 shadow-sm">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                            Prev: ${p.lastCostPrice.toFixed(2)}
                          </span>
                          {(() => {
                            const diff = p.baseCostPrice - p.lastCostPrice;
                            const percent = (diff / p.lastCostPrice) * 100;

                            if (percent > 0.1) {
                              return (
                                <span className="text-[10px] font-black text-red-500 flex items-center">
                                  <span className="mr-0.5">↑</span>
                                  {percent.toFixed(1)}%
                                </span>
                              );
                            }
                            if (percent < -0.1) {
                              return (
                                <span className="text-[10px] font-black text-emerald-500 flex items-center">
                                  <span className="mr-0.5">↓</span>
                                  {Math.abs(percent).toFixed(1)}%
                                </span>
                              );
                            }
                            return (
                              <span className="text-[10px] font-bold text-slate-400 tracking-tighter ml-1 italic">
                                Sin cambios
                              </span>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <input
        type="hidden"
        name="payload"
        value={JSON.stringify({ ...currentData, branchId })}
      />
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-400 font-medium">
          {currentData.products.some(
            (p) => p.lastCostPrice && p.baseCostPrice > p.lastCostPrice,
          )
            ? "⚠️ Se detectaron aumentos en los costos de algunos productos."
            : "Podés editar cualquier campo antes de confirmar"}
        </p>
        <button
          type="submit"
          disabled={importing}
          className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-indigo-100"
        >
          {importing ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="animate-pulse">Importando...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Confirmar Importación
            </>
          )}
        </button>
      </div>
    </form>
  );
}
