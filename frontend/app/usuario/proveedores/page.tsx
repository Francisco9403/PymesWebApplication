import { getBranches } from "@/app/actions/branch";
import Proveedores from "./Proveedores";
import { redirect } from "next/navigation";
// 1. Importamos cookies
import { cookies } from "next/headers";

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams: { branchId?: string };
}) {
  const params = await searchParams;
  const branches = await getBranches();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  const branchId = params.branchId ? Number(params.branchId) : branches[0].id;

  return <Proveedores branchId={branchId} token={token} />
}




