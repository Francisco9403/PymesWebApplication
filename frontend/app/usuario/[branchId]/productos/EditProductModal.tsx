"use client";

import { updateProduct } from "@/app/actions/product";
import { useToast } from "@/layout/ToastProvider";
import { ProductResponse } from "@/types/Product";
import { useActionState, useEffect } from "react";

export default function EditProductModal({
  product,
  onClose,
}: {
  product: ProductResponse;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateProduct, null);
  const { show } = useToast();

  useEffect(() => {
    if (state?.error) show(state.error, "error");
    if (state?.success) show(state.success, "success");
  }, [state, show]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-100 space-y-4">
        <h2 className="font-black text-lg">Editar Producto</h2>

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" defaultValue={product.id} />

          <input
            name="name"
            defaultValue={product.name}
            className="input"
            placeholder="Nombre"
          />

          <input
            name="ean13"
            defaultValue={product.ean13 ?? ""}
            className="input"
            placeholder="EAN13"
          />

          <input
            name="baseCostPrice"
            defaultValue={product.baseCostPrice}
            className="input"
            placeholder="Costo"
          />

          <input
            name="currentSalePrice"
            defaultValue={product.currentSalePrice}
            className="input"
            placeholder="Precio venta"
          />

          {state?.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-green-600 text-sm">{state.success}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={pending}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              {pending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
