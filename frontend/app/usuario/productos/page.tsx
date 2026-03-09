import { getProducts } from "@/app/actions/product";
import CreateProductForm from "./CreateProductForm";
import ProductTable from "./ProductTable";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getBranches } from "@/app/actions/branch";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const size = 10;

  const branches = await getBranches();

  if (!branches || branches.length === 0) {
    redirect("/usuario/sucursales");
  }

  const data = await getProducts(page, size);

  if (!data) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100">
        ⚠️ Sesión expirada. Por favor, volvé a iniciar sesión.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link
              href="/usuario"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
            >
              ← Volver al Panel
            </Link>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Administrar Productos
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Gestioná el catálogo global, precios de costo y márgenes de venta.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Total Registrados
            </span>
            <span className="text-xl font-black text-slate-900">
              {data.totalElements}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 sticky top-24">
            <CreateProductForm />
          </div>
          <div className="lg:col-span-2">
            <ProductTable pageData={data} />
          </div>
        </div>
      </div>
    </main>
  );
}
