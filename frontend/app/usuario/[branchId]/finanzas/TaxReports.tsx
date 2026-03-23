"use client";

import { useState } from "react";

export default function TaxReports() {
  const [period, setPeriod] = useState(
    new Date().toISOString().split("T")[0].slice(0, 7),
  );

  const handleDownload = (type: "iva" | "retenciones") => {
    const endpoint = type === "iva" ? "libro" : "percepciones";
    window.open(
      `${process.env.NEXT_PUBLIC_API}/iva/${endpoint}?periodo=${period}`,
      "_blank",
    );
  };

  return (
    <div
      className="p-6 rounded-xl transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      <div
        className="flex items-center gap-3 pb-5 mb-6
          border-b border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
            bg-[rgba(255,107,53,0.1)]"
          style={{ border: "1px solid rgba(255,107,53,0.25)" }}
        >
          ⚖️
        </div>
        <div>
          <h2
            className="text-lg font-extrabold tracking-[-0.01em]
            text-slate-900 dark:text-[#F0EDE8]"
          >
            Libros y Exportación Legal
          </h2>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mt-0.5
            text-slate-500 dark:text-[#555]"
          >
            Generación de archivos para contador (ARCA / ARBA)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5
            text-slate-400 dark:text-[#555]"
          >
            Seleccionar Período Fiscal
          </label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all
              border bg-slate-50 border-slate-200 text-slate-700
              focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
              dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8]
              dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)]"
          />
        </div>

        <div className="flex flex-col gap-3 justify-end">
          <button
            onClick={() => handleDownload("iva")}
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest
              border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
              bg-[#FF6B35] text-white
              hover:bg-[#FF8555] hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(255,107,53,0.3)]"
          >
            📄 Libro IVA Digital (.txt)
          </button>

          <button
            onClick={() => handleDownload("retenciones")}
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest
              cursor-pointer transition-colors duration-150
              border-2 border-[rgba(255,107,53,0.3)] text-[#FF6B35] bg-transparent
              hover:border-[rgba(255,107,53,0.5)] hover:bg-[rgba(255,107,53,0.06)]
              dark:border-[rgba(255,107,53,0.25)] dark:hover:border-[rgba(255,107,53,0.45)] dark:hover:bg-[rgba(255,107,53,0.08)]"
          >
            📊 Reporte Percepciones (PDF)
          </button>
        </div>
      </div>

      <p
        className="text-[10px] italic text-center mt-6 pt-4
          border-t border-slate-100 dark:border-[rgba(255,255,255,0.06)]
          text-slate-400 dark:text-[#444]"
      >
        Los archivos generados cumplen con la normativa de{" "}
        <span className="font-bold not-italic text-slate-500 dark:text-[#555]">
          ARCA (SIRE)
        </span>{" "}
        y los regímenes de retención vigentes.
      </p>
    </div>
  );
}
