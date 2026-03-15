import Link from "next/link";

const modules = [
  {
    name: "Clientes",
    href: "clientes",
    icon: "👥",
    desc: "Gestión de cartera y cumplimiento.",
  },
  {
    name: "Finanzas",
    href: "finanzas",
    icon: "💰",
    desc: "Flujo de caja y estados contables.",
  },
  {
    name: "Productos",
    href: "productos",
    icon: "📦",
    desc: "Catálogo y precios de venta.",
  },
  {
    name: "Punto de Venta",
    href: "venta",
    icon: "🛒",
    desc: "Realizar ventas y facturación.",
  },
  {
    name: "Sucursales",
    href: "sucursales",
    icon: "🏢",
    desc: "Administración de locales y depósitos.",
  },
  {
    name: "Inventario",
    href: "inventario",
    icon: "📊",
    desc: "Control de stock y alertas críticas.",
  },
  {
    name: "Proveedores",
    href: "proveedores",
    icon: "🚛",
    desc: "Gestión de compras y cuentas corrientes.",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Panel de Control
          </h2>
          <p className="text-slate-500 mt-2">
            Bienvenido. Seleccioná un módulo para comenzar.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={`/usuario/${branchId}/${mod.href}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4"
            >
              <div className="text-3xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                {mod.icon}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {mod.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
