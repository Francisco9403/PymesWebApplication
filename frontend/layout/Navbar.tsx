// layout/Navbar.tsx
"use client";

import { useToast } from "./ToastProvider";
import { useRouter, usePathname } from "next/navigation"; // Agregamos usePathname
import { AuthService } from "@/lib/auth";
import Link from "next/link";
import { Branch } from "@/types/Branch";

export default function Navbar({
  branches,
  selectedBranchId,
}: {
  branches: Branch[];
  selectedBranchId: number;
}) {
  const { show } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      show("Sesión cerrada correctamente", "success");
      router.replace("/");
    } catch (error) {
      show(
        error instanceof Error ? error.message : "Error inesperado",
        "error",
      );
    }
  };

  const navLinks = [
    { name: "Clientes", href: "/usuario/cumplimiento" },
    { name: "Finanzas", href: "/usuario/finanzas" },
    { name: "Productos", href: "/usuario/productos" },
    { name: "Venta", href: "/usuario/venta" },
    { name: "Sucursales", href: "/usuario/sucursales" },
    { name: "Inventario", href: "/usuario/inventario" },
    { name: "Proveedores", href: "/usuario/proveedores" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/usuario" className="group">
            <h1 className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Comercio App
            </h1>
            <div className="flex items-center gap-1.5 -mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                Online
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {branches.length > 0 && (
            <select
              id="branch-select"
              value={selectedBranchId}
              onChange={(e) => router.push(`?branchId=${e.target.value}`)}
              className="bg-slate-50 border-none text-sm font-bold text-slate-900 rounded-xl px-6 py-2 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
