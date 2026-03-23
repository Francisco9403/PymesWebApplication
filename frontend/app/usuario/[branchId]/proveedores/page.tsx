import { cookies } from "next/headers";
import Proveedores from "./Proveedores";
import { getSuppliers } from "@/app/actions/proveedor";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ branchId: string }>;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) redirect("/iniciar-sesion");

    const { branchId } = await params;

    const result = await getSuppliers(branchId);

    return (
        <main
            className="min-h-[calc(100vh-64px)] p-4 md:p-8 transition-colors duration-300
        bg-slate-50 dark:bg-[#0A0A0F]"
        >
            {result.error ? (
                <div className="flex flex-col items-center justify-center h-full py-20">
                    <p className="text-red-500 font-bold">Error al cargar proveedores</p>
                    <p className="text-slate-400 text-sm">{result.error}</p>
                </div>
            ) : (
                <Proveedores
                    branchId={branchId}
                    initialSuppliers={result.data ?? []}
                />
            )}
        </main>
    );
}