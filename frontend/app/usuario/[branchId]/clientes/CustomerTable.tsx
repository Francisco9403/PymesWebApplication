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
      <div className="card-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">Cliente</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">Teléfono</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">Saldo</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">Límite de crédito</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">Etiquetas</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-widest">Acciones</th>
              </tr>
            </thead>
    
            <tbody className="divide-y divide-slate-100">
              {(!customers || customers.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <span className="text-5xl">👥</span>
                      <p className="text-slate-900 font-bold italic">No hay clientes registrados.</p>
                    </div>
                  </td>
                </tr>
              )}
    
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
    
                  <td className="p-4">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {customer.name}
                    </span>
                  </td>
    
                  <td className="p-4 font-mono text-xs text-slate-500">
                    {customer.phone || "— SIN ASIGNAR —"}
                  </td>
    
                  <td className="p-4">
                    {customer.currentDebt > 0 ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-bold border border-red-100 uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                        Debe ${customer.currentDebt}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100 uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        ${Math.abs(customer.currentDebt)}
                      </div>
                    )}
                  </td>
    
                  <td className="p-4">
                    {customer.creditLimit != null ? (
                      <span className="text-slate-700 font-bold">${customer.creditLimit}</span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Sin límite</span>
                    )}
                  </td>
    
                  <td className="p-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {customer.tags && customer.tags.length > 0 ? (
                        customer.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">—</span>
                      )}
                    </div>
                  </td>
    
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1 text-[11px] font-black uppercase tracking-wide rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                      >
                        Ver compras
                      </button>
                      <a
                        href={`https://wa.me/${customer.phone}?text=${encodeURIComponent(
                          `Hola ${customer.name}, te recordamos que tenés un saldo pendiente. Podés pagar desde este link: https://tuapp.com/pagar/${customer.id}`
                        )}`}
                        target="_blank"
                        className="px-3 py-1 text-[11px] font-black uppercase tracking-wide rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                      >
                        Recordar
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
