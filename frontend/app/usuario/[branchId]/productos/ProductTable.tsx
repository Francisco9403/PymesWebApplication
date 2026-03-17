"use client";

import { PageResponse } from "@/types/Page";
import { ProductResponse } from "@/types/Product";
import Link from "next/link";
import { useState } from "react";
import { confirmStrategicPricesAction } from "@/app/actions/product";
import { runFullAIPricingAnalysis } from "@/app/actions/pricing";
import { ActionButton } from "@/components/ActionButton";
import { useToast } from "@/layout/ToastProvider";

export default function ProductTable({
  pageData,
}: {
  pageData: PageResponse<ProductResponse>;
}) {
  const { content, page, totalPages } = pageData;
  const { show } = useToast();
  const [status] = useState({ loading: false, analyzing: false });

  const handleConfirmPrices = () => {
    if (!confirm("¿Deseas aplicar todos los aumentos sugeridos por la IA?"))
      return;

    runActionWithFeedback(confirmStrategicPricesAction, show);
  };

  const handleAIAnalysis = () => {
    runActionWithFeedback(() => runFullAIPricingAnalysis(content), show);
  };

  const runActionWithFeedback = async (
    action: () => Promise<{ success?: string; error?: string; count?: number }>,
    show: (
      message: string,
      type?: "success" | "info" | "warn" | "error",
    ) => void,
  ) => {
    try {
      const result = await action();

      if (result.success) {
        show(result.success, "success");
      } else {
        show(result.error || "Error inesperado", "error");
      }
    } catch {
      show("Error inesperado", "error");
    }
  };

  return (
    <div className="flex flex-col gap-5">
 
      {/* ── Strategy header bar ── */}
      <div
        className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 p-5 rounded-xl transition-colors
          bg-white border border-slate-200
          dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
      >
        <div className="mr-auto flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0
              bg-[rgba(168,85,247,0.1)]"
            style={{ border: "1px solid rgba(168,85,247,0.25)" }}
          >
            🪄
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-[-0.01em]
              text-slate-900 dark:text-[#F0EDE8]">
              Estrategia de Precios
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5
              text-slate-400 dark:text-[#555]">
              Asistente Gemini 2.0 Flash
            </p>
          </div>
        </div>
 
        <div className="flex gap-2">
          {/* Ghost AI button */}
          <ActionButton
            onClick={handleAIAnalysis}
            loading={status.analyzing}
            icon={<span>🪄</span>}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-150
              border-2 border-[#A855F7] text-[#A855F7] bg-transparent
              hover:bg-[rgba(168,85,247,0.08)] hover:-translate-y-px
              dark:border-[#A855F7] dark:text-[#A855F7] dark:hover:bg-[rgba(168,85,247,0.12)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Sugerir con IA
          </ActionButton>
 
          {/* Primary apply button */}
          <ActionButton
            onClick={handleConfirmPrices}
            loading={status.loading}
            icon={<span>🚀</span>}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-[transform,box-shadow,background-color] duration-150
              bg-[#FF6B35] text-white border-0
              hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(255,107,53,0.35)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Aplicar Cambios
          </ActionButton>
        </div>
      </div>
 
      {/* ── Products table ── */}
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
                <th className="p-4">Producto</th>
                <th className="p-4">SKU</th>
                <th className="p-4 text-right">Costo</th>
                <th className="p-4 text-right">Venta</th>
                <th className="p-4 text-right">Operaciones</th>
              </tr>
            </thead>
 
            <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
              {content.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm italic
                    text-slate-400 dark:text-[#444]">
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
                    className="group transition-colors
                      hover:bg-slate-50/80
                      dark:hover:bg-[rgba(255,107,53,0.03)]"
                  >
                    {/* Name + badge */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold transition-colors
                            text-slate-900 group-hover:text-[#FF6B35]
                            dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]">
                            {product.name}
                          </span>
 
                          {hasStrategicRule && (
                            <div className="relative group/badge">
                              <span
                                className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest animate-pulse cursor-help
                                  border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)] text-[#A855F7]"
                              >
                                ⚡ Estratégico
                              </span>
                              {/* Tooltip */}
                              <div
                                className="absolute bottom-full left-0 mb-2 hidden group-hover/badge:block w-52 p-3 rounded-xl shadow-2xl z-50 leading-relaxed
                                  bg-slate-900 border border-slate-700 text-white text-[10px]
                                  dark:bg-[rgba(18,18,24,0.98)] dark:border-[rgba(255,255,255,0.1)]"
                              >
                                <p className="font-bold mb-1 uppercase tracking-tight text-[#A855F7]">
                                  Sugerencia IA (+{((Number(product.strategicMultiplier) - 1) * 100).toFixed(0)}%)
                                </p>
                                {product.strategicReason || "Aumento sugerido por estacionalidad o reposición."}
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-[#444]">
                          ID: {product.id}
                        </span>
                      </div>
                    </td>
 
                    {/* SKU */}
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-[#555]">
                      {product.sku || "—"}
                    </td>
 
                    {/* Cost */}
                    <td className="p-4 text-right font-mono text-slate-400 dark:text-[#555]">
                      ${Number(product.baseCostPrice ?? 0).toFixed(2)}
                    </td>
 
                    {/* Sale price */}
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`font-mono font-extrabold px-2 py-1 rounded-lg text-xs transition-colors
                            ${hasStrategicRule
                              ? "border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)] text-[#A855F7]"
                              : "bg-slate-100 text-slate-900 dark:bg-[rgba(255,255,255,0.06)] dark:text-[#F0EDE8]"
                            }`}
                        >
                          ${Number(product.currentSalePrice ?? 0).toFixed(2)}
                        </span>
                        {product.ignoreStrategicRules && (
                          <span className="text-[9px] font-bold uppercase tracking-tight text-[#00C9A7]">
                            🛡️ Protegido
                          </span>
                        )}
                      </div>
                    </td>
 
                    {/* Row actions */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <ActionButton
                          onClick={handleAIAnalysis}
                          loading={status.analyzing || status.loading}
                          icon={<span>🪄</span>}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-150
                            border-2 border-[#A855F7] text-[#A855F7] bg-transparent
                            hover:bg-[rgba(168,85,247,0.08)]
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          IA
                        </ActionButton>
                        <ActionButton
                          onClick={handleConfirmPrices}
                          loading={status.loading || status.analyzing}
                          icon={<span>🚀</span>}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-[transform,box-shadow,background-color] duration-150
                            bg-[#FF6B35] text-white border-0
                            hover:bg-[#FF8555] hover:shadow-[0_6px_16px_rgba(255,107,53,0.35)]
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Aplicar
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* ── Pagination ── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
        <p className="text-[0.7rem] font-bold uppercase tracking-widest
          text-slate-400 dark:text-[#555]">
          Página{" "}
          <span className="text-slate-900 dark:text-[#F0EDE8]">{page + 1}</span>
          {" "}de{" "}
          <span className="text-slate-900 dark:text-[#F0EDE8]">{totalPages}</span>
        </p>
 
        <div className="flex gap-2">
          <Link
            href={`?page=${Math.max(0, page - 1)}`}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border
              ${page === 0
                ? "pointer-events-none bg-slate-50 border-slate-100 text-slate-300 dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.04)] dark:text-[#333]"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#AAA] dark:hover:border-[rgba(255,107,53,0.3)] dark:hover:bg-[rgba(255,107,53,0.04)]"
              }`}
          >
            ← Anterior
          </Link>
          <Link
            href={`?page=${Math.min(totalPages - 1, page + 1)}`}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border
              ${page >= totalPages - 1
                ? "pointer-events-none bg-slate-50 border-slate-100 text-slate-300 dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.04)] dark:text-[#333]"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#AAA] dark:hover:border-[rgba(255,107,53,0.3)] dark:hover:bg-[rgba(255,107,53,0.04)]"
              }`}
          >
            Siguiente →
          </Link>
        </div>
      </div>
    </div>
  );
}
