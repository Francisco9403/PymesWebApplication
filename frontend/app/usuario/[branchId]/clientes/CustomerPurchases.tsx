"use client";

import { getCustomerSales } from "@/app/actions/cliente";
import { useToast } from "@/layout/ToastProvider";
import { CustomerListResponse, CustomerSaleResponse } from "@/types/Customer";
import { useEffect, useState } from "react";

export default function CustomerPurchases({
  customer,
}: {
  customer: CustomerListResponse;
}) {
  const { show } = useToast();
  const [sales, setSales] = useState<CustomerSaleResponse[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getCustomerSales(customer.id);

      if ("error" in res) {
        show(res.error, "error");
        return;
      }

      setSales(res.content);
    }

    load();
  }, [customer.id, show]);

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <div className="flex items-center justify-between px-2 mb-4">
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
          Compras de{" "}
          <span className="text-indigo-600">{customer.name}</span>
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {sales.length} Transacciones
        </span>
      </div>
  
      {sales.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 opacity-30">
          <span className="text-5xl">🧾</span>
          <p className="text-slate-900 font-bold italic">Sin compras registradas.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                ID {sale.id}
              </span>
              <span className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                ${sale.totalAmount}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {sale.createdAt}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
