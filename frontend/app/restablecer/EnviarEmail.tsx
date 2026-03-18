"use client";

import { useToast } from "@/layout/ToastProvider";
import { useActionState, useEffect } from "react";
import { sendResetEmail } from "../actions/auth";

export default function EnviarEmail() {
  const { show } = useToast();
  const [state, formAction, isPending] = useActionState(sendResetEmail, null);

  useEffect(() => {
    if (state?.error) show(state.error, "error");
    if (state?.success) show(state.success, "success");
  }, [state, show]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[0.65rem] font-bold uppercase tracking-widest ml-0.5
          text-slate-400 dark:text-[#555]"
        >
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
            border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400
            focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
            dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444]
            dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)]"
        />
      </div>

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
            <span className="animate-pulse">Enviando...</span>
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Enviar enlace
          </>
        )}
      </button>
    </form>
  );
}
