import { getSuppliers } from "@/app/actions/proveedor";
import CreateSupplierForm from "./CreateSupplierForm";
import SupplierTable from "./SupplierTable";
import Link from "next/link"; // Asegurate de importar Link

export default async function Page() {
    const data = await getSuppliers();

    return (
        <div className="p-8 space-y-6">

            {/* Botón para volver atrás */}
            <div>
                <Link
                    href="/usuario" // Cambiá esta ruta si querés que vuelva a /usuario/inventario, por ejemplo
                    className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver atrás
                </Link>
            </div>

            <h1 className="text-3xl font-bold">Administrar Proveedores</h1>

            <CreateSupplierForm />

            <SupplierTable suppliers={data} />
        </div>
    );
}