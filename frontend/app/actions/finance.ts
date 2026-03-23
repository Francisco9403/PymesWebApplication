"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { DolarApiRate } from "@/types/dolar";

export async function getExchangeRates() {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("API no disponible");

    const data: DolarApiRate[] = await res.json();

    const findRate = (names: string[]) => {
      const found = data.find((d) => names.includes(d.casa.toLowerCase()));
      return found ? found.venta : 0;
    };

    return {
      oficial: findRate(["oficial"]),
      mep: findRate(["mep", "bolsa"]),
      cripto: findRate(["cripto", "ccb"]),
    };
  } catch (err) {
    console.error("Error en cotizaciones:", err);
    return { oficial: 0, mep: 0, cripto: 0 };
  }
}

export async function updateMarkupSettings(formData: FormData) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const branchId = formData.get("branchId");

  const settings = {
    automaticMarkupEnabled: formData.get("enabled") === "true",
    thresholdPercentage: Number(formData.get("threshold")),
  };

  try {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/finance/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(settings),
        },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { error: data.message ?? "Falló la actualización de valor" };
    }

    // Al cambiar la configuración financiera, refrescamos la vista de finanzas
    // y la de productos, ya que los precios calculados podrían cambiar.
    if (branchId) {
      revalidatePath(`/usuario/${branchId}/finanzas`);
      revalidatePath(`/usuario/${branchId}/productos`);
    } else {
      // Si es una configuración global, refrescamos el layout de usuario
      revalidatePath("/usuario", "layout");
    }

    return { success: "Configuración actualizada" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}