"use client";

import { useState } from "react";
import CustomerPurchases from "./CustomerPurchases";
import { CustomerListResponse } from "@/types/Customer";

export default function CustomerTable({
  customers,
}: {
  customers: CustomerListResponse[];
}) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListResponse | null>(null);

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-left">Saldo</th>
            <th className="p-3 text-left">Límite de crédito</th>
            <th className="p-3 text-left">Etiquetas</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="p-3">{customer.name}</td>

              <td className="p-3">{customer.phone}</td>

              <td className="p-3">
                {customer.currentDebt > 0 ? (
                  <span className="text-red-600">
                    Debe ${customer.currentDebt}
                  </span>
                ) : (
                  <span className="text-green-600">
                    ${Math.abs(customer.currentDebt)}
                  </span>
                )}
              </td>

              <td className="p-3">${customer.creditLimit ?? "Sin límite"}</td>

              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  {customer.tags && customer.tags.length > 0 ? (
                    customer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded bg-gray-200"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">Sin etiquetas</span>
                  )}
                </div>
              </td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="text-blue-600"
                >
                  Ver compras
                </button>

                <a
                  href={`https://wa.me/${customer.phone}?text=${encodeURIComponent(
                    `Hola ${customer.name}, te recordamos que tenés un saldo pendiente. Podés pagar desde este link: https://tuapp.com/pagar/${customer.id}`,
                  )}`}
                  target="_blank"
                  className="text-green-600"
                >
                  Recordar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCustomer && <CustomerPurchases customer={selectedCustomer} />}
    </div>
  );
}
