import { getBranches } from "@/app/actions/stock";
import Proveedores from "./Proveedores";
import { redirect } from "next/navigation";

export default async function Page() {
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  return (
    <main>
      <Proveedores />
    </main>
  );
}
