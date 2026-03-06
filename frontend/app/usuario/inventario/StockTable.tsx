import { ProductStock } from "@/types/ProductStock";

export default function StockTable({
  stockList,
}: {
  stockList: ProductStock[];
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4 font-medium text-gray-600">SKU</th>
              <th className="p-4 font-medium text-gray-600">
                Código de Barras
              </th>
              <th className="p-4 font-medium text-gray-600">
                Cantidad Disponible
              </th>
              <th className="p-4 font-medium text-gray-600">Estado</th>
            </tr>
          </thead>

          <tbody>
            {(!stockList || stockList.length === 0) && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No hay mercadería registrada en esta sucursal.
                </td>
              </tr>
            )}

            {stockList?.map((stock) => {
              const isLowStock = stock.quantity <= stock.criticalThreshold;

              return (
                <tr
                  key={stock.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium">{stock.product.sku}</td>
                  <td className="p-4 text-gray-600">
                    {stock.product.ean13 || "-"}
                  </td>
                  <td className="p-4 font-semibold text-lg">
                    {stock.quantity}
                  </td>
                  <td className="p-4">
                    {isLowStock ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
                        Stock Crítico
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                        Óptimo
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
