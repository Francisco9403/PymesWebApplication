"use client";

import { CustomerListResponse } from "@/types/Customer";
import { useState } from "react";
import CustomerPurchases from "./CustomerPurchases";

export default function CustomerTable({
  customers,
}: {
  customers: CustomerListResponse[];
}) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListResponse | null>(null);

  return (
    <div
      className="rounded-xl overflow-hidden transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead
            className="text-[10px] font-extrabold uppercase tracking-widest border-b
              bg-slate-50 border-slate-200 text-slate-400
              dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)] dark:text-[#444]"
          >
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Saldo</th>
              <th className="p-4">Límite de crédito</th>
              <th className="p-4">Etiquetas</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
            {(!customers || customers.length === 0) && (
              <tr>
                <td colSpan={6} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <span className="text-5xl">👥</span>
                    <p className="font-bold italic text-slate-900 dark:text-[#F0EDE8]">
                      No hay clientes registrados.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {customers?.map((customer) => (
              <tr
                key={customer.id}
                className="group transition-colors
                  hover:bg-slate-50/80
                  dark:hover:bg-[rgba(255,107,53,0.03)]"
              >
                <td className="p-4">
                  <span
                    className="font-bold transition-colors
                    text-slate-900 group-hover:text-[#FF6B35]
                    dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]"
                  >
                    {customer.name}
                  </span>
                </td>

                <td className="p-4 font-mono text-xs text-slate-500 dark:text-[#555]">
                  {customer.phone || "— SIN ASIGNAR —"}
                </td>

                <td className="p-4">
                  {customer.currentDebt > 0 ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        border border-red-200 bg-red-50 text-red-600
                        dark:border-[rgba(239,68,68,0.25)] dark:bg-[rgba(239,68,68,0.08)] dark:text-red-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                      Debe ${customer.currentDebt}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        border border-[rgba(0,201,167,0.25)] bg-[rgba(0,201,167,0.07)] text-[#00C9A7]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00C9A7]" />
                      ${Math.abs(customer.currentDebt)}
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {customer.creditLimit != null ? (
                    <span className="font-bold text-slate-700 dark:text-[#AAA]">
                      ${customer.creditLimit}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-[#444]">
                      Sin límite
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {customer.tags && customer.tags.length > 0 ? (
                      customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full
                            border border-[rgba(255,107,53,0.25)] bg-[rgba(255,107,53,0.07)] text-[#FF6B35]"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-bold text-slate-300 dark:text-[#333] uppercase tracking-wide">
                        —
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide
                        border transition-all duration-150 cursor-pointer
                        border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.06)] text-[#FF6B35]
                        hover:border-[rgba(255,107,53,0.4)] hover:bg-[rgba(255,107,53,0.12)]
                        dark:border-[rgba(255,107,53,0.2)] dark:bg-[rgba(255,107,53,0.08)] dark:hover:bg-[rgba(255,107,53,0.15)]"
                    >
                      👁 Ver compras
                    </button>

                    <a
                      href={`https://wa.me/${customer.phone}?text=${encodeURIComponent(
                        `Hola ${customer.name}, te recordamos que tenés un saldo pendiente. Podés pagar desde este link: https://tuapp.com/pagar/${customer.id}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide no-underline
                        border transition-all duration-150
                        border-[rgba(0,201,167,0.25)] bg-[rgba(0,201,167,0.07)] text-[#00C9A7]
                        hover:border-[rgba(0,201,167,0.45)] hover:bg-[rgba(0,201,167,0.12)]"
                    >
                      💬 Recordar
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomer && <CustomerPurchases customer={selectedCustomer} />}
    </div>
  );
}
