"use client";

import { PageResponse } from "@/types/Page";
import { ProductResponse } from "@/types/Product";
import Link from "next/link";
import EditProductButton from "./EditProductButton";
import DeleteProductButton from "./DeleteProductButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmStrategicPricesAction } from "@/app/actions/product";
import { runFullAIPricingAnalysis } from "@/app/actions/pricing";

export default function ProductTable({
  pageData,
  branchId,
}: {
  pageData: PageResponse<ProductResponse>;
  branchId: number;
}) {
  const { content, page, totalPages } = pageData;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // Estado para el botón de IA

  // Lógica para aplicar los cambios finales
  const handleConfirmPrices = async () => {
    if (
      !confirm(
        "¿Deseas aplicar todos los aumentos sugeridos por la IA? Los productos protegidos no serán afectados.",
      )
    )
      return;

    setLoading(true);
    try {
      const result = await confirmStrategicPricesAction();
      if (result.success) {
        alert("¡Precios actualizados correctamente!");
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Error inesperado en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVA LÓGICA PARA DISPARAR EL ANÁLISIS DE IA ---
  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Mandamos la lista de productos actual a Gemini
      const result = await runFullAIPricingAnalysis(content);

      if (result.success) {
        alert(
          `¡Análisis completado! Se generaron ${result.count} sugerencias estratégicas.`,
        );
        router.refresh(); // Esto hará que aparezcan los badges ⚡
      } else {
        alert("Error en IA: " + result.error);
      }
    } catch (err) {
      alert("Error al conectar con el servicio de IA.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* --- PANEL DE CONTROL DE PRECIOS --- */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mr-auto">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Estrategia de Precios
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Asistente Gemini 2.0 Flash
          </p>
        </div>

        <div className="flex gap-2">
          {/* BOTÓN 1: GENERA LAS SUGERENCIAS (BADGES) */}
          <button
            onClick={handleAIAnalysis}
            disabled={analyzing || loading}
            className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <span className="animate-pulse">IA Analizando...</span>
            ) : (
              <>
                <span className="text-base">🪄</span>
                Sugerir con IA
              </>
            )}
          </button>

          {/* BOTÓN 2: APLICA LOS CAMBIOS A LOS PRECIOS REALES */}
          <button
            onClick={handleConfirmPrices}
            disabled={loading || analyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Aplicando...</span>
            ) : (
              <>
                <span className="text-base">🚀</span>
                Aplicar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Producto
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  SKU
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Costo
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Venta
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Operaciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {content.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-slate-400 font-medium italic"
                  >
                    No hay productos registrados en el catálogo.
                  </td>
                </tr>
              )}

              {content.map((product) => {
                const hasStrategicRule =
                  product.strategicMultiplier &&
                  Number(product.strategicMultiplier) > 1;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </span>

                          {hasStrategicRule && (
                            <div className="relative group/badge">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-full border border-amber-200 animate-pulse cursor-help uppercase tracking-widest">
                                ⚡ Estratégico
                              </span>

                              <div className="absolute bottom-full left-0 mb-2 hidden group-hover/badge:block w-52 p-2.5 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl z-50 leading-relaxed border border-slate-700">
                                <p className="text-amber-400 font-black mb-1 uppercase tracking-tighter">
                                  Sugerencia IA (+
                                  {(
                                    (Number(product.strategicMultiplier) - 1) *
                                    100
                                  ).toFixed(0)}
                                  %)
                                </p>
                                {product.strategicReason ||
                                  "Aumento sugerido por estacionalidad o reposición."}
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          ID: {product.id}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {product.sku || "—"}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400">
                      ${Number(product.baseCostPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono font-black px-2 py-1 rounded-lg transition-colors ${
                            hasStrategicRule
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          ${Number(product.currentSalePrice ?? 0).toFixed(2)}
                        </span>
                        {product.ignoreStrategicRules && (
                          <span className="text-[9px] text-emerald-600 font-black uppercase mt-1 tracking-tighter">
                            🛡️ Protegido (Stock Alto)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <EditProductButton product={product} />
                        <DeleteProductButton
                          productId={product.id}
                          branchId={branchId}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Página <span className="text-slate-900">{page + 1}</span> de{" "}
          <span className="text-slate-900">{totalPages}</span>
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
