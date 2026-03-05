"use server";

type CreateQRResult =
  | { success: true; checkoutUrl: string; paymentId: number }
  | { success: false; message: string };

async function getBindAccessToken(): Promise<string> {
  const body = new URLSearchParams();

  body.append("client_id", process.env.BIND_CLIENT_ID!);
  body.append("client_secret", process.env.BIND_CLIENT_SECRET!);
  body.append("grant_type", "client_credentials");
  body.append("scope", "api://staging-bind.epays.services/.default");

  const res = await fetch(
    "https://login.microsoftonline.com/61ef5b89-8df3-499d-8c13-38fed5d09c72/oauth2/v2.0/token",
    { method: "POST", body },
  );

  const data = await res.json();
  console.log("Bind token response:", data);

  if (!res.ok) {
    throw new Error(data.error_description);
  }

  return data.access_token;
}

export async function createBindQR(amount: number): Promise<CreateQRResult> {
  try {
    const token = await getBindAccessToken();

    const res = await fetch(
      "https://gw-staging-qrbind.epays.services/bindentidad-cardnotpresent-v2/v2/api/v1.201/deuda",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigoCaja: "B00000623451",
          codigoSucursal: "S18803",
          codigoComercio: "C22903",
          moneda: "1",
          motivo: "Pago POS",
          tipoOrden: "1",
          montoTotal: amount,
          habilitaQR: true,
          habilitaTransferencia: true,
          habilitaTarjeta: false,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message ?? "Error creando deuda",
      };
    }

    return {
      success: true,
      checkoutUrl: data.url,
      paymentId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error conectando con Bind",
    };
  }
}
