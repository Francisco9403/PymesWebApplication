import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-indigo-100/50 to-transparent -z-10" />

      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Sistema Activo v1.0
            </span>
          </div>

          <h1 className="text-6xl font-black text-slate-900 tracking-tight">
            Comercio<span className="text-indigo-600">App</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            Gestión inteligente de inventario, ventas y finanzas diseñada para
            el crecimiento de tu negocio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/iniciar-sesion"
            className="btn-primary text-center px-10 py-4 text-lg shadow-xl shadow-indigo-200/50"
          >
            Ingresar al Sistema
          </Link>
        </div>

        <footer className="pt-12">
          <p className="text-slate-400 text-sm font-medium">
            Desarrollado con precisión en{" "}
            <span className="text-slate-600">Junín, Buenos Aires</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
