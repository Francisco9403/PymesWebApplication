"use server";

import {
  BranchRequest,
  BranchResponse,
  CreateQROrderInput,
  PosRequest,
  PosResponse,
  Location,
  BranchSearchResponse,
} from "@/types/mercadopago";
import { randomUUID } from "crypto";

export async function crearQrMercadoPago(total: number) {
  const body: CreateQROrderInput = {
    external_reference: "sale_" + randomUUID(),
    title: "Venta POS",
    description: "Compra en tienda",
    total_amount: total,
    // notification_url: "", // por ahora opcional
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

  try {
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

    const data = await res.json();

    if (!res.ok) {
      return { error: data?.message || "Error inesperado de MercadoPago" };
    }

    return {
      qrString: data.qr_data,
      externalReference: body.external_reference,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

export async function obtenerSucursalPorExternalId(
  externalId: string,
): Promise<BranchResponse | null> {
  const res = await fetch(
    `https://api.mercadopago.com/users/${process.env.MP_USER_ID}/stores/search?external_id=${externalId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data: BranchSearchResponse = await res.json();

  return data.results.length > 0 ? data.results[0] : null;
}

export async function crearSucursal(
  name: string,
  external_id: string,
  location: Location,
): Promise<BranchResponse> {
  const body: BranchRequest = {
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

  const data: BranchResponse = await res.json();
  return data;
}

export async function crearCaja(
  name: string,
  store_id: number,
  external_store_id: string,
  external_id: string,
): Promise<PosResponse> {
  const body: PosRequest = {
    name,
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

  const data: PosResponse = await res.json();
  return data;
}
