import { getBranches } from "@/app/actions/branch";
import Proveedores from "./Proveedores";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSuppliers } from "@/app/actions/proveedor";

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams: { branchId?: string };
}) {
  const params = await searchParams;
  const branches = await getBranches();

  // Obtenemos proveedores y token en paralelo para mayor velocidad
  const [suppliers, cookieStore] = await Promise.all([
    getSuppliers(),
    cookies()
  ]);

  const token = cookieStore.get("token")?.value;

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  const branchId = params.branchId ? Number(params.branchId) : branches[0].id;

  return (
      <main className="p-4 md:p-8">
        <Proveedores
            branchId={branchId}
            token={token}
            initialSuppliers={suppliers}
        />
      </main>
  );
}