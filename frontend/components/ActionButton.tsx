interface ActionButtonProps {
  onClick: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ActionButton = ({
  onClick,
  loading = false,
  icon,
  children,
  className,
}: ActionButtonProps) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 ${className}`}
  >
    {loading ? (
      <span className="animate-pulse">Procesando...</span>
    ) : (
      <>
        {icon} {children}
      </>
    )}
  </button>
);
