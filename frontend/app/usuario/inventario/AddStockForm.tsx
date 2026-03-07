"use client";

import { addStockAction } from "@/app/actions/stock";
import { useToast } from "@/layout/ToastProvider";
import { ProductResponse } from "@/types/Product";
import { useActionState, useEffect } from "react";

export default function AddStockForm({
  branchId,
  products,
}: {
  branchId: number;
  products: ProductResponse[];
}) {
  const [state, action, pending] = useActionState(addStockAction, null);
  const { show } = useToast();

  useEffect(() => {
    if (!state) return;

    if (state.error) show(state.error, "error");
    if (state.success) show(state.success, "success");
  }, [state, show]);

  return (
    <form
      action={action}
      className="bg-white p-6 rounded-xl border shadow-sm space-y-4 mb-6"
    >
      <h2 className="text-xl font-semibold">Cargar Inventario</h2>

      <input type="hidden" name="branchId" value={branchId} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="productId"
          required
          className="border p-2 rounded w-full bg-white text-gray-700"
        >
          <option value="">Seleccionar Producto (SKU)...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.sku} - ${Number(p.currentSalePrice ?? 0).toFixed(2)}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          type="number"
          min="1"
          placeholder="Cantidad a ingresar"
          required
          className="border p-2 rounded w-full"
        />

        <input
          name="criticalThreshold"
          type="number"
          min="0"
          placeholder="Alerta de Stock Crítico (Ej: 5)"
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 w-full md:w-auto"
        >
          {pending ? "Guardando..." : "Ingresar Mercadería"}
        </button>
      </div>
    </form>
  );
}
