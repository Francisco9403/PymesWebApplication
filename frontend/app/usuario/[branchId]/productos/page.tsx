import { getProducts } from "@/app/actions/product";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductFilters } from "./ProductFilters";
import ProductTable from "./ProductTable";

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
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link
              href="/usuario"
              className="group inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.15em] transition-colors
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
              className="text-4xl font-extrabold tracking-[-0.03em] mt-2
              text-slate-900 dark:text-[#F0EDE8]"
            >
              Administrar Productos
            </h1>
            <p className="text-sm mt-1 text-slate-500 dark:text-[#666]">
              Gestioná el catálogo global, precios de costo y márgenes de venta.
            </p>
          </div>

          <div
            className="px-5 py-3 rounded-xl shrink-0 transition-colors
              bg-white border border-slate-200
              dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest block
              text-slate-400 dark:text-[#555]"
            >
              Total Registrados
            </span>
            <span
              className="text-2xl font-extrabold tracking-tight
              text-slate-900 dark:text-[#F0EDE8]"
            >
              {data!.totalElements}
            </span>
          </div>
        </header>

        <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

        <ProductFilters />
        <ProductTable pageData={data!} />
      </div>
    </main>
  );
}
