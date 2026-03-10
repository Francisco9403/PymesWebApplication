"use client";

import { ProductResponse } from "@/types/Product";
import { useState } from "react";
import EditProductModal from "./EditProductModal";

export default function EditProductButton({
  product,
}: {
  product: ProductResponse;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
      >
        Editar
      </button>

      {open && (
        <EditProductModal product={product} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
