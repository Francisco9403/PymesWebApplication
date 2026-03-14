"use server";

import { ProductResponse } from "@/types/Product";
import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runFullAIPricingAnalysis(products: ProductResponse[]) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Actuá como un experto en retail en Junín, Argentina. 
            Hoy es ${new Date().toLocaleDateString()}.
            Analizá estos productos: ${JSON.stringify(products.map((p) => ({ name: p.name })))}
            Sugerí aumentos estratégicos por estacionalidad o inflación.
            Responde SOLO JSON puro con este formato: 
            [{"name": "...", "multiplier": 1.15, "reason": "..."}]`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText)
      return {
        error: "La IA no devolvió resultados",
      };

    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const suggestions = JSON.parse(cleaned);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/strategic-drafts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(suggestions),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        error:
          errorData?.message || "Error al guardar borradores en el Backend",
      };
    }

    return {
      success: `Se generaron ${suggestions.length} sugerencias estratégicas`,
      count: suggestions.length,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
