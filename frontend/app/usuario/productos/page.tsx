import { getProducts } from "@/app/actions/product";
import CreateProductForm from "./CreateProductForm";
import ProductTable from "./ProductTable";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const size = 10;

  const data = await getProducts(page, size);

  return (
    <div className="p-8 space-y-8">

        <div>
            <Link
                href="/usuario" // Cambiá esta ruta si querés que vuelva a /usuario/inventario, por ejemplo
                className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver atrás
            </Link></div>
      <h1 className="text-3xl font-bold">Administrar Productos</h1>

      <CreateProductForm />

      <ProductTable pageData={data!} />
    </div>
  );
}
