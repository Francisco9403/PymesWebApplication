import { getProducts } from "@/app/actions/product";
import ProductTable from "./ProductTable";
import Link from "next/link";
import { ProductFilters } from "./ProductFilters";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    page?: string;
    size?: string;
    name?: string;
    belowMinStock?: string;
    sort?: string;
  }>;
  params: { branchId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const { page, size, name, belowMinStock, sort } = await searchParams;
  const { branchId } = await params;

  const data = await getProducts({
    page: Number(page ?? 0),
    size: Number(size ?? 10),
    branchId,
    name,
    belowMinStock,
    sort,
  });

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
              {data!.totalElements}
            </span>
          </div>
        </header>

        <ProductFilters />

        <ProductTable pageData={data!} />
      </div>
    </main>
  );
}
