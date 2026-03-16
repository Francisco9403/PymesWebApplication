import { cookies } from "next/headers";
import Proveedores from "./Proveedores";
import { getSuppliers } from "@/app/actions/proveedor";
import { redirect } from "next/navigation";

export default async function Page({
                                     params,
                                   }: {
  // 🚀 En Next.js 15, params es una Promise
  params: Promise<{ branchId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const { branchId } = await params;

  // 🚀 PASO CLAVE: Pasamos el branchId a la action
  const result = await getSuppliers(Number(branchId));

  return (
      <main className="p-4 md:p-8">
        <Proveedores
            branchId={Number(branchId)}
            initialSuppliers={result.data ?? []}
        />
      </main>
  );
}