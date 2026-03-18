"use client";

import { runFullAIPricingAnalysis } from "@/app/actions/pricing";
import { useToast } from "@/layout/ToastProvider";
import { ProductResponse } from "@/types/Product";
import { useState } from "react";

export default function PricingTrigger({
  products,
}: {
  products: ProductResponse[];
}) {
  const { show } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await runFullAIPricingAnalysis(products);

      if (result.success) {
        show(result.success, "success");
      } else {
        show(result.error || "Error inesperado", "error");
      }
    } catch {
      show("Error inesperado", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl mb-6 transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
            bg-[rgba(168,85,247,0.1)]"
          style={{ border: "1px solid rgba(168,85,247,0.25)" }}
        >
          🪄
        </div>
        <div>
          <h3
            className="text-sm font-extrabold tracking-[-0.01em]
            text-slate-900 dark:text-[#F0EDE8]"
          >
            Asistente de Precios Estratégicos
          </h3>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mt-0.5
            text-slate-400 dark:text-[#555]"
          >
            IA detectando estacionalidad y reposición en Junín
          </p>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shrink-0
          border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
          bg-[#A855F7] text-white
          hover:bg-[#B870FF] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(168,85,247,0.35)]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {isAnalyzing ? (
          <>
            <svg
              className="animate-spin w-3.5 h-3.5"
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
            <span className="animate-pulse">Analizando Mercado...</span>
          </>
        ) : (
          <>
            <span className="text-base">🪄</span>
            Sugerir Aumentos
          </>
        )}
      </button>
    </div>
  );
}
