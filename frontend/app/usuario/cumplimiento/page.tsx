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
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <Link
            href="/usuario"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            ← Volver al Panel
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">
            Cumplimiento & Fiscal
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Gestión de facturación electrónica ARCA y reportes para el Libro IVA
            Digital.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado del Servicio */}
          <div className="card-container p-6 space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                Conexión ARCA
              </h2>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative h-3 w-3 rounded-full bg-emerald-500"></span>
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 leading-none">
                  Certificado Activo
                </p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight mt-1">
                  Válido hasta el 31/12/2025
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic">
              La conexión con los servidores de ARCA se encuentra establecida y
              operativa.
            </p>
          </div>

          {/* Exportación */}
          <div className="card-container p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-lg font-bold text-slate-800">
              Libros Digitales
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Generá los archivos .txt necesarios para la presentación del Libro
              IVA Digital en el portal de ARCA.
            </p>
            <button className="btn-primary w-full py-4 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exportar Libro IVA TXT
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
