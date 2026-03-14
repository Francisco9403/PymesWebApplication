"use server";

import { Branch } from "@/types/Branch";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

export async function createBranchAction(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token")?.value;

    if (!jwt) return { error: "No autorizado" };

    // LA POSTA: .has() nos dice si el tilde está puesto (true) o no (false)
    const checkValue = formData.has("isPointOfSale");

    const branchPayload = {
      name: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      // Mandamos los dos nombres para ganarle a Jackson si es mañoso
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
      const data = await response.json().catch(() => ({}));
      return { error: data.message ?? "Falló la creación de la sucursal" };
    }

    // revalidatePath("/usuario/sucursales");
    // revalidatePath("/usuario/inventario");

    return { success: "Sucursal creada correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
