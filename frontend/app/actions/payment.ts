"use server";

import { randomUUID } from "crypto";

export async function crearQrMercadoPago(total: number) {
  const body = {
    external_reference: "sale_" + randomUUID(),
    title: "Venta POS",
    description: "Compra en tienda",
    notification_url: `http://localhost:3000/api/mercadopago/webhook`,
    total_amount: total,
    items: [
      {
        sku_number: "POS-SALE",
        category: "marketplace",
        title: "Venta POS",
        description: "Compra en tienda",
        unit_price: total,
        quantity: 1,
        unit_measure: "unit",
        total_amount: total,
      },
    ],
  };

  const res = await fetch(
    `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${process.env.MP_USER_ID}/pos/${process.env.MP_POS_ID}/qrs`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error("MercadoPago error: " + error);
  }

  return body.external_reference;
}
