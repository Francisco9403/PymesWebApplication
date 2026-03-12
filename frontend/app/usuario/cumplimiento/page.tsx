import { getCustomers } from "@/app/actions/cliente";
import CustomerTable from "./CustomerTable";

export default async function Page() {
  const customers = await getCustomers();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      <CustomerTable customers={customers.content} />
    </main>
  );
}

/* const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  } */
