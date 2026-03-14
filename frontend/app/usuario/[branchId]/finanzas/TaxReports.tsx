"use client";

import { useState } from "react";

export default function TaxReports() {
    const [period, setPeriod] = useState(new Date().toISOString().split('T')[0].slice(0, 7)); // Formato YYYY-MM

    const handleDownload = (type: "iva" | "retenciones") => {
        const [year, month] = period.split("-");
        const endpoint = type === "iva" ? "iva-ventas" : "retenciones";
        // Usamos la URL de tu backend de Spring Boot
        window.open(`${process.env.NEXT_PUBLIC_API}/finance/export/${endpoint}?month=${month}&year=${year}`, "_blank");
    };

    return (
        <div className="card-container p-6 bg-white border-slate-200 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-6">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">⚖️</div>
                <div>
                    <h2 className="text-xl font-black text-slate-900">Libros y Exportación Legal</h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Generación de archivos para contador (AFIP/ARBA)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selector de Período */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Seleccionar Período Fiscal</label>
                    <input
                        type="month"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-3 justify-end">
                    <button
                        onClick={() => handleDownload("iva")}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >📄 Libro IVA Digital (.txt)
                    </button>
                    <button
                        onClick={() => handleDownload("retenciones")}
                        className="w-full bg-white text-indigo-600 border-2 border-indigo-50 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                        📊 Reporte Percepciones (PDF)
                    </button>
                </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 italic text-center border-t border-slate-50 pt-4">
                Los archivos generados cumplen con la normativa de **AFIP (SIRE)** y los regímenes de retención
                vigentes.
            </p>
        </div>
    );
}