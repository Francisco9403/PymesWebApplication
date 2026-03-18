import Navbar from "@/layout/Navbar";
import { getBranches } from "../actions/branch";

export default async function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branches = await getBranches();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar branches={branches} />
      <div>{children}</div>
    </div>
  );
}
