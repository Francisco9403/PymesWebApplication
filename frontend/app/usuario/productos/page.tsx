import { getProducts } from "@/app/actions/product";
import CreateProductForm from "./CreateProductForm";
import ProductTable from "./ProductTable";
import { getBranches } from "@/app/actions/stock";
import { redirect } from "next/navigation";

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
    return <div>No autorizado o sesión expirada</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Administrar Productos</h1>

      <CreateProductForm />

      <ProductTable pageData={data} />
    </div>
  );
}
