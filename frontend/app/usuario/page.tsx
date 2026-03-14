import { redirect } from "next/navigation";
import { getBranches } from "../actions/branch";

export default async function Page() {
  const branches = await getBranches();

  if (!branches.length) redirect("/usuario/sucursales");

  redirect(`/usuario/${branches[0].id}`);
}
