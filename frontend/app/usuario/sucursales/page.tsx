import { getBranches } from "@/app/actions/branch";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateBranchForm from "./CreateBranchForm";

export default async function SucursalesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const branches = await getBranches();

  return (
    <main
      className="min-h-[calc(100vh-64px)] p-6 sm:p-10 transition-colors duration-300
        bg-slate-50 dark:bg-[#0A0A0F]"
    >
      <div
        className="fixed rounded-full pointer-events-none blur-[140px] w-[500px] h-[500px] -top-[150px] -left-[150px]
        bg-[rgba(255,107,53,0.04)] dark:bg-[rgba(255,107,53,0.08)]"
      />
      <div
        className="fixed rounded-full pointer-events-none blur-[140px] w-[400px] h-[400px] bottom-0 right-0
        bg-[rgba(0,201,167,0.03)] dark:bg-[rgba(0,201,167,0.06)]"
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Link
              href="/usuario"
              className="group inline-flex items-center gap-1.5 w-fit text-[0.72rem] font-bold uppercase tracking-[0.15em] transition-colors
                text-slate-400 hover:text-slate-700
                dark:text-[#555] dark:hover:text-[#F0EDE8]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Panel
            </Link>
            <h1
              className="text-4xl font-extrabold tracking-[-0.03em]
              text-slate-900 dark:text-[#F0EDE8]"
            >
              Administrar Sucursales
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#666]">
              Configurá tus puntos de venta y centros de distribución logística.
            </p>
          </div>
        </header>

        <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

        <CreateBranchForm />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-lg font-extrabold tracking-[-0.01em]
              text-slate-800 dark:text-[#F0EDE8]"
            >
              Listado de Locales
            </h2>
            <span
              className="text-[0.65rem] font-bold uppercase tracking-widest
              text-slate-400 dark:text-[#555]"
            >
              {branches.length}{" "}
              {branches.length === 1 ? "Sucursal" : "Sucursales"}
            </span>
          </div>

          <div
            className="rounded-xl overflow-hidden transition-colors
              bg-white border border-slate-200
              dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead
                  className="text-[10px] font-extrabold uppercase tracking-widest border-b
                    bg-slate-50 border-slate-200 text-slate-400
                    dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)] dark:text-[#444]"
                >
                  <tr>
                    <th className="p-4">Nombre del Local</th>
                    <th className="p-4">Dirección Geográfica</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Tipo de Operación</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
                  {(!branches || branches.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-16 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <span className="text-5xl">🏢</span>
                          <p className="font-bold italic text-slate-900 dark:text-[#F0EDE8]">
                            No hay sucursales registradas todavía.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {branches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="group transition-colors
                        hover:bg-slate-50/80
                        dark:hover:bg-[rgba(255,107,53,0.03)]"
                    >
                      <td className="p-4">
                        <span
                          className="font-bold transition-colors
                          text-slate-900 group-hover:text-[#FF6B35]
                          dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]"
                        >
                          {branch.name}
                        </span>
                      </td>

                      <td className="p-4 font-medium text-slate-600 dark:text-[#888]">
                        {branch.address || "— No especificada —"}
                      </td>

                      <td className="p-4 font-mono text-xs text-slate-500 dark:text-[#555]">
                        {branch.phone || "— Sin teléfono —"}
                      </td>

                      <td className="p-4">
                        {branch.isPointOfSale ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                              border border-[rgba(255,107,53,0.25)] bg-[rgba(255,107,53,0.08)] text-[#FF6B35]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                            Punto de Venta
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                              border border-slate-200 bg-slate-100 text-slate-500
                              dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.05)] dark:text-[#666]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-[#555]" />
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
