import Link from "next/link";
import IniciarSesionForm from "./IniciarSesionForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) redirect("/usuario");

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300
        bg-slate-50
        dark:bg-[#0A0A0F]"
    >
      {/* Background glows — same as hero */}
      <div className="fixed rounded-full pointer-events-none blur-[120px] w-[500px] h-[500px] -top-[200px] -left-[150px]
        bg-[rgba(255,107,53,0.05)] dark:bg-[rgba(255,107,53,0.12)]" />
      <div className="fixed rounded-full pointer-events-none blur-[120px] w-[400px] h-[400px] -bottom-[150px] -right-[100px]
        bg-[rgba(0,201,167,0.04)] dark:bg-[rgba(0,201,167,0.08)]" />
 
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[size:60px_60px]
        bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
 
      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
 
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors w-fit
            text-slate-400 hover:text-slate-700
            dark:text-[#555] dark:hover:text-[#F0EDE8]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la página principal
        </Link>
 
        {/* Card */}
        <div
          className="w-full rounded-2xl p-8 transition-colors duration-300
            bg-white border border-slate-200 shadow-xl shadow-slate-200/50
            dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)] dark:shadow-none"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-base text-white">◈</span>
              <span className="font-extrabold text-xl tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
                Comercio<span className="text-[#FF6B35]">App</span>
              </span>
            </div>
 
            <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
              Iniciar Sesión
            </h1>
            <p className="text-sm mt-1.5 text-slate-500 dark:text-[#666]">
              Introducí tu email y contraseña para acceder al sistema
            </p>
          </div>
 
          {/* Form */}
          <IniciarSesionForm />
 
          {/* Footer */}
          <div
            className="mt-7 pt-6 text-center border-t transition-colors
              border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
          >
            <p className="text-sm text-slate-400 dark:text-[#555]">
              ¿Problemas con tu cuenta?{" "}
              <a
                href="#"
                className="font-bold transition-colors
                  text-[#FF6B35] hover:text-[#FF8555]"
              >
                Contactá a soporte técnico
              </a>
            </p>
          </div>
        </div>
 
        {/* Footer */}
        <p className="text-center text-[0.7rem] font-bold uppercase tracking-widest text-slate-300 dark:text-[#333]">
          Junín • Buenos Aires • 2026
        </p>
      </div>
    </main>
  );
}
