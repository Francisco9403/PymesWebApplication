"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(params.toString());

    if (!value) newParams.delete(key);
    else newParams.set(key, value);

    newParams.set("page", "0");

    router.push(`?${newParams.toString()}`);
  };

  return (
    <div
      className="p-4 rounded-xl transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#555]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            placeholder="Buscar producto..."
            defaultValue={params.get("name") ?? ""}
            onChange={(e) => updateParam("name", e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all
              border bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400
              focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] focus:bg-white
              dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#F0EDE8] dark:placeholder:text-[#444]
              dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)] dark:focus:bg-[rgba(255,255,255,0.06)]"
          />
        </div>

        <div className="hidden sm:block w-px self-stretch bg-slate-100 dark:bg-[rgba(255,255,255,0.05)]" />

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#555]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7H4M16 12H8M12 17H8"
            />
          </svg>
          <select
            defaultValue={params.get("belowMinStock") ?? ""}
            onChange={(e) => updateParam("belowMinStock", e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-xl text-sm font-bold cursor-pointer border outline-none transition-all bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#AAA] dark:hover:border-[rgba(255,107,53,0.3)] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)]"
          >
            <option value="" className="text-black">
              Stock normal
            </option>
            <option value="true" className="text-black">
              Bajo stock
            </option>
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-400 dark:text-[#555]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#555]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h13M3 8h9M3 12h5m10 4v-8m0 0l-3 3m3-3l3 3"
            />
          </svg>
          <select
            defaultValue={params.get("sort") ?? ""}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-xl text-sm font-bold cursor-pointer border outline-none transition-all bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 focus:border-[rgba(255,107,53,0.5)] focus:ring-2 focus:ring-[rgba(255,107,53,0.12)] dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] dark:text-[#AAA] dark:hover:border-[rgba(255,107,53,0.3)] dark:focus:border-[rgba(255,107,53,0.5)] dark:focus:ring-[rgba(255,107,53,0.1)]"
          >
            <option value="" className="text-black">
              Ordenar por
            </option>
            <option value="name,asc" className="text-black">
              Nombre ↑
            </option>
            <option value="name,desc" className="text-black">
              Nombre ↓
            </option>
            <option value="baseCostPrice,asc" className="text-black">
              Costo ↑
            </option>
            <option value="baseCostPrice,desc" className="text-black">
              Costo ↓
            </option>
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-400 dark:text-[#555]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
