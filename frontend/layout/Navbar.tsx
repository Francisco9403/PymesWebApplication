"use client";

import { useTheme } from "@/hooks/useTheme";
import { AuthService } from "@/lib/auth";
import { Branch } from "@/types/Branch";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

const navLinks = [
  { name: "Clientes", href: "clientes", scoped: true },
  { name: "Finanzas", href: "finanzas", scoped: true },
  { name: "Productos", href: "productos", scoped: true },
  { name: "Venta", href: "venta", scoped: true },
  { name: "Inventario", href: "inventario", scoped: true },
  { name: "Proveedores", href: "proveedores", scoped: true },
  { name: "Sucursales", href: "/usuario/sucursales", scoped: false },
];

export default function Navbar({ branches }: { branches: Branch[] }) {
  const { show } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { darkMode, toggleDark } = useTheme();

  const selectedBranchId = params.branchId
    ? params.branchId
    : branches[0]?.id || 0;

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      show("Sesión cerrada correctamente", "success");
      router.replace("/iniciar-sesion");
    } catch (error) {
      show(
        error instanceof Error ? error.message : "Error inesperado",
        "error",
      );
    }
  };

  const handleBranchChange = (id: string) => {
    const segments = pathname.split("/");
    segments[2] = id;
    router.push(segments.join("/"));
  };

  return (
    <header
      className="sticky top-0 z-50 w-full transition-colors duration-300
        backdrop-blur-[20px]
        bg-white/80 border-b border-slate-200 shadow-sm
        dark:bg-[rgba(10,10,15,0.85)] dark:border-[rgba(255,255,255,0.05)] dark:shadow-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/usuario" className="flex flex-col leading-none">
            <span className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
              Comercio<span className="text-[#FF6B35]">App</span>
            </span>
            <span className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C9A7] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C9A7]" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00C9A7]">
                Online
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const href = link.scoped
                ? `/usuario/${selectedBranchId}/${link.href}`
                : link.href;
              const active = pathname.startsWith(href);

              return (
                <Link
                  key={link.name}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-semibold tracking-[0.01em] transition-all duration-150
                    ${
                      active
                        ? "bg-[rgba(255,107,53,0.1)] text-[#FF6B35] dark:bg-[rgba(255,107,53,0.12)] dark:text-[#FF6B35]"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-[#9A9A9A] dark:hover:text-[#F0EDE8] dark:hover:bg-[rgba(255,255,255,0.06)]"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {branches.length > 0 && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6B35] text-xs pointer-events-none select-none">
                ◈
              </span>
              <select
                id="branch-select"
                value={selectedBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="appearance-none pl-8 pr-7 py-2 rounded-lg text-sm font-bold cursor-pointer
                  border transition-all duration-150 outline-none
                  bg-slate-50 border-slate-200 text-slate-800
                  hover:border-slate-300 focus:border-[rgba(255,107,53,0.4)] focus:ring-2 focus:ring-[rgba(255,107,53,0.15)]
                  dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8]
                  dark:hover:border-[rgba(255,107,53,0.3)] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.12)]"
              >
                {branches.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                    className="text-black"
                  >
                    {branch.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-[#555]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          )}

          <button
            onClick={toggleDark}
            aria-label="Cambiar tema"
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-150
              bg-slate-100 hover:bg-slate-200 text-slate-500
              dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] dark:text-[#9A9A9A]"
          >
            {darkMode ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
              border transition-all duration-150 cursor-pointer
              text-slate-500 border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50
              dark:text-[#9A9A9A] dark:border-[rgba(255,255,255,0.08)] dark:hover:text-red-400 dark:hover:border-[rgba(239,68,68,0.25)] dark:hover:bg-[rgba(239,68,68,0.06)]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
