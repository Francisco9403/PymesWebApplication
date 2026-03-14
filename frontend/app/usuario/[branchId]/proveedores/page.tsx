import Proveedores from "./Proveedores";
import { getSuppliers } from "@/app/actions/proveedor";

export default async function Page({
  params,
}: {
  params: { branchId: string };
}) {
  const { branchId } = await params;

  const result = await getSuppliers();

  return (
    <main className="p-4 md:p-8">
      <Proveedores
        branchId={Number(branchId)}
        initialSuppliers={result.data ?? []}
      />
    </main>
  );
}
