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

export async function create(formData: FormData) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return null;

  const product = {
    sku: formData.get("sku"),
    ean13: formData.get("ean13"),
    baseCostPrice: formData.get("baseCostPrice"),
    currentSalePrice: formData.get("currentSalePrice"),
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error de Spring Boot:", response.status, errorText);
    return { error: "Falló la creación en el backend" };
  }

  const data = await response.json();

  revalidatePath("/admin/products");
}

export async function getProducts(
  page: number,
  size: number,
): Promise<PageResponse<ProductResponse> | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/products?page=${page}&size=${size}`,
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
      size,
      totalElements: 0,
      totalPages: 0,
    };
  }

  return res.json();
}
