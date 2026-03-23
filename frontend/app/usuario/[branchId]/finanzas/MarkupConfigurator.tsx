"use client";

import { updateMarkupSettings } from "@/app/actions/finance";
import { useToast } from "@/layout/ToastProvider";
import { useState, useTransition } from "react";

export default function MarkupConfigurator({
                                             branchId, // 🚀 Recibimos el branchId
                                             initialEnabled,
                                             initialThreshold,
                                           }: {
  branchId: string; // 🚀 Agregado al tipado de Props
  initialEnabled: boolean;
  initialThreshold: number;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const { show } = useToast();

  const handleToggle = () => {
    const newStatus = !enabled;
    setEnabled(newStatus);

    const formData = new FormData();
    formData.append("enabled", String(newStatus));
    formData.append("threshold", String(initialThreshold));
    formData.append("branchId", branchId);

    startTransition(async () => {
      const res = await updateMarkupSettings(formData);
      if (res.success) show(res.success, "success");
      if (res.error) {
        show(res.error, "error");
        // Si hay error, volvemos el switch a su estado anterior
        setEnabled(!newStatus);
      }
    });
  };

  return (
      <div
          className={`relative overflow-hidden p-6 rounded-xl transition-all duration-500
        ${
              enabled
                  ? "bg-[#FF6B35] border border-[rgba(255,107,53,0.6)] shadow-xl shadow-[rgba(255,107,53,0.2)] text-white"
                  : "bg-white border border-slate-200 text-slate-900 dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)] dark:text-[#F0EDE8]"
          }`}
      >
        {enabled && (
            <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
            />
        )}

        <div className="relative flex justify-between items-start mb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div
                  className={`p-1.5 rounded-lg transition-colors
                ${
                      enabled
                          ? "bg-[rgba(255,255,255,0.2)]"
                          : "bg-slate-100 text-slate-500 dark:bg-[rgba(255,255,255,0.06)] dark:text-[#666]"
                  }`}
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3
                  className={`text-[0.65rem] font-bold uppercase tracking-widest
                ${enabled ? "text-white/70" : "text-slate-400 dark:text-[#555]"}`}
              >
                Markup Automático
              </h3>
            </div>
            <p className="text-lg font-extrabold tracking-[-0.01em]">
              Protección de Márgenes
            </p>
          </div>

          <button
              onClick={handleToggle}
              disabled={isPending}
              aria-label="Toggle markup automático"
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer
            ${enabled ? "bg-[#00C9A7]" : "bg-slate-200 dark:bg-[rgba(255,255,255,0.12)]"}`}
          >
          <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
              ${enabled ? "translate-x-6" : "translate-x-1"}`}
          />
          </button>
        </div>

        <p
            className={`text-xs leading-relaxed italic
          ${enabled ? "text-white/70" : "text-slate-500 dark:text-[#666]"}`}
        >
          Los precios se ajustarán automáticamente si el MEP sube más del{" "}
          <span
              className={`font-extrabold not-italic underline underline-offset-2
            ${enabled ? "text-white" : "text-[#FF6B35]"}`}
          >
          {initialThreshold}%
        </span>
        </p>
      </div>
  );
}