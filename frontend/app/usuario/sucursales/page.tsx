import { getBranches } from "@/app/actions/stock";
import CreateBranchForm from "./CreateBranchForm";
import Link from "next/link";

export default async function SucursalesPage() {
    const branches = await getBranches();

    return (
        <div className="p-8 space-y-6">
            <div>
                <Link
                    href="/usuario"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver atrás
                </Link>
            </div>

            <h1 className="text-3xl font-bold">Administrar Sucursales</h1>

            <CreateBranchForm />

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden mt-8">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="p-4 font-medium text-gray-600">Nombre</th>
                        <th className="p-4 font-medium text-gray-600">Dirección</th>
                        <th className="p-4 font-medium text-gray-600">Teléfono</th>
                        <th className="p-4 font-medium text-gray-600">Tipo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(!branches || branches.length === 0) && (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-gray-500">
                                No hay sucursales registradas
                            </td>
                        </tr>
                    )}
                    {branches.map((branch) => (
                        <tr key={branch.id} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium">{branch.name}</td>
                            <td className="p-4 text-gray-600">{branch.address || "-"}</td>
                            <td className="p-4 text-gray-600">{branch.phone || "-"}</td>
                            <td className="p-4">
                                {branch.isPointOfSale ? (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                      Punto de Venta
                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
                      Solo Depósito
                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}