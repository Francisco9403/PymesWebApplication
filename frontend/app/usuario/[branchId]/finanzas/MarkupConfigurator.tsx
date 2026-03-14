"use client";

import { updateMarkupSettings } from "@/app/actions/finance";
import { useToast } from "@/layout/ToastProvider";
import { useState, useTransition } from "react";

export default function MarkupConfigurator({
  initialEnabled,
  initialThreshold,
}: {
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

    startTransition(async () => {
      const res = await updateMarkupSettings(formData);
      if (res.success) show(res.success, "success");
      if (res.error) show(res.error, "error");
    });
  };

  return (
    <div
      className={`card-container p-6 transition-all duration-500 ${enabled ? "bg-indigo-600 border-indigo-700 text-white shadow-xl shadow-indigo-200/50" : "bg-white text-slate-900 border-slate-200"}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${enabled ? "bg-indigo-500" : "bg-slate-100 text-slate-500"}`}
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
              className={`text-xs font-black uppercase tracking-widest ${enabled ? "text-indigo-100" : "text-slate-400"}`}
            >
              Markup Automático
            </h3>
          </div>
          <p className="text-lg font-bold">Protección de Márgenes</p>
        </div>

        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-emerald-400" : "bg-slate-200"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <p
        className={`text-xs leading-relaxed italic ${enabled ? "text-indigo-200" : "text-slate-500"}`}
      >
        Los precios se ajustarán automáticamente si el MEP sube más del{" "}
        <span
          className={`font-black underline ${enabled ? "text-white" : "text-indigo-600"}`}
        >
          {initialThreshold}%
        </span>
      </p>
    </div>
  );
}
