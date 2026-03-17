"use client";

import { useToast } from "@/layout/ToastProvider";
import { AuthService } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { resetPasswordAction } from "../actions/auth";

export default function RestablecerPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  const { show } = useToast();
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      const logoutAndRedirect = async () => {
        try {
          await AuthService.logout();
          router.replace("/iniciar-sesion");
        } catch (error) {
          show(
            error instanceof Error ? error.message : "Error inesperado",
            "error",
          );
        }
      };

      logoutAndRedirect();
    }

    if (state?.error) show(state.error, "error");
  }, [state, show, router]);

  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token ?? ""} />

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5
          text-slate-400 dark:text-[#555]"
        >
          Nueva contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all
              border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400
              focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
              dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444]
              dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)]"
          />
          {/* Toggle visibility */}
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors
              text-slate-400 hover:text-slate-600
              dark:text-[#555] dark:hover:text-[#9A9A9A]"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Strength hint */}
        <p className="text-[0.65rem] ml-0.5 text-slate-400 dark:text-[#444]">
          Mínimo 8 caracteres, incluí números y símbolos.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-1 inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm tracking-[0.02em]
          border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
          bg-[#FF6B35] text-white
          hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(255,107,53,0.35)]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="animate-pulse">Cambiando...</span>
          </>
        ) : (
          <>
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Restablecer contraseña
          </>
        )}
      </button>
    </form>
  );
}
