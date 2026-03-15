import Link from "next/link";
import IniciarSesionForm from "./IniciarSesionForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) redirect("/usuario");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md mb-4 text-left">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a la página principal
        </Link>
      </div>

      <div className="card-container max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Comercio<span className="text-indigo-600">App</span>
            </h2>
            <div className="h-1 w-12 bg-indigo-600 mx-auto mt-1 rounded-full"></div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Iniciar Sesión
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Introduce tu email y contraseña para acceder al sistema
          </p>
        </div>

        <div className="mt-8">
          <IniciarSesionForm />
        </div>

        <div className="pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            ¿Problemas con tu cuenta? <br />
            <a href="#" className="text-indigo-600 font-bold hover:underline">
              Contactá a soporte técnico
            </a>
          </p>
        </div>
      </div>

      <footer className="mt-12 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        Junín • Buenos Aires • 2026
      </footer>
    </main>
  );
}
