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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Mis Proveedores
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Gestión comercial de Junín
          </p>
        </div>
        <button
          onClick={onNewImport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95"
        >
          <span className="text-xl">🏭</span>
          Importar con IA
        </button>
      </div>

      <div className="card-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Razón Social
                </th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  CUIT / ID
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Saldo CC
                </th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-indigo-50/50 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {s.businessName || "Sin Nombre"}
                      </span>
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter mt-0.5">
                        {s.taxCategory?.replace("_", " ") ||
                          "RESPONSABLE INSCRIPTO"}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {s.cuit || "---"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <span className="font-mono font-black text-slate-900">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-[14px]">👁</span> Ver detalles
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
