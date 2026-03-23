"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache"; // 🚀 Importado
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
        next: { tags: [`stock-branch-${branchId}`] },
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

    // El cambio de stock afecta a tres pantallas críticas.
    if (branchId) {
      // 1. Refrescamos la vista de Inventario (donde se cargan estos ajustes)
      revalidatePath(`/usuario/${branchId}/inventario`);

      // 2. Refrescamos la tabla de Productos (donde se ve el stock total/por sucursal)
      revalidatePath(`/usuario/${branchId}/productos`);

      // 3. Refrescamos la pantalla de Venta (para que el carrito sepa la disponibilidad real)
      revalidatePath(`/usuario/${branchId}/venta`);
    }
    return { success: "¡Stock actualizado correctamente!" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}