"use client";

import { Supplier } from "@/types/Supplier";

export default function SupplierList({
  suppliers,
  onNewImport,
  onSupplierClick,
}: {
  suppliers: Supplier[];
  onNewImport: () => void;
  onSupplierClick: (supplier: Supplier) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-7 rounded-xl
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
      >
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
            Mis Proveedores
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400 dark:text-[#555]">
            Gestión comercial de Junín
          </p>
        </div>

        <button
          onClick={onNewImport}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.12em]
          border-0 cursor-pointer transition-[transform,box-shadow,background-color] duration-150
          bg-[#FF6B35] text-white
          hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(255,107,53,0.3)]
          active:scale-95"
        >
          <span className="text-base">🏭</span>
          Importar con IA
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className="text-[10px] font-extrabold uppercase tracking-widest
              border-b bg-slate-50 border-slate-200 text-slate-400
              dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)] dark:text-[#444]"
            >
              <tr>
                <th className="p-5">Razón Social</th>
                <th className="p-5">CUIT / ID</th>
                <th className="p-4 text-right">Saldo CC</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
              {suppliers.map((s) => (
                <tr
                  key={s.id}
                  className="group transition-colors
                  hover:bg-[rgba(255,107,53,0.03)]
                  dark:hover:bg-[rgba(255,107,53,0.04)]"
                >
                  <td className="p-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900 transition-colors group-hover:text-[#FF6B35] dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]">
                        {s.businessName || "Sin Nombre"}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-tight text-[#FF6B35] opacity-70">
                        {s.taxCategory?.replace("_", " ") ||
                          "RESPONSABLE INSCRIPTO"}
                      </span>
                    </div>
                  </td>

                  <td className="p-5">
                    <span
                      className="font-mono text-[10px] px-2 py-1 rounded-md
                      bg-slate-100 text-slate-500
                      dark:bg-[rgba(255,255,255,0.06)] dark:text-[#666]"
                    >
                      {s.cuit || "---"}
                    </span>
                  </td>

                  <td className="p-5 text-right">
                    <span className="font-mono font-extrabold text-slate-900 dark:text-[#F0EDE8]">
                      ${Number(s.currentAccount?.balance ?? 0).toFixed(2)}
                    </span>
                  </td>

                  <td
                    className="p-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSupplierClick(s);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                      border transition-all duration-150 cursor-pointer active:scale-95
                      border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.06)] text-[#FF6B35]
                      hover:border-[rgba(255,107,53,0.4)] hover:bg-[rgba(255,107,53,0.12)]
                      dark:border-[rgba(255,107,53,0.2)] dark:bg-[rgba(255,107,53,0.08)] dark:hover:bg-[rgba(255,107,53,0.15)]"
                    >
                      <span className="text-sm">👁</span> Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
