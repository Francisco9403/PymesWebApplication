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
    <div className="border rounded-lg p-4 mt-4">
      <h2 className="font-bold mb-4">Compras de {customer.name}</h2>

      <ul className="space-y-2">
        {sales.map((sale) => (
          <li key={sale.id} className="border-b pb-2">
            ${sale.totalAmount} — {sale.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
}
