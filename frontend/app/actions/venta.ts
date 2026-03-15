"use server";

import { cookies } from "next/headers";
import type { CartItem } from "@/types/Cart";
import { CreateSaleRequest } from "@/types/Sale";

export async function crearVenta(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;

  if (!jwt) return { error: "No autorizado" };

  const branchId = Number(formData.get("branchId"));
  const customerIdRaw = formData.get("customerId");
  const cartRaw = formData.get("cart");

  if (!cartRaw || typeof cartRaw !== "string")
    return { error: "Carrito vacío" };

  const cart: CartItem[] = JSON.parse(cartRaw);

  const body: CreateSaleRequest = {
    branchId,
    customerId: customerIdRaw ? Number(customerIdRaw) : null,
    channel: "WEB",
    items: cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/sales`, {
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
      return { error: data.message ?? "Falló la creación de venta" };
    }

    return { success: "Venta creada correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
