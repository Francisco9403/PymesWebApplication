"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  EditableOCRData,
  EditableProduct,
  RawOCRProduct,
  RawOCRResult,
} from "@/types/OCR";
import {
  analyzeDocumentAction,
  importSupplierDataAction,
} from "@/app/actions/proveedor";
import { useToast } from "@/layout/ToastProvider";
import { TaxCategory } from "@/types/TaxCategory";

export default function Proveedores() {
  const [ocrState, analyzeAction, analyzing] = useActionState(
    analyzeDocumentAction,
    null,
  );

  const [importState, importAction, importing] = useActionState(
    importSupplierDataAction,
    null,
  );

  const [data, setData] = useState<EditableOCRData | null>(null);
  const { show } = useToast();

  const derivedData = useMemo<EditableOCRData | null>(() => {
    if (!ocrState?.data) return null;

    const raw = ocrState.data as RawOCRResult;

    return {
      businessName: raw.businessName ?? raw.razonSocial ?? "",
      cuit: raw.cuit ?? "",
      taxCategory: raw.taxCategory ?? TaxCategory.CONSUMIDOR_FINAL,
      products: (raw.products ?? raw.productos ?? []).map(
        (p: RawOCRProduct): EditableProduct => ({
          name: p.name ?? p.descripcion ?? "",
          baseCostPrice: p.baseCostPrice ?? p.precio ?? 0,
          quantity: 1,
        }),
      ),
    };
  }, [ocrState]);

  useEffect(() => {
    if (ocrState?.error) show(ocrState.error, "error");
    if (importState?.error) show(importState.error, "error");
    if (importState?.success) show(importState.success, "success");
  }, [ocrState, importState, show]);

  const currentData = data ?? derivedData;

  // Si llegamos aquí, 'data' ya tiene los campos del proveedor y productos
  return (
    <>
      {!currentData ? (
        /* ─────────────────────────────────────────────
         ESTADO 1 — Carga de archivo
      ───────────────────────────────────────────── */
        <form
          action={analyzeAction}
          className="card-container p-8 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          {/* Encabezado */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-8">
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
              🏭
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Importar Proveedor
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Sube el archivo de lista de precios para analizar
              </p>
            </div>
          </div>

          {/* Zona de carga */}
          <label
            htmlFor="supplier-file"
            className="group flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-3 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 shadow-sm flex items-center justify-center text-2xl transition-all duration-200">
                📄
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                  Haz clic para seleccionar un archivo
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Formatos soportados:{" "}
                  <span className="font-bold">.xlsx, .csv, .pdf</span>
                </p>
              </div>
            </div>
            <input
              id="supplier-file"
              type="file"
              name="file"
              required
              className="sr-only"
            />
          </label>

          {/* Footer del form */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
            {analyzing ? (
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
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
                Procesando archivo...
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium">
                La IA extraerá los productos automáticamente
              </p>
            )}

            <button
              type="submit"
              disabled={analyzing}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <span className="animate-pulse">Analizando...</span>
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.304 0l-.306-.346z"
                    />
                  </svg>
                  Analizar Archivo
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* ─────────────────────────────────────────────
         ESTADO 2 — Revisión y confirmación de datos
      ───────────────────────────────────────────── */
        <form
          action={importAction}
          className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          {/* Encabezado con resumen */}
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

            {/* Campo Razón Social */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Razón Social del Proveedor
              </label>
              <input
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 bg-white transition-all placeholder:font-normal placeholder:text-slate-300"
                placeholder="Ej: Distribuidora SA"
                value={currentData.businessName ?? ""}
                onChange={(e) =>
                  setData({ ...currentData, businessName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Tabla de productos */}
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
                      {/* Número de fila */}
                      <td className="p-4">
                        <span className="text-xs font-black text-slate-300 tabular-nums">
                          {i + 1}
                        </span>
                      </td>

                      {/* Nombre */}
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

                      {/* Precio */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs font-black text-slate-400">
                            $
                          </span>
                          <input
                            type="number"
                            className="w-28 text-right bg-transparent font-mono font-black text-slate-900 outline-none border-b border-transparent focus:border-indigo-300 focus:bg-white focus:px-2 focus:rounded-lg py-0.5 tabular-nums"
                            value={p.baseCostPrice ?? 0}
                            onChange={(e) => {
                              const newProducts = [...currentData.products];
                              newProducts[i] = {
                                ...newProducts[i],
                                baseCostPrice: parseFloat(e.target.value) || 0,
                              };
                              setData({
                                ...currentData,
                                products: newProducts,
                              });
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hidden payload + Footer */}
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify({ ...data, branchId: 1 })}
          />

          <div className="flex items-center justify-between px-2">
            <p className="text-xs text-slate-400 font-medium">
              Podés editar cualquier campo antes de confirmar
            </p>
            <button
              type="submit"
              disabled={importing}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  Importar Datos
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
