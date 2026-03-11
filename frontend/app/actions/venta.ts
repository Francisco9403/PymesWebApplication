"use server";

import { cookies } from "next/headers";
import type { CartItem } from "@/types/Cart";

type CreateSaleItemRequest = {
  productId: number;
  quantity: number;
};

type CreateSaleRequest = {
  branchId: number;
  customerId?: number | null;
  channel: "WEB" | "INSTAGRAM" | "WHATSAPP" | "POS_PHYSICAL";
  items: CreateSaleItemRequest[];
};

export async function crearVenta(cart: CartItem[], branchId: number) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const body: CreateSaleRequest = {
    branchId: branchId,
    customerId: null,
    channel: "WEB",
    items: cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error creando venta: " + error);
  }

  return true;
}
