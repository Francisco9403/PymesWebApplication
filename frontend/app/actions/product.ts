"use server";

import { PageResponse } from "@/types/Page";
import { Product, ProductResponse } from "@/types/Product";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function procesarSkuAction(sku: string): Promise<Product | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/sku/${sku}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Error procesando SKU:", error);
    return null;
  }
}

export async function create(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;

  if (!jwt) return { error: "No autorizado" };

  const rawData = {
    sku: formData.get("sku"),
    ean13: formData.get("ean13"),
    baseCostPrice: Number(formData.get("baseCostPrice")),
    currentSalePrice: Number(formData.get("currentSalePrice")),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(rawData),
    });

    const data = await response.json();

    if (!response.ok)
      return {
        error: data.message || "Error al crear el producto",
      };

    revalidatePath("/admin/products");

    return { success: "Producto creado correctamente" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Error inesperado" };
  }
}

export async function getProducts(params: {
  page: number;
  size: number;
  name?: string;
  belowMinStock?: string;
  sort?: string;
}): Promise<PageResponse<ProductResponse> | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return null;

  const search = new URLSearchParams();

  search.set("page", String(params.page));
  search.set("size", String(params.size));

  if (params.name) search.set("name", params.name);
  if (params.belowMinStock) search.set("belowMinStock", params.belowMinStock);
  if (params.sort) search.set("sort", params.sort);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/products?${search.toString()}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );

  if (!res.ok) {
    return {
      content: [],
      page: 0,
      size: params.size,
      totalElements: 0,
      totalPages: 0,
    };
  }

  return res.json();
}
