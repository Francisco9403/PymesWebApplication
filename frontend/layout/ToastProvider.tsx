"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
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

const TOAST_VARIANTS: Record<
  ToastType,
  { border: string; iconBg: string; iconColor: string; label: string }
> = {
  success: {
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    label: "Success",
  },
  info: {
    border: "border-sky-500/40",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    label: "Info",
  },
  warn: {
    border: "border-amber-400/40",
    iconBg: "bg-amber-400/10",
    iconColor: "text-amber-400",
    label: "Warning",
  },
  error: {
    border: "border-red-500/40",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    label: "Error",
  },
};

function ToastIcon({ type }: { type: ToastType }) {
  const props = {
    width: 16,
    height: 16,
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

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const v = TOAST_VARIANTS[toast.type];

  return (
    <>
      <div
        className={`
          relative flex items-start gap-3 w-80 rounded-xl border
          bg-[#111118]/95 backdrop-blur-md p-4 shadow-2xl shadow-black/60
          ${v.border}
        `}
        style={{ animation: "toastIn 0.25s ease forwards" }}
      >
        <div
          className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${v.iconColor} opacity-60`}
          style={{ background: "currentColor" }}
        />

        <div
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${v.iconBg} ${v.iconColor}`}
        >
          <ToastIcon type={toast.type} />
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-0.5">
            {v.label}
          </p>
          <p className="text-sm text-zinc-200 leading-snug wrap-break-word">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onRemove}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/6 transition-all duration-150 mt-0.5"
          aria-label="Close"
        >
          <svg
            width="12"
            height="12"
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
    </>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2.5 z-9999">
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
