import { cookies } from "next/headers";
import Proveedores from "./Proveedores";
import { getSuppliers } from "@/app/actions/proveedor";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { branchId: string };
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
      <Proveedores
        branchId={branchId}
        initialSuppliers={result.data ?? []}
      />
    </main>
  );
}
