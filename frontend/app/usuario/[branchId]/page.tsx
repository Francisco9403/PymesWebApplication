import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const modules = [
  {
    name: "Clientes",
    href: "clientes",
    icon: "👥",
    desc: "Gestión de cartera y cumplimiento.",
    color: "#FF6B35",
  },
  {
    name: "Finanzas",
    href: "finanzas",
    icon: "💰",
    desc: "Flujo de caja y estados contables.",
    color: "#00C9A7",
  },
  {
    name: "Productos",
    href: "productos",
    icon: "📦",
    desc: "Catálogo y precios de venta.",
    color: "#FFD166",
  },
  {
    name: "Punto de Venta",
    href: "venta",
    icon: "🛒",
    desc: "Realizar ventas y facturación.",
    color: "#06B6D4",
  },
  {
    name: "Sucursales",
    href: "sucursales",
    icon: "🏢",
    desc: "Administración de locales y depósitos.",
    color: "#A855F7",
  },
  {
    name: "Inventario",
    href: "inventario",
    icon: "📊",
    desc: "Control de stock y alertas críticas.",
    color: "#4ECDC4",
  },
  {
    name: "Proveedores",
    href: "proveedores",
    icon: "🚛",
    desc: "Gestión de compras y cuentas corrientes.",
    color: "#FF6B35",
  },
];

export default async function Page({
  params,
}: {
  params: { branchId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const { branchId } = await params;

  return (
    <main
      className="min-h-[calc(100vh-64px)] p-6 sm:p-10 transition-colors duration-300
        bg-slate-50 dark:bg-[#0A0A0F]"
    >
      <div
        className="fixed rounded-full pointer-events-none blur-[140px] w-[600px] h-[600px] top-0 -left-[200px]
        bg-[rgba(255,107,53,0.04)] dark:bg-[rgba(255,107,53,0.07)]"
      />
      <div
        className="fixed rounded-full pointer-events-none blur-[140px] w-[500px] h-[500px] bottom-0 right-0
        bg-[rgba(0,201,167,0.03)] dark:bg-[rgba(0,201,167,0.06)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-[14px] py-[6px] rounded-full border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[0.72rem] font-bold tracking-widest uppercase text-[#FF6B35] font-dmMono mb-4">
            <span
              className="relative inline-block w-2 h-2 rounded-full bg-[#00C9A7]
                before:content-[''] before:absolute before:inset-[-3px] before:rounded-full before:bg-[rgba(0,201,167,0.4)] before:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"
            />
            Panel de Control
          </div>

          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
            Bienvenido de nuevo.
          </h2>
          <p className="mt-1.5 text-slate-500 dark:text-[#666]">
            Seleccioná un módulo para comenzar.
          </p>
        </header>

        <div className="h-px mb-10 bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={`/usuario/${branchId}/${mod.href}`}
              className="group relative overflow-hidden flex flex-col gap-4 p-6 rounded-xl
                border transition-[border-color,background-color,transform,box-shadow] duration-200
                cursor-pointer no-underline
                bg-white border-slate-200 hover:border-[rgba(255,107,53,0.3)] hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1
                dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)] dark:hover:border-[rgba(255,107,53,0.3)] dark:hover:bg-[rgba(255,255,255,0.05)] dark:hover:shadow-none dark:hover:-translate-y-1
                before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,107,53,0.03)_0%,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100"
            >
              <div
                className="absolute top-0 left-0 w-[18px] h-[18px] border-t-2 border-l-2 transition-opacity duration-200 opacity-0 group-hover:opacity-50"
                style={{ borderColor: mod.color }}
              />
              <div
                className="absolute bottom-0 right-0 w-[18px] h-[18px] border-b-2 border-r-2 transition-opacity duration-200 opacity-0 group-hover:opacity-50"
                style={{ borderColor: mod.color }}
              />

              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl
                  transition-transform duration-200 group-hover:scale-110
                  bg-slate-100 dark:bg-[rgba(255,255,255,0.05)]"
                style={{ boxShadow: `0 0 0 1px ${mod.color}20` }}
              >
                {mod.icon}
              </div>

              <div>
                <h3
                  className="font-bold text-[0.95rem] tracking-[-0.01em] transition-colors duration-150
                    text-slate-900 group-hover:text-[#FF6B35]
                    dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]"
                >
                  {mod.name}
                </h3>
                <p className="text-sm mt-1 leading-snug text-slate-500 dark:text-[#666]">
                  {mod.desc}
                </p>
              </div>

              <div
                className="mt-auto flex items-center gap-1 text-xs font-bold tracking-[0.05em] uppercase
                  transition-[color,gap] duration-150
                  text-slate-300 group-hover:text-[#FF6B35] group-hover:gap-2
                  dark:text-[#333] dark:group-hover:text-[#FF6B35]"
              >
                Abrir módulo
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
