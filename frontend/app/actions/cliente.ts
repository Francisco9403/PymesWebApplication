"use server";

import { CustomerListResponse, CustomerSaleResponse } from "@/types/Customer";
import { PageResponse } from "@/types/Page";
import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";

export async function updateCustomerTags(customerId: number, tags: string[]) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/customers/${customerId}/tags`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tags),
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        error:
          data?.message || "No se pudo actualizar las etiquetas del cliente",
      };
    }

    return tags;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateCustomerTag(
  customerId: number,
  salesHistory: CustomerSaleResponse[],
) {
  const historyText = salesHistory
    .map((s) => `Compra: $${s.totalAmount} el ${s.createdAt}`)
    .join("\n");

  const prompt = `
    Analiza el historial de compras y deuda del cliente y asigna etiquetas según:
    - "Cliente recurrente" si tiene compras frecuentes.
    - "Cliente en riesgo de abandono" si hace tiempo que no compra.
    - "Mayorista" si suele comprar grandes cantidades.
    Devuelve solo un array JSON de etiquetas.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\nHistorial:\n${historyText}` }],
        },
      ],
      config: { responseMimeType: "application/json" },
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return { error: "No se pudo generar etiquetas del cliente" };

    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const tags: string[] = JSON.parse(cleaned);

    const updated = await updateCustomerTags(customerId, tags);
    if ("error" in updated) return { error: updated.error };

    return tags;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

export async function getCustomers(page = 0, size = 20) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) throw new Error("No autorizado");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/customers?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  const data: PageResponse<CustomerListResponse> = await res.json();

  return data;
}

export async function getCustomerSales(
  customerId: number,
  page = 0,
  size = 10,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;

  if (!jwt) {
    return { error: "No autorizado" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/customers/${customerId}/sales?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { error: data.message ?? "Error obteniendo ventas" };
    }

    const data: PageResponse<CustomerSaleResponse> = await response.json();
    return data;
  } catch {
    return { error: "No se pudo conectar con el servidor" };
  }
}

export async function crearCliente(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const body = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    creditLimit: Number(formData.get("creditLimit") || 0),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { error: data.message ?? "Falló la creación del cliente" };
    }

    const id = await response.json();

    return {
      success: "Cliente creado correctamente",
      id,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
