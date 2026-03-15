"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ProductStock } from "@/types/Product";

export async function getStockByBranch(
  branchId: number,
): Promise<ProductStock[]> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return [];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/stock/branch/${branchId}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${jwt}` },
    },
  );

  if (!res.ok) return [];
  return res.json();
}

export async function addStockAction(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const branchId = Number(formData.get("branchId"));

  const stockPayload = {
    product: { id: Number(formData.get("productId")) },
    branch: { id: Number(formData.get("branchId")) },
    quantity: Number(formData.get("quantity")),
    criticalThreshold: Number(formData.get("criticalThreshold") || 5),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(stockPayload),
    });

    const data = await response.json();

    if (!response.ok)
      return {
        error: data.message || "Error al cargar stock",
      };

    revalidatePath(`/usuario/${branchId}/inventario`);
    return { success: "¡Stock actualizado correctamente!" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
