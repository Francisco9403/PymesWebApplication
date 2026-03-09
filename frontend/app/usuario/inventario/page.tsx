import { getStockByBranch } from "@/app/actions/stock";
import { getProducts } from "@/app/actions/product";
import StockTable from "./StockTable";
import AddStockForm from "./AddStockForm";
import BranchSelector from "./BranchSelector";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBranches } from "@/app/actions/branch";

export default async function InventarioPage({
  searchParams,
}: {
  searchParams: { branchId?: string };
}) {
  const params = await searchParams;
  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  const selectedId = params.branchId ? Number(params.branchId) : branches[0].id;
  const activeBranch = branches.find((b) => b.id === selectedId) || branches[0];

  const stockData = await getStockByBranch(activeBranch.id);
  const productsPage = await getProducts(0, 500);
  const productsList = productsPage?.content || [];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header con Navegación y Título */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
            <p className="text-slate-500 text-sm font-medium">
              Gestionando existencias en:{" "}
              <span className="text-indigo-600 font-bold">
                {activeBranch.name}
              </span>
            </p>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <BranchSelector
              branches={branches}
              selectedBranchId={activeBranch.id}
            />
          </div>
        </header>

        {/* Formulario de Carga */}
        <AddStockForm branchId={activeBranch.id} products={productsList} />

        {/* Listado de Stock */}
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
