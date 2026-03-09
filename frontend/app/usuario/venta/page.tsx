import Venta from "./Venta";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getBranches } from "@/app/actions/branch";

export default async function Page() {
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
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
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Terminal 01 • {branches[0].name}
            </span>
          </div>
        </header>

        <Venta />
      </div>
    </main>
  );
}
