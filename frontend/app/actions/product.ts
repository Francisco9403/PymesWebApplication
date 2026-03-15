"use server";

import { PageResponse } from "@/types/Page";
import { ProductResponse } from "@/types/Product";
import { cookies } from "next/headers";

export async function getSupplierProductsAction(supplierId: number) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/supplier/${supplierId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        error: errorData?.message || "Error al obtener productos del proveedor",
      };
    }

    return await res.json();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

export async function compareCostsAction(productNames: string[]) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/compare-costs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(productNames),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.message || "Error al comparar costos" };
    }

    return await res.json();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

export async function procesarSku(sku: string) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/sku/${sku}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { error: data?.message || "No se encontró el producto" };
    }

    const product = await res.json();
    return product;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error desconocido" };
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "Error al crear el producto" };
    }

    // revalidatePath("/admin/products");

    return { success: "Producto creado correctamente" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Error inesperado" };
  }
}

export async function updateProduct(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const payload = {
    id: Number(formData.get("id")),
    name: formData.get("name"),
    ean13: formData.get("ean13"),
    baseCostPrice: Number(formData.get("baseCostPrice")),
    currentSalePrice: Number(formData.get("currentSalePrice")),
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message ?? "Error actualizando producto" };
    }

    // revalidatePath("/admin/products");

    return { success: "Producto actualizado correctamente" };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
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

export async function deleteProduct(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const productId = formData.get("productId");
  const branchId = formData.get("branchId");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/${productId}?branchId=${branchId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!res.ok) return { error: "No se pudo eliminar el producto" };

    // revalidatePath("/admin/products");

    return { success: "Producto eliminado" };
  } catch {
    return { error: "Error inesperado" };
  }
}

export async function confirmStrategicPricesAction() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/products/confirm-strategic`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        error: errorData?.message || "Error al confirmar precios estratégicos",
      };
    }

    return { success: "Precios estratégicos aplicados" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
