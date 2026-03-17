"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

type ToastType = "success" | "info" | "warn" | "error";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type Action = { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string };

type ToastContextType = {
  show: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    dispatch({ type: "ADD", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE", id }), 3500);
  }, []);

  const value = useMemo(() => ({ show, removeToast }), [show, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/* ─────────────────────────────────────────────
   Design-system tokens per toast type
   success → #00C9A7  (teal  — same as "Nivel Óptimo", payment confirm)
   info    → #06B6D4  (cyan  — same as "Dólar MEP" feature card)
   warn    → #FFD166  (amber — same as "Stock Crítico" mini-card)
   error   → red-400  (same as stock-crítico badge dark)
───────────────────────────────────────────── */
const TOAST_VARIANTS: Record<
  ToastType,
  {
    accent: string; // hex — used for icon, left bar, border
    borderOpacity: string; // tailwind border utility
    iconBg: string; // tailwind bg utility
    label: string;
  }
> = {
  success: {
    accent: "#00C9A7",
    borderOpacity: "border-[rgba(0,201,167,0.35)]",
    iconBg: "bg-[rgba(0,201,167,0.12)]",
    label: "Éxito",
  },
  info: {
    accent: "#06B6D4",
    borderOpacity: "border-[rgba(6,182,212,0.35)]",
    iconBg: "bg-[rgba(6,182,212,0.12)]",
    label: "Info",
  },
  warn: {
    accent: "#FFD166",
    borderOpacity: "border-[rgba(255,209,102,0.35)]",
    iconBg: "bg-[rgba(255,209,102,0.12)]",
    label: "Atención",
  },
  error: {
    accent: "#F87171",
    borderOpacity: "border-[rgba(248,113,113,0.35)]",
    iconBg: "bg-[rgba(248,113,113,0.12)]",
    label: "Error",
  },
};

/* ── Icon ── */
function ToastIcon({ type }: { type: ToastType }) {
  const props = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "success")
    return (
      <svg {...props}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  if (type === "error")
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    );
  if (type === "warn")
    return (
      <svg {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

/* ── Single toast item ── */
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const v = TOAST_VARIANTS[toast.type];

  return (
    <div
      className={`
        relative flex items-start gap-3 w-80 rounded-xl border pl-5 pr-3 py-4
        shadow-2xl shadow-black/50 backdrop-blur-md
        bg-[rgba(10,10,15,0.95)]
        ${v.borderOpacity}
      `}
      style={{
        animation: "toastIn 0.25s ease forwards",
        fontFamily: "'Sora', 'DM Sans', sans-serif",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: v.accent, opacity: 0.8 }}
      />

      {/* Icon */}
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${v.iconBg}`}
        style={{ color: v.accent }}
      >
        <ToastIcon type={toast.type} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className="text-[0.6rem] font-bold uppercase tracking-[0.12em] mb-0.5"
          style={{ color: v.accent, fontFamily: "'DM Mono', monospace" }}
        >
          {v.label}
        </p>
        <p className="text-sm text-[#C8C5C0] leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onRemove}
        aria-label="Cerrar"
        className="shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center rounded-md transition-all duration-150
          text-[#444] hover:text-[#AAA] hover:bg-[rgba(255,255,255,0.06)]"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ── Container ── */
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2.5 z-[9999]">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
