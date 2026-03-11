import Venta from "./Venta";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getBranches } from "@/app/actions/branch";

export default async function Page({
  searchParams,
}: {
  searchParams: { branchId?: string };
}) {
  const params = await searchParams;
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  const branchId = params.branchId ? Number(params.branchId) : branches[0].id;

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <Link
            href="/usuario"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
          >
            ← Volver al Panel
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mt-2">
            Punto de Venta
          </h1>
          <p className="text-slate-500 text-sm">
            Escaneá productos y generá el cobro al instante.
          </p>
        </header>

        <Venta branchId={branchId} />
      </div>
    </main>
  );
}
