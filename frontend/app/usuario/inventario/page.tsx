"use client";

import { PageResponse } from "@/types/Page";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<PageResponse<Product> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const size = 10;

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  async function fetchProducts(pageNumber: number) {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/products?page=${pageNumber}&size=${size}`,
      );
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error loading products", error);
    } finally {
      setLoading(false);
    }
  }

  const totalStock = (product: Product) =>
    product.stocks?.reduce((acc, s) => acc + s.quantity, 0) ?? 0;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Inventario y Catálogo
        </h1>
        <p className="text-gray-600 mt-2">
          Gestión omnicanal, escaneo OCR y generación de fichas IA.
        </p>
      </header>

      {/* TABLA INVENTARIO */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">EAN13</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  Cargando...
                </td>
              </tr>
            )}

            {!loading && data?.content.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            )}

            {!loading &&
              data?.content.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">{product.ean13}</td>
                  <td className="p-4">
                    ${Number(product.currentSalePrice ?? 0).toFixed(2)}
                  </td>
                  <td className="p-4 font-medium">{totalStock(product)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        {data && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <span className="text-sm text-gray-600">
              Página {data.page + 1} de {data.totalPages} — {data.totalElements}{" "}
              productos
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                disabled={page + 1 >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
