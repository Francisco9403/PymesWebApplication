import Link from "next/link";
import { getExchangeRates } from "@/app/actions/finance";
import MarkupConfigurator from "./MarkupConfigurator";
import TaxReports from "./TaxReports";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const rates = await getExchangeRates();
  const config = { enabled: true, threshold: 2.0 };

  const currencies = [
    { name: "Dólar Oficial", value: rates.oficial, color: "text-slate-900" },
    { name: "Dólar MEP", value: rates.mep, color: "text-indigo-600" },
    { name: "Dólar Cripto", value: rates.cripto, color: "text-emerald-600" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link
              href="/usuario"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              ← Volver al Panel
            </Link>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Finanzas & Pagos
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Control de divisas y automatización de precios en tiempo real.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {currencies.map((currency) => (
            <div
              key={currency.name}
              className="card-container p-6 space-y-2 group bg-white border-slate-200"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {currency.name}
                </h3>
                <span className="text-xs font-bold text-emerald-500 animate-pulse">
                  Live
                </span>
              </div>
              <p
                className={`text-4xl font-black tracking-tighter ${currency.color}`}
              >
                <span className="text-lg mr-1">$</span>
                {Number(currency.value).toFixed(2)}
              </p>
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-indigo-500 w-full opacity-10 group-hover:opacity-30 transition-opacity"></div>
              </div>
            </div>
          ))}

          <MarkupConfigurator
            initialEnabled={config.enabled}
            initialThreshold={config.threshold}
          />
        </div>

        <TaxReports />
      </div>
    </main>
  );
}
