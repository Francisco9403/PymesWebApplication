"use client";

import { useToast } from "@/layout/ToastProvider";
import { AuthService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function IniciarSesionForm() {
  const { show } = useToast();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await AuthService.login(credentials);
        show("¡Ingreso exitoso!", "success");
        router.replace("/usuario");
      } catch (error) {
        show(
          error instanceof Error ? error.message : "Error inesperado",
          "error",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
 
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold ml-0.5 text-slate-700 dark:text-[#AAA]">
          Email <span className="text-[#FF6B35]">*</span>
        </label>
        <input
          name="email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          placeholder="nombre@ejemplo.com"
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
            border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400
            focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.15)] focus:bg-white
            dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444]
            dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.12)] dark:focus:bg-[rgba(255,255,255,0.06)]"
        />
      </div>
 
      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center ml-0.5">
          <label className="text-sm font-bold text-slate-700 dark:text-[#AAA]">
            Contraseña <span className="text-[#FF6B35]">*</span>
          </label>
          <a
            href="/restablecer"
            className="text-xs font-semibold transition-colors
              text-[#FF6B35] hover:text-[#FF8555]"
          >
            ¿La olvidaste?
          </a>
        </div>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all
              border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400
              focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.15)] focus:bg-white
              dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444]
              dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.12)] dark:focus:bg-[rgba(255,255,255,0.06)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors
              text-slate-400 hover:text-slate-600
              dark:text-[#555] dark:hover:text-[#9A9A9A]"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
 
      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="group w-full mt-1 py-3.5 inline-flex items-center justify-center gap-2.5
          font-bold text-sm tracking-[0.02em] rounded-xl border-0 cursor-pointer
          transition-[transform,box-shadow,background-color] duration-150
          bg-[#FF6B35] text-white
          hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(255,107,53,0.35)]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="animate-pulse">Verificando...</span>
          </>
        ) : (
          <>
            <span>Iniciar Sesión</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
