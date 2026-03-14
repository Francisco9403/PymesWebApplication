import Navbar from "@/layout/Navbar";
import { getBranches } from "../../actions/branch";
import { redirect } from "next/navigation";

export default async function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const branchIdNumber = Number(branchId);

  const branches = await getBranches();

  const branchExists = branches.some((b) => b.id === branchIdNumber);

  if (!branches.length) redirect("/usuario/sucursales");

  if (!branchExists) redirect(`/usuario/${branches[0].id}`);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar branches={branches} selectedBranchId={branchIdNumber} />
      <div>{children}</div>
    </div>
  );
}
