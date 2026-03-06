import { getBranches, getStockByBranch } from "@/app/actions/stock";
import { getProducts } from "@/app/actions/product";
import StockTable from "./StockTable";
import AddStockForm from "./AddStockForm";
import BranchSelector from "./BranchSelector";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <div className="p-8 space-y-6">
      <div>
        <Link
          href="/usuario"
          className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
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
          Volver atrás
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-gray-500 mt-1">
            Mostrando stock de:{" "}
            <span className="font-semibold text-gray-700">
              {activeBranch.name}
            </span>
          </p>
        </div>

        <BranchSelector
          branches={branches}
          selectedBranchId={activeBranch.id}
        />
      </div>

      <AddStockForm branchId={activeBranch.id} products={productsList} />

      <StockTable stockList={stockData} />
    </div>
  );
}
