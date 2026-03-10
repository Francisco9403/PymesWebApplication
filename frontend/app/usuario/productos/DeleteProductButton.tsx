"use client";

import { deleteProduct } from "@/app/actions/product";
import { useActionState } from "react";

export default function DeleteProductButton({
  productId,
  branchId,
}: {
  productId: number;
  branchId: number;
}) {
  const [state, formAction, pending] = useActionState(deleteProduct, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="branchId" value={branchId} />

      <button
        type="submit"
        disabled={pending}
        className="text-red-600 hover:text-red-800 text-xs font-bold ml-3"
      >
        {pending ? "Eliminando..." : "Eliminar"}
      </button>

      {state?.error && (
        <p className="text-red-500 text-xs mt-1">{state.error}</p>
      )}
    </form>
  );
}
