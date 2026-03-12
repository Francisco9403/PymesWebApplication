"use server";

import { CustomerListResponse, CustomerSaleResponse } from "@/types/Customer";
import { PageResponse } from "@/types/Page";
import { cookies } from "next/headers";

export async function getCustomers(page = 0, size = 20) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) throw new Error("No autorizado");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/customers?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", res.status, text);
    throw new Error(`Error ${res.status}`);
  }

  const data: PageResponse<CustomerListResponse> = await res.json();

  return data;
}

export async function getCustomerSales(
  customerId: number,
  page = 0,
  size = 10,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) throw new Error("No autorizado");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/customers/${customerId}/sales?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Error fetching sales");
  }

  const data: PageResponse<CustomerSaleResponse> = await res.json();

  return data;
}

export async function crearCliente(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;
  if (!jwt) return { error: "No autorizado" };

  const body = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    creditLimit: Number(formData.get("creditLimit") || 0),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { error: data.message ?? "Falló la creación del cliente" };
    }

    const id = await response.json();

    return {
      success: "Cliente creado correctamente",
      id,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
