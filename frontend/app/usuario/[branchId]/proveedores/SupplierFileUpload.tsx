"use client";

import { useState } from "react";

export default function SupplierFileUpload({
  analyzeAction,
  analyzing,
}: {
  analyzeAction: (formData: FormData) => void;
  analyzing: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hasFile = !!selectedFile;
  return (
    <form
      action={analyzeAction}
      className="max-w-4xl mx-auto p-8 rounded-xl transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 pb-5 mb-8
          border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl
            bg-[rgba(255,107,53,0.1)]"
          style={{ border: "1px solid rgba(255,107,53,0.25)" }}
        >
          🏭
        </div>
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.01em] text-slate-900 dark:text-[#F0EDE8]">
            Importar Proveedor
          </h2>
          <p className="text-xs mt-0.5 text-slate-400 dark:text-[#555]">
            Subí el archivo de lista de precios para analizar
          </p>
        </div>
      </div>
 
      {/* Drop zone */}
      <label
        htmlFor="supplier-file"
        className={`group flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-xl transition-all duration-200
          ${analyzing
            ? "border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.04)] cursor-not-allowed"
            : hasFile
              ? "border-[rgba(0,201,167,0.4)] bg-[rgba(0,201,167,0.04)] hover:bg-[rgba(0,201,167,0.06)] cursor-pointer"
              : "border-slate-200 bg-slate-50 hover:border-[rgba(255,107,53,0.4)] hover:bg-[rgba(255,107,53,0.03)] cursor-pointer dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.02)] dark:hover:border-[rgba(255,107,53,0.4)] dark:hover:bg-[rgba(255,107,53,0.04)]"
          }`}
      >
        <div className="flex flex-col items-center gap-3 pointer-events-none">
 
          {/* Icon container */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200
              ${analyzing
                ? "bg-[rgba(255,107,53,0.08)] border border-[rgba(255,107,53,0.2)]"
                : hasFile
                  ? "bg-[rgba(0,201,167,0.1)] border border-[rgba(0,201,167,0.3)]"
                  : "bg-white border border-slate-200 group-hover:border-[rgba(255,107,53,0.3)] group-hover:bg-[rgba(255,107,53,0.04)] dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
              }`}
          >
            {analyzing ? (
              <svg className="animate-spin w-6 h-6" style={{ color: "#FF6B35" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : hasFile ? (
              <svg className="w-6 h-6" style={{ color: "#00C9A7" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-2xl">📄</span>
            )}
          </div>
 
          {/* Text */}
          <div className="text-center space-y-1">
            {analyzing ? (
              <>
                <p className="text-sm font-bold" style={{ color: "#FF6B35" }}>
                  Procesando archivo...
                </p>
                <p className="text-xs font-medium text-slate-400 dark:text-[#555]">
                  La IA está extrayendo los datos
                </p>
              </>
            ) : hasFile ? (
              <>
                <p className="text-sm font-bold max-w-xs truncate px-4" style={{ color: "#00C9A7" }}>
                  {selectedFile.name}
                </p>
                <p className="text-xs font-medium" style={{ color: "#00C9A7", opacity: 0.7 }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB · Listo para analizar
                </p>
                <p className="text-[11px] text-slate-400 dark:text-[#555] pt-0.5">
                  Clic para cambiar archivo
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold transition-colors text-slate-700 group-hover:text-[#FF6B35] dark:text-[#AAA] dark:group-hover:text-[#FF6B35]">
                  Hacé clic para seleccionar un archivo
                </p>
                <p className="text-xs text-slate-400 dark:text-[#555]">
                  Formatos soportados:{" "}
                  <span className="font-bold text-slate-600 dark:text-[#888]">.xlsx, .csv, .pdf</span>
                </p>
              </>
            )}
          </div>
        </div>
 
        <input
          id="supplier-file"
          type="file"
          name="file"
          required
          disabled={analyzing}
          className="sr-only"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />
      </label>
 
      {/* Footer */}
      <div
        className="flex items-center justify-between mt-6 pt-5
          border-t border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
      >
        <p className="text-xs text-slate-400 dark:text-[#555]">
          {hasFile && !analyzing
            ? "Revisá el nombre y presioná Analizar para continuar"
            : "La IA extraerá los productos automáticamente"}
        </p>
 
        <button
          type="submit"
          disabled={analyzing || !hasFile}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-[0.02em]
            border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
            bg-[#FF6B35] text-white
            hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(255,107,53,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {analyzing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="animate-pulse">Analizando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.304 0l-.306-.346z" />
              </svg>
              Analizar Archivo
            </>
          )}
        </button>
      </div>
    </form>
  );
}
