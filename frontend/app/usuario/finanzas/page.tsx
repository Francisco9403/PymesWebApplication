import Link from "next/link";

export default function Page() {
  const currencies = [
    { name: "Dólar Oficial", value: "900.00", color: "text-slate-900" },
    { name: "Dólar MEP", value: "1050.00", color: "text-indigo-600" },
  ];

  return (
      <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
            <Link href="/usuario" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
              ← Volver al Panel
            </Link>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">Finanzas & Pagos</h1>
            <p className="text-slate-500 text-sm font-medium">Monitor de divisas, gestión de cuentas corrientes y automatización de márgenes.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currencies.map((currency) => (
                <div key={currency.name} className="card-container p-6 space-y-2 group">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currency.name}</h3>
                    <span className="text-xs font-bold text-emerald-500 group-hover:animate-pulse">Live</span>
                  </div>
                  <p className={`text-4xl font-black tracking-tighter ${currency.color}`}>
                    <span className="text-lg mr-1">$</span>{currency.value}
                  </p>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-slate-200 w-1/3"></div>
                  </div>
                </div>
            ))}

            {/* Card de Alerta de Markup */}
            <div className="card-container p-6 bg-indigo-600 border-indigo-700 text-white shadow-xl shadow-indigo-200/50 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-100">Markup Automático</h3>
                </div>
                <p className="text-lg font-bold leading-tight">
                  Protección contra devaluación activa.
                </p>
              </div>

              <p className="text-xs text-indigo-200 mt-4 leading-relaxed italic">
                "Tus precios de venta se ajustarán automáticamente si el MEP sube más del <span className="text-white font-black underline">2%</span>"
              </p>
            </div>
          </div>
        </div>
      </main>
  );
}