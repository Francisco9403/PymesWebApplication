"use server";

import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function runFullAIPricingAnalysis(products: any[]) {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token")?.value;
    if (!jwt) return { error: "No autorizado" };

    try {
        const result = await genAI.models.generateContent({
            // 🚀 Usamos el modelo estable de 2026
            model: "gemini-3-flash-preview",
            contents: [
                {
                    role: "user",
                    // FIX SINTAXIS: parts es un array de objetos { text: "..." }
                    parts: [{
                        text: `Actuá como un experto en retail en Junín, Argentina. 
            Hoy es ${new Date().toLocaleDateString()}.
            Analizá estos productos: ${JSON.stringify(products.map(p => ({name: p.name})))}
            Sugerí aumentos estratégicos por estacionalidad o inflación.
            Responde SOLO JSON puro con este formato: 
            [{"name": "...", "multiplier": 1.15, "reason": "..."}]`
                    }]
                }
            ],
            config: {
                responseMimeType: "application/json",
            },
        });

        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("La IA no devolvió resultados");

        const suggestions = JSON.parse(rawText);

        // 2. MANDAMOS LAS SUGERENCIAS AL BACKEND
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products/strategic-drafts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(suggestions),
        });

        if (!response.ok) throw new Error("Error al guardar borradores en el Backend");

        return { success: true, count: suggestions.length };

    } catch (error) {
        console.error("❌ Error en runFullAIPricingAnalysis:", error);
        return { error: "Falló el análisis: " + (error instanceof Error ? error.message : "Error desconocido") };
    }
}