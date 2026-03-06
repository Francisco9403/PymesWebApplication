"use server";

import { randomUUID } from "crypto";

export async function crearQrMercadoPago(total: number) {
  const body = {
    external_reference: "sale_" + randomUUID(),
    title: "Venta POS",
    description: "Compra en tienda",
    /* notification_url: `http://localhost:3000/api/mercadopago/webhook`, */
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
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error("MercadoPago error: " + error);
  }

  const data = await res.json();

  return {
    qrString: data.qr_data,
    externalReference: body.external_reference,
  };
}

export interface CrearSucursalInput {
  name: string;
  external_id: string;
  business_hours?: any;
  location: {
    street_number: string;
    street_name: string;
    city_name: string;
    state_name: string;
    latitude: number;
    longitude: number;
    reference?: string;
  };
}

export interface LocationData {
  street_number: string;
  street_name: string;
  city_name: string;
  state_name: string;
  latitude: number;
  longitude: number;
  reference: string;
}

export async function obtenerSucursalPorExternalId(externalId: string) {
  const res = await fetch(
    `https://api.mercadopago.com/users/${process.env.MP_USER_ID}/stores/search?external_id=${externalId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.results && data.results.length > 0 ? data.results[0] : null;
}

export async function crearSucursal(
  name: string,
  external_id: string,
  location: LocationData,
) {
  const body = {
    name,
    external_id,
    location,
  };

  const res = await fetch(
    `https://api.mercadopago.com/users/${process.env.MP_USER_ID}/stores`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error de MercadoPago al crear sucursal: " + error);
  }

  const data = await res.json();
  return data;
}

export async function crearCaja(
  name: string,
  store_id: number,
  external_store_id: string,
  external_id: string,
) {
  const body = {
    name,
    fixed_amount: true,
    store_id,
    external_store_id,
    external_id,
  };

  const res = await fetch(`https://api.mercadopago.com/pos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error de MercadoPago al crear caja: " + error);
  }

  const data = await res.json();
  return data;
}
