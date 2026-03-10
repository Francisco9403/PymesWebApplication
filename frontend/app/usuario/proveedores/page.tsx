import { getBranches } from "@/app/actions/branch";
import Proveedores from "./Proveedores";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { branchId?: string };
}) {
  const params = await searchParams;
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  const branchId = params.branchId ? Number(params.branchId) : branches[0].id;

  return (
    <main>
      <Proveedores branchId={branchId} />
    </main>
  );
}
