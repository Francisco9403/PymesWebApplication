import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      <Link href="/usuario/cumplimiento">Clientes</Link>
      <Link href="/usuario/finanzas">Finanzas</Link>
      <Link href="/usuario/productos">Productos</Link>
      <Link href="/usuario/venta">Venta</Link>
      <Link href="/usuario/sucursales">Sucursales</Link>
      <Link href="/usuario/inventario">Inventario</Link>
      <Link href="/usuario/proveedores">Proveedores</Link>
    </div>
  );
}
