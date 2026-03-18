import { getExchangeRates } from "@/app/actions/finance";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import MarkupConfigurator from "./MarkupConfigurator";
import TaxReports from "./TaxReports";

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
        bg-[rgba(0,201,167,0.03)] dark:bg-[rgba(0,201,167,0.07)]"
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
              Finanzas & Pagos
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#666]">
              Control de divisas y automatización de precios en tiempo real.
            </p>
          </div>
        </header>

        <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {currencies.map((currency) => (
            <div
              key={currency.name}
              className="group relative overflow-hidden p-6 rounded-xl transition-all duration-300
                bg-white border border-slate-200 hover:border-[rgba(255,107,53,0.3)] hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5
                dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)] dark:hover:border-[rgba(255,107,53,0.3)] dark:hover:shadow-none"
            >
              <div className="absolute top-0 left-0 w-[18px] h-[18px] border-t-2 border-l-2 border-[#FF6B35] opacity-0 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-[18px] h-[18px] border-b-2 border-r-2 border-[#FF6B35] opacity-0 group-hover:opacity-40 transition-opacity" />

              <div className="flex justify-between items-start mb-3">
                <h3
                  className="text-[10px] font-bold uppercase tracking-widest
                  text-slate-400 dark:text-[#555]"
                >
                  {currency.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00C9A7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7] animate-pulse" />
                  Live
                </span>
              </div>

              <p
                className={`text-4xl font-extrabold tracking-[-0.04em] ${currency.color}`}
              >
                <span className="text-lg mr-1 opacity-60">$</span>
                {Number(currency.value).toFixed(2)}
              </p>

              <div
                className="h-0.5 w-full rounded-full mt-5 overflow-hidden
                bg-slate-100 dark:bg-[rgba(255,255,255,0.05)]"
              >
                <div
                  className="h-full rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-300"
                  style={{
                    width: "100%",
                    background: currency.color?.includes("#")
                      ? currency.color
                      : "#FF6B35",
                  }}
                />
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
