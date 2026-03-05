import { getBranches, getStockByBranch } from "@/app/actions/stock";
import { getProducts } from "@/app/actions/product";
import StockTable from "./StockTable";
import AddStockForm from "./AddStockForm";
import BranchSelector from "./BranchSelector"; // <-- Importamos el selector
import Link from "next/link";

export default async function InventarioPage({
                                               searchParams,
                                             }: {
  searchParams: { branchId?: string };
}) {
  // Leemos los parámetros de la URL
  const params = await searchParams;

  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    return (
        <div className="p-8 space-y-6">
          <h1 className="text-3xl font-bold">Inventario</h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <p className="text-yellow-700">
              Para ver el inventario, primero tenés que crear al menos una Sucursal.
            </p>
          </div>
        </div>
    );
  }

  // LÓGICA DE SELECCIÓN: Si hay un branchId en la URL lo usamos, si no, agarramos el primero (ej: Depósito Junín)
  const selectedId = params.branchId ? Number(params.branchId) : branches[0].id;

  // Buscamos el objeto completo de la sucursal seleccionada
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
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver atrás
          </Link>
        </div>

        {/* Título a la izquierda y Selector a la derecha */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inventario</h1>
            <p className="text-gray-500 mt-1">
              Mostrando stock de: <span className="font-semibold text-gray-700">{activeBranch.name}</span>
            </p>
          </div>

          {/* Agregamos el componente desplegable acá */}
          <BranchSelector branches={branches} selectedBranchId={activeBranch.id} />
        </div>

        {/* Le pasamos el ID de la sucursal activa al formulario para que guarde ahí */}
        <AddStockForm branchId={activeBranch.id} products={productsList} />

        <StockTable stockList={stockData} />
      </div>
  );
}