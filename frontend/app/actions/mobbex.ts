"use server";

export async function crearQr(total: number): Promise<
  | {
      qrString: string;
      externalReference: string;
    }
  | {
      error: string;
    }
> {
  try {
    const body = {
      total,
      currency: "ARS",
      description: "Venta POS",
      reference: `venta-${Date.now()}`,
      test: true,
      /* webhook: process.env.MOBBEX_WEBHOOK_URL, */
      intent: "qr",
      installments: [],
      sources: [],
      timeout: 300,
    };

    const res = await fetch(
      `https://api.mobbex.com/p/pos/${process.env.MOBBEX_POS_UID}/operation`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": process.env.MOBBEX_API_KEY!,
          "x-access-token": process.env.MOBBEX_ACCESS_TOKEN!,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return { error: `Error Mobbex: ${text}` };
    }

    const json = await res.json();

    if (!json.result) {
      return { error: "Error creando intención de pago" };
    }

    const token = json.data.intent.token;

    const qrString = token;

    return {
      qrString,
      externalReference: body.reference,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
