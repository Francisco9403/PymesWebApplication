"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// app/actions/finance.ts

export async function getExchangeRates() {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("API no disponible");

    const data = await res.json();

    // Función auxiliar para buscar por varios nombres posibles
    const findRate = (names: string[]) => {
      const found = data.find((d: any) => names.includes(d.casa.toLowerCase()));
      return found ? found.venta : 0; // Si no lo encuentra, devuelve 0 en vez de undefined
    };

    return {
      oficial: findRate(["oficial"]),
      // Probamos con 'mep' o 'bolsa' que son los nombres comunes
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

  const settings = {
    automaticMarkupEnabled: formData.get("enabled") === "true",
    thresholdPercentage: Number(formData.get("threshold")),
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/finance/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(settings),
    });

    if (!res.ok) throw new Error("Error al guardar");

    // revalidatePath("/usuario/finanzas");
    return { success: "Configuración actualizada" };
  } catch (err) {
    return { error: "Fallo al conectar con el servidor" };
  }
}
