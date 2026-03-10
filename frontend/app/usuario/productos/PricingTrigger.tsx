"use client";

import { useState } from "react";
import { analyzeStrategicPricing } from "@/app/actions/pricing";
import { ProductResponse } from "@/types/Product";

export default function PricingTrigger({ products }: { products: ProductResponse[] }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            // Mandamos los nombres y categorías actuales a Gemini
            const result = await analyzeStrategicPricing(products);
            setSuggestions(result);
            console.log("Sugerencias de IA:", result);
            // Aquí abriríamos un modal para confirmar (paso siguiente)
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Asistente de Precios Estratégicos</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IA detectando estacionalidad y reposición</p>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isAnalyzing ? (
                    <span className="animate-pulse">Analizando Mercado...</span>
                ) : (
                    <>
                        <span className="text-lg">🪄</span>
                        Sugerir Aumentos
                    </>
                )}
            </button>
        </div>
    );
}