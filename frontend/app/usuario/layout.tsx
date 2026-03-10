import Navbar from "@/layout/Navbar";
import { getBranches } from "../actions/branch";
import BranchRedirect from "./BranchRedirect";

/* export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branches = await getBranches();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar branches={branches ?? []} />
      {children}
    </div>
  );
}
 */
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branches = await getBranches();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar branches={branches} selectedBranchId={branches?.[0]?.id ?? 0} />
      <BranchRedirect branches={branches} />
      <div>{children}</div>
    </div>
  );
}
