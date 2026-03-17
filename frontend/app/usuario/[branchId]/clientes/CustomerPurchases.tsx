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
    <div
      className="mt-0 pt-5 px-0 border-t transition-colors
        border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
    >
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-base font-extrabold tracking-[-0.01em]
          text-slate-800 dark:text-[#F0EDE8]">
          Compras de{" "}
          <span className="text-[#FF6B35]">{customer.name}</span>
        </h2>
        <span className="text-[0.65rem] font-bold uppercase tracking-widest
          text-slate-400 dark:text-[#555]">
          {sales.length} Transacciones
        </span>
      </div>
 
      {/* Empty state */}
      {sales.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 opacity-30">
          <span className="text-5xl">🧾</span>
          <p className="font-bold italic text-slate-900 dark:text-[#F0EDE8]">
            Sin compras registradas.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="group flex items-center justify-between px-4 py-3.5 transition-colors
                hover:bg-slate-50/80 dark:hover:bg-[rgba(255,107,53,0.03)]"
            >
              {/* Sale ID */}
              <span className="font-mono text-xs uppercase tracking-widest
                text-slate-400 dark:text-[#444]">
                ID {sale.id}
              </span>
 
              {/* Amount */}
              <span className="text-lg font-extrabold tabular-nums transition-colors
                text-slate-900 group-hover:text-[#FF6B35]
                dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]">
                ${sale.totalAmount}
              </span>
 
              {/* Date */}
              <span className="text-[11px] font-bold uppercase tracking-wide
                text-slate-400 dark:text-[#444]">
                {sale.createdAt}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
