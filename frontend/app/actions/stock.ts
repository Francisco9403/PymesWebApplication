"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Branch } from "@/types/Branch";
import { ProductStock } from "@/types/Product";

export async function getBranches(): Promise<Branch[]> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return [];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/branches`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) return [];
  return res.json();
}

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

export async function addStockAction(formData: FormData) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const stockPayload = {
    product: { id: Number(formData.get("productId")) },
    branch: { id: Number(formData.get("branchId")) },
    quantity: Number(formData.get("quantity")),
    criticalThreshold: Number(formData.get("criticalThreshold") || 5),
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(stockPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error guardando stock:", response.status, errorText);
    return { error: "Falló la carga de stock" };
  }

  revalidatePath("/usuario/inventario");
}

export async function createBranchAction(formData: FormData) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const isPointOfSale = formData.get("isPointOfSale") === "on";

  const branchPayload = {
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    isPointOfSale: isPointOfSale,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/branches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(branchPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error creando sucursal:", response.status, errorText);
    return { error: "Falló la creación de la sucursal" };
  }

  revalidatePath("/usuario/sucursales");
  revalidatePath("/usuario/inventario");
}
