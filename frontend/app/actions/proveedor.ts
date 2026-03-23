"use server";

import { cookies } from "next/headers";
import { Supplier } from "@/types/Supplier";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

export async function getSuppliers(branchId: string): Promise<{
  data?: Supplier[];
  error?: string;
}> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/suppliers?branchId=${branchId}`, {
      next: { tags: [`suppliers-${branchId}`] },
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.message || "Error al obtener proveedores" };
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error inesperado",
    };
  }
}

export async function importSupplierData(
    prevState: { error?: string; success?: string } | null,
    formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const payload = JSON.parse(formData.get("payload") as string);
  const branchId = payload.branchId;

  try {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/suppliers/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "Error al importar datos" };
    }
    if (branchId) {
      revalidatePath(`/usuario/${branchId}/proveedores`);
    }

    return { success: "Proveedor cargado correctamente" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error inesperado" };
  }
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string
});

export async function analyzeImage(
    prevState: { error?: string; success?: string } | null,
    formData: FormData,
) {
  const file = formData.get("image") as File;
  if (!file) throw new Error("No se proporcionó ninguna imagen.");

  const bytes = await file.arrayBuffer();
  const base64Image = Buffer.from(bytes).toString("base64");

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Analiza esta imagen y extrae: Razón Social, CUIT (solo números), y Categoría Fiscal (mapea a: RESPONSABLE_INSCRIPTO, MONOTRIBUTO, EXENTO). Responde solo con un JSON puro.",
            },
            {
              inlineData: {
                data: base64Image,
                mimeType: file.type,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return { error: "No se pudo analizar la imagen" };

    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error inesperado" };
  }
}

export async function analyzeDocument(
    prevState: { error?: string; success?: string } | null,
    formData: FormData,
) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No se proporcionó archivo" };

  const bytes = await file.arrayBuffer();
  const base64Data = Buffer.from(bytes).toString("base64");

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analiza este documento (factura, remito o lista). Extrae razón social, CUIT, categoría fiscal y productos (name, baseCostPrice, quantity). Devuelve estrictamente JSON.`,
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return { error: "No se pudo analizar el documento" };

    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return { data: JSON.parse(cleaned) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error inesperado" };
  }
}