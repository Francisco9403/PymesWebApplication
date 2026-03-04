import { getProducts } from "@/app/actions/product";
import CreateProductForm from "./CreateProductForm";
import ProductTable from "./ProductTable";

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
      <h1 className="text-3xl font-bold">Administrar Productos</h1>

      <CreateProductForm />

      <ProductTable pageData={data!} />
    </div>
  );
}
