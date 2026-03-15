import { cookies } from "next/headers";
import Venta from "./Venta";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <Link
            href="/usuario"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
          >
            ← Volver al Panel
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mt-2">
            Punto de Venta
          </h1>
          <p className="text-slate-500 text-sm">
            Escaneá productos y generá el cobro al instante.
          </p>
        </header>

        <Venta branchId={Number(branchId)} />
      </div>
    </main>
  );
}
