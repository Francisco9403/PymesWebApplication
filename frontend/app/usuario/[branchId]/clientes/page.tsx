import { getCustomers } from "@/app/actions/cliente";
import CustomerTable from "./CustomerTable";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/iniciar-sesion");

  const customers = await getCustomers();

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <div className="space-y-2">
            <Link
              href="/usuario"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Panel
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Clientes
            </h1>
          </div>
        </header>

        <CustomerTable customers={customers.content} />
      </div>
    </main>
  );
}
