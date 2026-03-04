import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      <Link href="/usuario/cumplimiento">Ir a Clientes</Link>
      <Link href="/usuario/finanzas">Ir a Finanzas</Link>
      <Link href="/usuario/inventario">Ir a Inventario</Link>
      <Link href="/usuario/productos">Ir a Productos</Link>
      <Link href="/usuario/venta">Ir a Venta</Link>
    </div>
  );
}
