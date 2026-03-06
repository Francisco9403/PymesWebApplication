"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Supplier } from "@/types/Supplier";
import { GoogleGenAI } from "@google/genai";
import { EditableOCRData, OCRResult } from "@/types/OCR";

export async function importSupplierData(
  data: EditableOCRData & { branchId: number },
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const payload = {
    businessName: data.businessName,
    cuit: data.cuit,
    taxCategory: data.taxCategory,
    products: data.products?.map((p) => ({
      name: p.name, // Enviamos el nombre
      baseCostPrice: p.baseCostPrice,
      quantity: p.quantity || 0,
    })),
    branchId: data.branchId,
  };

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
    const errorText = await response.text();
    console.error("❌ Error en backend /import:", response.status, errorText);
    return { error: "Error al importar datos en el servidor" };
  }

  revalidatePath("/usuario/proveedores");
  return { success: true };
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeImage(formData: FormData) {
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

    return JSON.parse(response.candidates![0].content!.parts![0].text!);
  } catch (error) {
    console.error("Error en OCR:", error);
    throw new Error("No se pudo procesar la imagen");
  }
}

export async function analyzeDocument(formData: FormData): Promise<OCRResult> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No se proporcionó archivo.");

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
              text: `Analiza este documento (factura, remito o lista). 
              Extrae: Razón Social, CUIT (solo números), Categoría Fiscal (mapea a: RESPONSABLE_INSCRIPTO, MONOTRIBUTO, EXENTO).
              También extrae la lista de productos con: name (descripción del producto) y baseCostPrice.
              Responde estrictamente en formato JSON.`,
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

    if (!rawText) {
      throw new Error("La IA no devolvió contenido.");
    }

    return JSON.parse(rawText) as OCRResult;
  } catch (error) {
    console.error("❌ Error en OCR Gemini:", error);
    throw new Error("No se pudo procesar el documento.");
  }
}

export async function getSuppliers(): Promise<Supplier[]> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return [];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/suppliers`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
