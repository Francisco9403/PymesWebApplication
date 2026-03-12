import { getCustomers } from "@/app/actions/cliente";
import CustomerTable from "./CustomerTable";
import { getBranches } from "@/app/actions/branch";
import { redirect } from "next/navigation";

export default async function Page() {
  const customers = await getCustomers();

  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      <CustomerTable customers={customers.content} />
    </main>
  );
}
