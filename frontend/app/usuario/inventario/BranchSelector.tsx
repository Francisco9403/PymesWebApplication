"use client";
import { Branch } from "@/types/Branch";
import { useRouter } from "next/navigation";

export default function BranchSelector({
                                           branches,
                                           selectedBranchId,
                                       }: {
    branches: Branch[];
    selectedBranchId: number;
}) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3 px-2">
            <label htmlFor="branch-select" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Cambiar Sucursal
            </label>
            <select
                id="branch-select"
                value={selectedBranchId}
                onChange={(e) => router.push(`?branchId=${e.target.value}`)}
                className="bg-slate-50 border-none text-sm font-bold text-slate-900 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all"
            >
                {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                        {branch.name}
                    </option>
                ))}
            </select>
        </div>
    );
}