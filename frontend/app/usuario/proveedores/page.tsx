import Proveedores from "./Proveedores";
import { getSuppliers } from "@/app/actions/proveedor";

// if (!branchParam) redirect("/usuario/sucursales");

export default async function Page({
  searchParams,
}: {
  searchParams: { branchId?: string };
}) {
  const { branchId: branchParam } = await searchParams;

  const suppliers = await getSuppliers();

  return (
    <main className="p-4 md:p-8">
      <Proveedores
        branchId={Number(branchParam)}
        initialSuppliers={suppliers}
      />
    </main>
  );
}
