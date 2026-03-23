"use client";

import { FiscalOrigin } from "@/types/FiscalOrigin";
import { IvaCondition } from "@/types/IvaCondition";
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
  branchId: string;
}) {
  return (
    <form
      action={importAction}
      className="max-w-4xl mx-auto flex flex-col gap-5"
    >
      <div
        className="p-6 rounded-xl transition-colors
          bg-white border border-slate-200
          dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
      >
        <div
          className="flex items-center gap-3 pb-4 mb-5
            border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl
              bg-[rgba(0,201,167,0.1)] dark:bg-[rgba(0,201,167,0.1)]"
            style={{ border: "1px solid rgba(0,201,167,0.25)" }}
          >
            ✅
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-[-0.01em] text-slate-900 dark:text-[#F0EDE8]">
              Revisión de Datos
            </h2>
            <p className="text-xs mt-0.5 text-slate-400 dark:text-[#555]">
              Verificá y editá la información antes de importar
            </p>
          </div>

          <div className="ml-auto">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide
                border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[#FF6B35]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              {currentData.products.length} Productos detectados
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">
            Razón Social del Proveedor
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all
              border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 placeholder:font-normal
              focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
              dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#333]
              dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)]"
            placeholder="Ej: Distribuidora SA"
            name="businessName"
            value={currentData.businessName ?? ""}
            onChange={(e) =>
              setData({ ...currentData, businessName: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">
              CUIT
            </label>
            <input
              name="cuit"
              value={currentData.cuit ?? ""}
              onChange={(e) =>
                setData({ ...currentData, cuit: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all
                border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300
                focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
                dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#333]
                dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:bg-[rgba(255,255,255,0.06)]"
              placeholder="20-12345678-9"
              type="text"
              inputMode="numeric"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">
              Condición IVA
            </label>
            <select
              name="ivaCondition"
              value={currentData.ivaCondition ?? IvaCondition.CONSUMIDOR_FINAL}
              onChange={(e) =>
                setData({
                  ...currentData,
                  ivaCondition: e.target.value as IvaCondition,
                })
              }
              className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all
                border bg-slate-50 border-slate-200 text-slate-900
                focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
                dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8]
                dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:bg-[rgba(255,255,255,0.06)]"
            >
              {Object.values(IvaCondition).map((iva) => (
                <option key={iva} value={iva}>
                  {iva}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5 text-slate-400 dark:text-[#555]">
              Origen Fiscal
            </label>
            <select
              name="fiscalOrigin"
              value={currentData.fiscalOrigin ?? FiscalOrigin.NACIONAL}
              onChange={(e) =>
                setData({
                  ...currentData,
                  fiscalOrigin: e.target.value as FiscalOrigin,
                })
              }
              className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all
                border bg-slate-50 border-slate-200 text-slate-900
                focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
                dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8]
                dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:bg-[rgba(255,255,255,0.06)]"
            >
              {Object.values(FiscalOrigin).map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden transition-colors
          bg-white border border-slate-200
          dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
      >
        <div
          className="flex items-center justify-between px-5 py-4
            border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-[#AAA]">
            Lista de Productos
          </h3>
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 dark:text-[#555]">
            {currentData.products.length} ítems
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className="border-b text-[10px] font-extrabold uppercase tracking-widest
                bg-slate-50 border-slate-200 text-slate-400
                dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)] dark:text-[#444]"
            >
              <tr>
                <th className="p-4 w-8">#</th>
                <th className="p-4">Nombre del Producto</th>
                <th className="p-4 w-36">EAN13</th>
                <th className="p-4 w-24 text-right">Cantidad</th>
                <th className="p-4 w-40 text-right">Precio de Costo</th>
              </tr>
            </thead>

            <tbody
              className="divide-y
                divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]"
            >
              {currentData.products.map((p, i) => (
                <tr
                  key={i}
                  className="group transition-colors
                    hover:bg-slate-50/80
                    dark:hover:bg-[rgba(255,107,53,0.03)]"
                >
                  <td className="p-4">
                    <span className="text-xs font-bold tabular-nums text-slate-300 dark:text-[#333]">
                      {i + 1}
                    </span>
                  </td>

                  <td className="p-4">
                    <input
                      className="w-full bg-transparent outline-none py-0.5 transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal border-b border-transparent focus:border-[rgba(255,107,53,0.4)] focus:bg-[rgba(255,107,53,0.04)] focus:px-2 focus:rounded-lg dark:text-[#F0EDE8] dark:placeholder:text-[#333] dark:focus:border-[rgba(255,107,53,0.4)] dark:focus:bg-[rgba(255,107,53,0.06)] group-hover:text-[#FF6B35] dark:group-hover:text-[#FF6B35]"
                      placeholder="Nombre del producto"
                      value={p.name ?? ""}
                      onChange={(e) => {
                        const next = [...currentData.products];
                        next[i] = { ...next[i], name: e.target.value };
                        setData({ ...currentData, products: next });
                      }}
                    />
                  </td>

                  <td className="p-4">
                    <input
                      className="bg-transparent outline-none py-0.5 transition-all font-mono text-slate-700 tabular-nums border-b border-transparent focus:border-[rgba(255,107,53,0.4)] focus:bg-[rgba(255,107,53,0.04)] focus:px-2 focus:rounded-lg dark:text-[#AAA] dark:focus:border-[rgba(255,107,53,0.4)] dark:focus:bg-[rgba(255,107,53,0.06)] w-40"
                      placeholder="EAN13"
                      value={p.ean13 ?? ""}
                      onChange={(e) => {
                        const next = [...currentData.products];
                        next[i] = { ...next[i], ean13: e.target.value };
                        setData({ ...currentData, products: next });
                      }}
                    />
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      className="bg-transparent outline-none py-0.5 transition-all font-mono text-slate-700 tabular-nums border-b border-transparent focus:border-[rgba(255,107,53,0.4)] focus:bg-[rgba(255,107,53,0.04)] focus:px-2 focus:rounded-lg dark:text-[#AAA] dark:focus:border-[rgba(255,107,53,0.4)] dark:focus:bg-[rgba(255,107,53,0.06)] w-20 text-right font-bold"
                      value={p.quantity ?? 1}
                      onChange={(e) => {
                        const next = [...currentData.products];
                        next[i] = {
                          ...next[i],
                          quantity: parseInt(e.target.value) || 1,
                        };
                        setData({ ...currentData, products: next });
                      }}
                    />
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400 dark:text-[#555]">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="bg-transparent outline-none py-0.5 transition-all font-mono text-slate-700 tabular-nums border-b border-transparent focus:border-[rgba(255,107,53,0.4)] focus:bg-[rgba(255,107,53,0.04)] focus:px-2 focus:rounded-lg dark:text-[#AAA] dark:focus:border-[rgba(255,107,53,0.4)] dark:focus:bg-[rgba(255,107,53,0.06)] w-28 text-right font-extrabold"
                          value={p.baseCostPrice ?? 0}
                          onChange={(e) => {
                            const next = [...currentData.products];
                            next[i] = {
                              ...next[i],
                              baseCostPrice: parseFloat(e.target.value) || 0,
                            };
                            setData({ ...currentData, products: next });
                          }}
                        />
                      </div>

                      {p.lastCostPrice !== undefined &&
                        (() => {
                          const diff = p.baseCostPrice - p.lastCostPrice;
                          const pct = (diff / p.lastCostPrice) * 100;
                          const isUp = pct > 0.1;
                          const isDown = pct < -0.1;

                          return (
                            <div
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tight
                              bg-slate-50 border border-slate-100
                              dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)]"
                            >
                              <span className="text-slate-400 dark:text-[#555]">
                                Prev: ${p.lastCostPrice.toFixed(2)}
                              </span>
                              {isUp && (
                                <span className="text-red-500 dark:text-red-400 flex items-center gap-0.5">
                                  ↑ {pct.toFixed(1)}%
                                </span>
                              )}
                              {isDown && (
                                <span className="text-[#00C9A7] flex items-center gap-0.5">
                                  ↓ {Math.abs(pct).toFixed(1)}%
                                </span>
                              )}
                              {!isUp && !isDown && (
                                <span className="italic text-slate-400 dark:text-[#444]">
                                  Sin cambios
                                </span>
                              )}
                            </div>
                          );
                        })()}
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

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400 dark:text-[#555]">
          {currentData.products.some(
            (p) => p.lastCostPrice && p.baseCostPrice > p.lastCostPrice,
          ) ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold
                  border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[#FF6B35]"
              >
                ⚠️ Se detectaron aumentos en los costos de algunos productos.
              </span>
            </span>
          ) : (
            "Podés editar cualquier campo antes de confirmar"
          )}
        </p>

        <button
          type="submit"
          disabled={importing}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-[0.02em]
            border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
            bg-[#FF6B35] text-white
            hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(255,107,53,0.3)]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
