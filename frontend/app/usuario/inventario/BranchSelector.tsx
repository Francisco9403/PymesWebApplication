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
    <div className="flex items-center gap-3">
      <label
        htmlFor="branch-select"
        className="text-sm font-medium text-gray-600"
      >
        Sucursal:
      </label>
      <select
        id="branch-select"
        value={selectedBranchId}
        onChange={(e) => router.push(`?branchId=${e.target.value}`)}
        className="border-gray-300 rounded-lg text-sm pl-3 pr-8 py-2 border shadow-sm focus:border-black focus:ring-black bg-white"
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
