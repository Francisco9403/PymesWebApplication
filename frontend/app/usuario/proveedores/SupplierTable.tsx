import { Supplier } from "@/types/Supplier"; // Ajustá la ruta

export default function SupplierTable({
                                          suppliers,
                                      }: {
    suppliers: Supplier[];
}) {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="p-4 font-medium text-gray-600">Razón Social</th>
                        <th className="p-4 font-medium text-gray-600">CUIT</th>
                        <th className="p-4 font-medium text-gray-600">Categoría Fiscal</th>
                    </tr>
                    </thead>

                    <tbody>
                    {(!suppliers || suppliers.length === 0) && (
                        <tr>
                            <td colSpan={3} className="p-6 text-center text-gray-500">
                                No hay proveedores registrados
                            </td>
                        </tr>
                    )}

                    {suppliers?.map((supplier) => (
                        <tr key={supplier.id} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium">{supplier.businessName}</td>
                            <td className="p-4 text-gray-600">{supplier.cuit}</td>
                            <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">
                    {supplier.taxCategory?.replace(/_/g, " ")}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}