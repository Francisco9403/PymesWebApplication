import { getProducts } from "@/app/actions/product";
import { getStockByBranch } from "@/app/actions/stock";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import AddStockForm from "./AddStockForm";
import StockTable from "./StockTable";

export const revalidate = 60;

export default async function InventarioPage({
                                               params,
                                             }: {
  params: Promise<{ branchId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const { branchId } = await params;

  const [stockData, productsPage] = await Promise.all([
    getStockByBranch(Number(branchId)),
    getProducts({
      page: 0,
      size: 500, // Traemos una lista amplia para el selector de carga de stock
      branchId,
    }),
  ]);

  const productsList = productsPage?.content || [];

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
          <header className="flex flex-col gap-2">
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
              Control de Inventario
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#666]">
              Monitoreá niveles críticos y ajustá existencias por sucursal.
            </p>
          </header>

          <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

          <AddStockForm branchId={Number(branchId)} products={productsList} />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2
                  className="text-lg font-extrabold tracking-[-0.01em]
              text-slate-800 dark:text-[#F0EDE8]"
              >
                Existencias Actuales
              </h2>
              <span
                  className="text-[0.65rem] font-bold uppercase tracking-widest
              text-slate-400 dark:text-[#555]"
              >
              {stockData.length} Artículos Registrados
            </span>
            </div>

            {stockData && stockData.length > 0 ? (
                <StockTable stockList={stockData} />
            ) : (
                <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[rgba(255,255,255,0.05)]">
                  <p className="text-slate-400 text-sm">No hay registros de stock en esta sucursal.</p>
                </div>
            )}
          </div>
        </div>
      </main>
  );
}