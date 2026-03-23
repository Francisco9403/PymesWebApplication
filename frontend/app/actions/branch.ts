"use server";

import { Branch } from "@/types/Branch";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
export async function getBranches(): Promise<Branch[]> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return [];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/branches`, {
    cache: "no-store",
    next: { tags: ["branches-list"] },
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) return [];
  return res.json();
}

export async function createBranchAction(
    prevState: { error?: string; success?: string } | null,
    formData: FormData,
) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token")?.value;

    if (!jwt) return { error: "No autorizado" };

    const checkValue = formData.has("isPointOfSale");

    const branchPayload = {
      name: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      isPointOfSale: checkValue,
      pointOfSale: checkValue,
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
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message ?? "Falló la creación de la sucursal" };
    }

    // Al crear una sucursal, queremos que el cambio impacte en:
    // 1. La tabla de gestión de sucursales.
    revalidatePath("/usuario/sucursales");

    // 2. El selector global (que suele estar en el layout de /usuario)
    // Usamos "layout" para asegurar que el combo de sucursales se actualice.
    revalidatePath("/usuario", "layout");

    // 3. Opcional: El inventario, ya que ahora hay una sucursal nueva lista para recibir stock.
    revalidatePath("/usuario/inventario");

    return { success: "Sucursal creada correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}