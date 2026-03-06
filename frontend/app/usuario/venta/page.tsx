import { getBranches } from "@/app/actions/stock";
import Venta from "./Venta";
import { redirect } from "next/navigation";

export default async function Page() {
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  return (
    <main>
      <Venta />
    </main>
  );
}
