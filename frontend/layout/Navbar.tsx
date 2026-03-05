"use client";

import { useToast } from "./ToastProvider";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";
import Link from "next/link";

export default function Navbar() {
  const { show } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      show("Logged out successfully", "success");
      router.replace("/");
    } catch (error) {
      show(
        error instanceof Error ? error.message : "Unexpected error",
        "error",
      );
    }
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Comercio App</h1>
            <p className="text-xs text-green-600 font-medium -mt-1">Online</p>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/usuario/cumplimiento" className="nav-link">
              Cumplimiento
            </Link>
            <Link href="/usuario/finanzas" className="nav-link">
              Finanzas
            </Link>
            <Link href="/usuario/inventario" className="nav-link">
              Inventario
            </Link>
            <Link href="/usuario/productos" className="nav-link">
              Productos
            </Link>
            <Link href="/usuario/venta" className="nav-link">
              Punto de Venta
            </Link>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-lg text-sm text-zinc-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
