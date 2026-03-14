import { getStockByBranch } from "@/app/actions/stock";
import { getProducts } from "@/app/actions/product";
import StockTable from "./StockTable";
import AddStockForm from "./AddStockForm";
import Link from "next/link";

export default async function InventarioPage({
  params,
}: {
  params: { branchId: string };
}) {
  const { branchId } = await params;

  const stockData = await getStockByBranch(Number(branchId));
  const productsPage = await getProducts({
    page: 0,
    size: 500,
  });
  const productsList = productsPage?.content || [];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <div className="space-y-2">
            <Link
              href="/usuario"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Panel
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Control de Inventario
            </h1>
          </div>
        </header>

        <AddStockForm branchId={branchId} products={productsList} />

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
              Existencias Actuales
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {stockData.length} Artículos Registrados
            </span>
          </div>
          <StockTable stockList={stockData} />
        </div>
      </div>
    </main>
  );
}
