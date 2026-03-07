import { getBranches } from "@/app/actions/stock";
import CreateBranchForm from "./CreateBranchForm";
import Link from "next/link";

export default async function SucursalesPage() {
  const branches = await getBranches();

  return (
      <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Link
                  href="/usuario"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Panel
              </Link>
              <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">Administrar Sucursales</h1>
              <p className="text-slate-500 text-sm font-medium">Configurá tus puntos de venta y centros de distribución logística.</p>
            </div>
          </header>

          <CreateBranchForm />

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight px-2">Listado de Locales</h2>
            <div className="card-container animate-in fade-in duration-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400">
                  <tr>
                    <th className="p-4 font-black uppercase text-[10px] tracking-widest">Nombre del Local</th>
                    <th className="p-4 font-black uppercase text-[10px] tracking-widest">Dirección Geográfica</th>
                    <th className="p-4 font-black uppercase text-[10px] tracking-widest">Contacto</th>
                    <th className="p-4 font-black uppercase text-[10px] tracking-widest">Tipo de Operación</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                  {(!branches || branches.length === 0) && (
                      <tr>
                        <td colSpan={4} className="p-16 text-center text-slate-400 font-medium italic">
                          No hay sucursales registradas todavía.
                        </td>
                      </tr>
                  )}
                  {branches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{branch.name}</span>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{branch.address || "— No especificada —"}</td>
                        <td className="p-4 text-slate-500 font-mono text-xs">{branch.phone || "— Sin teléfono —"}</td>
                        <td className="p-4">
                          {branch.isPointOfSale ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-bold border border-indigo-100 uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            Punto de Venta
                          </span>
                          ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold border border-slate-200 uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Solo Depósito
                          </span>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}