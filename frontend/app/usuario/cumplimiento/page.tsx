import { redirect } from "next/navigation";
import { getBranches } from "@/app/actions/branch";

export default async function Page() {
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  return <main></main>;
}
