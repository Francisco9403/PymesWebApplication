import { ProductResponse } from "@/app/actions/product";
import { PageResponse } from "@/types/Page";
import { Product } from "@/types/Product";

import Link from "next/link";

export default function ProductTable({
  pageData,
}: {
  pageData: PageResponse<ProductResponse>;
}) {
  const { content, page, totalPages } = pageData;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Precio Venta</th>
            </tr>
          </thead>

          <tbody>
            {content.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            )}

            {content.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{product.sku}</td>
                <td className="p-4">
                  ${Number(product.currentSalePrice ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Página {page + 1} de {totalPages}
        </div>

        <div className="flex gap-2">
          {page > 0 && (
            <Link
              href={`?page=${page - 1}`}
              className="px-4 py-2 border rounded-lg"
            >
              Anterior
            </Link>
          )}

          {page < totalPages - 1 && (
            <Link
              href={`?page=${page + 1}`}
              className="px-4 py-2 border rounded-lg"
            >
              Siguiente
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
