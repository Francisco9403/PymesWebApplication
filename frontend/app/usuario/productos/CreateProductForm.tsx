"use client";

import { createProductAction } from "@/app/actions/product";
import { useFormStatus } from "react-dom";

export default function CreateProductForm() {
  const { pending } = useFormStatus();
  return (
    <form
      action={createProductAction}
      className="bg-white p-6 rounded-xl border shadow-sm space-y-4"
    >
      <h2 className="text-xl font-semibold">Nuevo Producto</h2>

      <input
        name="sku"
        placeholder="SKU"
        required
        className="border p-2 rounded w-full"
      />

      <input
        name="ean13"
        placeholder="EAN13"
        className="border p-2 rounded w-full"
      />

      <input
        name="baseCostPrice"
        placeholder="Precio Costo"
        type="number"
        step="0.01"
        className="border p-2 rounded w-full"
      />

      <input
        name="currentSalePrice"
        placeholder="Precio Venta"
        type="number"
        step="0.01"
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        {pending ? "Creando..." : "Crear Producto"}
      </button>
    </form>
  );
}
